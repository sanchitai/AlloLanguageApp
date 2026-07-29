-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/cbpggbzhufdxdpoqmbhn/sql

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name     TEXT NOT NULL DEFAULT '',
  avatar_url       TEXT,
  native_language  TEXT NOT NULL DEFAULT 'en',
  target_languages TEXT[] NOT NULL DEFAULT '{fr}',
  dialect          TEXT NOT NULL DEFAULT 'quebec',
  xp_total         INTEGER NOT NULL DEFAULT 0,
  streak_days      INTEGER NOT NULL DEFAULT 0,
  streak_last_date DATE,
  onboarding_done  BOOLEAN NOT NULL DEFAULT FALSE,
  app_mode         TEXT NOT NULL DEFAULT 'learn' CHECK (app_mode IN ('learn','buddy')),
  voice_gender     TEXT NOT NULL DEFAULT 'female' CHECK (voice_gender IN ('female','male','neutral')),
  daily_goal       INTEGER NOT NULL DEFAULT 10,
  preferences      JSONB NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Scenarios
CREATE TABLE IF NOT EXISTS scenarios (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  category         TEXT NOT NULL DEFAULT 'custom',
  is_preset        BOOLEAN NOT NULL DEFAULT FALSE,
  native_language  TEXT NOT NULL DEFAULT 'en',
  target_language  TEXT NOT NULL DEFAULT 'fr',
  dialect          TEXT NOT NULL DEFAULT 'quebec',
  item_count       INTEGER NOT NULL DEFAULT 0,
  is_archived      BOOLEAN NOT NULL DEFAULT FALSE,
  last_studied_at  TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_scenarios_user ON scenarios(user_id);

-- Generated content
CREATE TABLE IF NOT EXISTS generated_content (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id          UUID REFERENCES scenarios(id) ON DELETE CASCADE,
  content_type         TEXT NOT NULL CHECK (content_type IN ('vocabulary','phrase','emergency','cultural_tip','conversation_starter')),
  target_text          TEXT NOT NULL,
  native_text          TEXT NOT NULL,
  pronunciation        TEXT,
  example_sentence     TEXT,
  example_translation  TEXT,
  context_note         TEXT,
  difficulty           TEXT CHECK (difficulty IN ('basic','intermediate','advanced')),
  sort_order           INTEGER NOT NULL DEFAULT 0,
  metadata             JSONB NOT NULL DEFAULT '{}',
  created_at           TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_content_scenario ON generated_content(scenario_id);

-- Learning progress
CREATE TABLE IF NOT EXISTS learning_progress (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id       UUID REFERENCES generated_content(id) ON DELETE CASCADE,
  scenario_id      UUID REFERENCES scenarios(id) ON DELETE CASCADE,
  status           TEXT NOT NULL DEFAULT 'unseen' CHECK (status IN ('unseen','reviewing','learned')),
  is_favorite      BOOLEAN NOT NULL DEFAULT FALSE,
  notes            TEXT,
  review_count     INTEGER NOT NULL DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  learned_at       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);
CREATE INDEX IF NOT EXISTS idx_progress_user ON learning_progress(user_id);

-- Translation cache
CREATE TABLE IF NOT EXISTS translation_cache (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key    TEXT UNIQUE NOT NULL,
  source_text  TEXT NOT NULL,
  from_lang    TEXT NOT NULL,
  to_lang      TEXT NOT NULL,
  translation  TEXT NOT NULL,
  pronunciation TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cache_key ON translation_cache(cache_key);

-- Supabase Storage bucket for audio
INSERT INTO storage.buckets (id, name, public) VALUES ('audio', 'audio', false) ON CONFLICT DO NOTHING;

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own scenarios" ON scenarios FOR SELECT USING (user_id = auth.uid() OR is_preset = TRUE);
CREATE POLICY "Users can insert own scenarios" ON scenarios FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own scenarios" ON scenarios FOR UPDATE USING (user_id = auth.uid());

ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view content of own scenarios" ON generated_content FOR SELECT USING (
  scenario_id IN (SELECT id FROM scenarios WHERE user_id = auth.uid() OR is_preset = TRUE)
);
CREATE POLICY "Users can insert content" ON generated_content FOR INSERT WITH CHECK (
  scenario_id IN (SELECT id FROM scenarios WHERE user_id = auth.uid())
);

ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON learning_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own progress" ON learning_progress FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own progress" ON learning_progress FOR UPDATE USING (user_id = auth.uid());

ALTER TABLE translation_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read cache" ON translation_cache FOR SELECT USING (true);
CREATE POLICY "Service role can insert cache" ON translation_cache FOR INSERT WITH CHECK (true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Audio storage policy
CREATE POLICY "Authenticated users can read audio" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'audio');
CREATE POLICY "Service role can upload audio" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'audio');
