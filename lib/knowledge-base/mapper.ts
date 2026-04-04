import type { HotelConfig, HotelKnowledge } from './types'

type DbDocument = { category: string; title: string; content: string }
type DbKnowledgeBase = { tone: string | null; language: string | null; agent_name: string | null }

function parseJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function fromDbDocuments(
  accountName: string,
  kb: DbKnowledgeBase,
  docs: DbDocument[]
): HotelKnowledge {
  const grouped = new Map<string, DbDocument[]>()
  for (const doc of docs) {
    const group = grouped.get(doc.category) ?? []
    group.push(doc)
    grouped.set(doc.category, group)
  }

  const one = (cat: string): DbDocument | null => grouped.get(cat)?.[0] ?? null
  const many = (cat: string): DbDocument[] => grouped.get(cat) ?? []

  const locationDoc = one('location')
  const locationData = locationDoc
    ? parseJson<{ address?: string; city?: string; country?: string; gpsLink?: string }>(locationDoc.content)
    : null

  const checkinDoc = one('checkin')
  const checkinData = checkinDoc
    ? parseJson<{ from?: string; until?: string; process?: string; earlyCheckin?: string; lateCheckout?: string; luggageStorage?: string }>(checkinDoc.content)
    : null

  const wifiDoc = one('wifi')
  const wifiData = wifiDoc
    ? parseJson<{ network?: string; password?: string }>(wifiDoc.content)
    : null

  const breakfastDoc = one('breakfast')
  const breakfastData = breakfastDoc
    ? parseJson<{ available?: boolean; included?: boolean; hours?: string; location?: string; details?: string }>(breakfastDoc.content)
    : null

  const parkingDoc = one('parking')
  const parkingData = parkingDoc
    ? parseJson<{ available?: boolean; free?: boolean; details?: string }>(parkingDoc.content)
    : null

  const transportDoc = one('transport')
  const transportData = transportDoc
    ? parseJson<{ fromAirport?: string; publicTransport?: string; taxi?: string }>(transportDoc.content)
    : null

  const policiesDoc = one('policies')
  const policiesData = policiesDoc
    ? parseJson<{ cancellation?: string; houseRules?: string; payment?: string[]; pets?: string; smoking?: string }>(policiesDoc.content)
    : null

  const contactDoc = one('contact')
  const contactData = contactDoc
    ? parseJson<{ email?: string; phone?: string }>(contactDoc.content)
    : null

  const faq = many('faq').map(d => ({ question: d.title, answer: d.content }))

  const restaurantDocs = [...many('dining'), ...many('restaurants')]
  const restaurants = restaurantDocs.map(d => {
    const data = parseJson<{ cuisine?: string; distance?: string; highlight?: string }>(d.content)
    return {
      name: d.title,
      cuisine: data?.cuisine ?? 'Local',
      distance: data?.distance ?? 'On-site',
      highlight: data?.highlight ?? d.content,
    }
  })

  const attractions = many('attractions').map(d => {
    const data = parseJson<{ distance?: string; description?: string }>(d.content)
    return {
      name: d.title,
      distance: data?.distance ?? 'Nearby',
      description: data?.description ?? d.content,
    }
  })

  const amenities = [...many('facilities'), ...many('amenities')].map(
    d => `${d.title}: ${d.content}`
  )

  return {
    name: accountName,
    agentName: kb.agent_name ?? undefined,
    tone: (kb.tone as 'formal' | 'warm' | 'casual' | null) ?? 'warm',
    location: {
      address: locationData?.address ?? locationData?.city ?? '',
      city: locationData?.city ?? '',
      country: locationData?.country ?? '',
      gpsLink: locationData?.gpsLink,
    },
    checkin: {
      from: checkinData?.from ?? '',
      until: checkinData?.until ?? '',
      process: checkinData?.process,
      earlyCheckin: checkinData?.earlyCheckin,
      lateCheckout: checkinData?.lateCheckout,
      luggageStorage: checkinData?.luggageStorage,
    },
    wifi: {
      network: wifiData?.network ?? '',
      password: wifiData?.password ?? '',
    },
    breakfast: breakfastDoc
      ? {
          available: breakfastData?.available ?? false,
          included: breakfastData?.included ?? false,
          hours: breakfastData?.hours ?? '',
          location: breakfastData?.location ?? '',
          details: breakfastData?.details,
        }
      : undefined,
    parking: parkingDoc
      ? {
          available: parkingData?.available ?? false,
          free: parkingData?.free ?? false,
          details: parkingData?.details ?? '',
        }
      : undefined,
    transport: transportData?.fromAirport
      ? { fromAirport: transportData.fromAirport, publicTransport: transportData.publicTransport, taxi: transportData.taxi }
      : transportDoc
        ? { fromAirport: transportDoc.content }
        : undefined,
    policies: policiesDoc
      ? {
          cancellation: policiesData?.cancellation ?? '',
          houseRules: policiesData?.houseRules ?? '',
          payment: policiesData?.payment ?? [],
          pets: policiesData?.pets,
          smoking: policiesData?.smoking,
        }
      : undefined,
    faq: faq.length > 0 ? faq : undefined,
    restaurants: restaurants.length > 0 ? restaurants : undefined,
    attractions: attractions.length > 0 ? attractions : undefined,
    amenities: amenities.length > 0 ? amenities : undefined,
    escalation: contactDoc
      ? { email: contactData?.email ?? '', phone: contactData?.phone ?? '' }
      : undefined,
  }
}

export function toHotelKnowledge(hotel: HotelConfig): HotelKnowledge {
  // On-site dining as restaurants
  const diningRestaurants = hotel.dining.map((d) => ({
    name: d.name,
    cuisine: d.type,
    distance: 'On-site',
    highlight: `${d.hours}. ${d.dresscode} ${d.responseHint}`.trim(),
  }))

  // Local restaurants from localArea
  const localRestaurants = hotel.localArea
    .filter((l) => l.category === 'restaurant')
    .map((l) => ({
      name: l.name,
      cuisine: 'Local',
      distance: l.distance ?? 'Nearby',
      highlight: l.description,
    }))

  // Attractions from localArea
  const attractions = hotel.localArea
    .filter((l) => l.category === 'attraction' || l.category === 'tip')
    .map((l) => ({
      name: l.name,
      distance: l.distance ?? 'Nearby',
      description: l.description,
    }))

  // Transport from localArea
  const transportEntries = hotel.localArea.filter((l) => l.category === 'transport')
  const airportEntry = transportEntries.find((t) => t.name.toLowerCase().includes('airport'))
  const metroEntry = transportEntries.find((t) => !t.name.toLowerCase().includes('airport'))

  // Amenities from services + facilities
  const amenities: string[] = [
    ...hotel.services
      .filter((s) => s.available)
      .map((s) => `${s.name}: ${s.hours}. ${s.notes}`),
    ...Object.entries(hotel.facilities)
      .filter(([, f]) => f.available)
      .map(([key, f]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: open ${f.hours}. ${f.notes}`),
  ]

  // Breakfast from dining
  const breakfastOutlet = hotel.dining.find(
    (d) => d.hours.toLowerCase().includes('breakfast') || d.type.toLowerCase().includes('breakfast')
  )

  return {
    name: hotel.name,
    tone: hotel.tone.style,
    location: {
      address: `${hotel.location.city}, ${hotel.location.country}`,
      city: hotel.location.city,
      country: hotel.location.country,
    },
    checkin: {
      from: hotel.policies.checkIn,
      until: hotel.policies.checkOut,
      process: 'Present your booking confirmation and ID at the front desk. Key cards are issued immediately.',
      earlyCheckin: 'Early check-in from 12:00 subject to availability at no extra charge.',
      lateCheckout: 'Late check-out until 14:00 subject to availability — please request by 10:00.',
      luggageStorage: 'Complimentary luggage storage available 24 hours, before check-in and after check-out.',
    },
    wifi: {
      network: hotel.wifi.ssid,
      password: hotel.wifi.password,
    },
    breakfast: breakfastOutlet
      ? {
          available: true,
          included: false,
          hours: breakfastOutlet.hours.split('|')[0].replace('Breakfast', '').trim(),
          location: breakfastOutlet.name,
          details: `${breakfastOutlet.dresscode} Hot and cold buffet with à la carte options. Dietary requirements catered for on request.`,
        }
      : undefined,
    parking: {
      available: true,
      free: false,
      details: 'Valet parking at €35 per night. Please inform the concierge upon arrival.',
    },
    amenities,
    restaurants: [...diningRestaurants, ...localRestaurants],
    attractions,
    transport: {
      fromAirport: airportEntry?.description ?? 'City Airport Train (CAT) to Wien Mitte (16 min), then 5 min taxi. Taxi direct approx. €40, 25–35 min.',
      publicTransport: metroEntry?.description ?? 'U-Bahn Karlsplatz (400m): lines U1, U2, U4. Trams 1, 2, D on Ringstraße.',
      taxi: 'Taxi rank outside the hotel. App: Bolt or Uber. 24-hour availability.',
    },
    policies: {
      cancellation: hotel.policies.cancellation,
      houseRules: `${hotel.policies.pets} ${hotel.policies.smoking} Quiet hours from 22:00.`,
      payment: ['Visa', 'Mastercard', 'American Express', 'Cash (EUR)'],
      pets: hotel.policies.pets,
      smoking: hotel.policies.smoking,
    },
    faq: hotel.faqs,
    escalation: {
      email: hotel.contact.email,
      phone: hotel.contact.phone,
    },
  }
}
