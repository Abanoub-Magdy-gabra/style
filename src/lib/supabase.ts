import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable session persistence - sessions won't be remembered after browser close
    persistSession: false,
    // Disable automatic token refresh
    autoRefreshToken: false,
    // Don't detect session from URL
    detectSessionInUrl: false,
    // Use memory storage instead of localStorage
    storage: {
      getItem: (key: string) => {
        // Return null to simulate no stored data
        return null;
      },
      setItem: (key: string, value: string) => {
        // Do nothing - don't store anything
      },
      removeItem: (key: string) => {
        // Do nothing
      }
    }
  }
})