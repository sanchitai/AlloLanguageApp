import { generateScenario } from '@/lib/claude'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 5 generations per day
    const today = new Date().toISOString().split('T')[0]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count } = await (supabase.from('scenarios') as any)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_preset', false)
      .gte('created_at', `${today}T00:00:00`)

    if ((count ?? 0) >= 5) {
      return Response.json({ error: 'Daily limit reached (5 scenarios/day)' }, { status: 429 })
    }

    const { description, nativeLang = 'en', targetLang = 'fr' } = await request.json()

    if (!description) {
      return Response.json({ error: 'Missing description' }, { status: 400 })
    }

    // Generate via Claude
    const generated = await generateScenario(description, nativeLang, targetLang)

    // Save scenario to database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: scenario, error: scenarioError } = await (supabase.from('scenarios') as any)
      .insert({
        user_id: user.id,
        title: generated.title,
        description,
        category: 'custom',
        is_preset: false,
        native_language: nativeLang,
        target_language: targetLang,
        dialect: 'quebec',
        item_count: (generated.vocabulary?.length ?? 0) + (generated.phrases?.length ?? 0),
      })
      .select()
      .single()

    if (scenarioError || !scenario) {
      throw scenarioError
    }

    // Save generated content items
    const contentItems = [
      ...(generated.vocabulary ?? []).map((v: Record<string, unknown>, i: number) => ({
        scenario_id: scenario.id,
        content_type: 'vocabulary',
        target_text: v.target_word as string,
        native_text: v.native_meaning as string,
        pronunciation: v.pronunciation_guide as string ?? null,
        example_sentence: v.example_sentence as string ?? null,
        example_translation: v.example_translation as string ?? null,
        difficulty: v.difficulty as string ?? 'basic',
        sort_order: i,
        metadata: {},
      })),
      ...(generated.phrases ?? []).map((p: Record<string, unknown>, i: number) => ({
        scenario_id: scenario.id,
        content_type: 'phrase',
        target_text: p.target_phrase as string,
        native_text: p.native_meaning as string,
        pronunciation: p.pronunciation_guide as string ?? null,
        context_note: p.context_note as string ?? null,
        sort_order: i,
        metadata: { category: p.category },
      })),
      ...(generated.emergency_phrases ?? []).map((e: Record<string, unknown>, i: number) => ({
        scenario_id: scenario.id,
        content_type: 'emergency',
        target_text: e.target_phrase as string,
        native_text: e.native_meaning as string,
        sort_order: i,
        metadata: { urgency: e.urgency },
      })),
      ...(generated.cultural_tips ?? []).map((tip: string, i: number) => ({
        scenario_id: scenario.id,
        content_type: 'cultural_tip',
        target_text: tip,
        native_text: tip,
        sort_order: i,
        metadata: {},
      })),
    ]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('generated_content') as any).insert(contentItems)

    return Response.json({ scenario_id: scenario.id, scenario, generated })
  } catch (error) {
    console.error('Generate scenario error:', error)
    return Response.json({ error: 'Scenario generation failed' }, { status: 500 })
  }
}
