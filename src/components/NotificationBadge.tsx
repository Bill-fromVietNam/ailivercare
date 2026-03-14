import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/components/NotificationBadge.module.css';
import { NotificationsAPI } from '../api/notifications';
import { RootState } from '../store/store';

interface NotificationBadgeProps {
  variant?: 'inline' | 'icon';
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ variant = 'inline' }) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      
      // Set up interval to check for new notifications every minute
      const interval = setInterval(fetchUnreadCount, 60000);
      
      // Clean up interval
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await NotificationsAPI.getUnreadCount();
      setUnreadCount(response.unread_count);
      setError(null);
    } catch (err: any) {
      setError('Không thể tải số thông báo');
      console.error('Error fetching notification count:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || (unreadCount === 0 && variant === 'icon')) {
    return null;
  }

  if (variant === 'icon') {
    return <span className={styles.badge}>{unreadCount}</span>;
  }

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      ) : error ? (
        <div className={styles.error} title={error}>!</div>
      ) : unreadCount > 0 ? (
        <div className={styles.badge}>{unreadCount}</div>
      ) : null}
    </div>
  );
};

export default NotificationBadge; 