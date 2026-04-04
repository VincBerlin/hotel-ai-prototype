import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { loadHotelConfig, loadHotelKnowledgeFromDb, getMinimalHotelConfig } from '@/lib/knowledge-base/loader'
import { buildContext } from '@/lib/context/builder'
import { interpretMessage } from '@/lib/ai/interpreter'
import { decideEscalation } from '@/lib/ai/escalation'
import { handleEscalation } from '@/lib/ai/escalationHandler'
import { getProactiveMessage } from '@/lib/ai/proactive'
import { buildSystemPrompt } from '@/lib/system-prompt'
import { postProcess } from '@/lib/post-processor'
import { ChatApiError, parseChatRequestBody, type ChatMessage } from '@/lib/api/chat'
import { getOrCreateConversation, persistMessage, updateConversation } from '@/lib/supabase/persistence'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PERSISTENCE_ENABLED = !!process.env.NEXT_PUBLIC_SUPABASE_URL

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID()
  const t0 = performance.now()

  let hotelId: string, message: string, history: ChatMessage[], guestContext: { name: string; room?: string; stayNights?: number } | undefined, conversationId: string | undefined
  try {
    const body = await req.json()
    ;({ hotelId, message, history, guestContext, conversationId } = parseChatRequestBody(body))
  } catch (err) {
    if (err instanceof ChatApiError) {
      return NextResponse.json(
        { error: err.message, code: err.code, details: err.details, requestId },
        { status: err.status }
      )
    }
    return NextResponse.json({ error: 'Invalid JSON payload.', code: 'INVALID_JSON', requestId }, { status: 400 })
  }

  let hotel, accountId: string
  const tSupabaseKbStart = performance.now()
  try {
    ;({ knowledge: hotel, accountId } = await loadHotelKnowledgeFromDb(hotelId))
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'Hotel not found.', code: 'HOTEL_NOT_FOUND', detail, requestId }, { status: 404 })
  }
  console.log(`[timing:${requestId}] supabase-kb: ${Math.round(performance.now() - tSupabaseKbStart)}ms`)

  // Resolve conversation before the Claude call so we have an ID for message persistence
  let resolvedConversationId: string | null = null
  if (PERSISTENCE_ENABLED) {
    const tConvStart = performance.now()
    try {
      resolvedConversationId = await getOrCreateConversation({
        conversationId: conversationId ?? null,
        hotelId,
        accountId,
        guestName: guestContext?.name ?? null,
        guestRoom: guestContext?.room ?? null,
        language: 'en', // will be updated after Claude responds
      })
    } catch (err) {
      console.error(`[chat/route] Conversation create failed (${requestId}):`, err)
      // Non-fatal — continue without persistence
    }
    console.log(`[timing:${requestId}] supabase-conv: ${Math.round(performance.now() - tConvStart)}ms`)
  }

  // HotelConfig still used for context/escalation — DB migration in a subsequent step
  const hotelConfig = loadHotelConfig(hotelId) ?? getMinimalHotelConfig(hotelId)
  const context = buildContext(hotelConfig)
  const interpreted = interpretMessage(message, history ?? [])
  const escalationDecision = decideEscalation(interpreted, hotelConfig)
  const escalationAction = handleEscalation(escalationDecision, hotelConfig)
  const systemPrompt = buildSystemPrompt(hotel, guestContext)

  const messages: ChatMessage[] = [...history, { role: 'user', content: message }]

  let rawText: string
  let tokensUsed: number | null = null
  const tClaudeStart = performance.now()
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: systemPrompt,
      messages,
    })

    rawText = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
    tokensUsed = response.usage.output_tokens
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    console.error(`[chat/route] Anthropic error (${requestId}):`, detail)
    return NextResponse.json({ error: 'AI service error.', code: 'AI_SERVICE_ERROR', detail, requestId }, { status: 502 })
  }
  console.log(`[timing:${requestId}] claude-api: ${Math.round(performance.now() - tClaudeStart)}ms`)

  if (!rawText) {
    return NextResponse.json({ error: 'Empty response from AI.', code: 'EMPTY_AI_RESPONSE', requestId }, { status: 502 })
  }

  const tPostStart = performance.now()
  const { cleanText, metadata } = postProcess(rawText)
  const proactiveMessage = getProactiveMessage(hotelConfig, context, false)
  console.log(`[timing:${requestId}] post-process: ${Math.round(performance.now() - tPostStart)}ms`)

  const escalationLevelMap: Record<string, number> = { none: 0, low: 1, high: 2, critical: 3 }
  const modelEscalationLevel = escalationLevelMap[metadata.escalation] ?? 0
  const escalationLevel = Math.max(modelEscalationLevel, escalationDecision.level)
  const reply = [cleanText, escalationAction.appendToResponse, proactiveMessage?.text].filter(Boolean).join('\n\n')
  const language = metadata.language || interpreted.detectedLanguage

  // Persist messages and update conversation — best-effort, non-blocking to response
  if (PERSISTENCE_ENABLED && resolvedConversationId) {
    const cid = resolvedConversationId
    void Promise.allSettled([
      persistMessage({ conversationId: cid, hotelId, role: 'user', content: message, language }),
      persistMessage({
        conversationId: cid,
        hotelId,
        role: 'assistant',
        content: cleanText,
        intent: metadata.intent || interpreted.intent,
        escalation: metadata.escalation,
        language,
        tokensUsed,
      }),
      updateConversation({ conversationId: cid, escalationLevel, language }),
    ])
  }

  console.log(`[timing:${requestId}] total: ${Math.round(performance.now() - t0)}ms`)

  return NextResponse.json({
    reply,
    escalationLevel,
    handoff: escalationDecision.handoff || escalationLevel >= 3,
    intent: metadata.intent || interpreted.intent,
    language,
    conversationId: resolvedConversationId,
  })
}
