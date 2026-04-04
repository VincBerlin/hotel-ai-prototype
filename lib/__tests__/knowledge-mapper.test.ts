import test from 'node:test'
import assert from 'node:assert/strict'
import { fromDbDocuments } from '../knowledge-base/mapper.ts'

const KB = { tone: 'warm', language: 'auto', agent_name: 'Aria' }
const KB_DEFAULTS = { tone: null, language: null, agent_name: null }

test('fromDbDocuments maps a full document set to HotelKnowledge', () => {
  const docs = [
    { category: 'location', title: 'Location', content: JSON.stringify({ address: '1 Main St', city: 'Vienna', country: 'Austria' }) },
    { category: 'checkin', title: 'Check-in', content: JSON.stringify({ from: '15:00', until: '12:00', process: 'Front desk.' }) },
    { category: 'wifi', title: 'WiFi', content: JSON.stringify({ network: 'HotelNet', password: 'abc123' }) },
    { category: 'contact', title: 'Contact', content: JSON.stringify({ email: 'info@hotel.com', phone: '+431234567' }) },
    { category: 'faq', title: 'Parking available?', content: 'Yes, valet parking at €35/night.' },
    { category: 'faq', title: 'Late checkout?', content: 'Until 14:00 on request.' },
    { category: 'dining', title: 'The Rooftop', content: JSON.stringify({ cuisine: 'Modern European', distance: 'On-site', highlight: 'Panoramic views.' }) },
    { category: 'attractions', title: 'Schönbrunn Palace', content: JSON.stringify({ distance: '3 km', description: 'Imperial baroque palace.' }) },
    { category: 'facilities', title: 'Spa', content: 'Open 08:00–22:00. Booking required.' },
    { category: 'transport', title: 'Transport', content: JSON.stringify({ fromAirport: 'CAT train 16 min.', publicTransport: 'U4 Karlsplatz.', taxi: 'Bolt app.' }) },
    { category: 'policies', title: 'Policies', content: JSON.stringify({ cancellation: '48h free cancellation.', houseRules: 'No smoking.', payment: ['Visa', 'Mastercard'] }) },
    { category: 'breakfast', title: 'Breakfast', content: JSON.stringify({ available: true, included: false, hours: '07:00–11:00', location: 'The Garden' }) },
    { category: 'parking', title: 'Parking', content: JSON.stringify({ available: true, free: false, details: 'Valet €35/night.' }) },
  ]

  const result = fromDbDocuments('Grand Hotel', KB, docs)

  assert.equal(result.name, 'Grand Hotel')
  assert.equal(result.agentName, 'Aria')
  assert.equal(result.tone, 'warm')
  assert.equal(result.location.city, 'Vienna')
  assert.equal(result.location.country, 'Austria')
  assert.equal(result.checkin.from, '15:00')
  assert.equal(result.checkin.until, '12:00')
  assert.equal(result.checkin.process, 'Front desk.')
  assert.equal(result.wifi.network, 'HotelNet')
  assert.equal(result.wifi.password, 'abc123')
  assert.equal(result.escalation?.email, 'info@hotel.com')
  assert.equal(result.escalation?.phone, '+431234567')
  assert.equal(result.faq?.length, 2)
  assert.equal(result.faq?.[0].question, 'Parking available?')
  assert.equal(result.faq?.[1].question, 'Late checkout?')
  assert.equal(result.restaurants?.length, 1)
  assert.equal(result.restaurants?.[0].name, 'The Rooftop')
  assert.equal(result.restaurants?.[0].cuisine, 'Modern European')
  assert.equal(result.attractions?.length, 1)
  assert.equal(result.attractions?.[0].name, 'Schönbrunn Palace')
  assert.equal(result.attractions?.[0].distance, '3 km')
  assert.equal(result.amenities?.length, 1)
  assert.equal(result.amenities?.[0], 'Spa: Open 08:00–22:00. Booking required.')
  assert.equal(result.transport?.fromAirport, 'CAT train 16 min.')
  assert.equal(result.transport?.publicTransport, 'U4 Karlsplatz.')
  assert.equal(result.policies?.cancellation, '48h free cancellation.')
  assert.deepEqual(result.policies?.payment, ['Visa', 'Mastercard'])
  assert.equal(result.breakfast?.available, true)
  assert.equal(result.breakfast?.hours, '07:00–11:00')
  assert.equal(result.parking?.available, true)
  assert.equal(result.parking?.free, false)
})

test('fromDbDocuments with empty docs returns safe defaults', () => {
  const result = fromDbDocuments('Minimal Hotel', KB_DEFAULTS, [])

  assert.equal(result.name, 'Minimal Hotel')
  assert.equal(result.agentName, undefined)
  assert.equal(result.tone, 'warm')
  assert.equal(result.location.city, '')
  assert.equal(result.location.country, '')
  assert.equal(result.checkin.from, '')
  assert.equal(result.checkin.until, '')
  assert.equal(result.wifi.network, '')
  assert.equal(result.wifi.password, '')
  assert.equal(result.faq, undefined)
  assert.equal(result.restaurants, undefined)
  assert.equal(result.attractions, undefined)
  assert.equal(result.amenities, undefined)
  assert.equal(result.breakfast, undefined)
  assert.equal(result.parking, undefined)
  assert.equal(result.transport, undefined)
  assert.equal(result.policies, undefined)
  assert.equal(result.escalation, undefined)
})

test('fromDbDocuments with malformed JSON content skips the field without throwing', () => {
  const docs = [
    { category: 'wifi', title: 'WiFi', content: 'not-json' },
    { category: 'faq', title: 'What time is checkout?', content: 'Noon.' },
  ]

  let result
  assert.doesNotThrow(() => {
    result = fromDbDocuments('Test Hotel', KB, docs)
  })

  assert.equal(result!.wifi.network, '')
  assert.equal(result!.wifi.password, '')
  assert.equal(result!.faq?.[0].question, 'What time is checkout?')
  assert.equal(result!.faq?.[0].answer, 'Noon.')
})

test('fromDbDocuments transport falls back to plain text when JSON invalid', () => {
  const docs = [
    { category: 'transport', title: 'Transport', content: 'Take the train.' },
  ]

  const result = fromDbDocuments('Test Hotel', KB, docs)

  assert.equal(result.transport?.fromAirport, 'Take the train.')
})
