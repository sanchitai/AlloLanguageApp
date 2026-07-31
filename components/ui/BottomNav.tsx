'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const items = [
    {
      href: '/',
      label: 'Home',
      active: pathname === '/',
      icon: (on: boolean) => (
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
          <path d="M3 12L12 3l9 9M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9"
            stroke="currentColor" strokeWidth={on ? 2.2 : 1.8}
            strokeLinecap="round" strokeLinejoin="round"
            fill={on ? 'none' : 'none'} />
        </svg>
      ),
    },
    {
      href: '/scenarios',
      label: 'Learn',
      active: pathname.startsWith('/scenario'),
      icon: (on: boolean) => (
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth={on ? 2.2 : 1.8} strokeLinejoin="round"/>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth={on ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      href: '/buddy',
      label: 'Buddy',
      active: pathname === '/buddy',
      icon: (on: boolean) => (
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            stroke="currentColor" strokeWidth={on ? 2.2 : 1.8} strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      href: '/profile',
      label: 'Profile',
      active: pathname === '/profile',
      icon: (on: boolean) => (
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth={on ? 2.2 : 1.8}/>
          <path d="M4 20c0-4.42 3.58-8 8-8s8 3.58 8 8" stroke="currentColor" strokeWidth={on ? 2.2 : 1.8} strokeLinecap="round"/>
        </svg>
      ),
    },
  ]

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(16px)',
      borderTop: '1.5px solid rgba(86,204,242,0.15)',
      display: 'flex', alignItems: 'center',
      paddingBottom: 'env(safe-area-inset-bottom, 0)',
      zIndex: 20,
      boxShadow: '0 -4px 20px rgba(26,46,59,0.06)',
    }}>
      <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-around', height: 68 }}>

        {items.slice(0, 2).map(item => (
          <NavItem key={item.href} {...item} />
        ))}

        {/* FAB — new scenario */}
        <Link href="/onboarding/situation" style={{
          width: 54, height: 54, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--sh-fab)', flexShrink: 0,
          transition: 'transform 160ms var(--spring)',
          marginTop: -16,
          border: '3px solid rgba(255,255,255,0.9)',
        }}>
          <svg viewBox="0 0 22 22" fill="none" width="20" height="20">
            <path d="M11 4v14M4 11h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </Link>

        {items.slice(2).map(item => (
          <NavItem key={item.href} {...item} />
        ))}

      </div>
    </nav>
  )
}

function NavItem({ href, active, label, icon }: {
  href: string; active: boolean; label: string
  icon: (active: boolean) => React.ReactNode
}) {
  return (
    <Link href={href} style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 3, padding: '8px 0',
      color: active ? 'var(--primary)' : 'var(--ink-3)',
      textDecoration: 'none', position: 'relative',
    }}>
      {active && (
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 32, height: 3, borderRadius: '0 0 4px 4px',
          background: 'var(--primary)',
        }} />
      )}
      {icon(active)}
      <span style={{
        fontSize: 10, fontWeight: active ? 800 : 700,
        letterSpacing: '0.01em',
        color: active ? 'var(--primary)' : 'var(--ink-3)',
      }}>
        {label}
      </span>
    </Link>
  )
}
