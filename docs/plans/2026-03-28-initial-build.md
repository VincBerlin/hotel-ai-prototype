# Hotel AI Concierge — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a working multi-hotel AI concierge with WhatsApp-style chat UI, intent detection, escalation logic, and proactive messaging.

**Architecture:** Next.js App Router with URL-based hotel routing (`/hotel/[hotelId]`). Each hotel has an isolated TypeScript config. The request pipeline runs server-side: load config → build context → classify intent → build prompt → call Anthropic → clean output → return response with escalation level.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Anthropic SDK (`@anthropic-ai/sdk`), `date-fns-tz` for timezone handling.

---

### Task 1: Bootstrap Next.js project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`

**Step 1: Initialise the project**

Run in `.worktrees/feature/initial-build/`:
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --no-eslint --import-alias "@/*"
```
Expected: Next.js scaffold created, `package.json` present.

**Step 2: Install additional dependencies**
```bash
npm install @anthropic-ai/sdk date-fns-tz
```

**Step 3: Verify dev server starts**
```bash
npm run dev
```
Expected: Server running on `http://localhost:3000`, no errors.

**Step 4: Commit**
```bash
git add .
git commit -m "feat: bootstrap Next.js project with Tailwind and Anthropic SDK"
```

---

### Task 2: Knowledge Base types

**Files:**
- Create: `lib/knowledge-base/types.ts`

**Step 1: Write the type definitions**

```ts
// lib/knowledge-base/types.ts

export type ToneProfile = {
  style: 'formal' | 'warm' | 'casual'
  language: 'auto' | string
}

export type ResponseRules = {
  formalAddress: boolean
  avoidSuggestions: boolean
  maxSentences: number
  neverMentionAI: boolean
  language: 'auto' | string
}

export type ProactiveConfig = {
  enabled: boolean
  quietHours: { from: string; to: string }
  maxPerDay: number
  triggers: {
    weather: boolean
    sunset: boolean
    localEvents: boolean
    hotelEvents: boolean
  }
}

export type GuestContextConfig = {
  detectLanguage: boolean
  personalization: boolean
  defaultLanguage: string
}

export type Facility = {
  available: boolean
  hours: string
  notes: string
  rules: string[]
  responseHint: string
}

export type DiningOutlet = {
  name: string
  type: string
  hours: string
  dresscode: string
  reservations: boolean
  responseHint: string
}

export type HotelService = {
  name: string
  available: boolean
  hours: string
  notes: string
  responseHint: string
}

export type HotelEvent = {
  name: string
  description: string
  time: string
  location: string
  recurring: boolean
}

export type LocalTip = {
  category: 'transport' | 'attraction' | 'restaurant' | 'tip'
  name: string
  description: string
  distance?: string
}

export type FAQ = {
  question: string
  answer: string
}

export type GoodwillGesture = {
  type: string
  description: string
  maxPerStay: number
}

export type EscalationCategory = {
  name: string
  examples: string[]
  defaultLevel: 0 | 1 | 2 | 3
  allowedGestures: string[]
}

export type EscalationConfig = {
  categories: EscalationCategory[]
  goodwillGestures: GoodwillGesture[]
  humanHandoffMessage: string
  staffContactMethod: string
}

export type HotelConfig = {
  id: string
  name: string
  location: {
    city: string
    country: string
    timezone: string
    coordinates: { lat: number; lng: number }
  }
  contact: { phone: string; email: string; whatsapp?: string }
  policies: {
    checkIn: string
    checkOut: string
    cancellation: string
    pets: string
    smoking: string
  }
  wifi: { ssid: string; password: string }
  responseRules: ResponseRules
  proactive: ProactiveConfig
  guestContext: GuestContextConfig
  facilities: Record<string, Facility>
  dining: DiningOutlet[]
  services: HotelService[]
  events: HotelEvent[]
  localArea: LocalTip[]
  faqs: FAQ[]
  tone: ToneProfile
  escalation: EscalationConfig
}
```

**Step 2: Verify TypeScript compiles**
```bash
npx tsc --noEmit
```
Expected: No errors.

**Step 3: Commit**
```bash
git add lib/knowledge-base/types.ts
git commit -m "feat: add knowledge base TypeScript types"
```

---

### Task 3: Hotel config — Grand Hotel example

**Files:**
- Create: `lib/hotels/grand-hotel.ts`
- Create: `lib/hotels/index.ts`

**Step 1: Create the Grand Hotel config**

```ts
// lib/hotels/grand-hotel.ts
import type { HotelConfig } from '@/lib/knowledge-base/types'

export const grandHotel: HotelConfig = {
  id: 'grand-hotel',
  name: 'Grand Hotel Vienna',
  location: {
    city: 'Vienna',
    country: 'Austria',
    timezone: 'Europe/Vienna',
    coordinates: { lat: 48.2082, lng: 16.3738 },
  },
  contact: {
    phone: '+43 1 515 800',
    email: 'concierge@grandhotelvienna.com',
    whatsapp: '+43 1 515 800',
  },
  policies: {
    checkIn: '15:00',
    checkOut: '12:00',
    cancellation: 'Free cancellation up to 24 hours before arrival.',
    pets: 'Pets are not permitted.',
    smoking: 'The hotel is entirely non-smoking.',
  },
  wifi: { ssid: 'GrandHotel_Guest', password: 'welcome2024' },
  responseRules: {
    formalAddress: true,
    avoidSuggestions: true,
    maxSentences: 4,
    neverMentionAI: true,
    language: 'auto',
  },
  proactive: {
    enabled: true,
    quietHours: { from: '22:00', to: '07:00' },
    maxPerDay: 1,
    triggers: {
      weather: true,
      sunset: true,
      localEvents: true,
      hotelEvents: true,
    },
  },
  guestContext: {
    detectLanguage: true,
    personalization: true,
    defaultLanguage: 'en',
  },
  facilities: {
    pool: {
      available: true,
      hours: '07:00–22:00',
      notes: 'Heated indoor pool on level B1.',
      rules: ['Swimwear required', 'No food or drink poolside'],
      responseHint: 'Mention the pool is heated and open year-round.',
    },
    gym: {
      available: true,
      hours: '06:00–23:00',
      notes: 'Fully equipped fitness centre on level B1.',
      rules: ['Sports attire required'],
      responseHint: 'Mention 24h access with room key card.',
    },
    spa: {
      available: true,
      hours: '09:00–21:00',
      notes: 'Bookings recommended. Access included for suite guests.',
      rules: ['Advance booking required for treatments'],
      responseHint: 'Mention treatments require booking; suite guests have complimentary access.',
    },
  },
  dining: [
    {
      name: 'The Grand Restaurant',
      type: 'Fine dining',
      hours: 'Breakfast 07:00–10:30 | Dinner 18:30–22:30',
      dresscode: 'Smart casual required for dinner.',
      reservations: true,
      responseHint: 'Always mention reservation requirement for dinner.',
    },
    {
      name: 'Lobby Bar',
      type: 'Bar',
      hours: '11:00–01:00',
      dresscode: 'No specific dress code.',
      reservations: false,
      responseHint: 'Mention evening live piano music from 20:00.',
    },
  ],
  services: [
    {
      name: 'Room Service',
      available: true,
      hours: '24 hours',
      notes: 'Full menu available around the clock.',
      responseHint: 'Mention average delivery time is 20 minutes.',
    },
    {
      name: 'Laundry',
      available: true,
      hours: 'Same-day if received before 09:00',
      notes: 'Express service available for additional fee.',
      responseHint: 'Mention same-day deadline of 09:00.',
    },
    {
      name: 'Concierge',
      available: true,
      hours: '24 hours',
      notes: 'Restaurant reservations, tickets, transport arrangements.',
      responseHint: 'Offer to assist with bookings or transport directly.',
    },
  ],
  events: [
    {
      name: 'Evening Piano',
      description: 'Live piano performance in the Lobby Bar.',
      time: 'Daily 20:00–23:00',
      location: 'Lobby Bar',
      recurring: true,
    },
  ],
  localArea: [
    {
      category: 'attraction',
      name: 'Kunsthistorisches Museum',
      description: 'World-class art museum, 10 minutes on foot.',
      distance: '800m',
    },
    {
      category: 'transport',
      name: 'U-Bahn Karlsplatz',
      description: 'Nearest metro station, lines U1, U2, U4.',
      distance: '400m',
    },
    {
      category: 'tip',
      name: 'Naschmarkt',
      description: 'Vienna\'s most famous open-air market. Open Mon–Sat from 06:00.',
      distance: '1.2km',
    },
  ],
  faqs: [
    {
      question: 'Is parking available?',
      answer: 'Valet parking is available at €35 per night. Please inform the concierge upon arrival.',
    },
    {
      question: 'What is the check-in time?',
      answer: 'Check-in is from 15:00. Early check-in is subject to availability and can be requested at the front desk.',
    },
  ],
  tone: { style: 'formal', language: 'auto' },
  escalation: {
    categories: [
      {
        name: 'Room issue',
        examples: ['noise', 'temperature', 'cleanliness', 'equipment malfunction'],
        defaultLevel: 1,
        allowedGestures: ['complimentary_drink', 'late_checkout'],
      },
      {
        name: 'Service failure',
        examples: ['wrong order', 'long wait', 'missing item'],
        defaultLevel: 2,
        allowedGestures: ['complimentary_drink', 'meal_credit'],
      },
      {
        name: 'Serious complaint',
        examples: ['repeated unresolved issue', 'billing dispute', 'discrimination'],
        defaultLevel: 3,
        allowedGestures: [],
      },
      {
        name: 'Emergency',
        examples: ['medical', 'fire', 'security', 'safety concern'],
        defaultLevel: 3,
        allowedGestures: [],
      },
    ],
    goodwillGestures: [
      { type: 'complimentary_drink', description: 'One complimentary drink at the Lobby Bar.', maxPerStay: 1 },
      { type: 'late_checkout', description: 'Late checkout until 14:00 subject to availability.', maxPerStay: 1 },
      { type: 'meal_credit', description: 'Credit of up to €30 toward dining.', maxPerStay: 1 },
    ],
    humanHandoffMessage:
      'I am connecting you with a member of our team now. They will be with you shortly.',
    staffContactMethod: 'whatsapp',
  },
}
```

**Step 2: Create the hotel registry**

```ts
// lib/hotels/index.ts
import type { HotelConfig } from '@/lib/knowledge-base/types'
import { grandHotel } from './grand-hotel'

const registry: Record<string, HotelConfig> = {
  'grand-hotel': grandHotel,
}

export function getHotelConfig(hotelId: string): HotelConfig | null {
  return registry[hotelId] ?? null
}
```

**Step 3: Verify TypeScript compiles**
```bash
npx tsc --noEmit
```
Expected: No errors.

**Step 4: Commit**
```bash
git add lib/hotels/
git commit -m "feat: add Grand Hotel config and hotel registry"
```

---

### Task 4: Knowledge base loader

**Files:**
- Create: `lib/knowledge-base/loader.ts`

**Step 1: Write the loader**

```ts
// lib/knowledge-base/loader.ts
import type { HotelConfig } from './types'
import { getHotelConfig } from '@/lib/hotels'

export function loadHotelConfig(hotelId: string): HotelConfig {
  const config = getHotelConfig(hotelId)
  if (!config) {
    throw new Error(`Hotel not found: ${hotelId}`)
  }
  return config
}
```

**Step 2: Verify TypeScript compiles**
```bash
npx tsc --noEmit
```

**Step 3: Commit**
```bash
git add lib/knowledge-base/loader.ts
git commit -m "feat: add knowledge base loader"
```

---

### Task 5: Context builder (real-time data)

**Files:**
- Create: `lib/context/weather.ts`
- Create: `lib/context/events.ts`
- Create: `lib/context/builder.ts`

**Step 1: Create mock weather module**

```ts
// lib/context/weather.ts
export type WeatherData = {
  condition: string
  temperatureCelsius: number
  recommendation: string
}

export function getMockWeather(city: string): WeatherData {
  // Mock data — replace with real API later
  return {
    condition: 'Partly cloudy',
    temperatureCelsius: 14,
    recommendation: 'A light jacket is advisable for the evening.',
  }
}
```

**Step 2: Create mock events module**

```ts
// lib/context/events.ts
export type LocalEvent = {
  name: string
  date: string
  description: string
}

export function getMockLocalEvents(city: string): LocalEvent[] {
  // Mock data — replace with real API later
  return [
    {
      name: 'Vienna Philharmonic Concert',
      date: 'Today, 19:30',
      description: 'Concert at the Musikverein. Tickets likely sold out — enquire at concierge.',
    },
  ]
}
```

**Step 3: Create context builder**

```ts
// lib/context/builder.ts
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import type { HotelConfig } from '@/lib/knowledge-base/types'
import { getMockWeather, type WeatherData } from './weather'
import { getMockLocalEvents, type LocalEvent } from './events'

export type RealtimeContext = {
  localTime: string
  localDate: string
  weather: WeatherData
  localEvents: LocalEvent[]
}

export function buildContext(hotel: HotelConfig): RealtimeContext {
  const now = new Date()
  const zoned = toZonedTime(now, hotel.location.timezone)

  return {
    localTime: format(zoned, 'HH:mm'),
    localDate: format(zoned, 'EEEE, d MMMM yyyy'),
    weather: getMockWeather(hotel.location.city),
    localEvents: getMockLocalEvents(hotel.location.city),
  }
}
```

**Step 4: Verify TypeScript compiles**
```bash
npx tsc --noEmit
```

**Step 5: Commit**
```bash
git add lib/context/
git commit -m "feat: add context builder with mock weather and events"
```

---

### Task 6: Intent interpreter

**Files:**
- Create: `lib/ai/interpreter.ts`

**Step 1: Write the interpreter**

```ts
// lib/ai/interpreter.ts

export type GuestIntent =
  | 'info_request'
  | 'complaint'
  | 'service_request'
  | 'smalltalk'
  | 'emergency'

export type InterpretedMessage = {
  intent: GuestIntent
  escalationLevel: 0 | 1 | 2 | 3
  detectedLanguage: string
}

export function interpretMessage(
  message: string,
  history: { role: string; content: string }[]
): InterpretedMessage {
  const lower = message.toLowerCase()

  // Emergency detection — always level 3
  const emergencyTerms = ['fire', 'help', 'emergency', 'medical', 'police', 'security', 'danger', 'feuer', 'hilfe', 'notfall']
  if (emergencyTerms.some((t) => lower.includes(t))) {
    return { intent: 'emergency', escalationLevel: 3, detectedLanguage: detectLanguage(message) }
  }

  // Complaint detection
  const complaintTerms = ['problem', 'issue', 'broken', 'dirty', 'noise', 'cold', 'hot', 'wrong', 'disappointed', 'unacceptable', 'complaint', 'manager', 'terrible', 'awful', 'nicht funktioniert', 'kaputt', 'lärm']
  if (complaintTerms.some((t) => lower.includes(t))) {
    // Check if repeated complaint in history
    const isRepeated = history.some(
      (m) => m.role === 'user' && complaintTerms.some((t) => m.content.toLowerCase().includes(t))
    )
    const level = isRepeated ? 3 : lower.includes('manager') || lower.includes('unacceptable') ? 3 : 2
    return { intent: 'complaint', escalationLevel: level, detectedLanguage: detectLanguage(message) }
  }

  // Service request detection
  const serviceTerms = ['book', 'reserve', 'order', 'need', 'want', 'request', 'send', 'bring', 'arrange', 'buchen', 'bestellen', 'brauche']
  if (serviceTerms.some((t) => lower.includes(t))) {
    return { intent: 'service_request', escalationLevel: 0, detectedLanguage: detectLanguage(message) }
  }

  // Smalltalk
  const smalltalkTerms = ['hello', 'hi', 'hey', 'thanks', 'thank you', 'bye', 'goodbye', 'good morning', 'good evening', 'hallo', 'danke', 'tschüss', 'guten morgen', 'guten abend']
  if (smalltalkTerms.some((t) => lower.includes(t))) {
    return { intent: 'smalltalk', escalationLevel: 0, detectedLanguage: detectLanguage(message) }
  }

  // Default: info request
  return { intent: 'info_request', escalationLevel: 0, detectedLanguage: detectLanguage(message) }
}

function detectLanguage(message: string): string {
  const germanTerms = ['ich', 'ist', 'nicht', 'und', 'die', 'der', 'das', 'haben', 'können', 'bitte', 'danke', 'wie', 'wann', 'wo']
  const lower = message.toLowerCase()
  const germanMatches = germanTerms.filter((t) => lower.includes(t)).length
  return germanMatches >= 2 ? 'de' : 'en'
}
```

**Step 2: Verify TypeScript compiles**
```bash
npx tsc --noEmit
```

**Step 3: Commit**
```bash
git add lib/ai/interpreter.ts
git commit -m "feat: add intent interpreter with escalation level detection"
```

---

### Task 7: Escalation handler

**Files:**
- Create: `lib/ai/escalation.ts`
- Create: `lib/ai/escalationHandler.ts`

**Step 1: Write escalation decision logic**

```ts
// lib/ai/escalation.ts
import type { HotelConfig } from '@/lib/knowledge-base/types'
import type { GuestIntent, InterpretedMessage } from './interpreter'

export type EscalationDecision = {
  level: 0 | 1 | 2 | 3
  gesture: string | null
  handoff: boolean
}

export function decideEscalation(
  interpreted: InterpretedMessage,
  hotel: HotelConfig
): EscalationDecision {
  const { intent, escalationLevel } = interpreted

  if (intent === 'emergency' || escalationLevel === 3) {
    return { level: 3, gesture: null, handoff: true }
  }

  if (escalationLevel === 2) {
    // Find an applicable gesture
    const category = hotel.escalation.categories.find(
      (c) => c.defaultLevel <= 2 && c.allowedGestures.length > 0
    )
    const gestureName = category?.allowedGestures[0] ?? null
    const gesture = gestureName
      ? hotel.escalation.goodwillGestures.find((g) => g.type === gestureName)?.description ?? null
      : null
    return { level: 2, gesture, handoff: false }
  }

  if (escalationLevel === 1) {
    return { level: 1, gesture: null, handoff: false }
  }

  return { level: 0, gesture: null, handoff: false }
}
```

**Step 2: Write escalation handler**

```ts
// lib/ai/escalationHandler.ts
import type { EscalationDecision } from './escalation'
import type { HotelConfig } from '@/lib/knowledge-base/types'

export type EscalationAction = {
  systemNote: string | null
  appendToResponse: string | null
}

export function handleEscalation(
  decision: EscalationDecision,
  hotel: HotelConfig
): EscalationAction {
  if (decision.level === 3) {
    return {
      systemNote: 'HANDOFF: Guest requires human staff immediately.',
      appendToResponse: hotel.escalation.humanHandoffMessage,
    }
  }

  if (decision.level === 2 && decision.gesture) {
    return {
      systemNote: `LOG: Goodwill gesture offered — ${decision.gesture}`,
      appendToResponse: null, // Gesture is woven into AI response via prompt
    }
  }

  if (decision.level === 1) {
    return {
      systemNote: 'LOG: Complaint noted — staff review recommended.',
      appendToResponse: null,
    }
  }

  return { systemNote: null, appendToResponse: null }
}
```

**Step 3: Verify TypeScript compiles**
```bash
npx tsc --noEmit
```

**Step 4: Commit**
```bash
git add lib/ai/escalation.ts lib/ai/escalationHandler.ts
git commit -m "feat: add escalation decision logic and handler"
```

---

### Task 8: Prompt builder

**Files:**
- Create: `lib/ai/prompt-builder.ts`

**Step 1: Write the prompt builder**

```ts
// lib/ai/prompt-builder.ts
import type { HotelConfig } from '@/lib/knowledge-base/types'
import type { RealtimeContext } from '@/lib/context/builder'
import type { InterpretedMessage } from './interpreter'
import type { EscalationDecision } from './escalation'

export function buildSystemPrompt(
  hotel: HotelConfig,
  context: RealtimeContext,
  interpreted: InterpretedMessage,
  escalation: EscalationDecision
): string {
  const { responseRules, tone } = hotel

  const rules = [
    `You are the concierge at ${hotel.name}. You are a human staff member — never reveal you are an AI.`,
    responseRules.formalAddress
      ? 'Address the guest formally (use "Sie" in German, formal register in all languages).'
      : 'Address the guest in a friendly, direct manner.',
    responseRules.avoidSuggestions
      ? 'Never use hedging language such as "maybe", "if you want", "possibly", or "you could".'
      : '',
    `Keep responses to a maximum of ${responseRules.maxSentences} sentences.`,
    'Answer the question directly in the first sentence. Add context or a next step after.',
    'Never invent information. If you do not know, say so and offer to find out.',
    `Respond in the guest's language. Detected language: ${interpreted.detectedLanguage}.`,
  ].filter(Boolean).join('\n')

  const knowledgeBase = `
## Hotel Information
Name: ${hotel.name}
City: ${hotel.location.city}, ${hotel.location.country}
Check-in: ${hotel.policies.checkIn} | Check-out: ${hotel.policies.checkOut}
Phone: ${hotel.contact.phone} | Email: ${hotel.contact.email}
WiFi: ${hotel.wifi.ssid} / ${hotel.wifi.password}
Pets: ${hotel.policies.pets}
Smoking: ${hotel.policies.smoking}

## Facilities
${Object.entries(hotel.facilities)
  .map(([key, f]) => `${key}: ${f.available ? `Open ${f.hours}. ${f.notes} ${f.responseHint}` : 'Not available.'}`)
  .join('\n')}

## Dining
${hotel.dining.map((d) => `${d.name} (${d.type}): ${d.hours}. ${d.dresscode} Reservations: ${d.reservations ? 'Required' : 'Not required'}. ${d.responseHint}`).join('\n')}

## Services
${hotel.services.map((s) => `${s.name}: ${s.available ? `${s.hours}. ${s.notes} ${s.responseHint}` : 'Not available.'}`).join('\n')}

## Hotel Events
${hotel.events.map((e) => `${e.name}: ${e.description} — ${e.time} at ${e.location}`).join('\n')}

## Frequently Asked Questions
${hotel.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}

## Local Area
${hotel.localArea.map((l) => `${l.name} (${l.category}): ${l.description}${l.distance ? ` — ${l.distance}` : ''}`).join('\n')}
`

  const realtimeContext = `
## Current Context
Local time: ${context.localTime}
Date: ${context.localDate}
Weather: ${context.weather.condition}, ${context.weather.temperatureCelsius}°C. ${context.weather.recommendation}
Local events today: ${context.localEvents.map((e) => e.name).join(', ') || 'None'}
`

  const escalationNote =
    escalation.level === 2 && escalation.gesture
      ? `\n## Escalation Guidance\nThe guest has a complaint. You may offer the following goodwill gesture if appropriate: ${escalation.gesture}. Do not exceed this offer.`
      : escalation.level === 3
      ? `\n## Escalation Guidance\nThis situation requires human staff. Acknowledge the guest calmly and inform them that a team member will assist them shortly.`
      : ''

  return [rules, knowledgeBase, realtimeContext, escalationNote].join('\n')
}
```

**Step 2: Verify TypeScript compiles**
```bash
npx tsc --noEmit
```

**Step 3: Commit**
```bash
git add lib/ai/prompt-builder.ts
git commit -m "feat: add system prompt builder"
```

---

### Task 9: Responder (Anthropic API call + output cleaning)

**Files:**
- Create: `lib/ai/responder.ts`

**Step 1: Create `.env.local`**
```
ANTHROPIC_API_KEY=your_api_key_here
```

**Step 2: Write the responder**

```ts
// lib/ai/responder.ts
import Anthropic from '@anthropic-ai/sdk'
import type { ResponseRules } from '@/lib/knowledge-base/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type Message = {
  role: 'user' | 'assistant'
  content: string
}

export async function getResponse(
  systemPrompt: string,
  messages: Message[],
  rules: ResponseRules
): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''
  return cleanResponse(raw, rules)
}

function cleanResponse(text: string, rules: ResponseRules): string {
  let cleaned = text

  // Strip AI self-references
  const aiPhrases = [
    /as an ai[,.]?/gi,
    /als ki[,.]?/gi,
    /i'm an ai[,.]?/gi,
    /ich bin eine? ki[,.]?/gi,
    /as a language model[,.]?/gi,
  ]
  aiPhrases.forEach((re) => { cleaned = cleaned.replace(re, '') })

  // Remove hedging language if configured
  if (rules.avoidSuggestions) {
    const hedges = [
      /\bmaybe\b/gi,
      /\bperhaps\b/gi,
      /\bpossibly\b/gi,
      /\bif you (want|like|wish)\b/gi,
      /\byou could\b/gi,
      /\bvielleicht\b/gi,
      /\bevtl\.?\b/gi,
    ]
    hedges.forEach((re) => { cleaned = cleaned.replace(re, '') })
  }

  // Enforce max sentences
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) ?? [cleaned]
  if (sentences.length > rules.maxSentences) {
    cleaned = sentences.slice(0, rules.maxSentences).join(' ')
  }

  return cleaned.trim()
}
```

**Step 3: Verify TypeScript compiles**
```bash
npx tsc --noEmit
```

**Step 4: Commit**
```bash
git add lib/ai/responder.ts .env.local
git commit -m "feat: add Anthropic responder with output cleaning"
```

---

### Task 10: Proactive message engine

**Files:**
- Create: `lib/ai/proactive.ts`

**Step 1: Write the proactive engine**

```ts
// lib/ai/proactive.ts
import type { HotelConfig } from '@/lib/knowledge-base/types'
import type { RealtimeContext } from '@/lib/context/builder'

export type ProactiveMessage = {
  text: string
  type: 'weather' | 'sunset' | 'localEvent' | 'hotelEvent'
}

export function getProactiveMessage(
  hotel: HotelConfig,
  context: RealtimeContext,
  alreadySentToday: boolean
): ProactiveMessage | null {
  const { proactive } = hotel

  if (!proactive.enabled || alreadySentToday) return null

  // Check quiet hours
  const [quietFrom] = proactive.quietHours.from.split(':').map(Number)
  const [quietTo] = proactive.quietHours.to.split(':').map(Number)
  const [currentHour] = context.localTime.split(':').map(Number)
  if (currentHour >= quietFrom || currentHour < quietTo) return null

  // Priority: weather → localEvents → hotelEvents
  if (proactive.triggers.weather && context.weather.recommendation) {
    return {
      type: 'weather',
      text: `Weather update: ${context.weather.condition}, ${context.weather.temperatureCelsius}°C. ${context.weather.recommendation}`,
    }
  }

  if (proactive.triggers.localEvents && context.localEvents.length > 0) {
    const event = context.localEvents[0]
    return {
      type: 'localEvent',
      text: `Local tip: ${event.name} — ${event.description}`,
    }
  }

  if (proactive.triggers.hotelEvents && hotel.events.length > 0) {
    const event = hotel.events[0]
    return {
      type: 'hotelEvent',
      text: `This evening: ${event.name}. ${event.description} ${event.time} at ${event.location}.`,
    }
  }

  return null
}
```

**Step 2: Verify TypeScript compiles**
```bash
npx tsc --noEmit
```

**Step 3: Commit**
```bash
git add lib/ai/proactive.ts
git commit -m "feat: add proactive message engine"
```

---

### Task 11: API route

**Files:**
- Create: `app/hotel/[hotelId]/api/chat/route.ts`

**Step 1: Write the API route**

```ts
// app/hotel/[hotelId]/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { loadHotelConfig } from '@/lib/knowledge-base/loader'
import { buildContext } from '@/lib/context/builder'
import { interpretMessage } from '@/lib/ai/interpreter'
import { buildSystemPrompt } from '@/lib/ai/prompt-builder'
import { decideEscalation } from '@/lib/ai/escalation'
import { handleEscalation } from '@/lib/ai/escalationHandler'
import { getResponse, type Message } from '@/lib/ai/responder'

export async function POST(
  req: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { messages }: { messages: Message[] } = await req.json()
    const hotel = loadHotelConfig(params.hotelId)

    const context = buildContext(hotel)
    const lastMessage = messages[messages.length - 1]
    const history = messages.slice(0, -1)

    const interpreted = interpretMessage(lastMessage.content, history)
    const escalationDecision = decideEscalation(interpreted, hotel)
    const escalationAction = handleEscalation(escalationDecision, hotel)

    const systemPrompt = buildSystemPrompt(hotel, context, interpreted, escalationDecision)
    let responseText = await getResponse(systemPrompt, messages, hotel.responseRules)

    // Append handoff message for level 3 escalations
    if (escalationAction.appendToResponse) {
      responseText = `${responseText}\n\n${escalationAction.appendToResponse}`
    }

    return NextResponse.json({
      message: responseText,
      escalationLevel: escalationDecision.level,
    })
  } catch (error) {
    const message = error instanceof Error && error.message.includes('Hotel not found')
      ? 'Hotel not found.'
      : 'An error occurred.'
    return NextResponse.json({ error: message }, { status: error instanceof Error && error.message.includes('Hotel not found') ? 404 : 500 })
  }
}
```

**Step 2: Verify TypeScript compiles**
```bash
npx tsc --noEmit
```

**Step 3: Commit**
```bash
git add app/hotel/
git commit -m "feat: add chat API route with full pipeline"
```

---

### Task 12: Chat UI

**Files:**
- Create: `app/hotel/[hotelId]/page.tsx`
- Create: `components/chat/MessageBubble.tsx`
- Create: `components/chat/InputBar.tsx`
- Create: `components/chat/SystemAlert.tsx`
- Create: `components/chat/ChatWindow.tsx`

**Step 1: MessageBubble component**

```tsx
// components/chat/MessageBubble.tsx
type Props = {
  role: 'guest' | 'ai'
  content: string
}

export function MessageBubble({ role, content }: Props) {
  const isGuest = role === 'guest'
  return (
    <div className={`flex ${isGuest ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isGuest
            ? 'bg-[#DCF8C6] text-gray-900 rounded-br-sm'
            : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
        }`}
      >
        {content}
      </div>
    </div>
  )
}
```

**Step 2: SystemAlert component**

```tsx
// components/chat/SystemAlert.tsx
type Props = {
  text: string
}

export function SystemAlert({ text }: Props) {
  return (
    <div className="flex justify-center my-3">
      <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
        {text}
      </span>
    </div>
  )
}
```

**Step 3: InputBar component**

```tsx
// components/chat/InputBar.tsx
'use client'
import { useState } from 'react'

type Props = {
  onSend: (text: string) => void
  disabled: boolean
}

export function InputBar({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-white border-t border-gray-200">
      <input
        type="text"
        className="flex-1 px-4 py-2 rounded-full border border-gray-300 text-sm outline-none focus:border-gray-400"
        placeholder="Type a message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center disabled:opacity-40"
      >
        ↑
      </button>
    </div>
  )
}
```

**Step 4: ChatWindow component**

```tsx
// components/chat/ChatWindow.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageBubble } from './MessageBubble'
import { SystemAlert } from './SystemAlert'
import { InputBar } from './InputBar'

type Message = {
  id: string
  role: 'guest' | 'ai' | 'system'
  content: string
}

type Props = {
  hotelId: string
  hotelName: string
}

export function ChatWindow({ hotelId, hotelName }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    const userMsg: Message = { id: crypto.randomUUID(), role: 'guest', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setLoading(true)

    try {
      const res = await fetch(`/hotel/${hotelId}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated
            .filter((m) => m.role !== 'system')
            .map((m) => ({ role: m.role === 'guest' ? 'user' : 'assistant', content: m.content })),
        }),
      })

      const data = await res.json()

      const aiMsg: Message = { id: crypto.randomUUID(), role: 'ai', content: data.message }
      const next = [...updated, aiMsg]

      if (data.escalationLevel === 3) {
        next.push({ id: crypto.randomUUID(), role: 'system', content: 'A member of our team has been notified and will assist you shortly.' })
      }

      setMessages(next)
    } catch {
      setMessages([...updated, { id: crypto.randomUUID(), role: 'system', content: 'Connection error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">🏨</div>
        <div>
          <p className="font-semibold text-sm">{hotelName}</p>
          <p className="text-xs text-white/70">Concierge</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#ECE5DD]">
        {messages.length === 0 && (
          <SystemAlert text="How can we assist you today?" />
        )}
        {messages.map((m) =>
          m.role === 'system' ? (
            <SystemAlert key={m.id} text={m.content} />
          ) : (
            <MessageBubble key={m.id} role={m.role} content={m.content} />
          )
        )}
        {loading && (
          <div className="flex justify-start mb-2">
            <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm text-gray-400 text-sm">...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <InputBar onSend={sendMessage} disabled={loading} />
    </div>
  )
}
```

**Step 5: Hotel page**

```tsx
// app/hotel/[hotelId]/page.tsx
import { getHotelConfig } from '@/lib/hotels'
import { notFound } from 'next/navigation'
import { ChatWindow } from '@/components/chat/ChatWindow'

export default function HotelPage({ params }: { params: { hotelId: string } }) {
  const hotel = getHotelConfig(params.hotelId)
  if (!hotel) notFound()

  return (
    <main className="h-screen flex flex-col max-w-md mx-auto">
      <ChatWindow hotelId={hotel.id} hotelName={hotel.name} />
    </main>
  )
}
```

**Step 6: Verify dev server runs without errors**
```bash
npm run dev
```
Open `http://localhost:3000/hotel/grand-hotel` — chat UI should appear.

**Step 7: Commit**
```bash
git add components/ app/hotel/
git commit -m "feat: add WhatsApp-style chat UI with full message pipeline"
```

---

### Task 13: End-to-end smoke test

**Step 1: Start the dev server**
```bash
npm run dev
```

**Step 2: Open the chat**

Navigate to `http://localhost:3000/hotel/grand-hotel`

**Step 3: Test these scenarios manually**

| Input | Expected behaviour |
|---|---|
| "What time is check-in?" | Direct answer, ≤4 sentences, no hedging |
| "The room is too noisy." | Empathetic response, goodwill gesture offered |
| "There is a fire!" | Immediate handoff message + system alert |
| "Guten Morgen" | Response in German |
| "Can I book a table for dinner?" | Confirms reservation process for The Grand Restaurant |

**Step 4: Verify no AI self-references appear in any response**

**Step 5: Final commit**
```bash
git add .
git commit -m "chore: complete initial build smoke test"
```
