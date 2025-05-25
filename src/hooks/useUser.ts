import { supabase } from '@/core/theme/supabase/supabaseClient';
import { useEffect, useState } from 'react';

export interface UserWithProfile {
    id: string;
    email?: string;
    phone?: string;
    userName?: string;
    // Add other fields as needed
}

export function useUser() {
    const [user, setUser] = useState<UserWithProfile | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchUserProfile(userId: string) {
        console.log('Fetching profile for userId:', userId);
        try {
            // Fetch profile data from the profiles table
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error);
                return null;
            }

            console.log('Profile data fetched:', profile);
            return profile;
        } catch (error) {
            console.error('Error in fetchUserProfile:', error);
            return null;
        }
    }

    useEffect(() => {
        async function getUser() {
            console.log('getUser function called');
            try {
                setLoading(true);
                
                // Get current session
                const { data, error } = await supabase.auth.getSession();
                console.log('Auth session data:', data);
                
                if (error) {
                    console.error('Error getting session:', error);
                    return;
                }
                
                if (!data.session) {
                    console.log('No active session found');
                    setUser(null);
                    return;
                }

                const authUser = data.session.user;
                console.log('Auth user:', authUser);
                
                // Fetch additional profile data if we have a user
                const profile = await fetchUserProfile(authUser.id);
                console.log('Combined profile to set:', { id: authUser.id, email: authUser.email, phone: authUser.phone, ...profile });
                
                // Combine auth data with profile data
                setUser({
                    id: authUser.id,
                    email: authUser.email,
                    phone: authUser.phone,
                    ...profile
                });
            } catch (error) {
                console.error('Error in getUser:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        getUser();

        // Set up auth state change listener
        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session);
            if (session && session.user) {
                const profile = await fetchUserProfile(session.user.id);
                console.log('Setting user on auth change:', { session: session.user, profile });
                
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    phone: session.user.phone,
                    ...profile
                });
            } else {
                console.log('No session in auth change event');
                setUser(null);
            }
        });

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    return { user, loading };
}