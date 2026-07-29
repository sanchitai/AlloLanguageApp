'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CANADA_FLAG = (
  <svg viewBox="0 0 44 29" fill="none" width="44" height="29" style={{ borderRadius: 5 }}>
    <rect width="11" height="29" fill="#D52B1E"/><rect x="11" width="22" height="29" fill="#FFFFFF"/><rect x="33" width="11" height="29" fill="#D52B1E"/>
    <path d="M22 4.5l1.1 3.3 3.2-.5-2 2.4 1.8 1.2-2.6.3.4 3.2-1.9-1.5v4.1l-.5-2h-.9l-.5 2v-4.1l-1.9 1.5.4-3.2-2.6-.3 1.8-1.2-2-2.4 3.2.5z" fill="#D52B1E"/>
  </svg>
)

const QUEBEC_FLAG = (
  <svg viewBox="0 0 44 29" fill="none" width="44" height="29" style={{ borderRadius: 5 }}>
    <rect width="19.5" height="13" fill="#003DA5"/><rect x="24.5" width="19.5" height="13" fill="#003DA5"/>
    <rect y="16" width="19.5" height="13" fill="#003DA5"/><rect x="24.5" y="16" width="19.5" height="13" fill="#003DA5"/>
    <rect x="19.5" width="5" height="29" fill="#FFFFFF"/><rect y="13" width="44" height="3" fill="#FFFFFF"/>
    <g transform="translate(9.75,6.5) scale(0.38)"><ellipse cx="0" cy="-5" rx="1.8" ry="2.5" fill="#FFFFFF"/><ellipse cx="-6.5" cy="2.5" rx="1.8" ry="2.5" fill="#FFFFFF"/><ellipse cx="6.5" cy="2.5" rx="1.8" ry="2.5" fill="#FFFFFF"/><rect x="-3.5" y="5" width="7" height="2.5" rx="0.5" fill="#FFFFFF"/><rect x="-2" y="7.5" width="4" height="3.5" rx="0.5" fill="#FFFFFF"/></g>
    <g transform="translate(34.25,6.5) scale(0.38)"><ellipse cx="0" cy="-5" rx="1.8" ry="2.5" fill="#FFFFFF"/><ellipse cx="-6.5" cy="2.5" rx="1.8" ry="2.5" fill="#FFFFFF"/><ellipse cx="6.5" cy="2.5" rx="1.8" ry="2.5" fill="#FFFFFF"/><rect x="-3.5" y="5" width="7" height="2.5" rx="0.5" fill="#FFFFFF"/><rect x="-2" y="7.5" width="4" height="3.5" rx="0.5" fill="#FFFFFF"/></g>
    <g transform="translate(9.75,22.5) scale(0.38)"><ellipse cx="0" cy="-5" rx="1.8" ry="2.5" fill="#FFFFFF"/><ellipse cx="-6.5" cy="2.5" rx="1.8" ry="2.5" fill="#FFFFFF"/><ellipse cx="6.5" cy="2.5" rx="1.8" ry="2.5" fill="#FFFFFF"/><rect x="-3.5" y="5" width="7" height="2.5" rx="0.5" fill="#FFFFFF"/><rect x="-2" y="7.5" width="4" height="3.5" rx="0.5" fill="#FFFFFF"/></g>
    <g transform="translate(34.25,22.5) scale(0.38)"><ellipse cx="0" cy="-5" rx="1.8" ry="2.5" fill="#FFFFFF"/><ellipse cx="-6.5" cy="2.5" rx="1.8" ry="2.5" fill="#FFFFFF"/><ellipse cx="6.5" cy="2.5" rx="1.8" ry="2.5" fill="#FFFFFF"/><rect x="-3.5" y="5" width="7" height="2.5" rx="0.5" fill="#FFFFFF"/><rect x="-2" y="7.5" width="4" height="3.5" rx="0.5" fill="#FFFFFF"/></g>
  </svg>
)

export default function OnboardingLanguagePage() {
  const router = useRouter()
  const [know, setKnow] = useState<'en' | 'fr' | null>(null)
  const [learn, setLearn] = useState<'en' | 'fr' | null>(null)

  function pickKnow(l: 'en' | 'fr') {
    if (learn === l) { shake(`learn-${l}`); return }
    setKnow(l)
  }
  function pickLearn(l: 'en' | 'fr') {
    if (know === l) { shake(`know-${l}`); return }
    setLearn(l)
  }
  function shake(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    el.style.transition = 'transform 60ms ease'
    el.style.transform = 'translateX(6px)'
    setTimeout(() => { el.style.transform = 'translateX(-5px)' }, 70)
    setTimeout(() => { el.style.transform = 'translateX(0)'; el.style.transition = '' }, 150)
  }
  function swap() { const t = know; setKnow(learn as typeof know); setLearn(t as typeof learn) }

  const canContinue = know && learn

  return (
    <div className="shell">
      <div style={{ background: 'var(--surface)', padding: '14px 20px 0', display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 600 }}>
        <span>9:41</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 0' }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-alt)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 18 18" fill="none" width="18" height="18"><path d="M11 4L6 9l5 5" stroke="var(--ink-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{ display: 'flex', gap: 5 }}>
          {[0,1,2,3].map(i => <div key={i} style={{ height: 5, borderRadius: 9999, background: i <= 1 ? 'var(--black)' : 'var(--divider)', opacity: i === 0 ? 0.35 : 1, width: i === 1 ? 24 : 5, transition: 'all 260ms var(--spring)' }} />)}
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>Step 2 of 4</div>
        <h1 style={{ fontSize: 40, fontWeight: 900, lineHeight: '44px', letterSpacing: '-0.025em' }}>Pick your languages<span style={{ color: 'var(--maple)' }}>.</span></h1>
        <p style={{ marginTop: 10, fontSize: 15, lineHeight: '24px', color: 'var(--ink-2)' }}>Tell us what you speak, and what you want to learn.</p>
      </div>

      <div style={{ padding: '28px 20px 20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Language I know */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>Language I know</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {(['en', 'fr'] as const).map(l => (
              <div key={l} id={`know-${l}`} onClick={() => pickKnow(l)} style={{ background: know === l ? (l === 'en' ? 'var(--tile-blue)' : 'var(--tile-green)') : 'var(--surface)', border: `2px solid ${know === l ? 'var(--black)' : 'var(--divider)'}`, borderRadius: 'var(--r-xl)', padding: '20px 16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: know === l ? 'var(--sh-float)' : 'var(--sh-card)', position: 'relative', transition: 'all 200ms ease' }}>
                {know === l && <div style={{ position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: '50%', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg viewBox="0 0 11 11" fill="none" width="11" height="11"><path d="M1.5 5.5 4 8l5.5-5.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
                {l === 'en' ? CANADA_FLAG : QUEBEC_FLAG}
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>{l === 'en' ? 'English' : 'Français'}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-3)', marginTop: 2 }}>{l === 'en' ? 'English' : 'Québécois'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Swap */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
          <button onClick={swap} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1.5px solid var(--divider)', borderRadius: 9999, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', cursor: 'pointer', boxShadow: 'var(--sh-card)', fontFamily: 'inherit' }}>
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M2 5h12M11 2l3 3-3 3M14 11H2M5 8l-3 3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Swap
          </button>
          <div style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
        </div>

        {/* Language I want to learn */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>Language I want to learn</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {(['en', 'fr'] as const).map(l => (
              <div key={l} id={`learn-${l}`} onClick={() => pickLearn(l)} style={{ background: learn === l ? (l === 'en' ? 'var(--tile-blue)' : 'var(--tile-green)') : 'var(--surface)', border: `2px solid ${learn === l ? 'var(--black)' : 'var(--divider)'}`, borderRadius: 'var(--r-xl)', padding: '20px 16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: learn === l ? 'var(--sh-float)' : 'var(--sh-card)', position: 'relative', transition: 'all 200ms ease' }}>
                {learn === l && <div style={{ position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: '50%', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg viewBox="0 0 11 11" fill="none" width="11" height="11"><path d="M1.5 5.5 4 8l5.5-5.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
                {l === 'en' ? CANADA_FLAG : QUEBEC_FLAG}
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>{l === 'en' ? 'English' : 'Français'}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-3)', marginTop: 2 }}>{l === 'en' ? 'English' : 'Québécois'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {canContinue && (
          <div style={{ background: 'var(--tile-green)', borderRadius: 'var(--r-lg)', padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center', animation: 'card-in 280ms var(--spring) both' }}>
            <span style={{ fontSize: 22 }}>🎯</span>
            <div style={{ fontSize: 13, fontWeight: 500 }}>You speak <strong>{know === 'en' ? 'English' : 'Québécois French'}</strong> and are learning <strong>{learn === 'en' ? 'English' : 'Québécois French'}</strong>.</div>
          </div>
        )}

        <div style={{ background: 'var(--surface-alt)', borderRadius: 'var(--r-md)', padding: '12px 14px', display: 'flex', gap: 10 }}>
          <span>🍁</span>
          <span style={{ fontSize: 13, lineHeight: '20px', color: 'var(--ink-2)' }}><strong>Built for Quebec.</strong> Translations use everyday Québécois — not textbook French from France.</span>
        </div>
      </div>

      <div style={{ padding: '12px 20px 36px', background: 'var(--surface)', boxShadow: '0 -1px 0 var(--divider)' }}>
        <button onClick={() => { if (canContinue) { localStorage.setItem('allo_know', know!); localStorage.setItem('allo_learn', learn!); router.push('/onboarding/situation') } }} disabled={!canContinue} style={{ width: '100%', height: 56, background: canContinue ? 'var(--black)' : 'var(--ink-3)', color: '#fff', border: 'none', borderRadius: 9999, fontSize: 16, fontWeight: 700, fontFamily: 'inherit', cursor: canContinue ? 'pointer' : 'not-allowed', boxShadow: canContinue ? 'var(--sh-fab)' : 'none' }}>
          Continue →
        </button>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-3)', marginTop: 12 }}>
          Already have an account? <a href="/login" style={{ color: 'var(--ink)', fontWeight: 600 }}>Sign in</a>
        </p>
      </div>
    </div>
  )
}
