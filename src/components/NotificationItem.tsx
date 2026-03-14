import React from 'react';
import { Notification } from '../api/notifications';
import styles from '../styles/components/NotificationItem.module.css';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (notification: Notification) => void;
  isAdmin?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onEdit,
  isAdmin = false
}) => {
  const {
    id,
    title,
    body,
    type,
    is_read,
    created_at
  } = notification;
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 60) {
      return minutes <= 1 ? 'Vừa xong' : `${minutes} phút trước`;
    } else if (hours < 24) {
      return `${hours} giờ trước`;
    } else if (days < 7) {
      return `${days} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };
  
  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'appointment': return '📅';
      case 'result': return '📊';
      case 'reminder': return '⏰';
      default: return '📣';
    }
  };
  
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'appointment': return 'Cuộc hẹn';
      case 'result': return 'Kết quả';
      case 'reminder': return 'Nhắc nhở';
      default: return 'Thông báo';
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!is_read && onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Bạn có chắc chắn muốn xóa thông báo này không?')) {
      onDelete(id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(notification);
    }
  };

  return (
    <div 
      className={`${styles.notificationItem} ${is_read ? '' : styles.unread}`}
      onClick={handleMarkAsRead}
    >
      <div className={styles.iconWrapper}>
        <div className={`${styles.icon} ${styles[type]}`}>
          {getTypeIcon(type)}
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <span className={styles.badge}>{getTypeLabel(type)}</span>
        </div>
        
        <p className={styles.message}>{body}</p>
        
        <div className={styles.footer}>
          <span className={styles.time}>{formatDate(created_at)}</span>
          
          <div className={styles.actions}>
            {isAdmin && onEdit && (
              <button 
                className={`${styles.actionButton} ${styles.editButton}`}
                onClick={handleEdit}
                title="Sửa thông báo"
              >
                ✏️
              </button>
            )}
            
            {isAdmin && onDelete && (
              <button 
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={handleDelete}
                title="Xóa thông báo"
              >
                🗑️
              </button>
            )}
            
            {!is_read && onMarkAsRead && (
              <button 
                className={`${styles.actionButton} ${styles.readButton}`}
                onClick={handleMarkAsRead}
                title="Đánh dấu đã đọc"
              >
                ✓
              </button>
            )}
          </div>
        </div>
      </div>
      
      {!is_read && <div className={styles.unreadIndicator}></div>}
    </div>
  );
};

export default NotificationItem; 