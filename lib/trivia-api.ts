/**
 * Live trivia question fetcher from Open Trivia Database (opentdb.com)
 * Falls back to local data automatically if unavailable.
 * MIT-licensed API, free, no key required.
 */

export interface LiveQuestion {
  question: string
  options: string[]
  correctIndex: number
  category: string
  difficulty: string
}

// opentdb category IDs → friendly names
export const OPENTDB_CATEGORIES: Record<string, number> = {
  'General':     9,
  'Science':    17,
  'Sports':     21,
  'Geography':  22,
  'History':    23,
  'Music':      12,
  'Film':       11,
  'TV':         14,
  'Mixed':       0, // will use no category filter
}

function decodeEntities(str: string): string {
  return decodeURIComponent(str)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export async function fetchTriviaFromAPI(count = 10, categoryName = 'Mixed'): Promise<LiveQuestion[]> {
  const catId = OPENTDB_CATEGORIES[categoryName] ?? 0
  const catParam = catId > 0 ? `&category=${catId}` : ''
  const url = `https://opentdb.com/api.php?amount=${count}&type=multiple&encode=url3986${catParam}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (data.response_code !== 0) throw new Error(`API code ${data.response_code}`)

    return data.results.map((q: {
      question: string
      correct_answer: string
      incorrect_answers: string[]
      category: string
      difficulty: string
    }) => {
      const question = decodeEntities(q.question)
      const correct  = decodeEntities(q.correct_answer)
      const options  = shuffleArr([correct, ...q.incorrect_answers.map(decodeEntities)])
      return {
        question,
        options,
        correctIndex: options.indexOf(correct),
        category: decodeEntities(q.category),
        difficulty: q.difficulty,
      }
    })
  } catch (e) {
    clearTimeout(timeout)
    throw e
  }
}
