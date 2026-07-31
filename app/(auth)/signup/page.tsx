'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { display_name: name }, emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    })
    if (error) { setError(error.message || 'Signup failed. Please try again.'); setLoading(false); return }
    if (data.user) {
      if (!data.session) { router.push('/login?message=confirm'); return }
      router.push('/onboarding/mode'); router.refresh()
    } else { setError('Something went wrong. Please try again.'); setLoading(false) }
  }

  async function handleGuest() {
    document.cookie = 'allo_guest=true; path=/; max-age=2592000'
    router.push('/onboarding/mode')
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/api/auth/callback` } })
  }

  const S = {
    page: { minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '24px 20px', position: 'relative' as const, overflow: 'hidden' as const },
    blob1: { position: 'absolute' as const, top: -80, right: -60, width: 260, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.50)', filter: 'blur(4px)', pointerEvents: 'none' as const },
    blob2: { position: 'absolute' as const, bottom: -60, left: -80, width: 220, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', filter: 'blur(4px)', pointerEvents: 'none' as const },
    card: { background: 'var(--surface)', borderRadius: 32, boxShadow: 'var(--sh-lift)', padding: '32px 28px', width: '100%', maxWidth: 400, position: 'relative' as const, zIndex: 1 },
    logo: { textAlign: 'center' as const, marginBottom: 24 },
    label: { fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--ink-3)', marginBottom: 6, display: 'block' },
    input: { width: '100%', height: 52, background: 'var(--bg)', border: '2px solid transparent', borderRadius: 'var(--r-lg)', padding: '0 16px', fontSize: 16, fontFamily: 'var(--font)', color: 'var(--ink)', outline: 'none', fontWeight: 600 },
    btn: { width: '100%', height: 56, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--r-full)', fontSize: 17, fontWeight: 800, fontFamily: 'var(--font)', cursor: 'pointer', boxShadow: 'var(--sh-fab)', marginTop: 8 },
    divRow: { display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0' },
    divLine: { flex: 1, height: 1.5, background: 'rgba(86,204,242,0.20)', borderRadius: 2 },
    divText: { fontSize: 12, fontWeight: 700, color: 'var(--ink-3)' },
    gBtn: { width: '100%', height: 52, background: '#fff', border: '2px solid rgba(26,46,59,0.10)', borderRadius: 'var(--r-full)', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--ink)', boxShadow: 'var(--sh-card)' },
    guestBtn: { width: '100%', height: 50, background: 'transparent', border: '2px dashed rgba(86,204,242,0.40)', borderRadius: 'var(--r-full)', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--sky-dark)' },
  }

  return (
    <div style={S.page}>
      <div style={S.blob1} /><div style={S.blob2} />
      <div style={S.card}>
        <div style={S.logo}>
          <div style={{ fontSize: 42, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            Allo<span style={{ color: 'var(--primary)' }}>.</span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 4, fontWeight: 600 }}>Create your account</div>
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {error && <div style={{ background: 'var(--coral-light)', color: '#C2185B', padding: '12px 14px', borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 700, borderLeft: '4px solid var(--coral)' }}>{error}</div>}
          {[
            { label: 'Your name', type: 'text', value: name, set: setName, placeholder: 'Maria' },
            { label: 'Email', type: 'email', value: email, set: setEmail, placeholder: 'you@example.com' },
            { label: 'Password', type: 'password', value: password, set: setPassword, placeholder: '8+ characters' },
          ].map(f => (
            <div key={f.label}>
              <label style={S.label}>{f.label}</label>
              <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} required minLength={f.type === 'password' ? 8 : undefined} placeholder={f.placeholder} style={S.input}
                onFocus={e => e.target.style.borderColor = 'var(--sky)'}
                onBlur={e => e.target.style.borderColor = 'transparent'} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div style={S.divRow}><div style={S.divLine} /><span style={S.divText}>or</span><div style={S.divLine} /></div>
        <button onClick={handleGoogle} style={S.gBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
        <div style={{ ...S.divRow, marginTop: 12 }}><div style={S.divLine} /><span style={S.divText}>or</span><div style={S.divLine} /></div>
        <button onClick={handleGuest} style={S.guestBtn}>
          <svg viewBox="0 0 20 20" fill="none" width="16" height="16"><path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="1.8"/><path d="M2 18c0-3.31 3.58-6 8-6s8 2.69 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          Try as Guest — no sign up needed
        </button>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink-3)', marginTop: 8 }}>Full Buddy &amp; Flashcard access · Progress not saved</div>
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--ink-3)', marginTop: 18, fontWeight: 600 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
