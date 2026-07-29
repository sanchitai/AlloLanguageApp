import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'
import { redirect } from 'next/navigation'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type Scenario = Database['public']['Tables']['scenarios']['Row']

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileData as Profile | null

  if (!profile?.onboarding_done) redirect('/onboarding/mode')

  const { data: scenariosData } = await supabase
    .from('scenarios')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_archived', false)
    .order('last_studied_at', { ascending: false })
    .limit(6)

  const scenarios = (scenariosData ?? []) as Scenario[]

  const { count: learnedCount } = await supabase
    .from('learning_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'learned')

  return (
    <DashboardClient
      profile={profile!}
      scenarios={scenarios}
      learnedCount={learnedCount ?? 0}
    />
  )
}
