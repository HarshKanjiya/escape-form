import { supabase } from '@/core/theme/supabase/supabaseClient';
import { useEffect, useState } from 'react';

export function useUser() {
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        const session = supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null);
        });
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });
        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);
    return user;
}