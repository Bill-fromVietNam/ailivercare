import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styles from '../../styles/pages/Admin/Questionnaires.module.css';
import QuestionnaireEditor, { QuestionnaireTemplate } from '../../components/QuestionnaireEditor/QuestionnaireEditor';
import AlertMessage from '../../components/AlertMessage';
import { QuestionnairesAPI } from '../../api/questionnaires';

// Định nghĩa lại interface TemplateWithSubmissions để kế thừa từ QuestionnaireTemplate
// Đảm bảo rằng tất cả các trường đều bắt buộc có để tránh undefined
interface TemplateWithSubmissions extends Omit<QuestionnaireTemplate, 'id' | 'status' | 'created_at' | 'updated_at'> {
  id: string; // Đảm bảo id luôn là string, không phải undefined
  status: 'active' | 'draft' | 'archived';
  created_at: string; // Đảm bảo created_at luôn là string
  updated_at: string; // Đảm bảo updated_at luôn là string
  submissionCount: number;
}


const AdminQuestionnaires: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<TemplateWithSubmissions[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [currentTemplate, setCurrentTemplate] = useState<QuestionnaireTemplate | null>(null);

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

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await QuestionnairesAPI.getAllQuestionnaires(1, 100);
        
        // Convert API response to TemplateWithSubmissions format
        const templatesWithSubmissions: TemplateWithSubmissions[] = response.items.map(template => ({
          ...template,
          id: String(template.id),
          status: (template.status || 'draft') as 'active' | 'draft' | 'archived',
          created_at: template.created_at || new Date().toISOString(),
          updated_at: template.updated_at || new Date().toISOString(),
          submissionCount: 0 // TODO: Get actual submission count from API
        }));
        
        setTemplates(templatesWithSubmissions);
      } catch (err: any) {
        console.error('Error fetching questionnaires:', err);
        setError(err?.message || 'Có lỗi xảy ra khi tải danh sách bảng câu hỏi');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return '---';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '---';
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '---';
    }
  };

  // Open editor with a new template
  const handleCreateNew = () => {
    setCurrentTemplate(null);
    setShowEditor(true);
  };

  // Open editor with an existing template
  const handleEditTemplate = (template: QuestionnaireTemplate) => {
    setCurrentTemplate(template);
    setShowEditor(true);
  };

  // Save template (create or update)
  const handleSaveTemplate = async (template: QuestionnaireTemplate) => {
    try {
      setLoading(true);
      
      const templateId = template.id || '';
      
      if (templateId && templates.some(t => t.id === templateId)) {
        // Update existing template
        await QuestionnairesAPI.updateQuestionnaire(templateId, template);
      } else {
        // Create new template
        await QuestionnairesAPI.createQuestionnaire(template);
      }
      
      // Refresh the templates list
      const response = await QuestionnairesAPI.getAllQuestionnaires(1, 100);
      const templatesWithSubmissions: TemplateWithSubmissions[] = response.items.map(t => ({
        ...t,
        id: String(t.id),
        status: (t.status || 'draft') as 'active' | 'draft' | 'archived',
        created_at: t.created_at || new Date().toISOString(),
        updated_at: t.updated_at || new Date().toISOString(),
        submissionCount: 0
      }));
      
      setTemplates(templatesWithSubmissions);
      setShowEditor(false);
      setError(null);
    } catch (err: any) {
      console.error('Error saving questionnaire:', err);
      setError(err?.message || 'Có lỗi xảy ra khi lưu bảng câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  // Delete template
  const handleDeleteTemplate = async (id: string) => {
    if (!id || !confirm('Bạn có chắc chắn muốn xóa bảng câu hỏi này không?')) return;
    
    try {
      setLoading(true);
      await QuestionnairesAPI.deleteQuestionnaire(id);
      
      // Refresh the templates list
      const response = await QuestionnairesAPI.getAllQuestionnaires(1, 100);
      const templatesWithSubmissions: TemplateWithSubmissions[] = response.items.map(t => ({
        ...t,
        id: String(t.id),
        status: (t.status || 'draft') as 'active' | 'draft' | 'archived',
        created_at: t.created_at || new Date().toISOString(),
        updated_at: t.updated_at || new Date().toISOString(),
        submissionCount: 0
      }));
      
      setTemplates(templatesWithSubmissions);
    } catch (err: any) {
      console.error('Error deleting questionnaire:', err);
      setError(err?.message || 'Có lỗi xảy ra khi xóa bảng câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  // Check if template has submissions
  const hasSubmissions = (id: string): boolean => {
    if (!id) return false;
    const template = templates.find(t => t.id === id);
    return !!template && template.submissionCount > 0;
  };

  // Toggle template status (active/draft)
  const toggleTemplateStatus = async (id: string, currentStatus: 'active' | 'draft' | 'archived') => {
    if (!id) return;
    
    try {
      setLoading(true);
      const newStatus = currentStatus === 'active' ? 'draft' : 'active';
      
      await QuestionnairesAPI.toggleQuestionnaireStatus(id, newStatus);
      
      // Refresh the templates list
      const response = await QuestionnairesAPI.getAllQuestionnaires(1, 100);
      const templatesWithSubmissions: TemplateWithSubmissions[] = response.items.map(t => ({
        ...t,
        id: String(t.id),
        status: (t.status || 'draft') as 'active' | 'draft' | 'archived',
        created_at: t.created_at || new Date().toISOString(),
        updated_at: t.updated_at || new Date().toISOString(),
        submissionCount: 0
      }));
      
      setTemplates(templatesWithSubmissions);
    } catch (err: any) {
      console.error('Error toggling questionnaire status:', err);
      setError(err?.message || 'Có lỗi xảy ra khi cập nhật trạng thái bảng câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setShowEditor(false);
    setCurrentTemplate(null);
  };

  // Function để tính tổng số câu hỏi trong các phần
  const countQuestions = (sections: Array<{questions?: any[]}> = []): number => {
    return sections.reduce((total: number, section) => {
      return total + (section.questions?.length || 0);
    }, 0);
  };

  if (showEditor) {
    return (
      <div className={styles.editorWrapper}>
        <QuestionnaireEditor
          initialData={currentTemplate || undefined}
          onSave={handleSaveTemplate}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Quản lý bảng câu hỏi</h1>
          <p className={styles.description}>
            Tạo và quản lý các bảng câu hỏi cho người dùng.
          </p>
        </div>
        <button onClick={handleCreateNew} className={styles.createButton}>
          + Tạo bảng câu hỏi mới
        </button>
      </div>

      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {loading && templates.length === 0 ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📝</div>
          <h2>Chưa có bảng câu hỏi nào</h2>
          <p>Bắt đầu bằng cách tạo bảng câu hỏi đầu tiên của bạn.</p>
          <button onClick={handleCreateNew} className={styles.createEmptyButton}>
            + Tạo bảng câu hỏi
          </button>
        </div>
      ) : (
        <div className={styles.templatesGrid}>
          {templates.map((template) => (
            <div key={template.id} className={styles.templateCard}>
              <div className={styles.templateHeader}>
                <div className={styles.templateStatus}>
                  <span className={`${styles.statusBadge} ${styles[template.status]}`}>
                    {template.status === 'active' ? 'Hoạt động' : 'Nháp'}
                  </span>
                  <div className={styles.submissionCount}>
                    {template.submissionCount} lượt trả lời
                  </div>
                </div>
                <div className={styles.templateActions}>
                  <button
                    className={styles.toggleStatusButton}
                    onClick={() => toggleTemplateStatus(template.id, template.status)}
                    title={template.status === 'active' ? 'Đổi sang nháp' : 'Kích hoạt bảng câu hỏi'}
                  >
                    {template.status === 'active' ? '⏸️' : '▶️'}
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditTemplate(template)}
                    title="Chỉnh sửa"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteTemplate(template.id)}
                    disabled={hasSubmissions(template.id)}
                    title={hasSubmissions(template.id) ? 'Không thể xóa bảng câu hỏi có dữ liệu' : 'Xóa'}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <h3 className={styles.templateTitle}>{template.title}</h3>
              <p className={styles.templateDescription}>{template.description || ''}</p>

              <div className={styles.templateMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Tạo:</span>
                  <span className={styles.metaValue}>{formatDate(template.created_at)}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Cập nhật:</span>
                  <span className={styles.metaValue}>{formatDate(template.updated_at)}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Số phần:</span>
                  <span className={styles.metaValue}>{template.sections?.length || 0}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Câu hỏi:</span>
                  <span className={styles.metaValue}>
                    {countQuestions(template.sections)}
                  </span>
                </div>
              </div>

              <div className={styles.templateFooter}>
                <button
                  className={styles.viewResultsButton}
                  disabled={template.submissionCount === 0}
                  onClick={() => navigate(`/admin/questionnaires/results/${template.id}`)}
                >
                  Xem kết quả
                </button>
                <button
                  className={styles.previewButton}
                  onClick={() => navigate(`/admin/questionnaires/preview/${template.id}`)}
                >
                  Xem trước
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminQuestionnaires; 