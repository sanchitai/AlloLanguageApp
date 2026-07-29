'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const DEMO_CARDS = [
  { id: '1', fr: 'Bonjour', en: 'Hello', pronun: 'bon-zhoor', ex: "Bonjour, comment s'est passée sa journée?", trans: 'Hello, how was her day?', grad: 'linear-gradient(145deg,#2563EB,#1E40AF)', band: 'linear-gradient(135deg,#2563EB,#1D4ED8)', glow: 'rgba(37,99,235,0.20)' },
  { id: '2', fr: 'La garderie', en: 'The daycare', pronun: 'la gar-duh-ree', ex: 'Ma fille adore sa garderie.', trans: 'My daughter loves her daycare.', grad: 'linear-gradient(145deg,#059669,#047857)', band: 'linear-gradient(135deg,#059669,#065F46)', glow: 'rgba(5,150,105,0.20)' },
  { id: '3', fr: 'Manger', en: 'To eat', pronun: 'mahn-zhay', ex: "Est-ce qu'il a bien mangé aujourd'hui?", trans: 'Did he eat well today?', grad: 'linear-gradient(145deg,#D97706,#B45309)', band: 'linear-gradient(135deg,#D97706,#92400E)', glow: 'rgba(217,119,6,0.20)' },
  { id: '4', fr: 'La sieste', en: 'The nap', pronun: 'la syest', ex: 'A-t-elle fait sa sieste?', trans: 'Did she have her nap?', grad: 'linear-gradient(145deg,#7C3AED,#6D28D9)', band: 'linear-gradient(135deg,#7C3AED,#5B21B6)', glow: 'rgba(124,58,237,0.20)' },
  { id: '5', fr: 'Les allergies', en: 'Allergies', pronun: 'lay-zal-air-zhee', ex: 'Mon enfant a des allergies alimentaires.', trans: 'My child has food allergies.', grad: 'linear-gradient(145deg,#DB2777,#BE185D)', band: 'linear-gradient(135deg,#DB2777,#9D174D)', glow: 'rgba(219,39,119,0.20)' },
]

type CardState = 'unseen' | 'learned' | 'review'

export default function FlashcardsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [states, setStates] = useState<Record<string, CardState>>(() => Object.fromEntries(DEMO_CARDS.map(c => [c.id, 'unseen'])))
  const [done, setDone] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const THRESHOLD = 110

  useEffect(() => { params.then(() => {}) }, [params])

  const card = DEMO_CARDS[idx]
  const learned = Object.values(states).filter(s => s === 'learned').length
  const pct = (idx / DEMO_CARDS.length) * 100

  function advance(dir: 'left' | 'right') {
    const newStates: Record<string, CardState> = { ...states, [card.id]: dir === 'right' ? 'learned' : 'review' as CardState }
    setStates(newStates)
    if (idx + 1 >= DEMO_CARDS.length) { setDone(true); return }
    setIdx(i => i + 1)
    setFlipped(false)
    setDragX(0)
  }

  function speak(text: string) {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = 'fr-CA'; utt.rate = 0.82; utt.pitch = 1.0
    window.speechSynthesis.speak(utt)
  }

  if (done) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', padding: 32, gap: 24, textAlign: 'center', background: 'var(--bg)' }}>
      <div style={{ fontSize: 80, filter: 'drop-shadow(0 8px 24px rgba(245,158,11,0.4))', animation: 'trophy-bounce 0.7s var(--spring) both' }}>🏆</div>
      <div>
        <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.028em' }}>Session Complete!</div>
        <div style={{ fontSize: 15, color: 'var(--ink-2)', marginTop: 8 }}>You went through all {DEMO_CARDS.length} cards.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, width: '100%' }}>
        <div style={{ background: 'var(--tile-green)', borderRadius: 'var(--r-xl)', padding: '16px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--tile-green-ink)' }}>{learned}</div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--tile-green-ink)' }}>Learned</div>
        </div>
        <div style={{ background: 'var(--tile-yellow)', borderRadius: 'var(--r-xl)', padding: '16px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--tile-yellow-ink)' }}>{DEMO_CARDS.length - learned}</div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--tile-yellow-ink)' }}>Review</div>
        </div>
        <div style={{ background: 'var(--black)', borderRadius: 'var(--r-xl)', padding: '16px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--maple)' }}>+{learned * 5}</div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--maple)' }}>XP</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        <button onClick={() => { setIdx(0); setFlipped(false); setDone(false); setStates(Object.fromEntries(DEMO_CARDS.map(c => [c.id, 'unseen' as CardState]))) }} style={{ height: 54, background: 'var(--surface-alt)', border: '2px solid var(--divider)', borderRadius: 9999, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Practice Again</button>
        <Link href={router.toString()} onClick={() => router.back()} style={{ height: 54, background: 'var(--black)', color: '#fff', borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: 'var(--sh-fab)' }}>Back to Scenario</Link>
      </div>
    </div>
  )

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <div style={{ background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px 14px', flexShrink: 0 }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-alt)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 18 18" fill="none" width="18" height="18"><path d="M11 4L6 9l5 5" stroke="var(--ink-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Flashcards</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>👶 Daycare Pickup</div>
        </div>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-alt)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 18 18" fill="none" width="18" height="18"><path d="M4 4l10 10M14 4L4 14" stroke="var(--ink-2)" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Progress */}
      <div style={{ background: 'var(--surface)', padding: '0 20px 16px', flexShrink: 0, borderBottom: '1px solid var(--divider)' }}>
        <div style={{ height: 6, background: 'var(--divider)', borderRadius: 9999, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg,var(--black),#3A3A5C)', borderRadius: 9999, width: `${pct}%`, transition: 'width 400ms var(--ease-out)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: 'var(--ink-3)' }}>
          <span>Card {idx + 1} of {DEMO_CARDS.length}</span>
          <span style={{ color: 'var(--success)', fontWeight: 700 }}>{learned} learned</span>
        </div>
      </div>

      {/* Card arena */}
      <div
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 20px 8px', position: 'relative', '--glow-color': card.glow } as React.CSSProperties}
      >
        {/* Ambient glow */}
        <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: card.glow, filter: 'blur(60px)', top: '50%', left: '50%', transform: 'translate(-50%,-55%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* Stack ghosts */}
        {idx + 1 < DEMO_CARDS.length && <div style={{ position: 'absolute', width: 'calc(100% - 60px)', maxWidth: 360, height: 430, borderRadius: 32, background: 'linear-gradient(145deg,#f0f0f8,#e8e8f4)', transform: 'translateY(10px) scale(0.96)', opacity: 0.7, zIndex: 1 }} />}
        {idx + 2 < DEMO_CARDS.length && <div style={{ position: 'absolute', width: 'calc(100% - 60px)', maxWidth: 360, height: 430, borderRadius: 32, background: 'linear-gradient(145deg,#e8e8f4,#e0e0ee)', transform: 'translateY(20px) scale(0.92)', opacity: 0.4, zIndex: 0 }} />}

        {/* Card */}
        <div
          ref={cardRef}
          style={{ width: '100%', maxWidth: 380, perspective: 1400, zIndex: 2, cursor: 'pointer' }}
          onPointerDown={e => { setIsDragging(true); startX.current = e.clientX }}
          onPointerMove={e => { if (!isDragging) return; setDragX(e.clientX - startX.current) }}
          onPointerUp={() => {
            if (Math.abs(dragX) >= THRESHOLD) { advance(dragX > 0 ? 'right' : 'left') }
            else { setDragX(0) }
            setIsDragging(false)
          }}
          onPointerCancel={() => { setDragX(0); setIsDragging(false) }}
        >
          <div style={{ width: '100%', minHeight: 430, position: 'relative', transformStyle: 'preserve-3d', transition: isDragging ? 'none' : 'transform 380ms cubic-bezier(0.34,1.10,0.64,1)', transform: `rotateY(${flipped ? 180 : 0}deg) translateX(${dragX}px) rotate(${(dragX / 300) * 14}deg)`, borderRadius: 32 }}>

            {/* Front */}
            <div onClick={() => { if (!isDragging && Math.abs(dragX) < 5) setFlipped(true) }} style={{ position: 'absolute', inset: 0, borderRadius: 32, backfaceVisibility: 'hidden', background: card.grad, boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 22 }}>
              {/* Decorative circles */}
              <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', top: -60, right: -60, background: 'rgba(255,255,255,0.10)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', bottom: -40, left: -40, background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
              {/* Ghost word */}
              <div style={{ position: 'absolute', fontSize: 96, fontWeight: 900, color: 'rgba(255,255,255,0.09)', letterSpacing: '-0.03em', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap' }}>{card.fr}</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <div style={{ background: 'rgba(255,255,255,0.28)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 9999, padding: '5px 12px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Français · Québécois</div>
                <div style={{ background: 'rgba(0,0,0,0.12)', borderRadius: 9999, padding: '4px 10px', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.55)' }}>{idx + 1}/{DEMO_CARDS.length}</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.025em', color: '#fff', textAlign: 'center', textShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>{card.fr}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.60)', background: 'rgba(0,0,0,0.12)', padding: '6px 14px', borderRadius: 9999 }}>
                  <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M2 8a6 6 0 1 1 11.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 10l3.5 0 0-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Tap to reveal
                </div>
              </div>

              {/* Swipe overlays */}
              {dragX > 20 && <div style={{ position: 'absolute', inset: 0, borderRadius: 32, background: 'rgba(16,185,129,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, opacity: Math.min(dragX / THRESHOLD, 1) }}><div style={{ fontSize: 24, fontWeight: 900, padding: '12px 24px', borderRadius: 9999, border: '3px solid rgba(16,185,129,0.8)', background: 'rgba(16,185,129,0.35)', color: '#fff' }}>Learned ✓</div></div>}
              {dragX < -20 && <div style={{ position: 'absolute', inset: 0, borderRadius: 32, background: 'rgba(245,158,11,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, opacity: Math.min(-dragX / THRESHOLD, 1) }}><div style={{ fontSize: 24, fontWeight: 900, padding: '12px 24px', borderRadius: 9999, border: '3px solid rgba(245,158,11,0.8)', background: 'rgba(245,158,11,0.35)', color: '#fff' }}>← Review</div></div>}
            </div>

            {/* Back */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: 32, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'var(--surface)', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: card.band, padding: '18px 22px 16px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.30)', borderRadius: 9999, padding: '4px 10px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>English · Translation</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)' }}>{idx + 1}/{DEMO_CARDS.length}</div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>{card.en}</div>
              </div>
              <div style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={() => setFlipped(false)}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 4 }}>Pronunciation</div>
                <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'monospace', marginBottom: 14 }}>{card.pronun}</div>
                <button onClick={e => { e.stopPropagation(); speak(card.fr) }} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 7, background: 'var(--coral)', color: '#fff', border: 'none', borderRadius: 9999, height: 40, padding: '0 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 16, boxShadow: '0 4px 14px rgba(244,63,94,0.30)' }}>
                  <svg viewBox="0 0 14 14" fill="none" width="14" height="14"><polygon points="2,2 12,7 2,12" fill="currentColor"/></svg>
                  Play
                </button>
                <div style={{ height: 1, background: 'var(--divider)', marginBottom: 14 }} />
                <div style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--ink-2)', lineHeight: '20px', marginBottom: 4 }}>&ldquo;{card.ex}&rdquo;</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: '18px', marginBottom: 14, flex: 1 }}>{card.trans}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => advance('left')} style={{ flex: 1, height: 48, background: 'var(--surface-alt)', border: '2px solid var(--divider)', borderRadius: 9999, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
                    <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Review
                  </button>
                  <button onClick={() => advance('right')} style={{ flex: 1, height: 48, background: 'var(--black)', color: '#fff', border: 'none', borderRadius: 9999, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: 'var(--sh-fab)', fontFamily: 'inherit' }}>
                    Learned
                    <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--divider)', padding: '12px 20px 28px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
          {DEMO_CARDS.map((c, i) => (
            <div key={c.id} style={{ height: i === idx ? 7 : 7, borderRadius: 9999, width: i === idx ? 24 : 7, background: i === idx ? 'var(--black)' : states[c.id] === 'learned' ? 'var(--success)' : states[c.id] === 'review' ? 'var(--maple)' : 'var(--divider)', transition: 'all 300ms var(--spring)' }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => speak(card.fr)} style={{ flex: 1, height: 48, background: 'var(--surface-alt)', border: 'none', borderRadius: 'var(--r-lg)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
            <svg viewBox="0 0 20 20" fill="none" width="18" height="18"><polygon points="5,4 16,10 5,16" fill="currentColor"/></svg>
            Listen
          </button>
          <button style={{ flex: 1, height: 48, background: 'var(--surface-alt)', border: 'none', borderRadius: 'var(--r-lg)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
            <svg viewBox="0 0 20 20" fill="none" width="18" height="18"><path d="M10 16.5s-7-4.5-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 17 7.5c0 4.5-7 9-7 9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
            Favourite
          </button>
        </div>
      </div>
    </div>
  )
}
