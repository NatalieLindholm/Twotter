
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient('https://wbioudgayuapyyxqcmzy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiaW91ZGdheXVhcHl5eHFjbXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM1OTMyNTIsImV4cCI6MTk4OTE2OTI1Mn0.F_i0ipRPLAvDWGAkgVcZiN2DDIDwVx-BRfF3alC-1l0')
