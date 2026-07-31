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
    if (msg === 'confirm') {
      setInfo('Check your email and click the confirmation link to activate your account, then sign in here.')
    }
    if (searchParams.get('error')) {
      setError('Authentication failed. Please try again.')
    }
  }, [searchParams])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
  }

  async function handleGuest() {
    // Set guest cookie and go straight to onboarding
    document.cookie = 'allo_guest=true; path=/; max-age=2592000' // 30 days
    router.push('/onboarding/mode')
  }

  return (
    <div className="shell">
      {/* Status bar */}
      <div style={{ background: 'var(--surface)', padding: '14px 20px 0', display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 600 }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 22 12" fill="none"><rect x="0.5" y="0.5" width="19" height="11" rx="3.5" stroke="currentColor"/><rect x="2" y="2" width="14" height="8" rx="2" fill="currentColor"/></svg>
        </div>
      </div>

      <div style={{ flex: 1, padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Logo */}
        <div>
          <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1 }}>
            Allo<span style={{ color: 'var(--maple)' }}>.</span>
          </div>
          <div style={{ fontSize: 16, color: 'var(--ink-2)', marginTop: 8 }}>Welcome back</div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {info && (
            <div style={{ background: 'var(--tile-blue)', color: 'var(--tile-blue-ink)', padding: '12px 16px', borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 500, lineHeight: '20px' }}>
              📧 {info}
            </div>
          )}
          {error && (
            <div style={{ background: 'var(--tile-pink)', color: 'var(--tile-pink-ink)', padding: '12px 16px', borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 500 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{ height: 52, background: 'var(--surface-alt)', border: '2px solid transparent', borderRadius: 'var(--r-lg)', padding: '0 16px', fontSize: 16, fontFamily: 'inherit', color: 'var(--ink)', outline: 'none', transition: 'border-color 200ms ease' }}
              onFocus={e => e.target.style.borderColor = 'var(--black)'}
              onBlur={e => e.target.style.borderColor = 'transparent'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{ height: 52, background: 'var(--surface-alt)', border: '2px solid transparent', borderRadius: 'var(--r-lg)', padding: '0 16px', fontSize: 16, fontFamily: 'inherit', color: 'var(--ink)', outline: 'none', transition: 'border-color 200ms ease' }}
              onFocus={e => e.target.style.borderColor = 'var(--black)'}
              onBlur={e => e.target.style.borderColor = 'transparent'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ height: 56, background: loading ? 'var(--ink-3)' : 'var(--black)', color: 'var(--ink-inv)', border: 'none', borderRadius: 'var(--r-full)', fontSize: 16, fontWeight: 700, fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: 'var(--sh-fab)', transition: 'transform 160ms var(--spring)', marginTop: 8 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
          <span style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 600 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
        </div>

        <button
          onClick={handleGoogle}
          style={{ height: 52, background: 'var(--surface)', border: '2px solid var(--divider)', borderRadius: 'var(--r-full)', fontSize: 15, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--ink)', boxShadow: 'var(--sh-card)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        {/* Guest mode separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
          <span style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 600 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
        </div>

        <button
          onClick={handleGuest}
          style={{ height: 52, background: 'var(--surface-alt)', border: '1.5px dashed var(--divider)', borderRadius: 'var(--r-full)', fontSize: 15, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--ink-2)' }}
        >
          <svg viewBox="0 0 20 20" fill="none" width="18" height="18"><path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="1.5"/><path d="M2 18c0-3.31 3.58-6 8-6s8 2.69 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Try as Guest — no sign up needed
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-3)', lineHeight: '18px' }}>
          Guest mode: full access to Buddy &amp; Flashcards.<br/>Progress and profile not saved.
        </p>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--ink-3)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: 'var(--ink)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2 }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ fontSize: 14, color: 'var(--ink-3)' }}>Loading…</div></div>}>
      <LoginForm />
    </Suspense>
  )
}
