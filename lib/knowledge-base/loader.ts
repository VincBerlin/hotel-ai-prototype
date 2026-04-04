import { supabaseAdmin } from '@/lib/supabase/server'
import { fromDbDocuments, toHotelKnowledge } from './mapper'
import type { HotelConfig, HotelKnowledge } from './types'
import { getHotelConfig } from '@/lib/hotels'

const MINIMAL_ESCALATION = {
  categories: [],
  goodwillGestures: [],
  humanHandoffMessage: 'A member of our team will be with you shortly.',
  staffContactMethod: 'front desk',
}

/**
 * Returns a safe minimal HotelConfig for hotels that exist in Supabase but not
 * in the hardcoded registry. Used only for context building and escalation logic
 * until those modules are migrated to Supabase as well.
 */
export function getMinimalHotelConfig(hotelId: string): HotelConfig {
  return {
    id: hotelId,
    name: hotelId,
    location: { city: '', country: '', timezone: 'UTC', coordinates: { lat: 0, lng: 0 } },
    contact: { phone: '', email: '' },
    policies: { checkIn: '', checkOut: '', cancellation: '', pets: '', smoking: '' },
    wifi: { ssid: '', password: '' },
    responseRules: {
      formalAddress: false,
      avoidSuggestions: false,
      maxSentences: 4,
      neverMentionAI: true,
      language: 'auto',
    },
    proactive: {
      enabled: false,
      quietHours: { from: '22:00', to: '08:00' },
      maxPerDay: 0,
      triggers: { weather: false, sunset: false, localEvents: false, hotelEvents: false },
    },
    guestContext: { detectLanguage: true, personalization: false, defaultLanguage: 'en' },
    facilities: {},
    dining: [],
    services: [],
    events: [],
    localArea: [],
    faqs: [],
    tone: { style: 'warm', language: 'auto' },
    escalation: MINIMAL_ESCALATION,
  }
}

/**
 * Returns the hardcoded HotelConfig for dev/fallback use.
 * Returns null if the hotel is not in the registry.
 */
export function loadHotelConfig(hotelId: string): HotelConfig | null {
  return getHotelConfig(hotelId)
}

export type HotelResolution = {
  knowledge: HotelKnowledge
  accountId: string
}

/**
 * Loads HotelKnowledge + accountId from Supabase (accounts + knowledge_bases + documents).
 *
 * Fallback chain:
 * 1. No NEXT_PUBLIC_SUPABASE_URL set → use hardcoded registry; accountId = hotelId
 * 2. Hotel not found in Supabase → try hardcoded registry; accountId = hotelId
 * 3. Hotel not found anywhere → throw (caller returns 404)
 */
export async function loadHotelKnowledgeFromDb(hotelId: string): Promise<HotelResolution> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const config = getHotelConfig(hotelId)
    if (!config) throw new Error(`Hotel not found: ${hotelId}`)
    return { knowledge: toHotelKnowledge(config), accountId: hotelId }
  }

  const [accountResult, kbResult, docsResult] = await Promise.all([
    supabaseAdmin
      .from('accounts')
      .select('id, name, hotel_id, plan, active, created_at, updated_at')
      .eq('hotel_id', hotelId)
      .eq('active', true)
      .limit(1)
      .single(),
    supabaseAdmin
      .from('knowledge_bases')
      .select('tone, language, agent_name')
      .eq('hotel_id', hotelId)
      .limit(1)
      .maybeSingle(),
    supabaseAdmin
      .from('documents')
      .select('category, title, content')
      .eq('hotel_id', hotelId)
      .eq('active', true)
      .order('category'),
  ])

  const accountData = accountResult.data as { id: string; name: string } | null
  const kbData = kbResult.data as { tone: string | null; language: string | null; agent_name: string | null } | null
  const docsData = docsResult.data as Array<{ category: string; title: string; content: string }> | null

  if (accountResult.error || !accountData) {
    const config = getHotelConfig(hotelId)
    if (config) {
      console.warn(`[loader] ${hotelId}: not found in DB, using hardcoded fallback`)
      return { knowledge: toHotelKnowledge(config), accountId: hotelId }
    }
    throw new Error(`Hotel not found: ${hotelId}`)
  }

  const kb = kbData ?? { tone: 'warm', language: 'auto', agent_name: null }
  const docs = docsData ?? []

  return { knowledge: fromDbDocuments(accountData.name, kb, docs), accountId: accountData.id }
}
