'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const AVATARS = [
  { id: '1', bg: '#DCEEFB', svg: <svg viewBox="0 0 52 52" fill="none" width="36" height="36"><circle cx="26" cy="16" r="9" fill="#3A7FC1" opacity="0.85"/><path d="M8 48c0-9.94 8.06-18 18-18s18 8.06 18 18" fill="#3A7FC1" opacity="0.5"/></svg> },
  { id: '2', bg: '#FEF7D0', svg: <svg viewBox="0 0 52 52" fill="none" width="36" height="36"><path d="M26 6l4.5 12L42 19l-9 9.5 2.5 12L26 35l-9.5 5.5 2.5-12L10 19l11.5-1z" fill="#F59E0B" opacity="0.85"/></svg> },
  { id: '3', bg: '#D8F5E8', svg: <svg viewBox="0 0 52 52" fill="none" width="36" height="36"><rect x="6" y="10" width="40" height="28" rx="9" fill="#2A8A55" opacity="0.75"/><rect x="14" y="20" width="14" height="4" rx="2" fill="white" opacity="0.8"/><rect x="14" y="28" width="24" height="4" rx="2" fill="white" opacity="0.5"/></svg> },
  { id: '4', bg: '#D0F4F4', svg: <svg viewBox="0 0 52 52" fill="none" width="36" height="36"><path d="M4 44 L20 14 L28 28 L34 18 L48 44Z" fill="#1A7A7A" opacity="0.75"/><circle cx="42" cy="12" r="6" fill="#F59E0B" opacity="0.8"/></svg> },
  { id: '5', bg: '#EDE8FB', svg: <svg viewBox="0 0 52 52" fill="none" width="36" height="36"><path d="M20 40V18l24-6v22" stroke="#5B3DAA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="16" cy="40" r="6" fill="#5B3DAA" opacity="0.8"/><circle cx="40" cy="34" r="6" fill="#5B3DAA" opacity="0.5"/></svg> },
  { id: '6', bg: '#FDE8EF', svg: <svg viewBox="0 0 52 52" fill="none" width="36" height="36"><path d="M26 5 L47 17 L26 47 L5 17Z" fill="#C03A65" opacity="0.75"/><path d="M5 17 L47 17" stroke="white" strokeWidth="2" opacity="0.5"/></svg> },
  { id: '7', bg: '#FEEBD0', svg: <svg viewBox="0 0 52 52" fill="none" width="36" height="36"><path d="M10 44 C10 26 26 8 44 8 C44 26 28 44 10 44Z" fill="#2A8A55" opacity="0.75"/><path d="M10 44 L27 27" stroke="#2A8A55" strokeWidth="2.5" strokeLinecap="round"/></svg> },
  { id: '8', bg: '#DCEEFB', svg: <svg viewBox="0 0 52 52" fill="none" width="36" height="36"><circle cx="26" cy="26" r="19" stroke="#3A7FC1" strokeWidth="2.5" opacity="0.75"/><ellipse cx="26" cy="26" rx="9" ry="19" stroke="#3A7FC1" strokeWidth="2" opacity="0.5"/><line x1="7" y1="26" x2="45" y2="26" stroke="#3A7FC1" strokeWidth="2" opacity="0.4"/></svg> },
]

export default function OnboardingProfilePage() {
  const router = useRouter()
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [name, setName] = useState('')
  const [goal, setGoal] = useState<5 | 10 | 20>(5)
  const [isRecording, setIsRecording] = useState(false)
  const [voiceSaved, setVoiceSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  function toggleRecord() {
    if (!isRecording) {
      setIsRecording(true)
      setTimeout(() => { setIsRecording(false); setVoiceSaved(true) }, 5000)
    } else {
      setIsRecording(false)
    }
  }

  async function handleLaunch() {
    if (!name.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const mode = localStorage.getItem('allo_mode') ?? 'learn'
      const nativeLang = localStorage.getItem('allo_know') ?? 'en'
      const targetLang = localStorage.getItem('allo_learn') ?? 'fr'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('profiles') as any).upsert({
        id: user.id,
        display_name: name.trim(),
        app_mode: mode as 'learn' | 'buddy',
        native_language: nativeLang,
        target_languages: [targetLang],
        dialect: 'quebec',
        daily_goal: goal,
        onboarding_done: true,
        voice_gender: 'female',
      })
    }

    setSaving(false)
    router.push('/')
    router.refresh()
  }

  const canLaunch = name.trim().length >= 1

  return (
    <div className="shell">
      <div style={{ background: 'var(--surface)', padding: '14px 20px 0', fontSize: 15, fontWeight: 600 }}>9:41</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 0' }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-alt)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 18 18" fill="none" width="18" height="18"><path d="M11 4L6 9l5 5" stroke="var(--ink-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{ display: 'flex', gap: 5 }}>
          {[0,1,2,3].map(i => <div key={i} style={{ height: 5, borderRadius: 9999, background: 'var(--black)', opacity: i < 3 ? 0.35 : 1, width: i === 3 ? 24 : 5 }} />)}
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>Step 4 of 4 — Almost there</div>
        <h1 style={{ fontSize: 40, fontWeight: 900, lineHeight: '44px', letterSpacing: '-0.025em' }}>Make it yours<span style={{ color: 'var(--maple)' }}>.</span></h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 20px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Avatar */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>Your avatar</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: avatar.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--sh-float)' }}>
              {avatar.svg}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, width: '100%' }}>
              {AVATARS.map(av => (
                <div key={av.id} onClick={() => setAvatar(av)} style={{ aspectRatio: '1', borderRadius: 'var(--r-lg)', background: av.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `2.5px solid ${avatar.id === av.id ? 'var(--black)' : 'transparent'}`, boxShadow: avatar.id === av.id ? 'var(--sh-float)' : 'none', transition: 'all 150ms var(--spring)' }}>
                  {av.svg}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>Your name</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="What should we call you?" maxLength={32} autoComplete="given-name" style={{ width: '100%', height: 54, background: 'var(--surface-alt)', border: `2px solid ${name ? 'var(--black)' : 'transparent'}`, borderRadius: 'var(--r-lg)', padding: '0 16px', fontSize: 18, fontWeight: 700, fontFamily: 'inherit', color: 'var(--ink)', outline: 'none' }} onFocus={e => { if (!name) e.target.style.borderColor = 'var(--divider)' }} onBlur={e => { if (!name) e.target.style.borderColor = 'transparent' }} />
        </div>

        {/* Voice */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>Your voice profile</div>
          <div style={{ background: voiceSaved ? 'var(--tile-green)' : 'var(--surface-alt)', borderRadius: 'var(--r-xl)', padding: 20, border: `2px solid ${voiceSaved ? 'var(--success)' : 'var(--divider)'}`, transition: 'all 200ms ease' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>Record your voice</div>
            <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 16, lineHeight: '20px' }}>Allo uses your voice to speak phrases back — so you sound like you, in the other language.</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={toggleRecord} style={{ flex: 1, height: 48, borderRadius: 9999, background: isRecording ? 'var(--black)' : voiceSaved ? 'var(--success)' : 'var(--coral)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: isRecording ? 'var(--sh-fab)' : voiceSaved ? 'var(--sh-green)' : 'var(--sh-coral)' }}>
                {voiceSaved ? '✓ Voice saved' : isRecording ? '⏹ Stop recording' : '🎙 Record voice sample'}
              </button>
            </div>
            {!voiceSaved && <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: 'var(--ink-3)' }}><a onClick={() => {}} style={{ color: 'var(--ink-2)', fontWeight: 600, cursor: 'pointer' }}>Skip for now — set up later in Profile</a></div>}
          </div>
        </div>

        {/* Daily goal */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>Daily learning goal</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {([
              { v: 5 as const, icon: '🌱', label: 'Light — 5 cards/day', desc: '~3 minutes. Build the habit first.', accent: 'var(--success)', badge: 'Recommended' },
              { v: 10 as const, icon: '🔥', label: 'Regular — 10 cards/day', desc: '~6 minutes. Steady, real progress.', accent: 'var(--maple)', badge: 'Popular' },
              { v: 20 as const, icon: '⚡', label: 'Intensive — 20 cards/day', desc: '~12 minutes. When you need it fast.', accent: 'var(--coral)', badge: 'Fastest' },
            ]).map(opt => (
              <div key={opt.v} onClick={() => setGoal(opt.v)} style={{ display: 'flex', alignItems: 'center', gap: 14, background: goal === opt.v ? 'var(--surface)' : 'var(--surface-alt)', border: `2px solid ${goal === opt.v ? 'var(--black)' : 'transparent'}`, borderRadius: 'var(--r-lg)', padding: '14px 16px', cursor: 'pointer', boxShadow: goal === opt.v ? 'var(--sh-float)' : 'none', transition: 'all 180ms ease', position: 'relative', overflow: 'hidden' }}>
                {goal === opt.v && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, borderRadius: '2px 0 0 2px', background: opt.accent }} />}
                <div style={{ width: 44, height: 44, borderRadius: 'var(--r-sm)', background: goal === opt.v ? 'var(--surface-alt)' : 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{opt.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{opt.desc}</div>
                </div>
                {goal === opt.v && <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 9999, background: 'var(--tile-green)', color: 'var(--tile-green-ink)', flexShrink: 0 }}>{opt.badge}</span>}
              </div>
            ))}
          </div>
        </div>

        {canLaunch && (
          <div style={{ background: 'var(--tile-green)', borderRadius: 'var(--r-lg)', padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 22 }}>✨</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--tile-green-ink)', marginBottom: 2 }}>Ready to start</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Hi <strong>{name.split(' ')[0]}</strong> — {goal} cards per day to build your confidence.</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '12px 20px 36px', background: 'var(--surface)', boxShadow: '0 -1px 0 var(--divider)' }}>
        <button onClick={handleLaunch} disabled={!canLaunch || saving} style={{ width: '100%', height: 56, background: canLaunch ? 'var(--success)' : 'var(--ink-3)', color: '#fff', border: 'none', borderRadius: 9999, fontSize: 16, fontWeight: 700, fontFamily: 'inherit', cursor: canLaunch ? 'pointer' : 'not-allowed', boxShadow: canLaunch ? 'var(--sh-green)' : 'none', transition: 'background 300ms ease' }}>
          {saving ? 'Creating your profile…' : canLaunch ? `Start learning, ${name.split(' ')[0]}!` : "Let's go"}
        </button>
      </div>
    </div>
  )
}
