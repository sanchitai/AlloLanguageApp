'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type Scenario = Database['public']['Tables']['scenarios']['Row']

const CATEGORY_COLORS: Record<string, { bg: string; ink: string }> = {
  daycare:     { bg: '#DCEEFB', ink: '#1A5FA8' },
  medical:     { bg: '#FDE8EF', ink: '#B03060' },
  work:        { bg: '#FEF7D0', ink: '#A07A10' },
  social:      { bg: '#D8F5E8', ink: '#1A6B45' },
  food:        { bg: '#FEEBD0', ink: '#B05A10' },
  transport:   { bg: '#D0F4F4', ink: '#1A7A7A' },
  services:    { bg: '#EBEBEB', ink: '#5A5A5A' },
  custom:      { bg: '#EDE8FB', ink: '#5B3DAA' },
}

const CATEGORY_EMOJI: Record<string, string> = {
  daycare: '👶', medical: '🏥', work: '💼', social: '🏠',
  food: '🍽️', transport: '🚌', services: '🔧', custom: '✨',
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardClient({ profile, scenarios, learnedCount, isGuest = false }: {
  profile: Profile
  scenarios: Scenario[]
  learnedCount: number
  isGuest?: boolean
}) {
  const ringRef = useRef<SVGCircleElement>(null)
  const today = new Date().toLocaleDateString('en-CA')
  const isStreakToday = profile.streak_last_date === today

  // Animate goal ring on mount
  useEffect(() => {
    const target = Math.min((profile.daily_goal > 0 ? (learnedCount % profile.daily_goal) / profile.daily_goal : 0), 1)
    const circ = 2 * Math.PI * 27
    if (ringRef.current) {
      setTimeout(() => {
        if (ringRef.current) {
          ringRef.current.style.strokeDashoffset = String(circ - target * circ)
        }
      }, 400)
    }
  }, [learnedCount, profile.daily_goal])

  const activeScenario = scenarios[0]
  const firstName = profile.display_name?.split(' ')[0] ?? 'there'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%' }}>

      {/* Status bar */}
      <div style={{ background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px 0', fontSize: 15, fontWeight: 600, position: 'sticky', top: 0, zIndex: 10 }}>
        <span>{new Date().toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><rect x="0" y="9" width="2.5" height="7" rx="1" fill="currentColor"/><rect x="4" y="6" width="2.5" height="10" rx="1" fill="currentColor"/><rect x="8" y="3" width="2.5" height="13" rx="1" fill="currentColor"/></svg>
          <svg viewBox="0 0 22 12" fill="none" width="20" height="12"><rect x="0.5" y="0.5" width="19" height="11" rx="3.5" stroke="currentColor"/><rect x="2" y="2" width="14" height="8" rx="2" fill="currentColor"/></svg>
        </div>
      </div>

      {/* Top bar */}
      <div style={{ background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 14px', position: 'sticky', top: 44, zIndex: 10 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{getGreeting()}</div>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: '32px' }}>
            Bonjour, {firstName}<span style={{ color: 'var(--maple)' }}>.</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/profile" style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'var(--tile-yellow)', borderRadius: 'var(--r-full)',
            padding: '6px 12px', fontSize: 13, fontWeight: 700,
            color: 'var(--tile-yellow-ink)', textDecoration: 'none',
            boxShadow: 'var(--sh-card)',
          }}>
            <span>🔥</span><span>{profile.streak_days}</span>
          </Link>
          <Link href="/profile" style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'var(--tile-blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--sh-card)', textDecoration: 'none',
          }}>
            <svg viewBox="0 0 22 22" fill="none" width="22" height="22">
              <circle cx="11" cy="7" r="4" fill="#3A7FC1" opacity="0.85"/>
              <path d="M3 20c0-4.42 3.58-8 8-8s8 3.58 8 8" fill="#3A7FC1" opacity="0.5"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Feed */}
      <div style={{ padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Guest banner */}
        {isGuest && (
          <div style={{ background: 'var(--tile-yellow)', borderRadius: 'var(--r-xl)', padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center', border: '1.5px solid rgba(245,158,11,0.20)' }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>👋</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tile-yellow-ink)' }}>You&apos;re using Guest Mode</div>
              <div style={{ fontSize: 12, color: 'var(--tile-yellow-ink)', marginTop: 2, opacity: 0.8 }}>Progress won&apos;t be saved. Create a free account to unlock streaks, saved scenarios, and your profile.</div>
            </div>
            <a href="/signup" style={{ background: 'var(--maple)', color: '#fff', borderRadius: 'var(--r-full)', padding: '7px 14px', fontSize: 12, fontWeight: 700, textDecoration: 'none', flexShrink: 0, boxShadow: '0 3px 10px rgba(245,158,11,0.35)' }}>Sign up free</a>
          </div>
        )}

        {/* Hero row: Continue Learning + Goal Ring */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'stretch' }}>

          {/* Continue Learning */}
          {activeScenario ? (
            <Link href={`/scenario/${activeScenario.id}`} style={{
              background: 'linear-gradient(145deg, #4158D0, #3A7BD5 60%, #2563EB)',
              borderRadius: 'var(--r-xl)', padding: 20,
              display: 'flex', flexDirection: 'column', gap: 12,
              boxShadow: '0 10px 40px rgba(65,88,208,0.30)',
              textDecoration: 'none', position: 'relative', overflow: 'hidden',
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.60)' }}>Continue Learning</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.20)', borderRadius: 9999, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>
                  {CATEGORY_EMOJI[activeScenario.category] ?? '📚'} {activeScenario.category}
                </div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.015em', color: '#fff' }}>{activeScenario.title}</div>
              <div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.18)', borderRadius: 9999, overflow: 'hidden', marginBottom: 5 }}>
                  <div style={{ height: '100%', background: '#fff', borderRadius: 9999, width: '43%', opacity: 0.9 }} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>43% learned</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', color: '#2563EB', borderRadius: 9999, padding: '8px 14px', fontSize: 13, fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                  Resume <svg viewBox="0 0 14 14" fill="none" width="14" height="14"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </Link>
          ) : (
            <Link href="/onboarding/situation" style={{
              background: 'linear-gradient(145deg, #4158D0, #2563EB)',
              borderRadius: 'var(--r-xl)', padding: 20,
              display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(65,88,208,0.30)', textDecoration: 'none',
            }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>Start your first scenario</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>Tell us your situation and we&apos;ll build your learning kit</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', color: '#2563EB', borderRadius: 9999, padding: '8px 14px', fontSize: 13, fontWeight: 700, alignSelf: 'flex-start' }}>
                Get started →
              </div>
            </Link>
          )}

          {/* Goal ring */}
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-xl)', padding: '16px 12px', boxShadow: 'var(--sh-card)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, justifyContent: 'center', minWidth: 92 }}>
            <div style={{ position: 'relative', width: 64, height: 64 }}>
              <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="32" cy="32" r="27" fill="none" stroke="var(--divider)" strokeWidth="5" />
                <circle ref={ringRef} cx="32" cy="32" r="27" fill="none"
                  stroke="var(--success)" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={String(2 * Math.PI * 27)}
                  strokeDashoffset={String(2 * Math.PI * 27)}
                  style={{ transition: 'stroke-dashoffset 800ms var(--ease-out)' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 900 }}>
                  {profile.daily_goal > 0 ? Math.round(((learnedCount % profile.daily_goal) / profile.daily_goal) * 100) : 0}%
                </span>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Today</span>
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-2)', textAlign: 'center' }}>
              {learnedCount % (profile.daily_goal || 10)} of {profile.daily_goal || 10}<br />cards
            </div>
          </div>
        </div>

        {/* Buddy banner */}
        <Link href="/buddy" style={{
          background: 'var(--tile-green)', borderRadius: 'var(--r-xl)', padding: '16px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
          border: '2px solid rgba(26,107,69,0.15)', textDecoration: 'none',
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'rgba(26,107,69,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🗣️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Buddy Mode ready</div>
            <div style={{ fontSize: 12, color: 'var(--tile-green-ink)', marginTop: 2 }}>Translate &amp; speak phrases out loud</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(26,107,69,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 14 14" fill="none" width="14" height="14"><path d="M3 7h8M8 4l3 3-3 3" stroke="var(--tile-green-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </Link>

        {/* Quick actions */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>Quick actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Link href="/onboarding/situation" style={{ background: 'var(--tile-blue)', borderRadius: 'var(--r-xl)', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10, textDecoration: 'none', minHeight: 110 }}>
              <div style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'rgba(58,127,193,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 20 20" fill="none" width="20" height="20"><path d="M10 4v12M4 10h12" stroke="#3A7FC1" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>New Scenario</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--tile-blue-ink)', marginTop: 2 }}>AI-generated</div>
              </div>
            </Link>

            <Link href="/flashcards/current" style={{ background: 'var(--tile-purple)', borderRadius: 'var(--r-xl)', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10, textDecoration: 'none', minHeight: 110 }}>
              <div style={{ width: 38, height: 38, borderRadius: 'var(--r-sm)', background: 'rgba(91,61,170,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 20 20" fill="none" width="20" height="20"><rect x="3" y="5" width="14" height="10" rx="3" stroke="#5B3DAA" strokeWidth="1.6"/><path d="M8 8.5l4 1.5-4 1.5V8.5z" fill="#5B3DAA"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Daily Practice</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--tile-purple-ink)', marginTop: 2 }}>Cards due</div>
              </div>
            </Link>
          </div>
        </div>

        {/* My Scenarios */}
        {scenarios.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>My Scenarios</div>
              <Link href="/scenarios" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', textDecoration: 'none' }}>See all</Link>
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none', marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16 }}>
              {scenarios.slice(0, 5).map(s => {
                const col = CATEGORY_COLORS[s.category] ?? CATEGORY_COLORS.custom
                return (
                  <Link key={s.id} href={`/scenario/${s.id}`} style={{
                    width: 148, background: 'var(--surface)', borderRadius: 'var(--r-xl)',
                    padding: 14, boxShadow: 'var(--sh-card)', flexShrink: 0,
                    display: 'flex', flexDirection: 'column', gap: 8, textDecoration: 'none',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: col.ink, opacity: 0.5, borderRadius: '24px 24px 0 0' }} />
                    <div style={{ fontSize: 24, lineHeight: 1, marginTop: 4 }}>{CATEGORY_EMOJI[s.category] ?? '📚'}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', lineHeight: '17px' }}>{s.title}</div>
                    <div style={{ height: 4, background: 'var(--divider)', borderRadius: 9999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: col.ink, borderRadius: 9999, width: '40%' }} />
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>In progress</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* XP total */}
        <div style={{ background: 'linear-gradient(135deg, #EDE8FB, #DDD4F8 50%, #C9B8F5)', borderRadius: 'var(--r-xl)', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 6px 24px rgba(124,58,237,0.18)', border: '1.5px solid rgba(124,58,237,0.15)' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.60)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: '0 2px 8px rgba(124,58,237,0.15)' }}>⭐</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(91,61,170,0.60)', marginBottom: 3 }}>Total XP earned</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#2D1B6E' }}>{profile.xp_total.toLocaleString()} points</div>
            <div style={{ fontSize: 12, color: 'rgba(74,42,144,0.60)', marginTop: 2 }}>{learnedCount} words &amp; phrases learned</div>
          </div>
          <Link href="/profile" style={{ background: '#7C3AED', color: '#fff', borderRadius: 9999, padding: '5px 12px', fontSize: 12, fontWeight: 900, flexShrink: 0, textDecoration: 'none', boxShadow: '0 3px 10px rgba(124,58,237,0.35)' }}>
            View
          </Link>
        </div>

      </div>
    </div>
  )
}
