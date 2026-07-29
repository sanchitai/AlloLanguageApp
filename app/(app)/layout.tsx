import BottomNav from '@/components/ui/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 72 }}>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
