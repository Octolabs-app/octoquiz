// ─── Capital Cities dataset ───────────────────────────────────────────────────
// wikiPage = exact Wikipedia page name used to fetch a thumbnail via the
// Wikipedia REST API. Choose pages that have a good representative city photo.

export interface Capital {
  city:     string
  country:  string
  wikiPage: string   // Wikipedia article title for image
  region:   'Europe' | 'Asia' | 'Americas' | 'Africa' | 'Oceania' | 'Middle East'
}

const CAPITALS: Capital[] = [
  // Europe
  { city: 'Paris',          country: 'France',          wikiPage: 'Paris',               region: 'Europe' },
  { city: 'London',         country: 'United Kingdom',  wikiPage: 'London',              region: 'Europe' },
  { city: 'Rome',           country: 'Italy',           wikiPage: 'Rome',                region: 'Europe' },
  { city: 'Berlin',         country: 'Germany',         wikiPage: 'Berlin',              region: 'Europe' },
  { city: 'Madrid',         country: 'Spain',           wikiPage: 'Madrid',              region: 'Europe' },
  { city: 'Amsterdam',      country: 'Netherlands',     wikiPage: 'Amsterdam',           region: 'Europe' },
  { city: 'Vienna',         country: 'Austria',         wikiPage: 'Vienna',              region: 'Europe' },
  { city: 'Prague',         country: 'Czech Republic',  wikiPage: 'Prague',              region: 'Europe' },
  { city: 'Budapest',       country: 'Hungary',         wikiPage: 'Budapest',            region: 'Europe' },
  { city: 'Athens',         country: 'Greece',          wikiPage: 'Athens',              region: 'Europe' },
  { city: 'Lisbon',         country: 'Portugal',        wikiPage: 'Lisbon',              region: 'Europe' },
  { city: 'Brussels',       country: 'Belgium',         wikiPage: 'Brussels',            region: 'Europe' },
  { city: 'Stockholm',      country: 'Sweden',          wikiPage: 'Stockholm',           region: 'Europe' },
  { city: 'Oslo',           country: 'Norway',          wikiPage: 'Oslo',                region: 'Europe' },
  { city: 'Copenhagen',     country: 'Denmark',         wikiPage: 'Copenhagen',          region: 'Europe' },
  { city: 'Helsinki',       country: 'Finland',         wikiPage: 'Helsinki',            region: 'Europe' },
  { city: 'Warsaw',         country: 'Poland',          wikiPage: 'Warsaw',              region: 'Europe' },
  { city: 'Bern',           country: 'Switzerland',     wikiPage: 'Bern',                region: 'Europe' },
  { city: 'Reykjavik',      country: 'Iceland',         wikiPage: 'Reykjavik',           region: 'Europe' },
  { city: 'Dublin',         country: 'Ireland',         wikiPage: 'Dublin',              region: 'Europe' },
  // Americas
  { city: 'Washington D.C.',country: 'United States',   wikiPage: 'Washington, D.C.',    region: 'Americas' },
  { city: 'Ottawa',         country: 'Canada',          wikiPage: 'Ottawa',              region: 'Americas' },
  { city: 'Brasília',       country: 'Brazil',          wikiPage: 'Brasília',            region: 'Americas' },
  { city: 'Buenos Aires',   country: 'Argentina',       wikiPage: 'Buenos Aires',        region: 'Americas' },
  { city: 'Lima',           country: 'Peru',            wikiPage: 'Lima',                region: 'Americas' },
  { city: 'Bogotá',         country: 'Colombia',        wikiPage: 'Bogotá',              region: 'Americas' },
  { city: 'Santiago',       country: 'Chile',           wikiPage: 'Santiago',            region: 'Americas' },
  { city: 'Mexico City',    country: 'Mexico',          wikiPage: 'Mexico City',         region: 'Americas' },
  { city: 'Havana',         country: 'Cuba',            wikiPage: 'Havana',              region: 'Americas' },
  // Asia
  { city: 'Tokyo',          country: 'Japan',           wikiPage: 'Tokyo',               region: 'Asia' },
  { city: 'Beijing',        country: 'China',           wikiPage: 'Beijing',             region: 'Asia' },
  { city: 'Seoul',          country: 'South Korea',     wikiPage: 'Seoul',               region: 'Asia' },
  { city: 'New Delhi',      country: 'India',           wikiPage: 'New Delhi',           region: 'Asia' },
  { city: 'Bangkok',        country: 'Thailand',        wikiPage: 'Bangkok',             region: 'Asia' },
  { city: 'Jakarta',        country: 'Indonesia',       wikiPage: 'Jakarta',             region: 'Asia' },
  { city: 'Kuala Lumpur',   country: 'Malaysia',        wikiPage: 'Kuala Lumpur',        region: 'Asia' },
  { city: 'Singapore',      country: 'Singapore',       wikiPage: 'Singapore',           region: 'Asia' },
  { city: 'Manila',         country: 'Philippines',     wikiPage: 'Manila',              region: 'Asia' },
  { city: 'Kathmandu',      country: 'Nepal',           wikiPage: 'Kathmandu',           region: 'Asia' },
  { city: 'Ulaanbaatar',    country: 'Mongolia',        wikiPage: 'Ulaanbaatar',         region: 'Asia' },
  { city: 'Hanoi',          country: 'Vietnam',         wikiPage: 'Hanoi',               region: 'Asia' },
  { city: 'Phnom Penh',     country: 'Cambodia',        wikiPage: 'Phnom Penh',          region: 'Asia' },
  { city: 'Colombo',        country: 'Sri Lanka',       wikiPage: 'Colombo',             region: 'Asia' },
  { city: 'Dhaka',          country: 'Bangladesh',      wikiPage: 'Dhaka',               region: 'Asia' },
  // Middle East
  { city: 'Tehran',         country: 'Iran',            wikiPage: 'Tehran',              region: 'Middle East' },
  { city: 'Baghdad',        country: 'Iraq',            wikiPage: 'Baghdad',             region: 'Middle East' },
  { city: 'Riyadh',         country: 'Saudi Arabia',    wikiPage: 'Riyadh',              region: 'Middle East' },
  { city: 'Tel Aviv',       country: 'Israel',          wikiPage: 'Tel Aviv',            region: 'Middle East' },
  { city: 'Amman',          country: 'Jordan',          wikiPage: 'Amman',               region: 'Middle East' },
  { city: 'Beirut',         country: 'Lebanon',         wikiPage: 'Beirut',              region: 'Middle East' },
  // Africa
  { city: 'Cairo',          country: 'Egypt',           wikiPage: 'Cairo',               region: 'Africa' },
  { city: 'Nairobi',        country: 'Kenya',           wikiPage: 'Nairobi',             region: 'Africa' },
  { city: 'Abuja',          country: 'Nigeria',         wikiPage: 'Abuja',               region: 'Africa' },
  { city: 'Addis Ababa',    country: 'Ethiopia',        wikiPage: 'Addis Ababa',         region: 'Africa' },
  { city: 'Cape Town',      country: 'South Africa',    wikiPage: 'Cape Town',           region: 'Africa' },
  { city: 'Accra',          country: 'Ghana',           wikiPage: 'Accra',               region: 'Africa' },
  { city: 'Rabat',          country: 'Morocco',         wikiPage: 'Rabat',               region: 'Africa' },
  // Oceania
  { city: 'Canberra',       country: 'Australia',       wikiPage: 'Canberra',            region: 'Oceania' },
  { city: 'Wellington',     country: 'New Zealand',     wikiPage: 'Wellington',          region: 'Oceania' },
]

export default CAPITALS

/** All unique country names for generating wrong-answer options */
export const ALL_CAPITAL_COUNTRIES = [...new Set(CAPITALS.map(c => c.country))]
