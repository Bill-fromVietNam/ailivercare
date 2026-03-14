import React, { useState } from 'react';
import SectionEditor from './SectionEditor';
import QuestionEditor from './QuestionEditor';
import styles from '../../styles/components/QuestionnaireEditor/QuestionnaireEditor.module.css';

export interface Question {
  id: string;
  text: string;
  type: string;
  options?: Array<{ value: string; label: string }>;
  required: boolean;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface QuestionnaireTemplate {
  id?: string;
  title: string;
  description?: string;
  sections: Section[];
  status?: 'active' | 'draft' | 'archived';
  created_at?: string;
  updated_at?: string;
}

interface QuestionnaireEditorProps {
  initialData?: QuestionnaireTemplate;
  onSave: (template: QuestionnaireTemplate) => void;
  onCancel: () => void;
}

const QuestionnaireEditor: React.FC<QuestionnaireEditorProps> = ({
  initialData,
  onSave,
  onCancel
}) => {
  const [template, setTemplate] = useState<QuestionnaireTemplate>(
    initialData || {
      title: '',
      description: '',
      sections: []
    }
  );

  const [currentSectionIndex, setCurrentSectionIndex] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTemplate(prev => ({ ...prev, [name]: value }));
  };

  // Add a new section
  const handleAddSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: `Phần ${template.sections.length + 1}`,
      description: '',
      questions: []
    };
    
    setTemplate(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    
    // Focus on the new section
    setCurrentSectionIndex(template.sections.length);
    setCurrentQuestionIndex(null);
  };

  // Remove a section
  const handleRemoveSection = (indexToRemove: number) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== indexToRemove)
    }));
    
    // Reset current indices if needed
    if (currentSectionIndex === indexToRemove) {
      setCurrentSectionIndex(null);
      setCurrentQuestionIndex(null);
    } else if (currentSectionIndex && currentSectionIndex > indexToRemove) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  // Update a section
  const handleUpdateSection = (sectionIndex: number, field: keyof Section, value: any) => {
    setTemplate(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        [field]: value
      };
      return { ...prev, sections: updatedSections };
    });
  };

  // Add a question to a section
  const handleAddQuestion = (sectionIndex: number) => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      text: 'Câu hỏi mới',
      type: 'text',
      required: false
    };
    
    setTemplate(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        questions: [...updatedSections[sectionIndex].questions, newQuestion]
      };
      return { ...prev, sections: updatedSections };
    });
    
    // Focus on the new question
    setCurrentSectionIndex(sectionIndex);
    setCurrentQuestionIndex(template.sections[sectionIndex].questions.length);
  };

  // Remove a question
  const handleRemoveQuestion = (sectionIndex: number, questionIndex: number) => {
    setTemplate(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        questions: updatedSections[sectionIndex].questions.filter((_, index) => index !== questionIndex)
      };
      return { ...prev, sections: updatedSections };
    });
    
    // Reset current question index if needed
    if (currentSectionIndex === sectionIndex && currentQuestionIndex === questionIndex) {
      setCurrentQuestionIndex(null);
    } else if (currentSectionIndex === sectionIndex && currentQuestionIndex && currentQuestionIndex > questionIndex) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Update a question
  const handleUpdateQuestion = (sectionIndex: number, questionIndex: number, field: keyof Question, value: any) => {
    setTemplate(prev => {
      const updatedSections = [...prev.sections];
      const updatedQuestions = [...updatedSections[sectionIndex].questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        [field]: value
      };
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        questions: updatedQuestions
      };
      return { ...prev, sections: updatedSections };
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(template);
  };

  return (
    <div className={styles.editor}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {initialData ? 'Chỉnh sửa bảng câu hỏi' : 'Tạo bảng câu hỏi mới'}
          </h2>
          <div className={styles.actions}>
            <button type="button" onClick={onCancel} className={styles.cancelButton}>
              Hủy
            </button>
            <button type="submit" className={styles.saveButton}>
              Lưu bảng câu hỏi
            </button>
          </div>
        </div>

        <div className={styles.basicInfo}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>Tiêu đề</label>
            <input
              type="text"
              id="title"
              name="title"
              value={template.title}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Nhập tiêu đề bảng câu hỏi..."
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={template.description || ''}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Nhập mô tả cho bảng câu hỏi (tùy chọn)..."
              rows={3}
            />
          </div>
        </div>
        
        <div className={styles.sectionsContainer}>
          <div className={styles.sectionsHeader}>
            <h3 className={styles.sectionsTitle}>Các phần</h3>
            <button 
              type="button" 
              onClick={handleAddSection} 
              className={styles.addSectionButton}
            >
              + Thêm phần mới
            </button>
          </div>
          
          {template.sections.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Chưa có phần nào trong bảng câu hỏi này.</p>
              <button 
                type="button" 
                onClick={handleAddSection} 
                className={styles.emptyStateButton}
              >
                + Thêm phần đầu tiên
              </button>
            </div>
          ) : (
            <div className={styles.sectionsList}>
              {template.sections.map((section, sectionIndex) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  onUpdateSection={(field, value) => handleUpdateSection(sectionIndex, field, value)}
                  onRemoveSection={() => handleRemoveSection(sectionIndex)}
                  onAddQuestion={() => handleAddQuestion(sectionIndex)}
                >
                  {section.questions.length === 0 ? (
                    <div className={styles.emptyQuestions}>
                      <p>Chưa có câu hỏi nào trong phần này.</p>
                    </div>
                  ) : (
                    <div className={styles.questionsList}>
                      {section.questions.map((question, questionIndex) => (
                        <QuestionEditor
                          key={question.id}
                          question={question}
                          onUpdateQuestion={(field, value) => handleUpdateQuestion(sectionIndex, questionIndex, field, value)}
                          onRemoveQuestion={() => handleRemoveQuestion(sectionIndex, questionIndex)}
                          isActive={currentSectionIndex === sectionIndex && currentQuestionIndex === questionIndex}
                          onFocus={() => {
                            setCurrentSectionIndex(sectionIndex);
                            setCurrentQuestionIndex(questionIndex);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </SectionEditor>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuestionnaireEditor; 