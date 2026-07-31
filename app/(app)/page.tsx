import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type Scenario = Database['public']['Tables']['scenarios']['Row']

const GUEST_PROFILE: Profile = {
  id: 'guest',
  display_name: 'Guest',
  avatar_url: null,
  native_language: 'en',
  target_languages: ['fr'],
  dialect: 'quebec',
  xp_total: 0,
  streak_days: 0,
  streak_last_date: null,
  onboarding_done: true,
  app_mode: 'learn',
  voice_gender: 'female',
  daily_goal: 10,
  preferences: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const isGuest = cookieStore.get('allo_guest')?.value === 'true'

  if (isGuest) {
    return <DashboardClient profile={GUEST_PROFILE} scenarios={[]} learnedCount={0} isGuest={true} />
  }

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
      isGuest={false}
    />
  )
}
