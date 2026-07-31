import BottomNav from '@/components/ui/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: '100%', maxWidth: 430, minHeight: '100dvh', margin: '0 auto', background: 'var(--bg)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
