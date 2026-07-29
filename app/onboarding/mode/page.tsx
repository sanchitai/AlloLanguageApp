'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingModePage() {
  const router = useRouter()
  const [selected, setSelected] = useState<'learn' | 'buddy' | null>(null)

  return (
    <div className="shell">
      <div style={{ background: 'var(--surface)', padding: '14px 20px 0', display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 600 }}>
        <span>9:41</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 20px 0', gap: 5 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ height: 5, borderRadius: 9999, background: i === 0 ? 'var(--black)' : 'var(--divider)', width: i === 0 ? 24 : 5, transition: 'all 260ms var(--spring)' }} />
        ))}
      </div>

      <div style={{ padding: '28px 24px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>Step 1 of 4</div>
        <h1 style={{ fontSize: 40, fontWeight: 900, lineHeight: '44px', letterSpacing: '-0.025em' }}>
          How can Allo help<span style={{ color: 'var(--maple)' }}>?</span>
        </h1>
        <p style={{ marginTop: 10, fontSize: 15, lineHeight: '24px', color: 'var(--ink-2)' }}>Choose your mode. You can always switch later in your profile.</p>
      </div>

      <div style={{ padding: '28px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
        {[
          { id: 'learn' as const, title: 'Learn the Language', label: 'Mode 1', desc: 'Build real vocabulary and phrases for your specific situation. Flashcards, audio pronunciation, and progress tracking.', bg: 'var(--tile-blue)', pills: ['🎯 Scenario-based','🃏 Flashcards','🔊 Pronunciation','📈 Progress','🔥 Streaks'] },
          { id: 'buddy' as const, title: 'Buddy Mode', label: 'Mode 2', desc: 'Use Allo as a live translation companion. Browse situation phrases or type anything — Allo speaks it out loud.', bg: 'var(--tile-green)', pills: ['🔄 Instant translation','📢 Loud speaker','✍️ Type anything','📦 Situation packs','🎙️ Your voice'] },
        ].map(opt => (
          <div key={opt.id} onClick={() => setSelected(opt.id)} style={{ background: 'var(--surface)', borderRadius: 'var(--r-2xl)', border: `2.5px solid ${selected === opt.id ? 'var(--black)' : 'var(--divider)'}`, padding: 24, cursor: 'pointer', boxShadow: selected === opt.id ? 'var(--sh-lift)' : 'var(--sh-card)', transition: 'all 200ms ease', position: 'relative' }}>
            {selected === opt.id && (
              <div style={{ position: 'absolute', top: 18, right: 18, width: 26, height: 26, borderRadius: '50%', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 13 13" fill="none" width="13" height="13"><path d="M2 6.5 5 9.5l6-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
            <div style={{ height: 100, background: opt.bg, borderRadius: 'var(--r-lg)', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>
              {opt.id === 'learn' ? '🃏' : '🗣️'}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: opt.id === 'learn' ? 'var(--tile-blue-ink)' : 'var(--tile-green-ink)', marginBottom: 6 }}>{opt.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 10 }}>{opt.title}</div>
            <div style={{ fontSize: 14, lineHeight: '22px', color: 'var(--ink-2)', marginBottom: 14 }}>{opt.desc}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {opt.pills.map(p => <span key={p} style={{ fontSize: 12, fontWeight: 600, padding: '5px 11px', borderRadius: 9999, background: opt.id === 'learn' ? 'rgba(220,238,251,0.6)' : 'rgba(216,245,232,0.6)', color: opt.id === 'learn' ? 'var(--tile-blue-ink)' : 'var(--tile-green-ink)' }}>{p}</span>)}
            </div>
          </div>
        ))}

        <div style={{ background: 'var(--surface-alt)', borderRadius: 'var(--r-lg)', padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span>💡</span>
          <span style={{ fontSize: 13, lineHeight: '20px', color: 'var(--ink-2)' }}><strong>Not sure?</strong> Start with <strong>Learn</strong> to build confidence, or pick <strong>Buddy</strong> if you have a real situation happening soon.</span>
        </div>
      </div>

      <div style={{ padding: '12px 20px 36px', boxShadow: '0 -1px 0 var(--divider)', background: 'var(--surface)' }}>
        <button onClick={() => { if (selected) { localStorage.setItem('allo_mode', selected); router.push('/onboarding/language') } }} disabled={!selected} style={{ width: '100%', height: 56, background: selected ? 'var(--black)' : 'var(--ink-3)', color: '#fff', border: 'none', borderRadius: 9999, fontSize: 16, fontWeight: 700, fontFamily: 'inherit', cursor: selected ? 'pointer' : 'not-allowed', boxShadow: selected ? 'var(--sh-fab)' : 'none' }}>
          {selected ? (selected === 'learn' ? 'Start learning →' : 'Start translating →') : 'Choose a mode to continue'}
        </button>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-3)', marginTop: 10 }}>You can change your mode anytime in Profile → Settings</div>
      </div>
    </div>
  )
}
