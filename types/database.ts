export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          avatar_url: string | null
          native_language: string
          target_languages: string[]
          dialect: string
          xp_total: number
          streak_days: number
          streak_last_date: string | null
          onboarding_done: boolean
          app_mode: 'learn' | 'buddy'
          voice_gender: 'female' | 'male' | 'neutral'
          daily_goal: number
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      scenarios: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: string
          is_preset: boolean
          native_language: string
          target_language: string
          dialect: string
          item_count: number
          is_archived: boolean
          last_studied_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['scenarios']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['scenarios']['Row']>
      }
      generated_content: {
        Row: {
          id: string
          scenario_id: string
          content_type: 'vocabulary' | 'phrase' | 'emergency' | 'cultural_tip' | 'conversation_starter'
          target_text: string
          native_text: string
          pronunciation: string | null
          example_sentence: string | null
          example_translation: string | null
          context_note: string | null
          difficulty: 'basic' | 'intermediate' | 'advanced' | null
          sort_order: number
          metadata: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['generated_content']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['generated_content']['Row']>
      }
      learning_progress: {
        Row: {
          id: string
          user_id: string
          content_id: string
          scenario_id: string
          status: 'unseen' | 'reviewing' | 'learned'
          is_favorite: boolean
          notes: string | null
          review_count: number
          last_reviewed_at: string | null
          learned_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['learning_progress']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['learning_progress']['Row']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
