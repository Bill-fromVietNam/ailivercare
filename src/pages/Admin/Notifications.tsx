import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styles from '../../styles/pages/Admin/Notifications.module.css';
import AlertMessage from '../../components/AlertMessage';
import NotificationItem from '../../components/NotificationItem';
import { 
  NotificationsAPI, 
  Notification,
  CreateNotificationRequest,
  UpdateNotificationRequest 
} from '../../api/notifications';
import { UserResponse } from '../../api/auth';

interface NotificationModalProps {
  isOpen: boolean;
  notification?: Notification;
  users: UserResponse[];
  onClose: () => void;
  onSave: (data: CreateNotificationRequest | UpdateNotificationRequest, userId?: string) => void;
  isBulk?: boolean;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  notification,
  users,
  onClose,
  onSave,
  isBulk = false
}) => {
  const [formData, setFormData] = useState<CreateNotificationRequest>({
    user_id: '',
    title: '',
    body: '',
    type: 'general'
  });

  useEffect(() => {
    if (notification) {
      setFormData({
        user_id: notification.user_id,
        title: notification.title,
        body: notification.body,
        type: notification.type,
        related_id: notification.related_id || undefined
      });
    } else {
      // Reset form for new notification
      setFormData({
        user_id: users.length > 0 ? users[0].id.toString() : '',
        title: '',
        body: '',
        type: 'general'
      });
    }
  }, [notification, users]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBulk) {
      // For bulk notifications, we don't send user_id
      const { title, body, type } = formData;
      // Cast to CreateNotificationRequest để phù hợp với kiểu dữ liệu của onSave
      onSave({ 
        title, 
        body, 
        type,
        user_id: '' // Thêm giá trị giả để phù hợp với kiểu dữ liệu
      } as CreateNotificationRequest);
    } else {
      onSave(formData, formData.user_id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>
            {isBulk ? 'Gửi thông báo cho tất cả người dùng' : 
              notification ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {!notification && !isBulk && (
            <div className={styles.formGroup}>
              <label htmlFor="user_id">Người nhận</label>
              <select
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                required
              >
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.full_name || user.email}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Tiêu đề</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                maxLength={100}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="type">Loại thông báo</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="general">Thông báo chung</option>
                <option value="appointment">Cuộc hẹn</option>
                <option value="result">Kết quả</option>
                <option value="reminder">Nhắc nhở</option>
              </select>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="body">Nội dung</label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              rows={5}
              required
              maxLength={500}
            />
            <div className={styles.charCount}>
              {formData.body.length}/500 ký tự
            </div>
          </div>
          
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={styles.saveButton}>
              {isBulk ? 'Gửi cho tất cả' : notification ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminNotifications: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [bulkModalOpen, setBulkModalOpen] = useState<boolean>(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Validate user is admin
  if (user?.role !== 'admin') {
    return (
      <div className={styles.accessDenied}>
        <h1>Truy cập bị từ chối</h1>
        <p>Bạn không có quyền truy cập vào trang quản trị.</p>
        <button onClick={() => navigate('/')}>Quay lại trang chủ</button>
      </div>
    );
  }

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, [page, selectedType]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const typeParam = selectedType !== 'all' ? selectedType : undefined;
      
      const response = await NotificationsAPI.getAllNotifications(
        undefined,
        typeParam,
        page,
        10
      );
      
      setNotifications(response.items);
      setTotalPages(Math.ceil(response.total / response.size));
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách thông báo');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    // This would be a real API call in production
    // For demo, using mock data
    setUsers([
      { id: 1, email: 'user1@example.com', full_name: 'Nguyễn Văn A', role: 'user', is_active: true, email_verified: true, created_at: new Date().toISOString() },
      { id: 2, email: 'user2@example.com', full_name: 'Trần Thị B', role: 'user', is_active: true, email_verified: true, created_at: new Date().toISOString() }
    ]);
  };

  const handleCreateNotification = () => {
    setCurrentNotification(undefined);
    setModalOpen(true);
  };

  const handleBulkNotification = () => {
    setBulkModalOpen(true);
  };

  const handleEditNotification = (notification: Notification) => {
    setCurrentNotification(notification);
    setModalOpen(true);
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      setLoading(true);
      await NotificationsAPI.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Không thể xóa thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotification = async (
    data: CreateNotificationRequest | UpdateNotificationRequest
  ) => {
    try {
      setLoading(true);
      
      if (currentNotification) {
        // Update existing notification
        const updated = await NotificationsAPI.updateNotification(
          currentNotification.id,
          data as UpdateNotificationRequest
        );
        
        setNotifications(prev => 
          prev.map(n => n.id === currentNotification.id ? updated : n)
        );
      } else {
        // Create new notification
        const created = await NotificationsAPI.createNotification(
          data as CreateNotificationRequest
        );
        
        setNotifications(prev => [created, ...prev]);
      }
      
      setModalOpen(false);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu thông báo');
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật kiểu dữ liệu của hàm sendBulk để khớp với interface
  const handleSendBulk = async (
    data: CreateNotificationRequest | UpdateNotificationRequest,
    _userId?: string
  ) => {
    try {
      setLoading(true);
      // Đảm bảo data có các trường cần thiết cho SendToAll API
      if ('title' in data && 'body' in data && 'type' in data) {
        const result = await NotificationsAPI.sendNotificationToAll(
          data.title, 
          data.body, 
          data.type
        );
        setBulkModalOpen(false);
        setError(null);
        alert(`Đã gửi thông báo thành công đến ${result.count} người dùng.`);
        fetchNotifications(); // Refresh the list
      }
    } catch (err: any) {
      setError(err?.message || 'Không thể gửi thông báo hàng loạt');
    } finally {
      setLoading(false);
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
  const filteredNotifications = notifications.filter(notification => 
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Quản lý thông báo</h1>
          <p className={styles.description}>
            Tạo và quản lý thông báo cho người dùng.
          </p>
        </div>
        <div className={styles.actionButtons}>
          <button onClick={handleBulkNotification} className={`${styles.createButton} ${styles.bulkButton}`}>
            Gửi thông báo hàng loạt
          </button>
          <button onClick={handleCreateNotification} className={styles.createButton}>
            + Tạo thông báo mới
          </button>
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
          <label htmlFor="admin-type-filter">Loại thông báo:</label>
          <select
            id="admin-type-filter"
            value={selectedType}
            onChange={handleTypeChange}
            className={styles.select}
          >
            <option value="all">Tất cả</option>
            <option value="general">Thông báo chung</option>
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
          <p>Hãy bắt đầu bằng cách tạo thông báo đầu tiên.</p>
          <button onClick={handleCreateNotification} className={styles.createEmptyButton}>
            + Tạo thông báo
          </button>
        </div>
      ) : (
        <>
          <div className={styles.notificationList}>
            {filteredNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                isAdmin={true}
                onDelete={handleDeleteNotification}
                onEdit={() => handleEditNotification(notification)}
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

      {/* Notification creation/edit modal */}
      <NotificationModal
        isOpen={modalOpen}
        notification={currentNotification}
        users={users}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveNotification}
      />

      {/* Bulk notification modal */}
      <NotificationModal
        isOpen={bulkModalOpen}
        users={users}
        onClose={() => setBulkModalOpen(false)}
        onSave={handleSendBulk}
        isBulk={true}
      />
    </div>
  );
};

export default AdminNotifications; 