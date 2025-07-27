import { createClient } from '@supabase/supabase-js';

// Supabase configuration - Replace with your actual values
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  role?: 'realtor' | 'home_seeker';
}

export interface SignUpData {
  email: string;
  password: string;
  role: 'realtor' | 'home_seeker';
}

export interface SignInData {
  email: string;
  password: string;
}