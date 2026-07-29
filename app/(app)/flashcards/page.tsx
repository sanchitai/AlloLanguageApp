import Link from 'next/link'

export default function FlashcardsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', padding: 24, textAlign: 'center', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🃏</div>
      <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em' }}>Flashcards</div>
      <div style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: '24px' }}>Select a scenario first to start practising flashcards.</div>
      <Link href="/scenarios" style={{ height: 48, background: 'var(--black)', color: '#fff', borderRadius: 9999, padding: '0 24px', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: 'var(--sh-fab)' }}>Browse scenarios</Link>
    </div>
  )
}
