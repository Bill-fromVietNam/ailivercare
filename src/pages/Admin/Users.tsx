import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/pages/Admin/Users.module.css';
import { UserResponse } from '../../api/auth';
import { UsersAPI, UserUpdateRequest } from '../../api/users';
import useAuth from '../../hooks/useAuth';
import AlertMessage from '../../components/AlertMessage';

interface UserModalProps {
  isOpen: boolean;
  user?: UserResponse;
  onClose: () => void;
  onSave: (userId: number, data: UserUpdateRequest) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<UserUpdateRequest>({
    full_name: '',
    email: '',
    role: 'user'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email,
        role: user.role
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        role: 'user'
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onSave(user.id, formData);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Cập nhật thông tin người dùng</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="full_name">Họ tên</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="role">Vai trò</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
              <option value="doctor">Bác sĩ</option>
            </select>
          </div>
          
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={styles.saveButton}>
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminUsers: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [stats, setStats] = useState<any>({
    total_users: 0,
    active_users: 0,
    admin_users: 0,
    new_users_last_30_days: 0,
    verified_users: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserResponse | undefined>(undefined);
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
    fetchUsers();
    fetchUserStats();
  }, [page, selectedRole, selectedStatus]);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      let isActive: boolean | undefined = undefined;
      if (selectedStatus === 'active') isActive = true;
      if (selectedStatus === 'inactive') isActive = false;
      
      const role = selectedRole !== 'all' ? selectedRole : undefined;
      
      const response = await UsersAPI.getAllUsers(
        page,
        10,
        role,
        isActive,
        searchTerm || undefined
      );
      
      setUsers(response.items);
      setTotalPages(Math.ceil(response.total / response.size));
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserStats = async () => {
    try {
      const response = await UsersAPI.getUserStats();
      setStats(response);
    } catch (err: any) {
      console.error('Error fetching user stats:', err);
    }
  };
  
  const handleEditUser = (user: UserResponse) => {
    setCurrentUser(user);
    setModalOpen(true);
  };
  
  const handleSaveUser = async (userId: number, data: UserUpdateRequest) => {
    try {
      setLoading(true);
      const updatedUser = await UsersAPI.updateUser(userId, data);
      
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      setModalOpen(false);
      fetchUserStats(); // Refresh stats if role changed
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Không thể cập nhật thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác.')) {
      return;
    }
    
    try {
      setLoading(true);
      await UsersAPI.deleteUser(id);
      
      setUsers(prev => prev.filter(u => u.id !== id));
      fetchUserStats();
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Không thể xóa người dùng');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      setLoading(true);
      
      let updatedUser;
      if (currentActive) {
        updatedUser = await UsersAPI.deactivateUser(id);
      } else {
        updatedUser = await UsersAPI.activateUser(id);
      }
      
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      fetchUserStats();
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Không thể thay đổi trạng thái người dùng');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChangeRole = async (id: number, newRole: string) => {
    try {
      setLoading(true);
      const updatedUser = await UsersAPI.changeUserRole(id, newRole);
      
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      fetchUserStats();
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Không thể thay đổi vai trò người dùng');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchUsers();
  };
  
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
    setPage(1); // Reset to first page when changing filter
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setPage(1); // Reset to first page when changing filter
  };
  
  const handlePrevPage = () => {
    setPage(prev => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setPage(prev => Math.min(prev + 1, totalPages));
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Quản lý người dùng</h1>
          <p className={styles.description}>
            Xem và quản lý tất cả người dùng trong hệ thống.
          </p>
        </div>
      </div>
      
      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.total_users}</div>
          <div className={styles.statLabel}>Tổng số người dùng</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.active_users}</div>
          <div className={styles.statLabel}>Người dùng hoạt động</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.admin_users}</div>
          <div className={styles.statLabel}>Quản trị viên</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.verified_users}</div>
          <div className={styles.statLabel}>Đã xác thực email</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.new_users_last_30_days}</div>
          <div className={styles.statLabel}>Mới trong 30 ngày</div>
        </div>
      </div>
      
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="role-filter">Vai trò:</label>
          <select
            id="role-filter"
            value={selectedRole}
            onChange={handleRoleChange}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị viên</option>
            <option value="doctor">Bác sĩ</option>
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label htmlFor="status-filter">Trạng thái:</label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
        
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên, email..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            🔍
          </button>
        </form>
      </div>
      
      {loading && users.length === 0 ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : users.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>👤</div>
          <h2>Không tìm thấy người dùng nào</h2>
          <p>Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Xác thực</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.full_name || '---'}</td>
                    <td>{user.email}</td>
                    <td>
                      <div className={styles.roleSelector}>
                        <select
                          value={user.role}
                          onChange={(e) => handleChangeRole(user.id, e.target.value)}
                          className={`${styles.roleSelect} ${styles[user.role]}`}
                        >
                          <option value="user">Người dùng</option>
                          <option value="admin">Quản trị viên</option>
                          <option value="doctor">Bác sĩ</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <div 
                        className={`${styles.statusBadge} ${user.is_active ? styles.active : styles.inactive}`}
                        onClick={() => handleToggleActive(user.id, user.is_active)}
                      >
                        {user.is_active ? 'Hoạt động' : 'Không hoạt động'}
                      </div>
                    </td>
                    <td>
                      <div className={`${styles.verificationBadge} ${user.email_verified ? styles.verified : styles.unverified}`}>
                        {user.email_verified ? 'Đã xác thực' : 'Chưa xác thực'}
                      </div>
                    </td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleEditUser(user)}
                          className={`${styles.actionButton} ${styles.editButton}`}
                          title="Chỉnh sửa"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      
      <UserModal
        isOpen={modalOpen}
        user={currentUser}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default AdminUsers; 