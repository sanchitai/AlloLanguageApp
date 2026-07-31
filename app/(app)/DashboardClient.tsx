'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type Scenario = Database['public']['Tables']['scenarios']['Row']

const CATEGORY_COLORS: Record<string, { bg: string; ink: string; emoji: string }> = {
  daycare:   { bg: '#E1F5FE', ink: '#0288D1', emoji: '👶' },
  medical:   { bg: '#FCE4EC', ink: '#C2185B', emoji: '🏥' },
  work:      { bg: '#FFF8E1', ink: '#F57F17', emoji: '💼' },
  social:    { bg: '#E8F5E9', ink: '#2E7D32', emoji: '🏠' },
  food:      { bg: '#FFF3E0', ink: '#E65100', emoji: '🍽️' },
  transport: { bg: '#E0F7FA', ink: '#00695C', emoji: '🚌' },
  services:  { bg: '#F3E5F5', ink: '#6A1B9A', emoji: '🔧' },
  custom:    { bg: '#EDE7FF', ink: '#4527A0', emoji: '✨' },
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bonjour'
  if (h < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

export default function DashboardClient({ profile, scenarios, learnedCount, isGuest = false }: {
  profile: Profile; scenarios: Scenario[]; learnedCount: number; isGuest?: boolean
}) {
  const ringRef = useRef<SVGCircleElement>(null)
  const firstName = profile.display_name?.split(' ')[0] ?? 'there'
  const dailyDone = learnedCount % (profile.daily_goal || 10)
  const dailyPct = Math.min((dailyDone / (profile.daily_goal || 10)) * 100, 100)

  useEffect(() => {
    const circ = 2 * Math.PI * 24
    if (ringRef.current) {
      setTimeout(() => {
        if (ringRef.current) {
          ringRef.current.style.strokeDashoffset = String(circ - (dailyPct / 100) * circ)
        }
      }, 400)
    }
  }, [dailyPct])

  const activeScenario = scenarios[0]

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg)' }}>

      {/* Sky header */}
      <div style={{
        background: 'linear-gradient(160deg, #C8E8FF 0%, #D8F0FF 60%, #EEF7FF 100%)',
        padding: '52px 20px 28px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Cloud blobs */}
        <div style={{ position: 'absolute', top: -50, right: -40, width: 220, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.50)', filter: 'blur(3px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 20, left: -60, width: 180, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', filter: 'blur(3px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(26,46,59,0.55)', marginBottom: 4 }}>{getGreeting()},</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: '34px' }}>
              {isGuest ? 'Welcome to Allo' : firstName + '!'}
            </div>
            <div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 4, fontWeight: 600 }}>
              {isGuest ? 'Try it out — no account needed' : 'Ready to practice today?'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Streak */}
            {!isGuest && (
              <Link href="/profile" style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(255,255,255,0.80)', borderRadius: 'var(--r-full)',
                padding: '6px 12px', textDecoration: 'none',
                boxShadow: '0 2px 10px rgba(26,46,59,0.08)',
              }}>
                <span style={{ fontSize: 16 }}>🔥</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>{profile.streak_days}</span>
              </Link>
            )}
            {/* XP */}
            {!isGuest && (
              <Link href="/profile" style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(255,255,255,0.80)', borderRadius: 'var(--r-full)',
                padding: '6px 12px', textDecoration: 'none',
                boxShadow: '0 2px 10px rgba(26,46,59,0.08)',
              }}>
                <span style={{ fontSize: 14 }}>⚡</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>{profile.xp_total}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Guest banner */}
        {isGuest && (
          <div style={{ position: 'relative', zIndex: 1, marginTop: 16, background: 'rgba(255,255,255,0.85)', borderRadius: 'var(--r-lg)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'var(--sh-card)' }}>
            <span style={{ fontSize: 20 }}>👋</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)' }}>You&apos;re in Guest Mode</div>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 1 }}>Progress won&apos;t be saved</div>
            </div>
            <a href="/signup" style={{ background: 'var(--primary)', color: '#fff', borderRadius: 'var(--r-full)', padding: '6px 14px', fontSize: 12, fontWeight: 800, textDecoration: 'none', boxShadow: 'var(--sh-fab)', whiteSpace: 'nowrap' }}>Sign up free</a>
          </div>
        )}
      </div>

      {/* Feed */}
      <div style={{ padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Daily goal + continue row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'stretch' }}>

          {/* Continue card */}
          {activeScenario ? (
            <Link href={`/scenario/${activeScenario.id}`} style={{
              background: 'var(--surface)', borderRadius: 'var(--r-xl)',
              padding: 20, display: 'flex', flexDirection: 'column', gap: 10,
              boxShadow: 'var(--sh-float)', textDecoration: 'none',
              borderLeft: '4px solid var(--sky)',
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sky-dark)' }}>Continue Learning</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--ink)', lineHeight: '22px' }}>{activeScenario.title}</div>
              <div>
                <div style={{ height: 6, background: 'var(--sky-light)', borderRadius: 9999, overflow: 'hidden', marginBottom: 5 }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--sky) 0%, var(--primary) 100%)', borderRadius: 9999, width: '43%' }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 700 }}>43% complete</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--primary)', color: '#fff', borderRadius: 9999, padding: '7px 14px', fontSize: 13, fontWeight: 800, alignSelf: 'flex-start', boxShadow: 'var(--sh-fab)' }}>
                Resume →
              </div>
            </Link>
          ) : (
            <Link href="/onboarding/situation" style={{
              background: 'linear-gradient(145deg, var(--sky) 0%, var(--primary) 100%)',
              borderRadius: 'var(--r-xl)', padding: 20,
              display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center',
              boxShadow: 'var(--sh-lift)', textDecoration: 'none',
            }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', lineHeight: '22px' }}>Start your first scenario</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>Tell us your situation — AI builds your kit</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.25)', color: '#fff', borderRadius: 9999, padding: '7px 14px', fontSize: 13, fontWeight: 800, alignSelf: 'flex-start' }}>
                Get started →
              </div>
            </Link>
          )}

          {/* Goal ring */}
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', padding: '14px 10px', boxShadow: 'var(--sh-card)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, justifyContent: 'center', minWidth: 88 }}>
            <div style={{ position: 'relative', width: 60, height: 60 }}>
              <svg width="60" height="60" viewBox="0 0 60 60" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="30" cy="30" r="24" fill="none" stroke="var(--sky-light)" strokeWidth="5" />
                <circle ref={ringRef} cx="30" cy="30" r="24" fill="none"
                  stroke="url(#ringGrad)" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={String(2 * Math.PI * 24)}
                  strokeDashoffset={String(2 * Math.PI * 24)}
                  style={{ transition: 'stroke-dashoffset 800ms var(--ease-out)' }}
                />
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--sky)" />
                    <stop offset="100%" stopColor="var(--primary)" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--ink)' }}>{Math.round(dailyPct)}%</span>
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-2)', textAlign: 'center', lineHeight: '15px' }}>
              {dailyDone} of {profile.daily_goal || 10}<br />today
            </div>
          </div>
        </div>

        {/* Buddy shortcut */}
        <Link href="/buddy" style={{
          background: 'linear-gradient(135deg, #E8F7FD 0%, #EEF0FF 100%)',
          borderRadius: 'var(--r-xl)', padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: 'var(--sh-card)', textDecoration: 'none',
          border: '1.5px solid rgba(86,204,242,0.20)',
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'rgba(86,204,242,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🗣️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}>Buddy Mode</div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 1, fontWeight: 600 }}>Translate &amp; speak phrases out loud</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--sky)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--sh-sky)' }}>
            <svg viewBox="0 0 14 14" fill="none" width="12" height="12"><path d="M3 7h8M8 4l3 3-3 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </Link>

        {/* Quick actions */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>Quick Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Link href="/onboarding/situation" style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10, textDecoration: 'none', boxShadow: 'var(--sh-card)', minHeight: 110 }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--r-md)', background: 'var(--sky-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 20 20" fill="none" width="18" height="18"><path d="M10 4v12M4 10h12" stroke="var(--sky-dark)" strokeWidth="2.2" strokeLinecap="round"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>New Scenario</div>
                <div style={{ fontSize: 11, color: 'var(--sky-dark)', marginTop: 2, fontWeight: 700 }}>AI-generated</div>
              </div>
            </Link>

            <Link href="/flashcards/current" style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10, textDecoration: 'none', boxShadow: 'var(--sh-card)', minHeight: 110 }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--r-md)', background: 'var(--purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 20 20" fill="none" width="18" height="18"><rect x="3" y="5" width="14" height="10" rx="3" stroke="var(--purple)" strokeWidth="1.8"/><path d="M8 8.5l4 1.5-4 1.5V8.5z" fill="var(--purple)"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>Practice</div>
                <div style={{ fontSize: 11, color: 'var(--purple)', marginTop: 2, fontWeight: 700 }}>Flashcards</div>
              </div>
            </Link>
          </div>
        </div>

        {/* My scenarios */}
        {scenarios.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>My Scenarios</div>
              <Link href="/scenarios" style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)', textDecoration: 'none' }}>See all</Link>
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none', marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16, paddingBottom: 4 }}>
              {scenarios.slice(0, 5).map(s => {
                const col = CATEGORY_COLORS[s.category] ?? CATEGORY_COLORS.custom
                return (
                  <Link key={s.id} href={`/scenario/${s.id}`} style={{
                    width: 140, background: 'var(--surface)', borderRadius: 'var(--r-xl)',
                    padding: '14px 12px', boxShadow: 'var(--sh-card)',
                    flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8,
                    textDecoration: 'none',
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: col.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{col.emoji}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', lineHeight: '16px' }}>{s.title}</div>
                    <div style={{ height: 4, background: 'var(--bg)', borderRadius: 9999 }}>
                      <div style={{ height: '100%', background: col.ink, borderRadius: 9999, width: '40%', opacity: 0.7 }} />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* XP Banner */}
        {!isGuest && (
          <Link href="/profile" style={{
            background: 'linear-gradient(135deg, var(--purple) 0%, #B44DFF 100%)',
            borderRadius: 'var(--r-xl)', padding: '16px 18px',
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: '0 6px 24px rgba(123,97,255,0.30)', textDecoration: 'none',
          }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>⭐</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: 3 }}>Total XP</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{profile.xp_total.toLocaleString()} points</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.20)', color: '#fff', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 800 }}>View →</div>
          </Link>
        )}

      </div>
    </div>
  )
}
