import { supabase } from '@/core/theme/supabase/supabaseClient';
import { Database } from '@/lib/supabase/database.types';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

type Team = Database['public']['Tables']['teams']['Row'];

export function useTeam() {
  const { user } = useUser();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeams() {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .eq('owner_id', user.id);

        if (error) throw error;

        setTeams(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, [user?.id]);

  async function createTeam(name: string) {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{ name, owner_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setTeams([...teams, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }

  async function createPersonalTeam() {
    if (!user?.id) return null;
    return createTeam(`${user.firstName || 'Personal'}'s Team`);
  }

  return { teams, loading, error, createTeam, createPersonalTeam };
}