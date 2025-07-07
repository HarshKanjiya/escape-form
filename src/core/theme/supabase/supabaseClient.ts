import { auth } from '@clerk/nextjs/server';
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

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    async accessToken() {
        return ((await auth()).getToken());
    }
});