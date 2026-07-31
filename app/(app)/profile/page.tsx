'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    async function load() {
      // Check for guest mode
      if (document.cookie.includes('allo_guest=true')) {
        router.push('/login')
        return
      }
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
    if (!error) {
      setProfile(p => p ? { ...p, ...updates } : p)
    }
    setSaving(false)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function previewVoice() {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance('Bonjour! Comment puis-je vous aider aujourd\'hui?')
    utt.lang = 'fr-CA'
    utt.rate = 0.82
    utt.pitch = 1.0
    window.speechSynthesis.speak(utt)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>Loading…</div>
    </div>
  )

  const firstName = profile?.display_name?.split(' ')[0] ?? 'there'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', padding: '14px 20px 16px', borderBottom: '1px solid var(--divider)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em' }}>Profile<span style={{ color: 'var(--maple)' }}>.</span></div>
          {saving && <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Saving…</span>}
        </div>
      </div>

      <div style={{ padding: '0 0 24px' }}>

        {/* Hero card */}
        <div style={{ background: 'var(--surface)', padding: '24px 20px 20px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--tile-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--sh-float)', flexShrink: 0 }}>
              <svg viewBox="0 0 52 52" fill="none" width="44" height="44">
                <circle cx="26" cy="16" r="9" fill="#3A7FC1" opacity="0.85"/>
                <path d="M8 48c0-9.94 8.06-18 18-18s18 8.06 18 18" fill="#3A7FC1" opacity="0.5"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em' }}>{profile?.display_name ?? 'User'}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>{profile?.native_language === 'en' ? 'English' : 'French'} speaker</div>
            </div>
          </div>
          {/* Stats */}
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

        {/* Voice Preference */}
        <Section label="Playback Voice">
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-card)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--divider)', display: 'flex', gap: 8 }}>
              {(['female', 'male', 'neutral'] as const).map(g => (
                <button key={g} onClick={() => { setVoiceGender(g); saveSettings({ voice_gender: g }) }} style={{ flex: 1, height: 42, borderRadius: 9999, border: `2px solid ${voiceGender === g ? 'var(--black)' : 'var(--divider)'}`, background: voiceGender === g ? 'var(--black)' : 'var(--surface-alt)', color: voiceGender === g ? '#fff' : 'var(--ink-2)', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  {g === 'female' ? '👩' : g === 'male' ? '👨' : '🎙️'} {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ padding: '12px 16px' }}>
              <button onClick={previewVoice} style={{ width: '100%', height: 40, borderRadius: 9999, background: 'var(--tile-blue)', color: 'var(--tile-blue-ink)', border: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <svg viewBox="0 0 14 14" fill="none" width="14" height="14"><polygon points="2,2 12,7 2,12" fill="currentColor"/></svg>
                Preview this voice
              </button>
            </div>
          </div>
        </Section>

        {/* Settings */}
        <Section label="Settings">
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-card)', overflow: 'hidden' }}>
            <SettingRow icon="🌙" label="Dark Mode" desc="Switch to dark theme" right={<Toggle on={darkMode} onToggle={() => setDarkMode(v => !v)} />} />
            <SettingRow icon="ℹ️" label="About Allo" desc="Version 1.0.0 · Made in Montréal" right={<Chevron />} />
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
