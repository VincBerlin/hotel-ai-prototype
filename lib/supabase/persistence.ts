import { supabaseAdmin } from './server'

export type PersistenceParams = {
  conversationId: string | null
  hotelId: string
  accountId: string
  guestName: string | null
  guestRoom: string | null
  language: string
}

/**
 * Creates a new conversation row or retrieves an existing one.
 * If conversationId is provided, verifies it belongs to this hotel before reusing.
 * Returns the resolved conversationId.
 */
export async function getOrCreateConversation(params: PersistenceParams): Promise<string> {
  if (params.conversationId) {
    const { data, error } = await supabaseAdmin
      .from('conversations')
      .select('id, hotel_id, status')
      .eq('id', params.conversationId)
      .eq('hotel_id', params.hotelId)
      .limit(1)
      .maybeSingle()

    const row = data as { id: string; hotel_id: string; status: string } | null
    if (!error && row) {
      return row.id
    }
    // Conversation not found or wrong hotel — fall through to create
  }

  const { data, error } = await supabaseAdmin
    .from('conversations')
    .insert({
      hotel_id: params.hotelId,
      account_id: params.accountId,
      guest_name: params.guestName,
      guest_room: params.guestRoom,
      language: params.language,
      channel: 'web',
      status: 'active',
      escalation_level: 0,
    } as never)
    .select('id')
    .single()

  const created = data as { id: string } | null
  if (error || !created) {
    throw new Error(`Failed to create conversation: ${error?.message ?? 'unknown error'}`)
  }

  return created.id
}

/**
 * Writes a single message (user or assistant) to the messages table.
 * Errors are non-fatal — logged but not thrown.
 */
export async function persistMessage(params: {
  conversationId: string
  hotelId: string
  role: 'user' | 'assistant'
  content: string
  intent?: string | null
  escalation?: string
  language?: string
  tokensUsed?: number | null
}): Promise<void> {
  const { error } = await supabaseAdmin.from('messages').insert({
    conversation_id: params.conversationId,
    hotel_id: params.hotelId,
    role: params.role,
    content: params.content,
    intent: params.intent ?? null,
    escalation: params.escalation ?? 'none',
    language: params.language ?? 'en',
    tokens_used: params.tokensUsed ?? null,
  } as never)

  if (error) {
    console.error('[persistence] Failed to persist message:', error.message)
  }
}

/**
 * Updates the conversation's escalation_level, status, and last_message_at.
 * Errors are non-fatal — logged but not thrown.
 */
export async function updateConversation(params: {
  conversationId: string
  escalationLevel: number
  language: string
}): Promise<void> {
  const status = params.escalationLevel >= 2 ? 'escalated' : 'active'

  const { error } = await supabaseAdmin
    .from('conversations')
    .update({
      escalation_level: params.escalationLevel,
      status,
      language: params.language,
      last_message_at: new Date().toISOString(),
    } as never)
    .eq('id', params.conversationId)

  if (error) {
    console.error('[persistence] Failed to update conversation:', error.message)
  }
}
