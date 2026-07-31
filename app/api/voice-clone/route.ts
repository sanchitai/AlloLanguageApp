import { createClient } from '@/lib/supabase/server'
import { ElevenLabsClient } from 'elevenlabs'

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const audioBlob = formData.get('audio') as File | null

    if (!audioBlob) return Response.json({ error: 'No audio file' }, { status: 400 })

    // Upload the raw sample to Supabase Storage first
    const samplePath = `voice-samples/${user.id}/sample.webm`
    const arrayBuffer = await audioBlob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await supabase.storage.from('audio').upload(samplePath, buffer, {
      contentType: audioBlob.type || 'audio/webm',
      upsert: true,
    })

    // Submit to ElevenLabs Instant Voice Cloning
    const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY })

    const voiceFile = new Blob([buffer], { type: audioBlob.type || 'audio/webm' })

    const voice = await elevenlabs.voices.add({
      name: `allo_user_${user.id.slice(0, 8)}`,
      description: 'User voice clone for Allo language app',
      files: [new File([voiceFile], 'sample.webm', { type: audioBlob.type || 'audio/webm' })],
    })

    // Save voice ID to profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('profiles') as any).update({
      preferences: { voice_clone_id: voice.voice_id }
    }).eq('id', user.id)

    return Response.json({ voice_id: voice.voice_id, success: true })
  } catch (error) {
    console.error('Voice clone error:', error)
    return Response.json({ error: 'Voice cloning failed. Please try a longer recording.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    // Get current voice_clone_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from('profiles') as any)
      .select('preferences').eq('id', user.id).single()
    const prefs = data?.preferences as Record<string, unknown> | null
    const voiceId = prefs?.voice_clone_id as string | undefined

    if (voiceId) {
      const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY })
      await elevenlabs.voices.delete(voiceId).catch(() => {})
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('profiles') as any)
      .update({ preferences: {} }).eq('id', user.id)

    return Response.json({ success: true })
  } catch (error) {
    console.error('Voice delete error:', error)
    return Response.json({ error: 'Failed to delete voice' }, { status: 500 })
  }
}
