'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PRESETS = [
  { id: 'daycare', title: 'Daycare Pickup', emoji: '👶', category: 'Family', bg: '#DCEEFB' },
  { id: 'ptmeeting', title: 'Parent-Teacher', emoji: '🏫', category: 'Family', bg: '#EDE8FB' },
  { id: 'firstday', title: 'First Day at Work', emoji: '💼', category: 'Work', bg: '#FEF7D0' },
  { id: 'coworkers', title: 'Meeting Coworkers', emoji: '🤝', category: 'Work', bg: '#FEF7D0' },
  { id: 'doctor', title: 'Doctor Visit', emoji: '🏥', category: 'Medical', bg: '#FDE8EF' },
  { id: 'pharmacy', title: 'Pharmacy', emoji: '💊', category: 'Medical', bg: '#FDE8EF' },
  { id: 'neighbours', title: 'Neighbours', emoji: '🏠', category: 'Social', bg: '#D8F5E8' },
  { id: 'birthday', title: 'Birthday Party', emoji: '🎉', category: 'Social', bg: '#D8F5E8' },
  { id: 'restaurant', title: 'Restaurant', emoji: '🍽️', category: 'Food', bg: '#FEEBD0' },
  { id: 'grocery', title: 'Grocery Shopping', emoji: '🛒', category: 'Food', bg: '#FEEBD0' },
  { id: 'transit', title: 'Public Transit', emoji: '🚌', category: 'Transport', bg: '#D0F4F4' },
  { id: 'directions', title: 'Asking Directions', emoji: '📍', category: 'Transport', bg: '#D0F4F4' },
  { id: 'bank', title: 'Bank Appointment', emoji: '🏦', category: 'Services', bg: '#EBEBEB' },
  { id: 'airport', title: 'Airport', emoji: '✈️', category: 'Travel', bg: '#DCEEFB' },
]

const HINT_CHIPS = [
  "I pick up my child from a French daycare",
  "I have a doctor's appointment at a French clinic",
  "I'm starting a new job and my colleagues speak French",
  "I want to chat with my French-speaking neighbours",
]

export default function OnboardingSituationPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'preset' | 'custom'>('preset')
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [customText, setCustomText] = useState('')
  const [search, setSearch] = useState('')

  const filtered = PRESETS.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  )

  const canContinue = tab === 'preset' ? !!selectedPreset : customText.trim().length >= 10

  function handleContinue() {
    if (!canContinue) return
    if (tab === 'preset') {
      localStorage.setItem('allo_situation_preset', selectedPreset!)
    } else {
      localStorage.setItem('allo_situation_custom', customText)
    }
    router.push('/onboarding/profile')
  }

  return (
    <div className="shell">
      <div style={{ background: 'var(--surface)', padding: '14px 20px 0', fontSize: 15, fontWeight: 600 }}>9:41</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 0' }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-alt)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 18 18" fill="none" width="18" height="18"><path d="M11 4L6 9l5 5" stroke="var(--ink-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{ display: 'flex', gap: 5 }}>
          {[0,1,2,3].map(i => <div key={i} style={{ height: 5, borderRadius: 9999, background: i <= 2 ? 'var(--black)' : 'var(--divider)', opacity: i < 2 ? 0.35 : 1, width: i === 2 ? 24 : 5 }} />)}
        </div>
        <button onClick={() => router.push('/onboarding/profile')} style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-3)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Skip</button>
      </div>

      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>Step 3 of 4</div>
        <h1 style={{ fontSize: 40, fontWeight: 900, lineHeight: '44px', letterSpacing: '-0.025em' }}>What&apos;s your situation<span style={{ color: 'var(--maple)' }}>?</span></h1>
        <p style={{ marginTop: 10, fontSize: 15, lineHeight: '24px', color: 'var(--ink-2)' }}>Pick a scenario or describe your own.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, margin: '20px 20px 0', background: 'var(--surface-alt)', borderRadius: 9999, padding: 4 }}>
        {(['preset', 'custom'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, height: 38, borderRadius: 9999, border: 'none', background: tab === t ? 'var(--surface)' : 'transparent', color: tab === t ? 'var(--ink)' : 'var(--ink-3)', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: tab === t ? 'var(--sh-card)' : 'none', transition: 'all 150ms ease' }}>
            {t === 'preset' ? 'Browse scenarios' : 'Describe mine'}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 20px' }}>
        {tab === 'preset' ? (
          <>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} viewBox="0 0 16 16" fill="none" width="16" height="16"><circle cx="7" cy="7" r="5" stroke="var(--ink-3)" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search situations…" style={{ width: '100%', height: 44, background: 'var(--surface-alt)', border: 'none', borderRadius: 9999, padding: '0 16px 0 40px', fontSize: 14, fontFamily: 'inherit', color: 'var(--ink)', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {filtered.map(p => (
                <div key={p.id} onClick={() => setSelectedPreset(p.id)} style={{ background: p.bg, borderRadius: 'var(--r-xl)', padding: '16px 14px', cursor: 'pointer', border: `2px solid ${selectedPreset === p.id ? 'var(--black)' : 'transparent'}`, boxShadow: selectedPreset === p.id ? 'var(--sh-float)' : 'none', transition: 'all 160ms var(--spring)', position: 'relative', minHeight: 108 }}>
                  {selectedPreset === p.id && <div style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: '50%', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg viewBox="0 0 10 10" fill="none" width="10" height="10"><path d="M1.5 5 3.8 7.5 8.5 2.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
                  <div style={{ fontSize: 28, lineHeight: 1, marginBottom: 10 }}>{p.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, lineHeight: '18px', color: 'var(--ink)' }}>{p.title}</div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-3)', marginTop: 2 }}>{p.category}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>Try one of these</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {HINT_CHIPS.map(h => (
                  <button key={h} onClick={() => setCustomText(h)} style={{ background: customText === h ? 'var(--black)' : 'var(--surface-alt)', border: '1.5px solid var(--divider)', borderRadius: 9999, padding: '7px 13px', fontSize: 13, fontWeight: 500, color: customText === h ? '#fff' : 'var(--ink-2)', cursor: 'pointer', fontFamily: 'inherit' }}>{h.slice(0, 30)}{h.length > 30 ? '…' : ''}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>Describe your situation</div>
              <textarea value={customText} onChange={e => setCustomText(e.target.value)} placeholder="e.g. I pick up my daughter from her French daycare every day and I want to talk to the staff about her day…" maxLength={400} style={{ width: '100%', minHeight: 140, background: 'var(--surface-alt)', border: `2px solid ${customText.length >= 10 ? 'var(--black)' : 'transparent'}`, borderRadius: 'var(--r-lg)', padding: 14, fontSize: 15, fontFamily: 'inherit', color: 'var(--ink)', resize: 'none', outline: 'none' }} />
              <div style={{ textAlign: 'right', fontSize: 12, color: customText.length >= 360 ? 'var(--coral)' : 'var(--ink-3)', marginTop: 4 }}>{customText.length} / 400</div>
            </div>
            <div style={{ background: 'var(--tile-yellow)', borderRadius: 'var(--r-md)', padding: '12px 14px', display: 'flex', gap: 10 }}>
              <span>✨</span>
              <span style={{ fontSize: 13, lineHeight: '20px', color: 'var(--ink-2)' }}><strong>AI will build your kit.</strong> Based on your description, we&apos;ll generate vocabulary, phrases, and cultural tips in everyday Québécois French.</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '12px 20px 36px', background: 'var(--surface)', boxShadow: '0 -1px 0 var(--divider)' }}>
        {canContinue && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-alt)', borderRadius: 'var(--r-lg)', padding: '10px 14px', marginBottom: 10 }}>
            <span>{tab === 'custom' ? '✨' : PRESETS.find(p => p.id === selectedPreset)?.emoji ?? '📍'}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)' }}>
              {tab === 'custom' ? customText.slice(0, 50) + (customText.length > 50 ? '…' : '') : PRESETS.find(p => p.id === selectedPreset)?.title}
            </span>
          </div>
        )}
        <button onClick={handleContinue} disabled={!canContinue} style={{ width: '100%', height: 56, background: canContinue ? 'var(--black)' : 'var(--ink-3)', color: '#fff', border: 'none', borderRadius: 9999, fontSize: 16, fontWeight: 700, fontFamily: 'inherit', cursor: canContinue ? 'pointer' : 'not-allowed', boxShadow: canContinue ? 'var(--sh-fab)' : 'none' }}>
          {tab === 'custom' ? 'Generate my kit with AI' : 'Build my learning kit'}
          {canContinue && ' →'}
        </button>
      </div>
    </div>
  )
}
