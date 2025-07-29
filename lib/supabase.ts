import { createClient } from '@supabase/supabase-js';

// Supabase configuration - Replace with your actual values
const supabaseUrl = 'https://demo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

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