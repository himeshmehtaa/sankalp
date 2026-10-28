import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mlytlugxzsntemutbhtd.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_8UyUqgYL6HM8-NR759sBtQ_Bo0nUKxw';

export const supabase = createClient(supabaseUrl, supabaseKey);
