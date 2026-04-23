import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sfnzunqgkzxolfgohxoz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbnp1bnFna3p4b2xmZ29oeG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MDQ2MTcsImV4cCI6MjA5MjM4MDYxN30.8DPOIyonccelPuCM-SsEwDaHrtoHXS_Z2C0uCPwVXAA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
