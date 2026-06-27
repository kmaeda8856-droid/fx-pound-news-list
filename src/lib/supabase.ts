import { createClient } from '@supabase/supabase-js'

export type NewsItem = {
  id: string
  title: string
  content: string | null
  source_url: string | null
  published_at: string
  created_at: string
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
