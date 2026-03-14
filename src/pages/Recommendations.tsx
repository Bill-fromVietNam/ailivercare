import React, { useState, useEffect } from 'react';
import styles from '../styles/pages/Recommendations.module.css';
import { RecommendationsAPI, Recommendation } from '../api/recommendations';
import RecommendationCard from '../components/RecommendationCard';
import ThemeToggle from '../components/ThemeToggle';
import AlertMessage from '../components/AlertMessage';

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchRecommendations();
  }, [page, selectedCategory, showArchived]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const categoryParam = selectedCategory !== 'all' ? selectedCategory : undefined;
      
      const response = await RecommendationsAPI.getUserRecommendations(
        categoryParam,
        showArchived,
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

  const handleArchiveRecommendation = async (id: string) => {
    try {
      await RecommendationsAPI.archiveRecommendation(id);
      // Update local state
      setRecommendations(prev => 
        prev.map(r => r.id === id ? { ...r, is_archived: true } : r)
      );
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu trữ khuyến nghị');
    }
  };

  const handleRestoreRecommendation = async (id: string) => {
    try {
      await RecommendationsAPI.restoreRecommendation(id);
      // Update local state
      setRecommendations(prev => 
        prev.map(r => r.id === id ? { ...r, is_archived: false } : r)
      );
    } catch (err: any) {
      setError(err?.message || 'Không thể khôi phục khuyến nghị');
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
          <h1 className={styles.title}>Khuyến nghị</h1>
          <p className={styles.description}>
            Những khuyến nghị cá nhân hóa dựa trên thông tin sức khỏe của bạn.
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
          <label htmlFor="show-archived">
            <input
              type="checkbox"
              id="show-archived"
              checked={showArchived}
              onChange={() => setShowArchived(prev => !prev)}
            />
            Hiển thị đã lưu trữ
          </label>
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
          <div className={styles.emptyStateIcon}>📋</div>
          <h2>Không có khuyến nghị nào</h2>
          <p>
            Hiện tại bạn chưa có khuyến nghị nào. 
            Hãy hoàn thành các bảng câu hỏi đánh giá để nhận khuyến nghị cá nhân hóa.
          </p>
          <button 
            onClick={() => window.location.href = '/questionnaires'} 
            className={styles.actionButton}
          >
            Đi đến Bảng câu hỏi
          </button>
        </div>
      ) : (
        <>
          <div className={styles.recommendationsGrid}>
            {filteredRecommendations.map(recommendation => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                onArchive={handleArchiveRecommendation}
                onRestore={handleRestoreRecommendation}
                isAdmin={false}
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
        <h3 className={styles.infoTitle}>Về các khuyến nghị</h3>
        <p className={styles.infoText}>
          Khuyến nghị được cá nhân hóa dựa trên thông tin sức khỏe của bạn, bao gồm kết quả 
          bảng câu hỏi đánh giá và xét nghiệm gan. Các khuyến nghị được phân loại thành 
          các nhóm: Chế độ ăn, Tập luyện, Lối sống và Y tế. Mỗi khuyến nghị có mức độ ưu tiên khác nhau.
        </p>
        <div className={styles.priorityLegend}>
          <div className={styles.legendItem}>
            <div className={styles.priorityDots}>
              <span className={styles.priorityDot}></span>
            </div>
            <span>Thấp nhất</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.priorityDots}>
              <span className={styles.priorityDot}></span>
              <span className={styles.priorityDot}></span>
            </div>
            <span>Thấp</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.priorityDots}>
              <span className={styles.priorityDot}></span>
              <span className={styles.priorityDot}></span>
              <span className={styles.priorityDot}></span>
            </div>
            <span>Trung bình</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.priorityDots}>
              <span className={styles.priorityDot}></span>
              <span className={styles.priorityDot}></span>
              <span className={styles.priorityDot}></span>
              <span className={styles.priorityDot}></span>
            </div>
            <span>Cao</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.priorityDots}>
              <span className={styles.priorityDot}></span>
              <span className={styles.priorityDot}></span>
              <span className={styles.priorityDot}></span>
              <span className={styles.priorityDot}></span>
              <span className={styles.priorityDot}></span>
            </div>
            <span>Cao nhất</span>
          </div>
        </div>
      </div>
      
      <ThemeToggle />
    </div>
  );
};

export default Recommendations; 