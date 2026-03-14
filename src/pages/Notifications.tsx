import React, { useState, useEffect } from 'react';
import styles from '../styles/pages/Notifications.module.css';
import ThemeToggle from '../components/ThemeToggle';
import AlertMessage from '../components/AlertMessage';
import NotificationItem from '../components/NotificationItem';
import { NotificationsAPI, Notification } from '../api/notifications';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    fetchNotifications();
  }, [page, selectedType]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await NotificationsAPI.getUserNotifications(page, 10);
      
      setNotifications(response.items);
      setTotalPages(Math.ceil(response.total / response.size));
      setUnreadCount(response.unread_count);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await NotificationsAPI.markAsRead(id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      setError(err?.message || 'Không thể đánh dấu đã đọc');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationsAPI.markAllAsRead();
      
      // Update all notifications in the current view
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (err: any) {
      setError(err?.message || 'Không thể đánh dấu tất cả đã đọc');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNotifications();
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    setPage(1); // Reset to first page when changing filter
  };

  const handlePrevPage = () => {
    setPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage(prev => Math.min(prev + 1, totalPages));
  };

  // Filter notifications by search term
  const filteredNotifications = notifications.filter(notification => {
    // Filter by type first
    if (selectedType !== 'all' && notification.type !== selectedType) {
      return false;
    }
    
    // Then by search term
    return (
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Thông báo</h1>
        <div className={styles.actions}>
          {unreadCount > 0 && (
            <button 
              className={styles.markAllReadButton}
              onClick={handleMarkAllAsRead}
            >
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>
      </div>

      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="type-filter">Loại thông báo:</label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={handleTypeChange}
            className={styles.select}
          >
            <option value="all">Tất cả</option>
            <option value="general">Thông báo</option>
            <option value="appointment">Cuộc hẹn</option>
            <option value="result">Kết quả</option>
            <option value="reminder">Nhắc nhở</option>
          </select>
        </div>
        
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm thông báo..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            🔍
          </button>
        </form>
      </div>

      {loading && notifications.length === 0 ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải thông báo...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>🔔</div>
          <h2>Không có thông báo nào</h2>
          <p>Bạn sẽ nhận được thông báo về các hoạt động, lịch hẹn, và cập nhật quan trọng tại đây.</p>
        </div>
      ) : (
        <>
          <div className={styles.notificationList}>
            {filteredNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={handlePrevPage}
                disabled={page === 1 || loading}
                className={styles.paginationButton}
              >
                &laquo; Trước
              </button>
              <span className={styles.pageInfo}>
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page >= totalPages || loading}
                className={styles.paginationButton}
              >
                Tiếp &raquo;
              </button>
            </div>
          )}
        </>
      )}

      <div className={styles.infoSection}>
        <h3 className={styles.infoTitle}>Về thông báo</h3>
        <p className={styles.infoText}>
          Bạn sẽ nhận được các loại thông báo sau:
        </p>
        <ul className={styles.infoList}>
          <li><strong>Thông báo chung</strong> - Cập nhật từ hệ thống và thông tin quan trọng</li>
          <li><strong>Cuộc hẹn</strong> - Thông báo về lịch hẹn khám bệnh sắp tới</li>
          <li><strong>Kết quả</strong> - Kết quả xét nghiệm và đánh giá mới</li>
          <li><strong>Nhắc nhở</strong> - Nhắc nhở về thuốc, lịch khám, và các hoạt động cần làm</li>
        </ul>
      </div>
      
      <ThemeToggle />
    </div>
  );
};

export default Notifications; 