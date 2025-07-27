import { supabase } from './supabase';
import { databases, ID } from './appwrite';

const DATABASE_ID = '68832ec6000d33c4c577';
const USERS_COLLECTION_ID = '68832f010008c5f73e65';

export interface UserProfile {
  supabase_uid: string;
  email: string;
  role: 'realtor' | 'home_seeker';
  name?: string;
  phone?: string;
  created_at: string;
}

// Sign up with Supabase and create Appwrite profile
export const signUp = async (email: string, password: string, role: 'realtor' | 'home_seeker') => {
  try {
    // 1. Create user in Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    // 2. Create user profile in Appwrite
    const userProfile = {
      supabase_uid: authData.user.id,
      email: authData.user.email!,
      role,
      name: email.split('@')[0], // Default name from email
      created_at: new Date().toISOString(),
    };

    const { data: profileData, error: profileError } = await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      ID.unique(),
      userProfile
    );

    if (profileError) {
      // If Appwrite profile creation fails, we should clean up the Supabase user
      console.error('Failed to create Appwrite profile:', profileError);
      throw new Error('Failed to create user profile');
    }

    return {
      user: authData.user,
      profile: profileData,
    };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

// Sign in with Supabase and retrieve Appwrite profile
export const signIn = async (email: string, password: string) => {
  try {
    // 1. Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to sign in');

    // 2. Retrieve user profile from Appwrite
    const { data: profiles, error: profileError } = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [`supabase_uid=${authData.user.id}`]
    );

    if (profileError) {
      console.error('Failed to retrieve user profile:', profileError);
      throw new Error('Failed to retrieve user profile');
    }

    if (profiles.documents.length === 0) {
      throw new Error('User profile not found');
    }

    const profile = profiles.documents[0];

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

    const { data: profiles, error } = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [`supabase_uid=${user.id}`]
    );

    if (error || profiles.documents.length === 0) {
      return null;
    }

    return {
      user,
      profile: profiles.documents[0],
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};