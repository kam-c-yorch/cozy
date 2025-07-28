import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  role: 'realtor' | 'home_seeker';
  name?: string;
  phone?: string;
  created_at: string;
}

// Sign up with Supabase only
export const signUp = async (email: string, password: string, role: 'realtor' | 'home_seeker') => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          name: email.split('@')[0], // Default name from email
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    return {
      user: authData.user,
      profile: {
        id: authData.user.id,
        email: authData.user.email!,
        role,
        name: authData.user.user_metadata?.name || email.split('@')[0],
        created_at: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

// Sign in with Supabase
export const signIn = async (email: string, password: string) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to sign in');

    const profile = {
      id: authData.user.id,
      email: authData.user.email!,
      role: authData.user.user_metadata?.role || 'home_seeker',
      name: authData.user.user_metadata?.name || email.split('@')[0],
      created_at: authData.user.created_at,
    };

    return {
      user: authData.user,
      profile,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

// Get current user profile
export const getCurrentUserProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const profile = {
      id: user.id,
      email: user.email!,
      role: user.user_metadata?.role || 'home_seeker',
      name: user.user_metadata?.name || user.email?.split('@')[0],
      created_at: user.created_at,
    };

    return {
      user,
      profile,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};