import React from 'react';
import { Recommendation } from '../api/recommendations';
import styles from '../styles/components/RecommendationCard.module.css';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  onEdit?: (recommendation: Recommendation) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onArchive,
  onRestore,
  onEdit,
  onDelete,
  isAdmin = false
}) => {
  const {
    id,
    title,
    description,
    category,
    priority,
    is_archived,
    created_at,
    source
  } = recommendation;
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'diet': return 'Chế độ ăn';
      case 'exercise': return 'Tập luyện';
      case 'lifestyle': return 'Lối sống';
      case 'medical': return 'Y tế';
      default: return category;
    }
  };
  
  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'diet': return '🍎';
      case 'exercise': return '🏋️';
      case 'lifestyle': return '🌿';
      case 'medical': return '💊';
      default: return '📝';
    }
  };
  
  const getPriorityLabel = (priority: number): string => {
    switch (priority) {
      case 1: return 'Thấp nhất';
      case 2: return 'Thấp';
      case 3: return 'Trung bình';
      case 4: return 'Cao';
      case 5: return 'Cao nhất';
      default: return `Ưu tiên ${priority}`;
    }
  };
  
  const getSourceLabel = (source: string): string => {
    switch (source) {
      case 'questionnaire': return 'Bảng câu hỏi';
      case 'lab': return 'Kết quả xét nghiệm';
      case 'ai': return 'AI đề xuất';
      default: return source;
    }
  };

  const handleArchiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (is_archived && onRestore) {
      onRestore(id);
    } else if (!is_archived && onArchive) {
      onArchive(id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(recommendation);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Bạn có chắc chắn muốn xóa khuyến nghị này không?')) {
      onDelete(id);
    }
  };

  return (
    <div className={`${styles.card} ${is_archived ? styles.archived : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.categoryBadge}>
          <span className={styles.categoryIcon}>{getCategoryIcon(category)}</span>
          <span className={styles.categoryLabel}>{getCategoryLabel(category)}</span>
        </div>
        <div className={styles.priority}>
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`${styles.priorityDot} ${i < priority ? styles.active : ''}`}
            />
          ))}
          <span className={styles.priorityLabel}>{getPriorityLabel(priority)}</span>
        </div>
      </div>
      
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      
      <div className={styles.footer}>
        <div className={styles.meta}>
          <div className={styles.source}>
            <span className={styles.sourceLabel}>Nguồn: </span>
            {getSourceLabel(source)}
          </div>
          <div className={styles.date}>
            <span className={styles.dateLabel}>Ngày tạo: </span>
            {formatDate(created_at)}
          </div>
        </div>
        
        <div className={styles.actions}>
          {isAdmin && (
            <>
              <button
                className={`${styles.actionButton} ${styles.editButton}`}
                onClick={handleEditClick}
                title="Chỉnh sửa"
              >
                ✏️
              </button>
              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={handleDeleteClick}
                title="Xóa"
              >
                🗑️
              </button>
            </>
          )}
          
          <button
            className={`${styles.actionButton} ${is_archived ? styles.restoreButton : styles.archiveButton}`}
            onClick={handleArchiveClick}
            title={is_archived ? "Khôi phục" : "Lưu trữ"}
          >
            {is_archived ? '🔄' : '📁'}
          </button>
        </div>
      </div>
      
      {is_archived && (
        <div className={styles.archivedBadge}>Đã lưu trữ</div>
      )}
    </div>
  );
};

export default RecommendationCard; 