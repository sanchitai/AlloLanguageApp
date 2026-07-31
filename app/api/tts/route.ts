import { synthesizeSpeech, type VoiceGender } from '@/lib/elevenlabs'
import { createClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

export const maxDuration = 30

export async function POST(request: Request) {
  try {
    const { text, gender = 'female', voiceId } = await request.json() as { text: string; gender?: VoiceGender; voiceId?: string }

    if (!text) {
      return Response.json({ error: 'Missing text' }, { status: 400 })
    }

    if (text.length > 500) {
      return Response.json({ error: 'Text too long (max 500 chars)' }, { status: 400 })
    }

    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const isGuest = request.headers.get('cookie')?.includes('allo_guest=true')
    if (!user && !isGuest) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Try cache first
    const cacheKey = createHash('sha256').update(`${gender}:${text.trim()}`).digest('hex')
    const storagePath = `tts/${cacheKey}.mp3`

    try {
      const { data: existing } = await supabase.storage
        .from('audio')
        .createSignedUrl(storagePath, 3600)

      if (existing?.signedUrl) {
        return Response.json({ url: existing.signedUrl, cached: true })
      }
    } catch {
      // Cache miss — continue to generate
    }

    // Generate via ElevenLabs — pass cloned voiceId if provided
    const audioBuffer = await synthesizeSpeech(text, gender, voiceId)

    // Try to cache in Supabase Storage (best-effort)
    try {
      const { error: uploadError } = await supabase.storage
        .from('audio')
        .upload(storagePath, audioBuffer, { contentType: 'audio/mpeg', upsert: false })

      if (!uploadError) {
        const { data: signed } = await supabase.storage
          .from('audio')
          .createSignedUrl(storagePath, 3600)

        if (signed?.signedUrl) {
          return Response.json({ url: signed.signedUrl, cached: false })
        }
      }
    } catch {
      // Storage failed — stream directly
    }

    // Always fall back to streaming the audio directly as base64 data URL
    // so playback works even if Supabase Storage isn't configured
    const base64 = audioBuffer.toString('base64')
    const dataUrl = `data:audio/mpeg;base64,${base64}`
    return Response.json({ url: dataUrl, cached: false })

  } catch (error) {
    console.error('TTS error:', error)
    return Response.json({ error: 'TTS generation failed' }, { status: 500 })
  }
}
