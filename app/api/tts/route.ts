import { synthesizeSpeech, type VoiceGender } from '@/lib/elevenlabs'
import { createClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

export const maxDuration = 30

export async function POST(request: Request) {
  try {
    const { text, gender = 'female' } = await request.json() as { text: string; gender?: VoiceGender }

    if (!text) {
      return Response.json({ error: 'Missing text' }, { status: 400 })
    }

    // Length guard — prevent expensive abuse
    if (text.length > 500) {
      return Response.json({ error: 'Text too long (max 500 chars)' }, { status: 400 })
    }

    // Auth check — allow authenticated users and guests
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const isGuest = request.headers.get('cookie')?.includes('allo_guest=true')
    if (!user && !isGuest) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const cacheKey = createHash('sha256').update(`${gender}:${text.trim()}`).digest('hex')
    const storagePath = `tts/${cacheKey}.mp3`

    const { data: existing } = await supabase.storage
      .from('audio')
      .createSignedUrl(storagePath, 3600)

    if (existing?.signedUrl) {
      // Return cached signed URL
      return Response.json({ url: existing.signedUrl, cached: true })
    }

    // Generate new audio via ElevenLabs
    const audioBuffer = await synthesizeSpeech(text, gender)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('audio')
      .upload(storagePath, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: false,
      })

    if (uploadError) {
      // Fall back to streaming directly if upload fails
      return new Response(audioBuffer.buffer as ArrayBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBuffer.length.toString(),
        },
      })
    }

    // Get signed URL for newly uploaded file
    const { data: signed } = await supabase.storage
      .from('audio')
      .createSignedUrl(storagePath, 3600)

    return Response.json({ url: signed?.signedUrl, cached: false })
  } catch (error) {
    console.error('TTS error:', error)
    return Response.json({ error: 'TTS generation failed' }, { status: 500 })
  }
}
