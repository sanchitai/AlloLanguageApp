import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const PRESET_SCENARIOS = [
  { id: 'preset-daycare', title: 'French Daycare Pickup', category: 'daycare', emoji: '👶', desc: 'Talk to daycare staff about your child\'s day', cardCount: 28 },
  { id: 'preset-medical', title: 'Doctor\'s Appointment', category: 'medical', emoji: '🏥', desc: 'Navigate a medical visit in French', cardCount: 22 },
  { id: 'preset-work', title: 'First Day at Work', category: 'work', emoji: '💼', desc: 'Introduce yourself and navigate the workplace', cardCount: 24 },
  { id: 'preset-ptmeeting', title: 'Parent-Teacher Meeting', category: 'daycare', emoji: '🏫', desc: 'Discuss your child\'s progress with teachers', cardCount: 20 },
  { id: 'preset-pharmacy', title: 'Pharmacy Visit', category: 'medical', emoji: '💊', desc: 'Pick up prescriptions and ask about medications', cardCount: 18 },
  { id: 'preset-neighbours', title: 'Chatting with Neighbours', category: 'social', emoji: '🏠', desc: 'Small talk with your Quebec neighbours', cardCount: 16 },
  { id: 'preset-restaurant', title: 'Restaurant Ordering', category: 'food', emoji: '🍽️', desc: 'Order food and handle special requests', cardCount: 20 },
  { id: 'preset-grocery', title: 'Grocery Shopping', category: 'food', emoji: '🛒', desc: 'Navigate a French grocery store', cardCount: 15 },
  { id: 'preset-transit', title: 'Public Transit', category: 'transport', emoji: '🚌', desc: 'Take the bus or metro in Montreal', cardCount: 14 },
  { id: 'preset-bank', title: 'Bank Appointment', category: 'services', emoji: '🏦', desc: 'Handle banking transactions in French', cardCount: 18 },
  { id: 'preset-birthday', title: 'Children\'s Birthday Party', category: 'social', emoji: '🎉', desc: 'Socialise at a Quebec kids\' birthday party', cardCount: 14 },
  { id: 'preset-airport', title: 'Airport & Travel', category: 'transport', emoji: '✈️', desc: 'Navigate airports and travel in French Canada', cardCount: 16 },
]

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

export default async function ScenariosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: scenariosData } = await supabase
    .from('scenarios')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })

  const myScenarios = scenariosData as Array<{ id: string; title: string; category: string; item_count: number }> | null

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', padding: '14px 20px 16px', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid var(--divider)' }}>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em' }}>
          Scenarios<span style={{ color: 'var(--maple)' }}>.</span>
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 4 }}>Choose a situation or create your own</div>
      </div>

      <div style={{ padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Generate custom */}
        <Link href="/onboarding/situation" style={{
          background: 'var(--black)', borderRadius: 'var(--r-xl)', padding: '18px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: 'var(--sh-lift)', textDecoration: 'none',
        }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--r-lg)', background: 'var(--maple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>✨</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>Generate custom scenario</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.50)', marginTop: 2 }}>Describe your situation — AI builds your kit</div>
          </div>
          <svg viewBox="0 0 14 14" fill="none" width="16" height="16"><path d="M3 7h8M8 4l3 3-3 3" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>

        {/* My scenarios */}
        {myScenarios && myScenarios.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>My Scenarios</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myScenarios.map(s => {
                const col = CATEGORY_COLORS[s.category] ?? CATEGORY_COLORS.custom
                return (
                  <Link key={s.id} href={`/scenario/${s.id}`} style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: 'var(--sh-card)', textDecoration: 'none' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 'var(--r-lg)', background: col.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>✨</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{s.item_count} cards · Custom</div>
                    </div>
                    <svg viewBox="0 0 14 14" fill="none" width="14" height="14"><path d="M3 7h8M8 4l3 3-3 3" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Preset scenarios */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>All Situations</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {PRESET_SCENARIOS.map(s => {
              const col = CATEGORY_COLORS[s.category] ?? CATEGORY_COLORS.custom
              return (
                <Link key={s.id} href={`/scenario/${s.id}`} style={{ background: col.bg, borderRadius: 'var(--r-xl)', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10, textDecoration: 'none', minHeight: 120 }}>
                  <div style={{ fontSize: 28, lineHeight: 1 }}>{s.emoji}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', lineHeight: '18px' }}>{s.title}</div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: col.ink, marginTop: 2 }}>{s.cardCount} cards</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
