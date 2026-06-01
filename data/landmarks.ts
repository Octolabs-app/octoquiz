// ─── World Landmarks dataset ──────────────────────────────────────────────────

export type LandmarkQuestionType = 'name' | 'country'

export interface Landmark {
  name:         string
  country:      string
  city:         string
  wikiPage:     string             // Wikipedia article for image
  questionType: LandmarkQuestionType  // 'name' = guess the landmark, 'country' = guess the country
}

const LANDMARKS: Landmark[] = [
  // name questions (iconic landmarks easy to recognise)
  { name: 'Eiffel Tower',          country: 'France',          city: 'Paris',         wikiPage: 'Eiffel Tower',            questionType: 'name' },
  { name: 'Big Ben',               country: 'United Kingdom',  city: 'London',        wikiPage: 'Elizabeth Tower',         questionType: 'name' },
  { name: 'Colosseum',             country: 'Italy',           city: 'Rome',          wikiPage: 'Colosseum',               questionType: 'name' },
  { name: 'Sagrada Família',       country: 'Spain',           city: 'Barcelona',     wikiPage: 'Sagrada Família',         questionType: 'name' },
  { name: 'Taj Mahal',             country: 'India',           city: 'Agra',          wikiPage: 'Taj Mahal',               questionType: 'name' },
  { name: 'Burj Khalifa',          country: 'UAE',             city: 'Dubai',         wikiPage: 'Burj Khalifa',            questionType: 'name' },
  { name: 'Sydney Opera House',    country: 'Australia',       city: 'Sydney',        wikiPage: 'Sydney Opera House',      questionType: 'name' },
  { name: 'Acropolis of Athens',   country: 'Greece',          city: 'Athens',        wikiPage: 'Acropolis of Athens',     questionType: 'name' },
  { name: 'Machu Picchu',          country: 'Peru',            city: 'Cusco Region',  wikiPage: 'Machu Picchu',            questionType: 'name' },
  { name: 'Chichen Itza',          country: 'Mexico',          city: 'Yucatán',       wikiPage: 'Chichen Itza',            questionType: 'name' },
  { name: 'Angkor Wat',            country: 'Cambodia',        city: 'Siem Reap',     wikiPage: 'Angkor Wat',              questionType: 'name' },
  { name: 'Hagia Sophia',          country: 'Turkey',          city: 'Istanbul',      wikiPage: 'Hagia Sophia',            questionType: 'name' },
  { name: 'Stonehenge',            country: 'United Kingdom',  city: 'Wiltshire',     wikiPage: 'Stonehenge',              questionType: 'name' },
  { name: 'Christ the Redeemer',   country: 'Brazil',          city: 'Rio de Janeiro',wikiPage: 'Christ the Redeemer',     questionType: 'name' },
  { name: 'Petronas Towers',       country: 'Malaysia',        city: 'Kuala Lumpur',  wikiPage: 'Petronas Towers',         questionType: 'name' },
  { name: 'Golden Gate Bridge',    country: 'United States',   city: 'San Francisco', wikiPage: 'Golden Gate Bridge',      questionType: 'name' },
  { name: 'Leaning Tower of Pisa', country: 'Italy',           city: 'Pisa',          wikiPage: 'Leaning Tower of Pisa',   questionType: 'name' },
  { name: 'Mount Rushmore',        country: 'United States',   city: 'South Dakota',  wikiPage: 'Mount Rushmore',          questionType: 'name' },
  { name: 'Parthenon',             country: 'Greece',          city: 'Athens',        wikiPage: 'Parthenon',               questionType: 'name' },
  { name: 'The Great Wall',        country: 'China',           city: 'Beijing',       wikiPage: 'Great Wall of China',     questionType: 'name' },
  { name: 'Neuschwanstein Castle', country: 'Germany',         city: 'Bavaria',       wikiPage: 'Neuschwanstein Castle',   questionType: 'name' },
  { name: 'Tower Bridge',          country: 'United Kingdom',  city: 'London',        wikiPage: 'Tower Bridge',            questionType: 'name' },
  { name: 'Alhambra',              country: 'Spain',           city: 'Granada',       wikiPage: 'Alhambra',                questionType: 'name' },
  { name: 'Forbidden City',        country: 'China',           city: 'Beijing',       wikiPage: 'Forbidden City',          questionType: 'name' },
  { name: 'Arc de Triomphe',       country: 'France',          city: 'Paris',         wikiPage: 'Arc de Triomphe',         questionType: 'name' },
  // country questions (harder — player sees landmark and guesses country)
  { name: 'Trevi Fountain',        country: 'Italy',           city: 'Rome',          wikiPage: 'Trevi Fountain',          questionType: 'country' },
  { name: 'Petra',                 country: 'Jordan',          city: 'Petra',         wikiPage: 'Petra, Jordan',           questionType: 'country' },
  { name: 'Borobudur',             country: 'Indonesia',       city: 'Java',          wikiPage: 'Borobudur',               questionType: 'country' },
  { name: 'Easter Island Moai',    country: 'Chile',           city: 'Easter Island', wikiPage: 'Easter Island',           questionType: 'country' },
  { name: 'Cappadocia',            country: 'Turkey',          city: 'Cappadocia',    wikiPage: 'Cappadocia',              questionType: 'country' },
  { name: 'Meteora Monasteries',   country: 'Greece',          city: 'Thessaly',      wikiPage: 'Meteora',                 questionType: 'country' },
  { name: 'Santorini',             country: 'Greece',          city: 'Aegean',        wikiPage: 'Santorini',               questionType: 'country' },
  { name: 'Hallstatt',             country: 'Austria',         city: 'Hallstatt',     wikiPage: 'Hallstatt',               questionType: 'country' },
  { name: 'Banff National Park',   country: 'Canada',          city: 'Alberta',       wikiPage: 'Banff National Park',     questionType: 'country' },
  { name: 'Halong Bay',            country: 'Vietnam',         city: 'Quảng Ninh',    wikiPage: 'Ha Long Bay',             questionType: 'country' },
  { name: 'Pamukkale',             country: 'Turkey',          city: 'Denizli',       wikiPage: 'Pamukkale',               questionType: 'country' },
  { name: 'Zhangjiajie',           country: 'China',           city: 'Hunan',         wikiPage: 'Zhangjiajie',             questionType: 'country' },
  { name: 'Cinque Terre',          country: 'Italy',           city: 'Liguria',       wikiPage: 'Cinque Terre',            questionType: 'country' },
  { name: 'Plitvice Lakes',        country: 'Croatia',         city: 'Lika',          wikiPage: 'Plitvice Lakes National Park', questionType: 'country' },
  { name: 'Antelope Canyon',       country: 'United States',   city: 'Arizona',       wikiPage: 'Antelope Canyon',         questionType: 'country' },
  { name: 'Fiordland',             country: 'New Zealand',     city: 'South Island',  wikiPage: 'Milford Sound',           questionType: 'country' },
  { name: 'Red Square',            country: 'Russia',          city: 'Moscow',        wikiPage: 'Red Square',              questionType: 'country' },
  { name: 'Mount Fuji',            country: 'Japan',           city: 'Honshu',        wikiPage: 'Mount Fuji',              questionType: 'country' },
  { name: 'Uluru',                 country: 'Australia',       city: 'Northern Territory', wikiPage: 'Uluru',               questionType: 'country' },
  { name: 'Aurora Borealis',       country: 'Iceland',         city: 'Reykjavik',     wikiPage: 'Aurora borealis',         questionType: 'country' },
]

export default LANDMARKS

export const ALL_LANDMARK_COUNTRIES = [...new Set(LANDMARKS.map(l => l.country))]
export const ALL_LANDMARK_NAMES     = LANDMARKS.map(l => l.name)
