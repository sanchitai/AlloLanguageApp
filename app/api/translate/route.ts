import { translateText } from '@/lib/claude'
import { createClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

export async function POST(request: Request) {
  try {
    const { text, fromLang, toLang } = await request.json()

    if (!text || !fromLang || !toLang) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check cache in Supabase first
    const supabase = await createClient()
    const cacheKey = createHash('sha256').update(`${fromLang}:${toLang}:${text.toLowerCase().trim()}`).digest('hex')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: cached } = await (supabase.from('translation_cache') as any)
      .select('translation, pronunciation')
      .eq('cache_key', cacheKey)
      .single()

    if (cached) {
      return Response.json(cached)
    }

    // Call Claude
    const result = await translateText(text, fromLang, toLang)

    // Store in cache (best-effort)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(supabase.from('translation_cache') as any).insert({
      cache_key: cacheKey,
      source_text: text,
      from_lang: fromLang,
      to_lang: toLang,
      translation: result.translation,
      pronunciation: result.pronunciation ?? null,
    }).then(() => {}).catch(() => {})

    return Response.json(result)
  } catch (error) {
    console.error('Translation error:', error)
    return Response.json({ error: 'Translation failed' }, { status: 500 })
  }
}
