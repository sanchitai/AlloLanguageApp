'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Home',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
        <path d="M3 12L12 3l9 9M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          opacity={active ? 1 : 0.45} />
      </svg>
    ),
  },
  {
    href: '/scenarios',
    label: 'Scenarios',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" width="24" height="24" opacity={active ? 1 : 0.45}>
        <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    href: '/buddy',
    label: 'Buddy',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" width="24" height="24" opacity={active ? 1 : 0.45}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
          stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" width="24" height="24" opacity={active ? 1 : 0.45}>
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 20c0-4.42 3.58-8 8-8s8 3.58 8 8"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      height: 72, background: 'var(--surface)',
      borderTop: '1px solid var(--divider)',
      display: 'flex', alignItems: 'center',
      paddingBottom: 'env(safe-area-inset-bottom, 0)',
      zIndex: 20,
    }}>
      <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-around' }}>

        {/* Home */}
        <NavItem href="/" active={pathname === '/'} label="Home" icon={NAV_ITEMS[0].icon} />

        {/* Scenarios */}
        <NavItem href="/scenarios" active={pathname.startsWith('/scenarios') || pathname.startsWith('/scenario')} label="Scenarios" icon={NAV_ITEMS[1].icon} />

        {/* FAB — new scenario */}
        <Link href="/onboarding/situation" style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'var(--black)', color: 'var(--ink-inv)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--sh-fab)', flexShrink: 0,
          transition: 'transform 160ms var(--spring)',
        }}>
          <svg viewBox="0 0 22 22" fill="none" width="22" height="22">
            <path d="M11 4v14M4 11h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Link>

        {/* Buddy */}
        <NavItem href="/buddy" active={pathname === '/buddy'} label="Buddy" icon={NAV_ITEMS[2].icon} />

        {/* Profile */}
        <NavItem href="/profile" active={pathname === '/profile'} label="Profile" icon={NAV_ITEMS[3].icon} />

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
      alignItems: 'center', gap: 4, padding: '8px 0',
      color: active ? 'var(--black)' : 'var(--ink-3)',
      textDecoration: 'none',
    }}>
      {active && (
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--black)', marginBottom: -6 }} />
      )}
      {icon(active)}
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </Link>
  )
}
