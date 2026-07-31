'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => {
    const msg = searchParams.get('message')
    if (msg === 'confirm') setInfo('Check your email and click the confirmation link, then sign in here.')
    if (searchParams.get('error')) setError('Authentication failed. Please try again.')
  }, [searchParams])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/'); router.refresh()
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
  }

  async function handleGuest() {
    document.cookie = 'allo_guest=true; path=/; max-age=2592000; SameSite=Lax; Secure'
    router.push('/onboarding/mode')
  }

  const S = {
    page: { minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '24px 20px', position: 'relative' as const, overflow: 'hidden' as const },
    blob1: { position: 'absolute' as const, top: -80, right: -60, width: 260, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.50)', filter: 'blur(4px)', pointerEvents: 'none' as const },
    blob2: { position: 'absolute' as const, bottom: -60, left: -80, width: 220, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', filter: 'blur(4px)', pointerEvents: 'none' as const },
    card: { background: 'var(--surface)', borderRadius: 32, boxShadow: 'var(--sh-lift)', padding: '36px 28px', width: '100%', maxWidth: 400, position: 'relative' as const, zIndex: 1 },
    logo: { textAlign: 'center' as const, marginBottom: 28 },
    logoText: { fontSize: 42, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1 },
    logoDot: { color: 'var(--primary)' },
    tagline: { fontSize: 14, color: 'var(--ink-3)', marginTop: 4, fontWeight: 600 },
    label: { fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--ink-3)', marginBottom: 6, display: 'block' },
    input: { width: '100%', height: 52, background: 'var(--bg)', border: '2px solid transparent', borderRadius: 'var(--r-lg)', padding: '0 16px', fontSize: 16, fontFamily: 'var(--font)', color: 'var(--ink)', outline: 'none', fontWeight: 600, transition: 'border-color 200ms ease' },
    btn: { width: '100%', height: 56, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontSize: 17, fontWeight: 800, fontFamily: 'var(--font)', cursor: 'pointer', boxShadow: 'var(--sh-fab)', marginTop: 8 },
    divRow: { display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' },
    divLine: { flex: 1, height: 1.5, background: 'rgba(86,204,242,0.20)', borderRadius: 2 },
    divText: { fontSize: 12, fontWeight: 700, color: 'var(--ink-3)' },
    gBtn: { width: '100%', height: 52, background: '#fff', border: '2px solid rgba(26,46,59,0.10)', borderRadius: 'var(--r-full)', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--ink)', boxShadow: 'var(--sh-card)' },
    guestBtn: { width: '100%', height: 52, background: 'transparent', border: '2px dashed rgba(86,204,242,0.40)', borderRadius: 'var(--r-full)', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--sky-dark)' },
    guestNote: { textAlign: 'center' as const, fontSize: 11, color: 'var(--ink-3)', marginTop: 8, lineHeight: '16px' },
    footer: { textAlign: 'center' as const, fontSize: 14, color: 'var(--ink-3)', marginTop: 20, fontWeight: 600 },
    link: { color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' },
    err: { background: 'var(--coral-light)', color: '#C2185B', padding: '12px 14px', borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 700, marginBottom: 14, borderLeft: '4px solid var(--coral)' },
    inf: { background: 'var(--sky-light)', color: 'var(--sky-dark)', padding: '12px 14px', borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 700, marginBottom: 14, borderLeft: '4px solid var(--sky)' },
  }

  return (
    <div style={S.page}>
      <div style={S.blob1} />
      <div style={S.blob2} />

      <div style={S.card}>
        <div style={S.logo}>
          {/* Option 5 logo — two overlapping speech bubbles */}
          <svg viewBox="0 0 240 72" fill="none" width="200" style={{ display: 'block', margin: '0 auto' }}>
            <rect x="0" y="0" width="36" height="28" rx="10" fill="#56CCF2"/>
            <polygon points="5,28 18,28 11,40" fill="#56CCF2"/>
            <rect x="18" y="22" width="36" height="28" rx="10" fill="#FF7043"/>
            <polygon points="37,50 50,50 43,62" fill="#FF7043"/>
            <text x="66" y="50" fontFamily="Nunito, sans-serif" fontWeight="900" fontSize="48" fill="#1A2E3B" letterSpacing="-1.5">Allo</text>
            <circle cx="232" cy="54" r="6" fill="#56CCF2"/>
          </svg>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ink-3)', marginTop: 10, textAlign: 'center' as const }}>
            LEARN FOR YOUR MOMENT
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 8, fontWeight: 600, textAlign: 'center' as const }}>Welcome back 👋</div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {info && <div style={S.inf}>📧 {info}</div>}
          {error && <div style={S.err}>{error}</div>}

          <div>
            <label style={S.label}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" style={S.input}
              onFocus={e => e.target.style.borderColor = 'var(--sky)'}
              onBlur={e => e.target.style.borderColor = 'transparent'} />
          </div>

          <div>
            <label style={S.label}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={S.input}
              onFocus={e => e.target.style.borderColor = 'var(--sky)'}
              onBlur={e => e.target.style.borderColor = 'transparent'} />
          </div>

          <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={S.divRow}>
          <div style={S.divLine} /><span style={S.divText}>or</span><div style={S.divLine} />
        </div>

        <button onClick={handleGoogle} style={S.gBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div style={{ ...S.divRow, marginTop: 12 }}>
          <div style={S.divLine} /><span style={S.divText}>or</span><div style={S.divLine} />
        </div>

        <button onClick={handleGuest} style={S.guestBtn}>
          <svg viewBox="0 0 20 20" fill="none" width="16" height="16"><path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="1.8"/><path d="M2 18c0-3.31 3.58-6 8-6s8 2.69 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          Try as Guest — no sign up needed
        </button>
        <div style={S.guestNote}>Full Buddy &amp; Flashcard access · Progress not saved</div>

        <p style={S.footer}>
          New here?{' '}
          <Link href="/signup" style={S.link}>Create free account</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}><div style={{ fontSize: 14, color: 'var(--ink-3)', fontFamily: 'var(--font)' }}>Loading…</div></div>}>
      <LoginForm />
    </Suspense>
  )
}
