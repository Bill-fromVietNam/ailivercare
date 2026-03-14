import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styles from '../../styles/pages/Admin/Recommendations.module.css';
import AlertMessage from '../../components/AlertMessage';
import RecommendationCard from '../../components/RecommendationCard';
import { 
  RecommendationsAPI, 
  Recommendation,
  CreateRecommendationRequest,
  UpdateRecommendationRequest 
} from '../../api/recommendations';
import { UserResponse } from '../../api/auth';

interface RecommendationModalProps {
  isOpen: boolean;
  recommendation?: Recommendation;
  users: UserResponse[];
  onClose: () => void;
  onSave: (data: CreateRecommendationRequest | UpdateRecommendationRequest, userId?: string) => void;
}

const RecommendationModal: React.FC<RecommendationModalProps> = ({
  isOpen,
  recommendation,
  users,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<CreateRecommendationRequest>({
    title: '',
    description: '',
    category: 'lifestyle',
    priority: 3,
    content_json: {},
    source: 'admin'
  });

  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [contentText, setContentText] = useState<string>('{}');
  
  useEffect(() => {
    if (recommendation) {
      setFormData({
        title: recommendation.title,
        description: recommendation.description,
        category: recommendation.category,
        priority: recommendation.priority,
        content_json: recommendation.content_json,
        source: recommendation.source,
        source_id: recommendation.source_id
      });
      setContentText(JSON.stringify(recommendation.content_json, null, 2));
    } else {
      // Reset form for new recommendation
      setFormData({
        title: '',
        description: '',
        category: 'lifestyle',
        priority: 3,
        content_json: {},
        source: 'admin'
      });
      setContentText('{}');
      setSelectedUserId(users.length > 0 ? users[0].id.toString() : '');
    }
  }, [recommendation, users]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentText(e.target.value);
    try {
      const parsedContent = JSON.parse(e.target.value);
      setFormData(prev => ({ ...prev, content_json: parsedContent }));
    } catch (error) {
      // Invalid JSON, we'll handle it on submit
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate JSON
      const parsedContent = JSON.parse(contentText);
      const dataToSave = {
        ...formData,
        content_json: parsedContent
      };
      
      onSave(dataToSave, selectedUserId);
    } catch (error) {
      alert('Nội dung JSON không hợp lệ. Vui lòng kiểm tra lại.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{recommendation ? 'Chỉnh sửa khuyến nghị' : 'Tạo khuyến nghị mới'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {!recommendation && (
            <div className={styles.formGroup}>
              <label htmlFor="user">Người dùng</label>
              <select
                id="user"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
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
          
          <div className={styles.formGroup}>
            <label htmlFor="title">Tiêu đề</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="category">Danh mục</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="diet">Chế độ ăn</option>
                <option value="exercise">Tập luyện</option>
                <option value="lifestyle">Lối sống</option>
                <option value="medical">Y tế</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="priority">Mức ưu tiên</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={handlePriorityChange}
                required
              >
                <option value="1">1 - Thấp nhất</option>
                <option value="2">2 - Thấp</option>
                <option value="3">3 - Trung bình</option>
                <option value="4">4 - Cao</option>
                <option value="5">5 - Cao nhất</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="source">Nguồn</label>
              <select
                id="source"
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                required
              >
                <option value="admin">Admin</option>
                <option value="questionnaire">Bảng câu hỏi</option>
                <option value="lab">Kết quả xét nghiệm</option>
                <option value="ai">AI</option>
              </select>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="content_json">Nội dung (JSON)</label>
            <textarea
              id="content_json"
              value={contentText}
              onChange={handleContentChange}
              rows={8}
              className={styles.jsonEditor}
              required
            />
          </div>
          
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={styles.saveButton}>
              {recommendation ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminRecommendations: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentRecommendation, setCurrentRecommendation] = useState<Recommendation | undefined>(undefined);
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
    fetchRecommendations();
    fetchUsers();
  }, [page, selectedCategory, selectedSource]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const categoryParam = selectedCategory !== 'all' ? selectedCategory : undefined;
      const sourceParam = selectedSource !== 'all' ? selectedSource : undefined;
      
      const response = await RecommendationsAPI.getAllRecommendations(
        undefined,
        categoryParam,
        sourceParam,
        page,
        10
      );
      
      setRecommendations(response.items);
      setTotalPages(Math.ceil(response.total / response.size));
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách khuyến nghị');
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

  const handleCreateRecommendation = () => {
    setCurrentRecommendation(undefined);
    setModalOpen(true);
  };

  const handleEditRecommendation = (recommendation: Recommendation) => {
    setCurrentRecommendation(recommendation);
    setModalOpen(true);
  };

  const handleDeleteRecommendation = async (id: string) => {
    try {
      setLoading(true);
      await RecommendationsAPI.deleteRecommendation(id);
      setRecommendations(prev => prev.filter(r => r.id !== id));
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Không thể xóa khuyến nghị');
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveRecommendation = async (id: string) => {
    try {
      setLoading(true);
      await RecommendationsAPI.archiveRecommendation(id);
      // Update local state
      setRecommendations(prev => 
        prev.map(r => r.id === id ? { ...r, is_archived: true } : r)
      );
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu trữ khuyến nghị');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreRecommendation = async (id: string) => {
    try {
      setLoading(true);
      await RecommendationsAPI.restoreRecommendation(id);
      // Update local state
      setRecommendations(prev => 
        prev.map(r => r.id === id ? { ...r, is_archived: false } : r)
      );
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Không thể khôi phục khuyến nghị');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecommendation = async (
    data: CreateRecommendationRequest | UpdateRecommendationRequest,
    userId?: string
  ) => {
    try {
      setLoading(true);
      
      if (currentRecommendation) {
        // Update existing recommendation
        const updated = await RecommendationsAPI.updateRecommendation(
          currentRecommendation.id,
          data as UpdateRecommendationRequest
        );
        
        setRecommendations(prev => 
          prev.map(r => r.id === currentRecommendation.id ? updated : r)
        );
      } else if (userId) {
        // Create new recommendation
        const created = await RecommendationsAPI.createRecommendation(
          userId,
          data as CreateRecommendationRequest
        );
        
        setRecommendations(prev => [created, ...prev]);
      }
      
      setModalOpen(false);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu khuyến nghị');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecommendations();
  };

  const handlePrevPage = () => {
    setPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage(prev => Math.min(prev + 1, totalPages));
  };

  // Filter recommendations by search term
  const filteredRecommendations = recommendations.filter(rec => 
    rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Quản lý khuyến nghị</h1>
          <p className={styles.description}>
            Tạo và quản lý các khuyến nghị cho người dùng.
          </p>
        </div>
        <button onClick={handleCreateRecommendation} className={styles.createButton}>
          + Tạo khuyến nghị mới
        </button>
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
          <label htmlFor="category-filter">Danh mục:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="diet">Chế độ ăn</option>
            <option value="exercise">Tập luyện</option>
            <option value="lifestyle">Lối sống</option>
            <option value="medical">Y tế</option>
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label htmlFor="source-filter">Nguồn:</label>
          <select
            id="source-filter"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="admin">Admin</option>
            <option value="questionnaire">Bảng câu hỏi</option>
            <option value="lab">Kết quả xét nghiệm</option>
            <option value="ai">AI</option>
          </select>
        </div>
        
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            🔍
          </button>
        </form>
      </div>

      {loading && recommendations.length === 0 ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : filteredRecommendations.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📝</div>
          <h2>Không có khuyến nghị nào</h2>
          <p>Bắt đầu bằng cách tạo khuyến nghị đầu tiên của bạn.</p>
          <button onClick={handleCreateRecommendation} className={styles.createEmptyButton}>
            + Tạo khuyến nghị
          </button>
        </div>
      ) : (
        <>
          <div className={styles.recommendationsGrid}>
            {filteredRecommendations.map(recommendation => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                isAdmin={true}
                onArchive={handleArchiveRecommendation}
                onRestore={handleRestoreRecommendation}
                onEdit={handleEditRecommendation}
                onDelete={handleDeleteRecommendation}
              />
            ))}
          </div>
          
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
        </>
      )}

      <RecommendationModal
        isOpen={modalOpen}
        recommendation={currentRecommendation}
        users={users}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveRecommendation}
      />
    </div>
  );
};

export default AdminRecommendations; 