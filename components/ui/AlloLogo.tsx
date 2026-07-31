// Reusable Allo logo component — Option 5 (two overlapping speech bubbles)

interface AlloLogoProps {
  width?: number
  dark?: boolean
  showTagline?: boolean
}

export default function AlloLogo({ width = 200, dark = false, showTagline = false }: AlloLogoProps) {
  const ink = dark ? '#FFFFFF' : '#1A2E3B'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: showTagline ? 8 : 0 }}>
      <svg viewBox="0 0 240 72" fill="none" width={width} style={{ display: 'block' }}>
        {/* Sky blue bubble */}
        <rect x="0" y="0" width="36" height="28" rx="10" fill="#56CCF2"/>
        <polygon points="5,28 18,28 11,40" fill="#56CCF2"/>
        {/* Tangerine bubble */}
        <rect x="18" y="22" width="36" height="28" rx="10" fill="#FF7043"/>
        <polygon points="37,50 50,50 43,62" fill="#FF7043"/>
        {/* Wordmark */}
        <text x="66" y="50" fontFamily="Nunito, sans-serif" fontWeight="900" fontSize="48" fill={ink} letterSpacing="-1.5">Allo</text>
        {/* Sky dot accent */}
        <circle cx="232" cy="54" r="6" fill="#56CCF2"/>
      </svg>
      {showTagline && (
        <div style={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: dark ? 'rgba(255,255,255,0.45)' : 'var(--ink-3)',
        }}>
          LEARN FOR YOUR MOMENT
        </div>
      )}
    </div>
  )
}
