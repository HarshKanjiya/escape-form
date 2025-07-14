import { Database } from '@/lib/supabase/database.types';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

type Notification = Database['public']['Tables']['notifications']['Row'];

export function useNotifications() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // async function fetchNotifications() {
    //   if (!user?.id) return;

    //   try {
    //     const { data, error } = await supabase
    //       .from('notifications')
    //       .select('*')
    //       .eq('user_id', user.id)
    //       .order('created_at', { ascending: false })
    //       .limit(50);

    //     if (error) throw error;

    //     setNotifications(data || []);
    //     setUnreadCount(data?.filter(n => !n.read).length || 0);
    //   } catch (err) {
    //     setError(err instanceof Error ? err.message : 'An error occurred');
    //   } finally {
    //     setLoading(false);
    //   }
    // }

    // fetchNotifications();
  }, [user?.id]);

  async function markAsRead(notificationId: string) {
    try {
      // const { error } = await supabase
      //   .from('notifications')
      //   .update({ read: true })
      //   .eq('id', notificationId);

      // if (error) throw error;

      // setNotifications(notifications.map(n => 
      //   n.id === notificationId ? { ...n, read: true } : n
      // ));
      // setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  async function markAllAsRead() {
    if (!user?.id) return;

    try {
      // const { error } = await supabase
      //   .from('notifications')
      //   .update({ read: true })
      //   .eq('user_id', user.id)
      //   .eq('read', false);

      // if (error) throw error;

      // setNotifications(notifications.map(n => ({ ...n, read: true })));
      // setUnreadCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  const recentNotifications = notifications.slice(0, 5);

  return { 
    notifications, 
    recentNotifications,
    unreadCount, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead 
  };
}
