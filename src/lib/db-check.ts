import { supabase } from '@/core/theme/supabase/supabaseClient';

/**
 * Utility function to verify database tables and schema
 */
export async function verifyDatabaseSchema() {
    console.log('Verifying database schema...');
    
    try {
        // Check if profiles table exists
        const { data: profilesCheck, error: profilesError } = await supabase
            .from('profiles')
            .select('count')
            .limit(1);
        
        console.log('Profiles table check:', { exists: !!profilesCheck, error: profilesError?.message });
        
        if (profilesError) {
            // If the error is because the table doesn't exist, try to create it
            if (profilesError.message.includes('does not exist')) {
                console.warn('Profiles table does not exist. This could be the issue with user profiles not loading.');
                console.warn('You should create the profiles table with the following schema:');
                console.warn(`
                CREATE TABLE public.profiles (
                    id UUID PRIMARY KEY REFERENCES auth.users(id),
                    userName TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
                );
                `);
            }
        }
        
        // Optionally check RLS policies on the profiles table
        // This is important for security and proper access
        const { data: policies } = await supabase.rpc('get_policies');
        console.log('RLS policies:', policies);
        
        return {
            profilesCheck,
            profilesError
        };
    } catch (error) {
        console.error('Error verifying database schema:', error);
        return { error };
    }
}

/**
 * Check if a user record exists in the profiles table
 */
export async function checkUserProfile(userId: string) {
    if (!userId) {
        console.error('No user ID provided to checkUserProfile');
        return null;
    }
    
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        console.log('User profile check:', { userId, exists: !!data, error: error?.message });
        
        if (error && !error.message.includes('No rows found')) {
            console.error('Error checking user profile:', error);
        }
        
        return { data, error };
    } catch (error) {
        console.error('Unexpected error in checkUserProfile:', error);
        return { error };
    }
}
