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

  // ── Expanded pool ──────────────────────────────────────────────────────────
  // name questions
  { name: 'Statue of Liberty',     country: 'United States',   city: 'New York',      wikiPage: 'Statue of Liberty',       questionType: 'name' },
  { name: 'Empire State Building', country: 'United States',   city: 'New York',      wikiPage: 'Empire State Building',    questionType: 'name' },
  { name: 'Space Needle',          country: 'United States',   city: 'Seattle',       wikiPage: 'Space Needle',            questionType: 'name' },
  { name: 'Hollywood Sign',        country: 'United States',   city: 'Los Angeles',   wikiPage: 'Hollywood Sign',          questionType: 'name' },
  { name: 'Gateway Arch',          country: 'United States',   city: 'St. Louis',     wikiPage: 'Gateway Arch',            questionType: 'name' },
  { name: 'Willis Tower',          country: 'United States',   city: 'Chicago',       wikiPage: 'Willis Tower',            questionType: 'name' },
  { name: 'CN Tower',              country: 'Canada',          city: 'Toronto',       wikiPage: 'CN Tower',                questionType: 'name' },
  { name: 'Brandenburg Gate',      country: 'Germany',         city: 'Berlin',        wikiPage: 'Brandenburg Gate',        questionType: 'name' },
  { name: 'Cologne Cathedral',     country: 'Germany',         city: 'Cologne',       wikiPage: 'Cologne Cathedral',       questionType: 'name' },
  { name: 'Tower of London',       country: 'United Kingdom',  city: 'London',        wikiPage: 'Tower of London',         questionType: 'name' },
  { name: 'Buckingham Palace',     country: 'United Kingdom',  city: 'London',        wikiPage: 'Buckingham Palace',       questionType: 'name' },
  { name: 'Edinburgh Castle',      country: 'United Kingdom',  city: 'Edinburgh',     wikiPage: 'Edinburgh Castle',        questionType: 'name' },
  { name: 'Notre-Dame de Paris',   country: 'France',          city: 'Paris',         wikiPage: 'Notre-Dame de Paris',     questionType: 'name' },
  { name: 'Louvre',                country: 'France',          city: 'Paris',         wikiPage: 'Louvre',                  questionType: 'name' },
  { name: 'Mont-Saint-Michel',     country: 'France',          city: 'Normandy',      wikiPage: 'Mont-Saint-Michel',       questionType: 'name' },
  { name: "Saint Basil's Cathedral", country: 'Russia',        city: 'Moscow',        wikiPage: "Saint Basil's Cathedral", questionType: 'name' },
  { name: 'Moscow Kremlin',        country: 'Russia',          city: 'Moscow',        wikiPage: 'Moscow Kremlin',          questionType: 'name' },
  { name: 'Pyramids of Giza',      country: 'Egypt',           city: 'Giza',          wikiPage: 'Giza pyramid complex',    questionType: 'name' },
  { name: 'Great Sphinx',          country: 'Egypt',           city: 'Giza',          wikiPage: 'Great Sphinx of Giza',    questionType: 'name' },
  { name: 'Tokyo Tower',           country: 'Japan',           city: 'Tokyo',         wikiPage: 'Tokyo Tower',             questionType: 'name' },
  { name: 'Himeji Castle',         country: 'Japan',           city: 'Himeji',        wikiPage: 'Himeji Castle',           questionType: 'name' },
  { name: 'Marina Bay Sands',      country: 'Singapore',       city: 'Singapore',     wikiPage: 'Marina Bay Sands',        questionType: 'name' },
  { name: 'Gateway of India',      country: 'India',           city: 'Mumbai',        wikiPage: 'Gateway of India',        questionType: 'name' },
  { name: 'Golden Temple',         country: 'India',           city: 'Amritsar',      wikiPage: 'Golden Temple',           questionType: 'name' },
  { name: 'Atomium',               country: 'Belgium',         city: 'Brussels',      wikiPage: 'Atomium',                 questionType: 'name' },
  { name: 'Rialto Bridge',         country: 'Italy',           city: 'Venice',        wikiPage: 'Rialto Bridge',           questionType: 'name' },
  { name: 'Milan Cathedral',       country: 'Italy',           city: 'Milan',         wikiPage: 'Milan Cathedral',         questionType: 'name' },
  { name: 'Charles Bridge',        country: 'Czech Republic',  city: 'Prague',        wikiPage: 'Charles Bridge',          questionType: 'name' },
  { name: 'Matterhorn',            country: 'Switzerland',     city: 'Zermatt',       wikiPage: 'Matterhorn',              questionType: 'name' },

  // country questions
  { name: 'Wat Arun',              country: 'Thailand',        city: 'Bangkok',       wikiPage: 'Wat Arun',               questionType: 'country' },
  { name: 'Grand Palace',          country: 'Thailand',        city: 'Bangkok',       wikiPage: 'Grand Palace',           questionType: 'country' },
  { name: 'Shwedagon Pagoda',      country: 'Myanmar',         city: 'Yangon',        wikiPage: 'Shwedagon Pagoda',       questionType: 'country' },
  { name: 'Great Buddha of Kamakura', country: 'Japan',        city: 'Kamakura',      wikiPage: 'Kōtoku-in',              questionType: 'country' },
  { name: 'Burj Al Arab',          country: 'UAE',             city: 'Dubai',         wikiPage: 'Burj Al Arab',           questionType: 'country' },
  { name: 'Sheikh Zayed Mosque',   country: 'UAE',             city: 'Abu Dhabi',     wikiPage: 'Sheikh Zayed Grand Mosque', questionType: 'country' },
  { name: 'Blue Mosque',           country: 'Turkey',          city: 'Istanbul',      wikiPage: 'Sultan Ahmed Mosque',    questionType: 'country' },
  { name: 'Park Güell',            country: 'Spain',           city: 'Barcelona',     wikiPage: 'Park Güell',             questionType: 'country' },
  { name: 'Cliffs of Moher',       country: 'Ireland',         city: 'County Clare',  wikiPage: 'Cliffs of Moher',        questionType: 'country' },
  { name: 'Geirangerfjord',        country: 'Norway',          city: 'Geiranger',     wikiPage: 'Geirangerfjord',         questionType: 'country' },
  { name: 'Victoria Falls',        country: 'Zambia',          city: 'Livingstone',   wikiPage: 'Victoria Falls',         questionType: 'country' },
  { name: 'Table Mountain',        country: 'South Africa',    city: 'Cape Town',     wikiPage: 'Table Mountain',         questionType: 'country' },
  { name: 'Grand Canyon',          country: 'United States',   city: 'Arizona',       wikiPage: 'Grand Canyon',           questionType: 'country' },
  { name: 'Yellowstone',           country: 'United States',   city: 'Wyoming',       wikiPage: 'Yellowstone National Park', questionType: 'country' },
  { name: 'Niagara Falls',         country: 'Canada',          city: 'Ontario',       wikiPage: 'Niagara Falls',          questionType: 'country' },
  { name: 'Sugarloaf Mountain',    country: 'Brazil',          city: 'Rio de Janeiro',wikiPage: 'Sugarloaf Mountain',     questionType: 'country' },
  { name: 'Iguazú Falls',          country: 'Argentina',       city: 'Misiones',      wikiPage: 'Iguazú Falls',           questionType: 'country' },
  { name: 'Perito Moreno Glacier', country: 'Argentina',       city: 'Santa Cruz',    wikiPage: 'Perito Moreno Glacier',  questionType: 'country' },
  { name: 'Salar de Uyuni',        country: 'Bolivia',         city: 'Potosí',        wikiPage: 'Salar de Uyuni',         questionType: 'country' },
  { name: 'Mount Kilimanjaro',     country: 'Tanzania',        city: 'Kilimanjaro',   wikiPage: 'Mount Kilimanjaro',      questionType: 'country' },
  { name: 'Prague Castle',         country: 'Czech Republic',  city: 'Prague',        wikiPage: 'Prague Castle',          questionType: 'country' },
  { name: 'Bran Castle',           country: 'Romania',         city: 'Transylvania',  wikiPage: 'Bran Castle',            questionType: 'country' },
]

export default LANDMARKS

export const ALL_LANDMARK_COUNTRIES = [...new Set(LANDMARKS.map(l => l.country))]
export const ALL_LANDMARK_NAMES     = LANDMARKS.map(l => l.name)
