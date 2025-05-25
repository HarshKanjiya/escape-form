import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        'Missing Supabase environment variables. Please check your .env file or environment configuration.',
        { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey }
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log the Supabase initialization (without exposing keys)
console.log('Supabase client initialized with URL:', supabaseUrl ? 'URL provided' : 'URL missing');

// Export a helper function to check auth state
export const checkAuthState = async () => {
    const { data, error } = await supabase.auth.getSession();
    console.log('Current auth state check:', { 
        hasSession: !!data.session,
        sessionError: error,
        sessionUserId: data.session?.user?.id
    });
    return { data, error };
};