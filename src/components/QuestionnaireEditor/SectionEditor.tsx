import React from 'react';
import { Section } from './QuestionnaireEditor';
import styles from '../../styles/components/QuestionnaireEditor/SectionEditor.module.css';

interface SectionEditorProps {
  section: Section;
  onUpdateSection: (field: keyof Section, value: any) => void;
  onRemoveSection: () => void;
  onAddQuestion: () => void;
  children?: React.ReactNode;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  onUpdateSection,
  onRemoveSection,
  onAddQuestion,
  children
}) => {
  return (
    <div className={styles.sectionEditor}>
      <div className={styles.sectionHeader}>
        <input
          type="text"
          className={styles.sectionTitleInput}
          value={section.title}
          onChange={(e) => onUpdateSection('title', e.target.value)}
          placeholder="Nhập tiêu đề phần..."
        />
        <div className={styles.headerActions}>
          <button type="button" className={styles.removeButton} onClick={onRemoveSection}>
            Xóa phần
          </button>
        </div>
      </div>
      
      <div className={styles.sectionDescription}>
        <textarea
          className={styles.descriptionInput}
          value={section.description || ''}
          onChange={(e) => onUpdateSection('description', e.target.value)}
          placeholder="Nhập mô tả cho phần này (tùy chọn)..."
          rows={2}
        />
      </div>
      
      <div className={styles.questionsContainer}>
        <div className={styles.questionsHeader}>
          <h4 className={styles.questionsTitle}>Câu hỏi trong phần này</h4>
          <button type="button" className={styles.addQuestionButton} onClick={onAddQuestion}>
            + Thêm câu hỏi
          </button>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default SectionEditor; 