import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const QUEBEC_SYSTEM_PROMPT = `You are an expert language teacher for both Quebec French and German.

For FRENCH: Always use Quebec French (Québécois), NEVER European/France French. Use everyday spoken Quebec expressions, "tu" for informal, "vous" for formal. Include joual where natural. Pronunciation reflects Quebec accent.

For GERMAN: Use standard High German (Hochdeutsch) suitable for everyday situations. Use "du" for informal, "Sie" for formal. Include common idiomatic phrases.

Output ONLY what is asked — no preamble, no explanation unless part of the task.`

export async function translateText(
  text: string,
  fromLang: 'en' | 'fr' | 'de',
  toLang: 'en' | 'fr' | 'de'
): Promise<{ translation: string; pronunciation?: string }> {
  const langNames: Record<string, string> = { en: 'English', fr: 'Québécois French', de: 'German' }
  const direction = `${langNames[fromLang]} to ${langNames[toLang]}`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 512,
    system: QUEBEC_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Translate this from ${direction}. Return ONLY a JSON object with keys "translation" and optionally "pronunciation" (phonetic guide for the translated text).

Text to translate: "${text}"

JSON response only, no markdown:`,
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : '{}'
  try {
    const cleaned = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '')
    return JSON.parse(cleaned)
  } catch {
    return { translation: raw }
  }
}

export async function generateScenario(description: string, nativeLang: 'en' | 'fr' | 'de', targetLang = 'fr') {
  const langNames: Record<string, string> = { en: 'English', fr: 'Québécois French', de: 'German' }
  const targetName = langNames[targetLang] ?? 'Québécois French'
  const nativeName = langNames[nativeLang] ?? 'English'
  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    system: QUEBEC_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Generate a complete language learning scenario pack for this situation: "${description}"

The learner's native language is: ${nativeName}
Target language: ${targetName}

Return ONLY a JSON object (no markdown) with this exact structure:
{
  "title": "scenario title",
  "summary": "1-sentence description",
  "vocabulary": [
    {
      "target_word": "French word",
      "native_meaning": "English meaning",
      "pronunciation_guide": "phonetic guide in Quebec pronunciation",
      "example_sentence": "example in French",
      "example_translation": "English translation",
      "difficulty": "basic|intermediate|advanced"
    }
  ],
  "phrases": [
    {
      "category": "essential|question|response|polite",
      "target_phrase": "French phrase",
      "native_meaning": "English meaning",
      "pronunciation_guide": "phonetic guide",
      "context_note": "when/how to use this"
    }
  ],
  "emergency_phrases": [
    {
      "target_phrase": "French phrase",
      "native_meaning": "English meaning",
      "urgency": "high|medium"
    }
  ],
  "cultural_tips": ["tip 1", "tip 2", "tip 3"],
  "conversation_starters": ["starter 1", "starter 2"]
}

Generate 8-12 vocabulary items, 10-15 phrases, 4-6 emergency phrases, 3-4 cultural tips.
All French content must be authentic Québécois, not European French.`,
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : '{}'
  const cleaned = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '')
  return JSON.parse(cleaned)
}
