import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const PRESET_SCENARIOS: Record<string, { title: string; emoji: string; category: string; desc: string }> = {
  'preset-daycare':   { title: 'French Daycare Pickup', emoji: '👶', category: 'daycare', desc: 'Talk to daycare staff about your child\'s day' },
  'preset-medical':   { title: 'Doctor\'s Appointment', emoji: '🏥', category: 'medical', desc: 'Navigate a medical visit in French' },
  'preset-work':      { title: 'First Day at Work', emoji: '💼', category: 'work', desc: 'Introduce yourself and navigate the workplace' },
  'preset-ptmeeting': { title: 'Parent-Teacher Meeting', emoji: '🏫', category: 'daycare', desc: 'Discuss your child\'s progress' },
  'preset-pharmacy':  { title: 'Pharmacy Visit', emoji: '💊', category: 'medical', desc: 'Pick up prescriptions' },
  'preset-neighbours':{ title: 'Chatting with Neighbours', emoji: '🏠', category: 'social', desc: 'Small talk with Quebec neighbours' },
  'preset-restaurant':{ title: 'Restaurant Ordering', emoji: '🍽️', category: 'food', desc: 'Order food in French' },
  'preset-grocery':   { title: 'Grocery Shopping', emoji: '🛒', category: 'food', desc: 'Navigate a French grocery store' },
  'preset-transit':   { title: 'Public Transit', emoji: '🚌', category: 'transport', desc: 'Take the bus or metro' },
  'preset-bank':      { title: 'Bank Appointment', emoji: '🏦', category: 'services', desc: 'Handle banking in French' },
  'preset-birthday':  { title: 'Birthday Party', emoji: '🎉', category: 'social', desc: 'Socialise at a Quebec party' },
  'preset-airport':   { title: 'Airport & Travel', emoji: '✈️', category: 'transport', desc: 'Navigate airports in French Canada' },
}

const CATEGORY_COLORS: Record<string, { bg: string; ink: string }> = {
  daycare:   { bg: '#DCEEFB', ink: '#1A5FA8' },
  medical:   { bg: '#FDE8EF', ink: '#B03060' },
  work:      { bg: '#FEF7D0', ink: '#A07A10' },
  social:    { bg: '#D8F5E8', ink: '#1A6B45' },
  food:      { bg: '#FEEBD0', ink: '#B05A10' },
  transport: { bg: '#D0F4F4', ink: '#1A7A7A' },
  services:  { bg: '#EBEBEB', ink: '#5A5A5A' },
  custom:    { bg: '#EDE8FB', ink: '#5B3DAA' },
}

export default async function ScenarioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Try preset first
  const preset = PRESET_SCENARIOS[id]

  if (!preset && !id.match(/^[0-9a-f-]{36}$/)) {
    notFound()
  }

  let scenario = preset ? { id, ...preset, item_count: 28 } : null
  let content: Array<{ id: string; content_type: string; target_text: string; native_text: string; pronunciation: string | null; example_sentence: string | null; example_translation: string | null; difficulty: string | null; metadata: Record<string, unknown> }> = []

  if (!preset) {
    const supabase = await createClient()
    const { data: scenarioData } = await supabase.from('scenarios').select('*').eq('id', id).single()
    if (!scenarioData) notFound()
    const data = scenarioData as { id: string; title: string; description: string | null; category: string; item_count: number }
    scenario = { ...data, emoji: '✨', desc: data.description ?? '' }

    const { data: items } = await supabase
      .from('generated_content')
      .select('*')
      .eq('scenario_id', id)
      .order('sort_order')
    content = (items ?? []) as typeof content
  }

  if (!scenario) notFound()

  const col = CATEGORY_COLORS[(scenario as { category: string }).category] ?? CATEGORY_COLORS.custom

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%' }}>
      {/* Hero */}
      <div style={{ background: col.bg, padding: '60px 24px 28px', position: 'relative' }}>
        <Link href="/scenarios" style={{ position: 'absolute', top: 14, left: 20, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          <svg viewBox="0 0 18 18" fill="none" width="18" height="18"><path d="M11 4L6 9l5 5" stroke="var(--ink-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.50)', borderRadius: 9999, padding: '4px 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: col.ink, marginBottom: 12 }}>
          {(scenario as { emoji: string }).emoji} {(scenario as { category: string }).category}
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: '38px', color: 'var(--ink)' }}>{scenario.title}</h1>
        <p style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 8 }}>{scenario.item_count} words &amp; phrases to help you communicate confidently</p>
        <div style={{ marginTop: 16, height: 5, background: 'rgba(255,255,255,0.40)', borderRadius: 9999, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: col.ink, opacity: 0.6, borderRadius: 9999, width: '43%' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: col.ink, marginTop: 5 }}>
          <span>12 of {scenario.item_count} learned</span><span>43%</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 16px 100px' }}>
        {content.length === 0 ? (
          // Preset placeholder
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', padding: 24, boxShadow: 'var(--sh-card)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
            <div style={{ fontSize: 48 }}>{(scenario as { emoji: string }).emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Ready to start?</div>
            <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: '22px' }}>This scenario has {scenario.item_count} vocabulary words, phrases, emergency expressions, and cultural tips for Quebec.</div>
            <Link href={`/flashcards/${id}`} style={{ width: '100%', height: 52, background: 'var(--black)', color: '#fff', borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: 'var(--sh-fab)' }}>
              Start Flashcards →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {content.map(item => (
              <div key={item.id} style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', padding: 16, boxShadow: 'var(--sh-card)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{item.target_text}</div>
                  {item.difficulty && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 9999, background: item.difficulty === 'basic' ? 'var(--tile-green)' : 'var(--tile-yellow)', color: item.difficulty === 'basic' ? 'var(--tile-green-ink)' : 'var(--tile-yellow-ink)', flexShrink: 0, marginLeft: 8 }}>{item.difficulty}</span>}
                </div>
                <div style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: item.pronunciation ? 8 : 0 }}>{item.native_text}</div>
                {item.pronunciation && <div style={{ fontSize: 13, color: 'var(--ink-3)', fontFamily: 'monospace', letterSpacing: '0.04em' }}>🗣 {item.pronunciation}</div>}
                {item.example_sentence && <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 8, fontStyle: 'italic' }}>&ldquo;{item.example_sentence}&rdquo;</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div style={{ position: 'fixed', bottom: 72, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: 'var(--surface)', borderTop: '1px solid var(--divider)', padding: '12px 16px 14px', zIndex: 15 }}>
        <Link href={`/flashcards/${id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 56, background: 'var(--black)', color: '#fff', borderRadius: 9999, fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: 'var(--sh-fab)' }}>
          Start Flashcards →
        </Link>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>{scenario.item_count} cards · Québécois French</div>
      </div>
    </div>
  )
}
