import { createClient } from '@supabase/supabase-js';

// Mock Supabase configuration for development
const supabaseUrl = 'https://mock.supabase.co';
const supabaseAnonKey = 'mock-key';

// Create a mock client that doesn't make actual network requests
const mockSupabaseClient = {
  auth: {
    signUp: async ({ email, password, options }: any) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signup
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        user_metadata: options?.data || {}
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      
      return {
        data: { user: mockUser },
        error: null
      };
    },
    
    signInWithPassword: async ({ email, password }: any) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in localStorage
      const storedUser = localStorage.getItem('mock_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === email) {
          return {
            data: { user },
            error: null
          };
        }
      }
      
      // Mock user for demo purposes
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        user_metadata: { role: 'home_seeker' }
      };
      
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      
      return {
        data: { user: mockUser },
        error: null
      };
    },
    
    signOut: async () => {
      localStorage.removeItem('mock_user');
      return { error: null };
    },
    
    getUser: async () => {
      const storedUser = localStorage.getItem('mock_user');
      if (storedUser) {
        return {
          data: { user: JSON.parse(storedUser) },
          error: null
        };
      }
      return {
        data: { user: null },
        error: null
      };
    },
    
    onAuthStateChange: (callback: any) => {
      // Mock auth state change listener
      const storedUser = localStorage.getItem('mock_user');
      if (storedUser) {
        setTimeout(() => {
          callback('SIGNED_IN', { user: JSON.parse(storedUser) });
        }, 100);
      } else {
        setTimeout(() => {
          callback('SIGNED_OUT', { user: null });
        }, 100);
      }
      
      // Return unsubscribe function
      return {
        data: { subscription: { unsubscribe: () => {} } }
      };
    }
  }
};

export const supabase = mockSupabaseClient as any;

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