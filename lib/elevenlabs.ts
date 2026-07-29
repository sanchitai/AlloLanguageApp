import { ElevenLabsClient } from 'elevenlabs'

const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY })

// Best available French voices on ElevenLabs
export const FRENCH_VOICES = {
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

export type VoiceGender = keyof typeof FRENCH_VOICES

export async function synthesizeSpeech(
  text: string,
  gender: VoiceGender = 'female'
): Promise<Buffer> {
  const voice = FRENCH_VOICES[gender]

  const audio = await elevenlabs.generate({
    voice: voice.id,
    text,
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.85,
      style: 0.1,
      use_speaker_boost: true,
    },
  })

  // Convert stream to buffer
  const chunks: Buffer[] = []
  for await (const chunk of audio) {
    chunks.push(Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}
