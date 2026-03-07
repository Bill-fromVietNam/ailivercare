import React, { useState } from 'react';
import { Question } from './QuestionnaireEditor';
import styles from '../../styles/components/QuestionnaireEditor/QuestionEditor.module.css';

interface QuestionEditorProps {
  question: Question;
  onUpdateQuestion: (field: keyof Question, value: any) => void;
  onRemoveQuestion: () => void;
  isActive: boolean;
  onFocus: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onUpdateQuestion,
  onRemoveQuestion,
  isActive,
  onFocus
}) => {
  const [showOptionDialog, setShowOptionDialog] = useState<boolean>(false);
  const [newOption, setNewOption] = useState<{ value: string; label: string }>({
    value: '',
    label: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onUpdateQuestion(name as keyof Question, value);
  };

  const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateQuestion('required', e.target.checked);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    const requiresOptions = ['radio', 'checkbox', 'select'].includes(newType);
    
    // Initialize options if switching to a type that requires options
    if (requiresOptions && (!question.options || question.options.length === 0)) {
      onUpdateQuestion('options', [
        { value: 'option1', label: 'Tùy chọn 1' },
        { value: 'option2', label: 'Tùy chọn 2' }
      ]);
    }
    
    onUpdateQuestion('type', newType);
  };

  const handleAddOption = () => {
    if (!newOption.value || !newOption.label) return;
    
    const updatedOptions = [...(question.options || []), newOption];
    onUpdateQuestion('options', updatedOptions);
    setNewOption({ value: '', label: '' });
    setShowOptionDialog(false);
  };

  const handleRemoveOption = (indexToRemove: number) => {
    const updatedOptions = question.options?.filter((_, index) => index !== indexToRemove);
    onUpdateQuestion('options', updatedOptions);
  };

  const handleOptionChange = (index: number, field: string, value: string) => {
    if (!question.options) return;
    
    const updatedOptions = [...question.options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value
    };
    
    onUpdateQuestion('options', updatedOptions);
  };

  return (
    <div 
      className={`${styles.questionEditor} ${isActive ? styles.active : ''}`} 
      onClick={onFocus}
    >
      <div className={styles.questionHeader}>
        <div className={styles.questionType}>
          <select
            name="type"
            value={question.type}
            onChange={handleTypeChange}
            className={styles.typeSelect}
          >
            <option value="text">Văn bản ngắn</option>
            <option value="textarea">Văn bản dài</option>
            <option value="number">Số</option>
            <option value="radio">Lựa chọn một</option>
            <option value="checkbox">Lựa chọn nhiều</option>
            <option value="select">Danh sách thả xuống</option>
            <option value="date">Ngày tháng</option>
            <option value="time">Thời gian</option>
            <option value="email">Email</option>
            <option value="tel">Số điện thoại</option>
          </select>
          <div className={styles.requiredCheckbox}>
            <input
              type="checkbox"
              id={`required-${question.id}`}
              checked={question.required}
              onChange={handleRequiredChange}
            />
            <label htmlFor={`required-${question.id}`}>Bắt buộc</label>
          </div>
        </div>
        <button
          type="button"
          className={styles.removeButton}
          onClick={onRemoveQuestion}
          title="Xóa câu hỏi"
        >
          ×
        </button>
      </div>

      <div className={styles.questionContent}>
        <div className={styles.formGroup}>
          <label htmlFor={`question-text-${question.id}`}>Câu hỏi</label>
          <input
            type="text"
            id={`question-text-${question.id}`}
            name="text"
            value={question.text}
            onChange={handleInputChange}
            placeholder="Nhập câu hỏi..."
            className={styles.questionInput}
          />
        </div>

        {['radio', 'checkbox', 'select'].includes(question.type) && (
          <div className={styles.optionsSection}>
            <div className={styles.optionsHeader}>
              <h4>Tùy chọn</h4>
              <button
                type="button"
                onClick={() => setShowOptionDialog(true)}
                className={styles.addOptionButton}
              >
                + Thêm tùy chọn
              </button>
            </div>
            
            {showOptionDialog && (
              <div className={styles.optionDialog}>
                <div className={styles.optionForm}>
                  <div className={styles.optionField}>
                    <label htmlFor="option-value">Giá trị</label>
                    <input
                      type="text"
                      id="option-value"
                      value={newOption.value}
                      onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                      placeholder="ví dụ: option1"
                    />
                  </div>
                  <div className={styles.optionField}>
                    <label htmlFor="option-label">Nhãn hiển thị</label>
                    <input
                      type="text"
                      id="option-label"
                      value={newOption.label}
                      onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                      placeholder="ví dụ: Tùy chọn 1"
                    />
                  </div>
                  <div className={styles.optionActions}>
                    <button
                      type="button"
                      onClick={() => setShowOptionDialog(false)}
                      className={styles.cancelOptionButton}
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className={styles.saveOptionButton}
                      disabled={!newOption.value || !newOption.label}
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className={styles.optionsList}>
              {question.options?.map((option, index) => (
                <div key={index} className={styles.optionItem}>
                  <div className={styles.optionFields}>
                    <input
                      type="text"
                      value={option.value}
                      onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                      placeholder="Giá trị"
                      className={styles.optionInput}
                    />
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                      placeholder="Nhãn hiển thị"
                      className={styles.optionInput}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className={styles.removeOptionButton}
                    title="Xóa tùy chọn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionEditor; 