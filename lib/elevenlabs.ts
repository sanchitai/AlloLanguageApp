import { ElevenLabsClient } from 'elevenlabs'

const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY })

// Default app voices — multilingual, natural
export const APP_VOICES = {
  female: {
    id: 'XrExE9yKIg1WjnnlVkGX', // Matilda — warm, natural
    name: 'Matilda (Female)',
  },
  male: {
    id: 'ErXwobaYiN019PkySvjV', // Antoni — natural conversational
    name: 'Antoni (Male)',
  },
  neutral: {
    id: 'pNInz6obpgDQGcFmaJgB', // Adam — neutral
    name: 'Adam (Neutral)',
  },
} as const

export type VoiceGender = keyof typeof APP_VOICES

export async function synthesizeSpeech(
  text: string,
  gender: VoiceGender = 'female',
  clonedVoiceId?: string
): Promise<Buffer> {
  // Use cloned voice if provided, otherwise use app default
  const voiceId = clonedVoiceId ?? APP_VOICES[gender].id

  const audio = await elevenlabs.generate({
    voice: voiceId,
    text,
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: clonedVoiceId ? 0.65 : 0.50,
      similarity_boost: clonedVoiceId ? 0.90 : 0.85,
      style: 0.1,
      use_speaker_boost: true,
    },
  })

  const chunks: Buffer[] = []
  for await (const chunk of audio) {
    chunks.push(Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}
