import { supabase } from '@/core/theme/supabase/supabaseClient';
import { Database } from '@/lib/supabase/database.types';
import { useEffect, useState } from 'react';

type Project = Database['public']['Tables']['projects']['Row'];

export function useProjects(teamId: string | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      if (!teamId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('team_id', teamId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setProjects(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [teamId]);

  async function createProject(name: string, description?: string) {
    if (!teamId) return null;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ name, description, team_id: teamId }])
        .select()
        .single();

      if (error) throw error;

      setProjects([data, ...projects]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }

  async function updateProject(id: string, updates: Partial<Pick<Project, 'name' | 'description'>>) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProjects(projects.map(project => 
        project.id === id ? data : project
      ));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }

  async function deleteProject(id: string) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(projects.filter(project => project.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }

  return { 
    projects, 
    loading, 
    error, 
    createProject, 
    updateProject, 
    deleteProject 
  };
}
