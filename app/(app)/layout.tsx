import BottomNav from '@/components/ui/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div style={{
        width: '100%',
        maxWidth: 430,
        minHeight: '100dvh',
        margin: '0 auto',
        background: 'var(--bg)',
        paddingBottom: 80, // space for fixed bottom nav
      }}>
        {children}
      </div>
      <BottomNav />
    </>
  )
}
