'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const LANGUAGES = [
  {
    id: 'fr',
    name: 'French',
    native: 'Français Québécois',
    desc: 'Quebec French for everyday life in Canada',
    emoji: '🍁',
    flag: (
      <svg viewBox="0 0 44 29" fill="none" width="52" height="34" style={{ borderRadius: 6, display: 'block' }}>
        <rect width="19.5" height="13" fill="#003DA5"/><rect x="24.5" width="19.5" height="13" fill="#003DA5"/>
        <rect y="16" width="19.5" height="13" fill="#003DA5"/><rect x="24.5" y="16" width="19.5" height="13" fill="#003DA5"/>
        <rect x="19.5" width="5" height="29" fill="#FFFFFF"/><rect y="13" width="44" height="3" fill="#FFFFFF"/>
        <g transform="translate(9.75,6.5) scale(0.38)"><ellipse cx="0" cy="-5" rx="1.8" ry="2.5" fill="#FFFFFF"/><ellipse cx="-6.5" cy="2.5" rx="1.8" ry="2.5" fill="#FFFFFF"/><ellipse cx="6.5" cy="2.5" rx="1.8" ry="2.5" fill="#FFFFFF"/><rect x="-3.5" y="5" width="7" height="2.5" rx="0.5" fill="#FFFFFF"/><rect x="-2" y="7.5" width="4" height="3.5" rx="0.5" fill="#FFFFFF"/></g>
        <g transform="translate(34.25,6.5) scale(0.38)"><ellipse cx="0" cy="-5" rx="1.8" ry="2.5" fill="#FFFFFF"/><ellipse cx="-6.5" cy="2.5" rx="1.8" ry="2.5" fill="#FFFFFF"/><ellipse cx="6.5" cy="2.5" rx="1.8" ry="2.5" fill="#FFFFFF"/><rect x="-3.5" y="5" width="7" height="2.5" rx="0.5" fill="#FFFFFF"/><rect x="-2" y="7.5" width="4" height="3.5" rx="0.5" fill="#FFFFFF"/></g>
        <g transform="translate(9.75,22.5) scale(0.38)"><ellipse cx="0" cy="-5" rx="1.8" ry="2.5" fill="#FFFFFF"/><ellipse cx="-6.5" cy="2.5" rx="1.8" ry="2.5" fill="#FFFFFF"/><ellipse cx="6.5" cy="2.5" rx="1.8" ry="2.5" fill="#FFFFFF"/><rect x="-3.5" y="5" width="7" height="2.5" rx="0.5" fill="#FFFFFF"/><rect x="-2" y="7.5" width="4" height="3.5" rx="0.5" fill="#FFFFFF"/></g>
        <g transform="translate(34.25,22.5) scale(0.38)"><ellipse cx="0" cy="-5" rx="1.8" ry="2.5" fill="#FFFFFF"/><ellipse cx="-6.5" cy="2.5" rx="1.8" ry="2.5" fill="#FFFFFF"/><ellipse cx="6.5" cy="2.5" rx="1.8" ry="2.5" fill="#FFFFFF"/><rect x="-3.5" y="5" width="7" height="2.5" rx="0.5" fill="#FFFFFF"/><rect x="-2" y="7.5" width="4" height="3.5" rx="0.5" fill="#FFFFFF"/></g>
      </svg>
    ),
    color: '#003DA5',
    bg: '#E8F0FF',
    pill: '#003DA5',
  },
  {
    id: 'de',
    name: 'German',
    native: 'Deutsch',
    desc: 'Standard German for travel, work & daily life',
    emoji: '🏔️',
    flag: (
      <svg viewBox="0 0 44 29" fill="none" width="52" height="34" style={{ borderRadius: 6, display: 'block' }}>
        <rect width="44" height="9.67" fill="#000000"/>
        <rect y="9.67" width="44" height="9.67" fill="#DD0000"/>
        <rect y="19.33" width="44" height="9.67" fill="#FFCE00"/>
      </svg>
    ),
    color: '#B8860B',
    bg: '#FFFBE6',
    pill: '#B8860B',
  },
]

export default function OnboardingLanguagePage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)

  function handleContinue() {
    if (!selected) return
    localStorage.setItem('allo_learn', selected)
    localStorage.setItem('allo_know', 'en')
    router.push('/onboarding/situation')
  }

  const lang = LANGUAGES.find(l => l.id === selected)

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* Sky header */}
      <div style={{
        background: 'linear-gradient(160deg, #C8E8FF 0%, #D8F0FF 60%, #EEF7FF 100%)',
        padding: '52px 24px 32px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -50, right: -40, width: 220, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.50)', filter: 'blur(3px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 20, left: -60, width: 180, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', filter: 'blur(3px)', pointerEvents: 'none' }} />

        {/* Back + step dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, position: 'relative', zIndex: 1 }}>
          <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.70)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(26,46,59,0.10)' }}>
            <svg viewBox="0 0 18 18" fill="none" width="18" height="18"><path d="M11 4L6 9l5 5" stroke="var(--ink-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ height: 6, borderRadius: 9999, background: i === 1 ? 'var(--primary)' : i < 1 ? 'rgba(255,112,67,0.40)' : 'rgba(255,255,255,0.50)', width: i === 1 ? 24 : 6, transition: 'all 260ms var(--spring)' }} />
            ))}
          </div>
          <div style={{ width: 40 }} />
        </div>

        {/* Headline */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,46,59,0.55)', marginBottom: 8 }}>Step 2 of 4</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.025em', lineHeight: '40px' }}>
            What would you<br />like to learn<span style={{ color: 'var(--primary)' }}>?</span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--ink-2)', marginTop: 10, fontWeight: 600, lineHeight: '22px' }}>
            Pick the language you want to learn. More languages coming soon!
          </p>
        </div>
      </div>

      {/* Language cards */}
      <div style={{ flex: 1, padding: '24px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {LANGUAGES.map(lang => (
          <div
            key={lang.id}
            onClick={() => setSelected(lang.id)}
            style={{
              background: selected === lang.id ? lang.bg : 'var(--surface)',
              borderRadius: 24,
              border: `2.5px solid ${selected === lang.id ? lang.color : 'transparent'}`,
              padding: '20px 20px',
              cursor: 'pointer',
              boxShadow: selected === lang.id ? `0 8px 28px ${lang.color}25` : 'var(--sh-card)',
              transition: 'all 200ms var(--spring)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Selected checkmark */}
            {selected === lang.id && (
              <div style={{ position: 'absolute', top: 14, right: 14, width: 26, height: 26, borderRadius: '50%', background: lang.color, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'bounce-in 280ms var(--spring) both' }}>
                <svg viewBox="0 0 13 13" fill="none" width="13" height="13"><path d="M2 6.5 5 9.5l6-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}

            {/* Flag */}
            <div style={{ flexShrink: 0, borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(26,46,59,0.15)' }}>
              {lang.flag}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: '26px' }}>
                {lang.name}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 700, marginTop: 2 }}>{lang.native}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6, lineHeight: '16px', fontWeight: 600 }}>{lang.desc}</div>
            </div>
          </div>
        ))}

        {/* Callout */}
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-lg)', padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'flex-start', boxShadow: 'var(--sh-card)', marginTop: 4 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>🍁</span>
          <div style={{ fontSize: 13, lineHeight: '20px', color: 'var(--ink-2)', fontWeight: 600 }}>
            <strong style={{ color: 'var(--ink)' }}>Quebec French</strong> uses everyday Québécois expressions — not textbook French from France.
          </div>
        </div>

        {/* Summary */}
        {selected && lang && (
          <div style={{ background: lang.bg, borderRadius: 'var(--r-lg)', padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center', border: `1.5px solid ${lang.color}30`, animation: 'float-up 250ms var(--spring) both' }}>
            <span style={{ fontSize: 20 }}>{lang.emoji}</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
              You&apos;re learning <strong>{lang.name}</strong> — great choice!
            </div>
          </div>
        )}

      </div>

      {/* CTA */}
      <div style={{ padding: '12px 20px 36px', background: 'var(--surface)', boxShadow: '0 -1px 0 rgba(86,204,242,0.15)' }}>
        <button
          onClick={handleContinue}
          disabled={!selected}
          style={{
            width: '100%', height: 56,
            background: selected ? 'var(--primary)' : 'var(--bg)',
            color: selected ? '#fff' : 'var(--ink-3)',
            border: 'none', borderRadius: 'var(--r-full)',
            fontSize: 17, fontWeight: 800,
            fontFamily: 'var(--font)',
            cursor: selected ? 'pointer' : 'not-allowed',
            boxShadow: selected ? 'var(--sh-fab)' : 'none',
            transition: 'all 200ms var(--spring)',
          }}
        >
          {selected ? `Start learning ${LANGUAGES.find(l => l.id === selected)?.name} →` : 'Choose a language'}
        </button>
      </div>

    </div>
  )
}
