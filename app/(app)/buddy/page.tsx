'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getPhrasePacks, getStoredLang, getLangLabel, type Lang } from '@/lib/content'

export default function BuddyPage() {
  const [lang, setLang] = useState<Lang>('fr')
  const [fromLang, setFromLang] = useState<'en' | Lang>('en')

  useEffect(() => {
    const stored = getStoredLang()
    setLang(stored)
    setFromLang('en')
  }, [])

  const PHRASE_PACKS = getPhrasePacks(lang)
  const langLabel = getLangLabel(lang)
  type PackKey = keyof typeof PHRASE_PACKS
  const [inputText, setInputText] = useState('')
  const [sourceText, setSourceText] = useState("Hello, how was my child's day today?")
  const [translatedText, setTranslatedText] = useState("Bonjour, comment s'est passée la journée de mon enfant aujourd'hui?")
  const [isTranslating, setIsTranslating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activePack, setActivePack] = useState<PackKey>('daycare')
  const [showLoud, setShowLoud] = useState(false)
  const [loudPhrase, setLoudPhrase] = useState('')
  const [loudTrans, setLoudTrans] = useState('')
  const [cachedGender, setCachedGender] = useState<'female' | 'male' | 'neutral'>('female')

  // Fetch voice gender once on mount
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('voice_gender').eq('id', user.id).single()
        .then(({ data }) => {
          const row = data as { voice_gender?: string } | null
          if (row?.voice_gender) setCachedGender(row.voice_gender as 'female' | 'male' | 'neutral')
        })
    })
  }, [])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  async function playTTS(text: string) {
    setIsPlaying(true)
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, gender: cachedGender }),
      })
      const { url } = await res.json()
      if (url) {
        if (audioRef.current) audioRef.current.pause()
        const audio = new Audio(url)
        audioRef.current = audio
        audio.onended = () => setIsPlaying(false)
        audio.onerror = () => setIsPlaying(false)
        await audio.play()
      }
    } catch {
      setIsPlaying(false)
    }
  }

  async function doTranslate() {
    if (!inputText.trim()) return
    setIsTranslating(true)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, fromLang, toLang: fromLang === 'en' ? lang : 'en' }),
      })
      const { translation } = await res.json()
      setSourceText(inputText)
      setTranslatedText(translation)
      setInputText('')
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
      await playTTS(translation)
    } finally {
      setIsTranslating(false)
    }
  }

  function swapLanguages() {
    setFromLang(l => l === 'en' ? lang : 'en')
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  function openLoud(phrase: string, trans: string) {
    setLoudPhrase(phrase)
    setLoudTrans(trans)
    setShowLoud(true)
    playTTS(phrase)
  }

  const packs = PHRASE_PACKS[activePack]
  const packKeys = Object.keys(PHRASE_PACKS) as PackKey[]
  const packEmoji: Record<PackKey, string> = { daycare: '👶', medical: '🏥', work: '💼', food: '🍽️', transport: '🚌' }

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: 'var(--buddy-bg)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px 0', fontSize: 15, fontWeight: 600, color: 'var(--buddy-text)' }}>
          <span>{new Date().toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(26,95,168,0.12)', border: '1px solid rgba(26,95,168,0.25)', borderRadius: 9999, padding: '5px 11px', fontSize: 11, fontWeight: 700, color: '#1A5FA8' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A5FA8', animation: 'live-pulse 1.6s ease-in-out infinite' }} />
            Live
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px 18px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.015em', color: '#1A3A6B' }}>Buddy<span style={{ color: '#1A5FA8' }}>.</span></div>
            <div style={{ fontSize: 12, color: 'var(--buddy-text-dim)', marginTop: 1 }}>Live translation companion</div>
          </div>
        </div>

        {/* Language bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px 14px' }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.55)', border: '1.5px solid rgba(26,95,168,0.20)', borderRadius: 'var(--r-lg)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--buddy-text-dim)', marginBottom: 2 }}>I speak</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A3A6B' }}>{fromLang === 'en' ? 'English' : langLabel.name}</div>
          </div>
          <button onClick={swapLanguages} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--maple)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(245,158,11,0.40)', flexShrink: 0 }}>
            <svg viewBox="0 0 18 18" fill="none" width="18" height="18"><path d="M3 6h12M12 3l3 3-3 3M15 12H3M6 9l-3 3 3 3" stroke="var(--black)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.55)', border: '1.5px solid rgba(26,95,168,0.20)', borderRadius: 'var(--r-lg)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--buddy-text-dim)', marginBottom: 2 }}>Translate to</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A3A6B' }}>{fromLang === 'en' ? langLabel.name : 'English'}</div>
            <div style={{ fontSize: 11, color: 'var(--buddy-text-dim)', marginTop: 1 }}>{fromLang === 'en' ? langLabel.native : 'Canadian'}</div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 220px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Translation card */}
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-lift)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--divider)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 4 }}>{fromLang === 'en' ? 'English' : langLabel.name}</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink-2)', lineHeight: '22px' }}>{sourceText}</div>
          </div>
          <div style={{ padding: '14px 16px 10px', background: 'linear-gradient(135deg, #F3EEFF, #EDE8FB)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#7C3AED', marginBottom: 6 }}>{fromLang === 'en' ? langLabel.name : 'English'}</div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.015em', color: '#2D1B6E', lineHeight: '28px' }}>{translatedText}</div>
          </div>
          <div style={{ padding: '10px 14px 12px', display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid rgba(124,58,237,0.12)' }}>
            <button onClick={() => playTTS(translatedText)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: isPlaying ? 'var(--coral)' : '#7C3AED', color: '#fff', border: 'none', borderRadius: 9999, padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,58,237,0.35)', flexShrink: 0 }}>
              <svg viewBox="0 0 14 14" fill="none" width="14" height="14"><polygon points="2,2 12,7 2,12" fill="currentColor"/></svg>
              {isPlaying ? 'Playing…' : 'Play'}
            </button>
            <button onClick={() => openLoud(translatedText, sourceText)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--tile-green)', color: 'var(--tile-green-ink)', border: 'none', borderRadius: 9999, padding: '9px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
              <svg viewBox="0 0 14 14" fill="none" width="14" height="14"><path d="M2 5h3l4-3v10l-4-3H2z" fill="currentColor"/><path d="M11 4a4 4 0 0 1 0 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none"/></svg>
              Loud
            </button>
            <button onClick={() => navigator.clipboard?.writeText(translatedText)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-alt)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
              <svg viewBox="0 0 15 15" fill="none" width="15" height="15"><rect x="4" y="4" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M2 11V3a1 1 0 0 1 1-1h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        {/* Phrase packs */}
        <div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none', marginLeft: -14, marginRight: -14, paddingLeft: 14, paddingRight: 14 }}>
            {packKeys.map(k => (
              <button key={k} onClick={() => setActivePack(k)} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px',
                borderRadius: 9999, border: `2px solid ${activePack === k ? '#7C3AED' : 'var(--divider)'}`,
                background: activePack === k ? '#7C3AED' : 'var(--surface)',
                color: activePack === k ? '#fff' : 'var(--ink-2)',
                fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                whiteSpace: 'nowrap', flexShrink: 0,
                boxShadow: activePack === k ? '0 4px 14px rgba(124,58,237,0.30)' : 'none',
              }}>
                {packEmoji[String(k)]} {String(k).charAt(0).toUpperCase() + String(k).slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {packs.map((p, i) => (
            <div key={i} style={{ background: 'var(--surface)', borderRadius: 'var(--r-lg)', padding: '12px 14px', boxShadow: 'var(--sh-card)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', lineHeight: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.target}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.native}</div>
              </div>
              {p.emergency && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 9999, background: 'var(--tile-pink)', color: 'var(--tile-pink-ink)', flexShrink: 0 }}>Urgent</span>}
              <button onClick={() => playTTS(p.target)} style={{ width: 36, height: 36, borderRadius: '50%', background: '#EDE8FB', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg viewBox="0 0 14 14" fill="none" width="14" height="14"><polygon points="2,2 12,7 2,12" fill="#7C3AED"/></svg>
              </button>
              <button onClick={() => openLoud(p.target, p.native)} style={{ width: 36, height: 36, borderRadius: '50%', background: '#7C3AED', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(124,58,237,0.35)' }}>
                <svg viewBox="0 0 14 14" fill="none" width="14" height="14"><path d="M4 7h6M7 4l3 3-3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div style={{ position: 'fixed', bottom: 72, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: 'var(--surface)', borderTop: '1px solid var(--divider)', padding: '10px 14px 12px', zIndex: 25 }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 8 }}>
          {["Did my child eat well?", "Peanut allergy", "Repeat slowly", "Thank you"].map(hint => (
            <button key={hint} onClick={() => { setInputText(hint); textareaRef.current?.focus() }} style={{ whiteSpace: 'nowrap', padding: '5px 12px', borderRadius: 9999, background: 'var(--surface-alt)', border: '1.5px solid var(--divider)', fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit' }}>
              {hint}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <div style={{ flex: 1, background: 'var(--surface-alt)', borderRadius: 'var(--r-xl)', border: '2px solid transparent', transition: 'border-color 200ms', display: 'flex', alignItems: 'flex-end' }}>
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={e => { setInputText(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doTranslate() } }}
              placeholder="Type to translate…"
              rows={1}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '12px 14px', fontSize: 15, fontFamily: 'inherit', color: 'var(--ink)', resize: 'none', maxHeight: 120 }}
            />
          </div>
          <button onClick={doTranslate} disabled={!inputText.trim() || isTranslating} style={{ width: 46, height: 46, borderRadius: '50%', background: inputText.trim() ? '#1A5FA8' : 'var(--surface-alt)', border: 'none', cursor: inputText.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: inputText.trim() ? '0 4px 16px rgba(26,95,168,0.35)' : 'none', transition: 'background 200ms, box-shadow 200ms' }}>
            <svg viewBox="0 0 18 18" fill="none" width="18" height="18"><path d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* Loud overlay */}
      {showLoud && (
        <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(160deg, #1A3A6B, #1A5FA8 60%, #2563EB)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', gap: 28 }}>
          <button onClick={() => setShowLoud(false)} style={{ position: 'absolute', top: 60, right: 24, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.10)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 18 18" fill="none" width="18" height="18"><path d="M4 4l10 10M14 4L4 14" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#93C5FD' }}>📢 LOUD SPEAKER</div>
          <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', textAlign: 'center', lineHeight: 1.15 }}>{loudPhrase}</div>
          <button onClick={() => playTTS(loudPhrase)} style={{ width: 80, height: 80, borderRadius: '50%', background: '#DCEEFB', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(220,238,251,0.40)' }}>
            <svg viewBox="0 0 30 30" fill="none" width="30" height="30"><polygon points="6,4 26,15 6,26" fill="#1A5FA8"/></svg>
          </button>
          <div style={{ fontSize: 18, fontWeight: 500, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 1.4 }}>{loudTrans}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.30)', textAlign: 'center' }}>Tap the button to play aloud · Hand your phone to someone</div>
        </div>
      )}
    </div>
  )
}
