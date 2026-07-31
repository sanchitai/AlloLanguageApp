'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<'learn' | 'buddy'>('learn')
  const [goal, setGoal] = useState(10)
  const [voiceGender, setVoiceGender] = useState<'female' | 'male' | 'neutral'>('female')
  const [darkMode, setDarkMode] = useState(false)
  const [saving, setSaving] = useState(false)

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [voiceCloneId, setVoiceCloneId] = useState<string | null>(null)
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'recording' | 'uploading' | 'ready' | 'error'>('idle')
  const [voiceError, setVoiceError] = useState('')
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const [previewMode, setPreviewMode] = useState<'app' | 'clone'>('app')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    async function load() {
      if (document.cookie.includes('allo_guest=true')) { router.push('/login'); return }
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      const data = profileData as Profile | null
      if (data) {
        setProfile(data)
        setMode(data.app_mode ?? 'learn')
        setGoal(data.daily_goal ?? 10)
        setVoiceGender(data.voice_gender ?? 'female')
        const prefs = data.preferences as Record<string, unknown> | null
        if (prefs?.voice_clone_id) {
          setVoiceCloneId(prefs.voice_clone_id as string)
          setVoiceStatus('ready')
        }
      }
      setLoading(false)
    }
    load()
  }, [router])

  async function saveSettings(updates: Partial<Profile>) {
    if (!profile) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await (supabase.from('profiles') as ReturnType<typeof supabase.from>).update(updates as Record<string, unknown>).eq('id', profile.id)
    if (!error) setProfile(p => p ? { ...p, ...updates } : p)
    setSaving(false)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // ── Voice recording ────────────────────────────────────────────
  async function startRecording() {
    try {
      setVoiceError('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.start(250)
      mediaRecorderRef.current = recorder
      setIsRecording(true)
      setVoiceStatus('recording')
      setRecordingTime(0)
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000)
    } catch {
      setVoiceError('Microphone permission denied. Please allow microphone access.')
    }
  }

  async function stopRecording() {
    if (!mediaRecorderRef.current) return
    if (timerRef.current) clearInterval(timerRef.current)

    mediaRecorderRef.current.stop()
    mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop())
    setIsRecording(false)
    setVoiceStatus('uploading')

    // Wait for final chunk
    await new Promise<void>(resolve => {
      if (mediaRecorderRef.current) mediaRecorderRef.current.onstop = () => resolve()
      else resolve()
    })

    const blob = new Blob(chunksRef.current, { type: 'audio/webm' })

    if (blob.size < 50000) {
      setVoiceError('Recording too short. Please record at least 30 seconds for best results.')
      setVoiceStatus('idle')
      return
    }

    try {
      const formData = new FormData()
      formData.append('audio', blob, 'voice-sample.webm')

      const res = await fetch('/api/voice-clone', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok || data.error) {
        setVoiceError(data.error || 'Voice cloning failed. Please try again.')
        setVoiceStatus('idle')
        return
      }

      setVoiceCloneId(data.voice_id)
      setVoiceStatus('ready')
      setPreviewMode('clone')
    } catch {
      setVoiceError('Upload failed. Please check your connection and try again.')
      setVoiceStatus('idle')
    }
  }

  async function deleteVoiceClone() {
    setVoiceStatus('idle')
    setVoiceCloneId(null)
    await fetch('/api/voice-clone', { method: 'DELETE' })
  }

  async function previewVoice(useClone: boolean) {
    setIsPreviewPlaying(true)
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Bonjour! Comment puis-je vous aider aujourd\'hui?',
          gender: voiceGender,
          voiceId: useClone && voiceCloneId ? voiceCloneId : undefined,
        }),
      })
      const { url } = await res.json()
      if (url) {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = '' }
        const audio = new Audio(url)
        audioRef.current = audio
        audio.onended = () => setIsPreviewPlaying(false)
        audio.onerror = () => setIsPreviewPlaying(false)
        await audio.play()
      }
    } catch { setIsPreviewPlaying(false) }
  }

  const fmtTime = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>Loading…</div>
    </div>
  )

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', padding: '14px 20px 16px', borderBottom: '1px solid var(--divider)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em' }}>Profile<span style={{ color: 'var(--primary)' }}>.</span></div>
          {saving && <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Saving…</span>}
        </div>
      </div>

      <div style={{ padding: '0 0 24px' }}>

        {/* Hero card */}
        <div style={{ background: 'var(--surface)', padding: '24px 20px 20px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--tile-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--sh-float)', flexShrink: 0 }}>
              <svg viewBox="0 0 52 52" fill="none" width="44" height="44"><circle cx="26" cy="16" r="9" fill="#3A7FC1" opacity="0.85"/><path d="M8 48c0-9.94 8.06-18 18-18s18 8.06 18 18" fill="#3A7FC1" opacity="0.5"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em' }}>{profile?.display_name ?? 'User'}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>{profile?.native_language === 'en' ? 'English' : 'French'} speaker</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { label: 'Day Streak', value: `🔥 ${profile?.streak_days ?? 0}`, bg: 'var(--tile-yellow)', ink: 'var(--tile-yellow-ink)' },
              { label: 'XP Total', value: (profile?.xp_total ?? 0).toLocaleString(), bg: 'var(--tile-purple)', ink: 'var(--tile-purple-ink)' },
              { label: 'Daily Goal', value: `${profile?.daily_goal ?? 10}/day`, bg: 'var(--tile-green)', ink: 'var(--tile-green-ink)' },
            ].map(stat => (
              <div key={stat.label} style={{ background: stat.bg, borderRadius: 'var(--r-lg)', padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: stat.ink }}>{stat.value}</div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: stat.ink, marginTop: 3, opacity: 0.7 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* App Mode */}
        <Section label="App Mode">
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', padding: 16, boxShadow: 'var(--sh-card)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['learn', 'buddy'] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); saveSettings({ app_mode: m }) }} style={{ flex: 1, height: 40, borderRadius: 9999, border: `2px solid ${mode === m ? 'var(--black)' : 'var(--divider)'}`, background: mode === m ? 'var(--black)' : 'var(--surface-alt)', color: mode === m ? '#fff' : 'var(--ink-2)', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  {m === 'learn' ? '📚 Learn' : '🗣️ Buddy'}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
              {mode === 'learn' ? 'Flashcards, vocabulary & progress tracking' : 'Live translator & loud speaker mode'}
            </div>
          </div>
        </Section>

        {/* Daily Goal */}
        <Section label="Daily Learning Goal">
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', padding: '14px 16px', boxShadow: 'var(--sh-card)', display: 'flex', gap: 8 }}>
            {[5, 10, 20].map(n => (
              <button key={n} onClick={() => { setGoal(n); saveSettings({ daily_goal: n }) }} style={{ flex: 1, height: 44, borderRadius: 9999, border: `2px solid ${goal === n ? 'var(--black)' : 'var(--divider)'}`, background: goal === n ? 'var(--black)' : 'var(--surface-alt)', color: goal === n ? '#fff' : 'var(--ink-2)', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                {n === 5 ? '🌱' : n === 10 ? '🔥' : '⚡'} {n}/day
              </button>
            ))}
          </div>
        </Section>

        {/* ── APP DEFAULT VOICE ──────────────────────────────────────── */}
        <Section label="App Default Voice">
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-card)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px 12px' }}>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 600, marginBottom: 12, lineHeight: '18px' }}>
                Choose the voice used when playing translations in Buddy Mode and Flashcards.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {([
                  { id: 'female', label: '👩 Female', desc: 'Warm & natural' },
                  { id: 'male',   label: '👨 Male',   desc: 'Clear & confident' },
                ] as const).map(v => (
                  <div key={v.id} onClick={() => { setVoiceGender(v.id); saveSettings({ voice_gender: v.id }) }}
                    style={{ flex: 1, padding: '14px 12px', borderRadius: 'var(--r-lg)', border: `2.5px solid ${voiceGender === v.id ? 'var(--primary)' : 'var(--divider)'}`, background: voiceGender === v.id ? 'var(--primary-light)' : 'var(--surface-alt)', cursor: 'pointer', transition: 'all 160ms var(--spring)' }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{v.label.split(' ')[0]}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: voiceGender === v.id ? 'var(--primary-dark)' : 'var(--ink)' }}>{v.label.split(' ').slice(1).join(' ')}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2, fontWeight: 600 }}>{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '0 16px 14px' }}>
              <button onClick={() => previewVoice(false)} disabled={isPreviewPlaying}
                style={{ width: '100%', height: 42, borderRadius: 9999, background: 'var(--tile-blue)', color: 'var(--tile-blue-ink)', border: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: isPreviewPlaying ? 0.6 : 1 }}>
                <svg viewBox="0 0 14 14" fill="none" width="14" height="14"><polygon points="2,2 12,7 2,12" fill="currentColor"/></svg>
                {isPreviewPlaying ? 'Playing…' : `Preview ${voiceGender} voice`}
              </button>
            </div>
          </div>
        </Section>

        {/* ── MY VOICE CLONE ─────────────────────────────────────────── */}
        <Section label="My Voice Clone">
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-card)', overflow: 'hidden' }}>

            {/* Status banner */}
            <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--divider)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: voiceStatus === 'ready' ? 'var(--tile-green)' : 'var(--tile-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {voiceStatus === 'ready' ? '🎙️' : '🎤'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>
                    {voiceStatus === 'ready' ? 'Voice clone ready ✓' : voiceStatus === 'recording' ? `Recording… ${fmtTime(recordingTime)}` : voiceStatus === 'uploading' ? 'Creating your voice clone…' : 'Record your voice'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3, lineHeight: '17px', fontWeight: 600 }}>
                    {voiceStatus === 'ready'
                      ? 'Allo can now speak phrases in your voice. Toggle below to use it.'
                      : voiceStatus === 'recording'
                      ? 'Keep talking naturally — longer recordings sound better. Aim for 60s.'
                      : voiceStatus === 'uploading'
                      ? 'Sending to ElevenLabs AI voice cloning…'
                      : 'Record 30–90 seconds of natural speech. Allo will clone your voice using AI.'}
                  </div>
                </div>
              </div>

              {voiceError && (
                <div style={{ marginTop: 10, background: 'var(--tile-pink)', color: 'var(--tile-pink-ink)', padding: '10px 12px', borderRadius: 'var(--r-md)', fontSize: 12, fontWeight: 700, lineHeight: '17px' }}>
                  ⚠️ {voiceError}
                </div>
              )}

              {/* Recording waveform bars */}
              {voiceStatus === 'recording' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 40, marginTop: 12, padding: '0 4px' }}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} style={{ flex: 1, borderRadius: 2, background: 'var(--coral)', animation: `mw-pulse ${0.4 + (i % 5) * 0.08}s ease-in-out infinite alternate`, animationDelay: `${i * 30}ms` }} />
                  ))}
                  <style>{`@keyframes mw-pulse { from { height: 4px; } to { height: 32px; } }`}</style>
                </div>
              )}
            </div>

            {/* Controls */}
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {voiceStatus !== 'ready' ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={voiceStatus === 'uploading'}
                    style={{ flex: 1, height: 48, borderRadius: 9999, background: isRecording ? 'var(--black)' : 'var(--coral)', color: '#fff', border: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: voiceStatus === 'uploading' ? 0.6 : 1,
                      boxShadow: isRecording ? 'var(--sh-fab)' : '0 4px 16px rgba(244,63,94,0.35)' }}>
                    {voiceStatus === 'uploading'
                      ? '⏳ Processing…'
                      : isRecording
                      ? `⏹ Stop (${fmtTime(recordingTime)})`
                      : '🎙 Start recording'}
                  </button>
                </div>
              ) : (
                <>
                  {/* Playback mode toggle */}
                  <div style={{ background: 'var(--surface-alt)', borderRadius: 'var(--r-lg)', padding: 4, display: 'flex', gap: 4 }}>
                    {([
                      { id: 'app',   label: '🔊 App voice' },
                      { id: 'clone', label: '🎙 My voice' },
                    ] as const).map(opt => (
                      <button key={opt.id} onClick={() => setPreviewMode(opt.id)}
                        style={{ flex: 1, height: 38, borderRadius: 'var(--r-md)', border: 'none', background: previewMode === opt.id ? 'var(--surface)' : 'transparent', color: previewMode === opt.id ? 'var(--ink)' : 'var(--ink-3)', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: previewMode === opt.id ? 'var(--sh-card)' : 'none', transition: 'all 150ms ease' }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => previewVoice(previewMode === 'clone')} disabled={isPreviewPlaying}
                      style={{ flex: 1, height: 44, borderRadius: 9999, background: previewMode === 'clone' ? 'var(--coral)' : 'var(--tile-blue)', color: previewMode === 'clone' ? '#fff' : 'var(--tile-blue-ink)', border: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: isPreviewPlaying ? 0.6 : 1,
                        boxShadow: previewMode === 'clone' ? '0 4px 16px rgba(244,63,94,0.30)' : 'none' }}>
                      <svg viewBox="0 0 14 14" fill="none" width="14" height="14"><polygon points="2,2 12,7 2,12" fill="currentColor"/></svg>
                      {isPreviewPlaying ? 'Playing…' : `Preview ${previewMode === 'clone' ? 'my voice' : 'app voice'}`}
                    </button>
                    <button onClick={deleteVoiceClone}
                      style={{ width: 44, height: 44, borderRadius: 9999, background: 'var(--surface-alt)', border: '1.5px solid var(--divider)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg viewBox="0 0 16 16" fill="none" width="15" height="15"><path d="M3 4h10M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M6 7v5M10 7v5M4 4l.8 9a1 1 0 0 0 1 .9h4.4a1 1 0 0 0 1-.9L12 4" stroke="var(--coral)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>

                  <div style={{ background: 'var(--tile-yellow)', borderRadius: 'var(--r-md)', padding: '10px 12px', fontSize: 12, color: 'var(--tile-yellow-ink)', fontWeight: 600, lineHeight: '17px' }}>
                    💡 <strong>How to use:</strong> In Buddy Mode, tap the 🎙 icon to switch between app voice and your cloned voice when playing phrases.
                  </div>

                  <button onClick={startRecording} style={{ height: 36, borderRadius: 9999, background: 'transparent', border: '1.5px solid var(--divider)', color: 'var(--ink-3)', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    🔄 Re-record voice
                  </button>
                </>
              )}
            </div>
          </div>
        </Section>

        {/* Settings */}
        <Section label="Settings">
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-card)', overflow: 'hidden' }}>
            <SettingRow icon="🌙" label="Dark Mode" desc="Switch to dark theme" right={<Toggle on={darkMode} onToggle={() => setDarkMode(v => !v)} />} />
            <SettingRow icon="ℹ️" label="About Allo" desc="Version 1.0.0 · Learn for Your Moment" right={<Chevron />} />
          </div>
        </Section>

        {/* Account */}
        <Section label="Account">
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-card)', overflow: 'hidden' }}>
            <button onClick={handleSignOut} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--divider)', cursor: 'pointer', fontFamily: 'inherit' }}>
              <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>👋</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Sign out</span>
              <Chevron />
            </button>
            <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>🗑️</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--coral)' }}>Delete account</span>
              <Chevron />
            </button>
          </div>
        </Section>

      </div>
    </div>
  )
}


function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '0 14px', marginBottom: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10, padding: '12px 2px 0' }}>{label}</div>
      {children}
    </div>
  )
}

function SettingRow({ icon, label, desc, right }: { icon: string; label: string; desc: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderBottom: '1px solid var(--divider)' }}>
      <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 1 }}>{desc}</div>
      </div>
      {right}
    </div>
  )
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{ width: 44, height: 26, borderRadius: 13, background: on ? 'var(--black)' : 'var(--divider)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 200ms', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.20)', transition: 'left 200ms var(--spring)' }} />
    </button>
  )
}

function Chevron() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="14" height="14" style={{ flexShrink: 0 }}>
      <path d="M5 3l4 4-4 4" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
// force redeploy Fri Jul 31 00:31:49 EDT 2026
