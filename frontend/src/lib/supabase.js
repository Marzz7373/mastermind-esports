import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://<your-supabase-url>',
  '<your-anon-public-key>'
)
