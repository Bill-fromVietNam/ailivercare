import React, { useState, useEffect } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import { QuestionnairesAPI } from '../api/questionnaires';
import { QuestionnaireTemplate, Section, Question as BaseQuestion } from '../components/QuestionnaireEditor/QuestionnaireEditor';
import styles from '../styles/pages/Questionnaires.module.css';

// Extend Question interface to include dependsOn
interface Question extends BaseQuestion {
  dependsOn?: {
    questionId: string;
    value: string;
  };
}

interface Questionnaire {
  id: number;
  title: string;
  description: string;
  timeEstimate: string;
  sections: Section[];
  status: 'not_started' | 'in_progress' | 'completed' | 'expired';
  deadline?: string;
  completedAt?: string;
  progress: number;
}


// Dữ liệu mẫu
const sampleQuestionnaires: Questionnaire[] = [
  {
    id: 1,
    title: 'Đánh giá triệu chứng và yếu tố nguy cơ',
    description: 'Bảng câu hỏi này giúp đánh giá các triệu chứng và yếu tố nguy cơ liên quan đến gan của bạn.',
    timeEstimate: '5-10 phút',
    status: 'not_started',
    progress: 0,
    sections: [
      {
        id: 'personal_info',
        title: 'Thông tin cá nhân',
        description: 'Thông tin cơ bản về bạn',
    questions: [
      {
            id: 'age',
            text: 'Bạn bao nhiêu tuổi?',
            type: 'radio',
            required: true,
            options: [
              { value: 'under_30', label: 'Dưới 30 tuổi' },
              { value: '30_to_45', label: '30-45 tuổi' },
              { value: '46_to_60', label: '46-60 tuổi' },
              { value: 'over_60', label: 'Trên 60 tuổi' }
            ]
          },
          {
            id: 'gender',
            text: 'Giới tính của bạn?',
        type: 'radio',
            required: true,
            options: [
              { value: 'male', label: 'Nam' },
              { value: 'female', label: 'Nữ' },
              { value: 'other', label: 'Khác' }
            ]
          }
        ]
      },
      {
        id: 'symptoms',
        title: 'Triệu chứng',
        description: 'Các triệu chứng bạn có thể gặp phải',
        questions: [
          {
            id: 'fatigue',
            text: 'Bạn có thường xuyên cảm thấy mệt mỏi không?',
            type: 'radio',
            required: true,
            options: [
              { value: 'never', label: 'Không bao giờ' },
              { value: 'sometimes', label: 'Thỉnh thoảng' },
              { value: 'often', label: 'Thường xuyên' },
              { value: 'always', label: 'Luôn luôn' }
            ]
      },
      {
            id: 'jaundice',
            text: 'Bạn có từng bị vàng da hoặc vàng mắt không?',
            type: 'radio',
            required: true,
            options: [
              { value: 'no', label: 'Không' },
              { value: 'yes', label: 'Có' }
            ]
          },
          {
            id: 'jaundice_details',
            text: 'Nếu có, vui lòng mô tả chi tiết hơn',
            type: 'textarea',
            required: false,
            dependsOn: {
              questionId: 'jaundice',
              value: 'yes'
            }
          } as Question,
      {
            id: 'other_symptoms',
            text: 'Bạn có gặp phải triệu chứng nào sau đây? (Chọn tất cả các triệu chứng phù hợp)',
        type: 'checkbox',
            required: false,
            options: [
              { value: 'pain', label: 'Đau ở vùng bụng trên bên phải' },
              { value: 'itching', label: 'Ngứa da' },
              { value: 'dark_urine', label: 'Nước tiểu sẫm màu' },
              { value: 'pale_stool', label: 'Phân nhạt màu' },
              { value: 'appetite_loss', label: 'Chán ăn' },
              { value: 'nausea', label: 'Buồn nôn' }
            ]
          }
        ]
      },
      {
        id: 'risk_factors',
        title: 'Yếu tố nguy cơ',
        description: 'Các yếu tố có thể ảnh hưởng đến sức khỏe gan của bạn',
        questions: [
          {
            id: 'alcohol',
            text: 'Bạn có thường xuyên uống rượu bia không?',
            type: 'radio',
            required: true,
            options: [
              { value: 'never', label: 'Không bao giờ' },
              { value: 'occasionally', label: 'Thỉnh thoảng (1-2 lần/tháng)' },
              { value: 'weekly', label: 'Hàng tuần (1-2 lần/tuần)' },
              { value: 'frequently', label: 'Thường xuyên (3+ lần/tuần)' },
              { value: 'daily', label: 'Hàng ngày' }
            ]
          },
          {
            id: 'smoking',
            text: 'Bạn có hút thuốc không?',
            type: 'radio',
            required: true,
            options: [
              { value: 'never', label: 'Không bao giờ' },
              { value: 'former', label: 'Đã bỏ' },
              { value: 'occasional', label: 'Thỉnh thoảng' },
              { value: 'regular', label: 'Thường xuyên' }
            ]
          },
      {
            id: 'health_rating',
            text: 'Bạn đánh giá sức khỏe tổng thể của mình như thế nào?',
            type: 'scale',
            required: true,
            options: [
              { value: '1', label: 'Rất kém' },
              { value: '2', label: 'Kém' },
              { value: '3', label: 'Trung bình' },
              { value: '4', label: 'Tốt' },
              { value: '5', label: 'Rất tốt' }
            ]
          },
          {
            id: 'additional_info',
            text: 'Bạn có thông tin gì khác muốn chia sẻ với bác sĩ không?',
            type: 'textarea',
        required: false
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Đánh giá chế độ ăn uống',
    description: 'Bảng câu hỏi này đánh giá chế độ ăn uống và ảnh hưởng của nó đến sức khỏe gan.',
    timeEstimate: '8-12 phút',
    status: 'in_progress',
    progress: 35,
    sections: [
      {
        id: 'eating_habits',
        title: 'Thói quen ăn uống',
        questions: [
          {
            id: 'meals_per_day',
            text: 'Bạn ăn bao nhiêu bữa một ngày?',
        type: 'radio',
            required: true,
            options: [
              { value: '1_to_2', label: '1-2 bữa' },
              { value: '3', label: '3 bữa' },
              { value: '4_to_5', label: '4-5 bữa' },
              { value: 'more_than_5', label: 'Hơn 5 bữa' }
]
          },
          // Các câu hỏi khác về thói quen ăn uống
        ]
      },
      // Các sections khác
    ]
  },
  {
    id: 3,
    title: 'Đánh giá hoạt động thể chất',
    description: 'Bảng câu hỏi này đánh giá mức độ hoạt động thể chất và ảnh hưởng của nó đến sức khỏe.',
    timeEstimate: '5 phút',
    status: 'completed',
    completedAt: '2025-08-15',
    progress: 100,
    sections: []
  }
];

const Questionnaires: React.FC = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>(sampleQuestionnaires);
  const [apiQuestionnaires, setApiQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeQuestionnaire, setActiveQuestionnaire] = useState<Questionnaire | null>(null);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Convert API data to Questionnaire format
  const convertApiToQuestionnaire = (apiData: QuestionnaireTemplate): Questionnaire => {
    return {
      id: parseInt(apiData.id || '0') + 1000, // Offset để tránh conflict với mock data
      title: apiData.title,
      description: apiData.description || 'Bảng câu hỏi từ hệ thống',
      timeEstimate: '5-10 phút',
      sections: apiData.sections || [],
      status: apiData.status === 'active' ? 'not_started' : 'expired',
      progress: 0
    };
  };

  // Fetch questionnaires from API
  const fetchApiQuestionnaires = async () => {
    try {
      setLoading(true);
      const response = await QuestionnairesAPI.getUserQuestionnaires(1, 100);
      const convertedQuestionnaires = response.items.map(convertApiToQuestionnaire);
      setApiQuestionnaires(convertedQuestionnaires);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching questionnaires:', err);
      setError('Không thể tải bảng câu hỏi từ hệ thống');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchApiQuestionnaires();
  }, []);

  // Tải dữ liệu câu trả lời đã lưu
  useEffect(() => {
    if (activeQuestionnaire) {
      // Mô phỏng việc tải dữ liệu từ localStorage hoặc API
      const savedAnswers = localStorage.getItem(`questionnaire_${activeQuestionnaire.id}`);
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
    }
  }, [activeQuestionnaire]);

  // Lưu tự động khi có thay đổi câu trả lời
  useEffect(() => {
    if (activeQuestionnaire && Object.keys(answers).length > 0) {
      const saveTimer = setTimeout(() => {
        saveAnswers();
      }, 1000);
      
      return () => clearTimeout(saveTimer);
    }
  }, [answers]);

  // Lưu câu trả lời
  const saveAnswers = () => {
    if (!activeQuestionnaire) return;
    
    setSaveStatus('saving');
    
    // Mô phỏng API call
    setTimeout(() => {
      try {
        localStorage.setItem(`questionnaire_${activeQuestionnaire.id}`, JSON.stringify(answers));
        
        // Cập nhật trạng thái tiến độ
        const updatedQuestionnaires = questionnaires.map(q => {
          if (q.id === activeQuestionnaire.id) {
            const progress = calculateProgress();
            return {
              ...q,
              status: progress === 100 ? 'completed' as const : 'in_progress' as const,
              progress: progress,
              completedAt: progress === 100 ? new Date().toISOString() : undefined
            };
          }
          return q;
        });
        
        setQuestionnaires(updatedQuestionnaires);
        setSaveStatus('saved');
      } catch (error) {
        console.error('Error saving answers:', error);
        setSaveStatus('error');
      }
    }, 500);
  };

  // Xử lý thay đổi câu trả lời
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: value };
      
      // Xóa các câu trả lời phụ thuộc nếu giá trị thay đổi
      const currentSectionData = activeQuestionnaire?.sections[currentSection];
      if (currentSectionData) {
        currentSectionData.questions.forEach(question => {
          if ((question as Question).dependsOn?.questionId === questionId && (question as Question).dependsOn?.value !== value) {
            delete newAnswers[question.id];
          }
        });
      }
      
      return newAnswers;
    });
    
    // Xóa lỗi nếu đã trả lời
    if (formErrors[questionId]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
    
    setSaveStatus('idle');
  };

  // Kiểm tra hiển thị câu hỏi dựa trên điều kiện
  const shouldShowQuestion = (question: Question): boolean => {
    if (!(question as Question).dependsOn) return true;
    
    const { questionId, value } = (question as Question).dependsOn!;
    return answers[questionId] === value;
  };

  // Tính toán phần trăm hoàn thành
  const calculateProgress = (): number => {
    if (!activeQuestionnaire) return 0;
    
    let totalRequired = 0;
    let answered = 0;
    
    activeQuestionnaire.sections.forEach(section => {
      section.questions.forEach(question => {
        if (question.required && shouldShowQuestion(question)) {
          totalRequired++;
          if (answers[question.id] !== undefined && answers[question.id] !== '') {
            answered++;
          }
        }
      });
    });
    
    return totalRequired > 0 ? Math.round((answered / totalRequired) * 100) : 0;
  };

  // Xác thực section hiện tại
  const validateCurrentSection = (): boolean => {
    if (!activeQuestionnaire) return false;
    
    const currentSectionData = activeQuestionnaire.sections[currentSection];
    const errors: Record<string, string> = {};
    
    currentSectionData.questions.forEach(question => {
      if (question.required && shouldShowQuestion(question)) {
        const answer = answers[question.id];
        
        if (answer === undefined || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
          errors[question.id] = 'Vui lòng trả lời câu hỏi này';
        }
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Chuyển đến phần tiếp theo
  const goToNextSection = () => {
    if (!activeQuestionnaire) return;
    
    if (validateCurrentSection()) {
      if (currentSection < activeQuestionnaire.sections.length - 1) {
        setCurrentSection(currentSection + 1);
        saveAnswers();
      } else {
        // Hoàn thành bảng câu hỏi
        completeQuestionnaire();
      }
    }
  };

  // Quay lại phần trước
  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Hoàn thành bảng câu hỏi
  const completeQuestionnaire = () => {
    if (!activeQuestionnaire) return;
    
    // Cập nhật trạng thái hoàn thành
    const updatedQuestionnaires = questionnaires.map(q => {
      if (q.id === activeQuestionnaire.id) {
        return {
          ...q,
          status: 'completed' as const,
          progress: 100,
          completedAt: new Date().toISOString()
        };
      }
      return q;
    });
    
    setQuestionnaires(updatedQuestionnaires);
    setActiveQuestionnaire(null);
    saveAnswers();
  };

  // Bắt đầu một bảng câu hỏi
  const startQuestionnaire = (questionnaire: Questionnaire) => {
    setActiveQuestionnaire(questionnaire);
    setCurrentSection(0);
    
    // Khôi phục câu trả lời nếu đang làm dở
    const savedAnswers = localStorage.getItem(`questionnaire_${questionnaire.id}`);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    } else {
      setAnswers({});
    }
    
    setFormErrors({});
  };

  // Hiển thị trạng thái bảng câu hỏi
  const getStatusBadge = (status: Questionnaire['status']) => {
    switch (status) {
      case 'not_started':
        return <div className={`${styles.statusBadge} ${styles.notStarted}`}>Chưa bắt đầu</div>;
      case 'in_progress':
        return <div className={`${styles.statusBadge} ${styles.inProgress}`}>Đang thực hiện</div>;
      case 'completed':
        return <div className={`${styles.statusBadge} ${styles.completed}`}>Đã hoàn thành</div>;
      case 'expired':
        return <div className={`${styles.statusBadge} ${styles.expired}`}>Đã hết hạn</div>;
      }
  };

  // Hiển thị trạng thái lưu
  const renderSaveStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <div className={styles.autoSaveStatus}>
            <span className={`${styles.saveStatus} ${styles.saving}`}></span>
            <span>Đang lưu...</span>
          </div>
        );
      case 'saved':
        return (
          <div className={styles.autoSaveStatus}>
            <span className={`${styles.saveStatus} ${styles.saved}`}></span>
            <span>Đã lưu</span>
          </div>
        );
      case 'error':
        return (
          <div className={styles.autoSaveStatus}>
            <span className={`${styles.saveStatus} ${styles.error}`}></span>
            <span>Lỗi khi lưu</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.questionnairesContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bảng câu hỏi</h1>
        <div className={styles.actions}>
          {!activeQuestionnaire && (
            <button className="btn primary">Xem bảng câu hỏi đã hoàn thành</button>
          )}
        </div>
        </div>
        
      {!activeQuestionnaire ? (
        <div className={styles.questionnaireGrid}>
          {/* Mock Data Section */}
          <div className={styles.sectionHeader}>
            <h2>Bảng câu hỏi mẫu</h2>
            <p>Các bảng câu hỏi demo để bạn làm quen với hệ thống</p>
          </div>
          <div className={styles.questionnaireCards}>
            {questionnaires.map(questionnaire => (
            <div className={styles.questionnaireCard} key={questionnaire.id}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{questionnaire.title}</h2>
                <div className={styles.cardMeta}>
                  <div className={styles.timeEstimate}>
                    <span>⏱️</span> {questionnaire.timeEstimate}
            </div>
                  <div className={styles.questionCount}>
                    {questionnaire.sections.reduce((acc, section) => acc + section.questions.length, 0)} câu hỏi
            </div>
            </div>
            </div>
              
              <div className={styles.cardBody}>
                <p className={styles.cardDescription}>{questionnaire.description}</p>
                
                {questionnaire.status !== 'not_started' && (
                  <div className={styles.progressSection}>
                    <div className={styles.progressLabel}>
                      <span>Tiến độ</span>
                      <span className={styles.progressStatus}>{questionnaire.progress}%</span>
                      </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: `${questionnaire.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
            </div>
              
              <div className={styles.cardFooter}>
                {getStatusBadge(questionnaire.status)}
          
                <button 
                  className="btn-sm primary"
                  onClick={() => startQuestionnaire(questionnaire)}
                >
                  {questionnaire.status === 'not_started' 
                    ? 'Bắt đầu' 
                    : questionnaire.status === 'completed'
                    ? 'Xem lại'
                    : 'Tiếp tục'}
                </button>
              </div>
            </div>
            ))}
          </div>

          {/* API Data Section */}
          {loading && (
            <div className={styles.loadingSection}>
              <div className={styles.loadingSpinner}></div>
              <p>Đang tải bảng câu hỏi từ hệ thống...</p>
            </div>
          )}

          {error && (
            <div className={styles.errorSection}>
              <p className={styles.errorMessage}>{error}</p>
              <button onClick={fetchApiQuestionnaires} className="btn secondary">
                Thử lại
              </button>
            </div>
          )}

          {!loading && !error && apiQuestionnaires.length > 0 && (
            <>
              <div className={styles.sectionHeader}>
                <h2>Bảng câu hỏi từ hệ thống</h2>
                <p>Các bảng câu hỏi được tạo bởi quản trị viên</p>
              </div>
              <div className={styles.questionnaireCards}>
                {apiQuestionnaires.map(questionnaire => (
                <div className={styles.questionnaireCard} key={questionnaire.id}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>{questionnaire.title}</h2>
                    <div className={styles.cardMeta}>
                      <div className={styles.timeEstimate}>
                        <span>⏱️</span> {questionnaire.timeEstimate}
                      </div>
                      <div className={styles.questionCount}>
                        {questionnaire.sections.reduce((acc, section) => acc + section.questions.length, 0)} câu hỏi
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.cardBody}>
                    <p className={styles.cardDescription}>{questionnaire.description}</p>
                    <div className={styles.cardFooter}>
                      <div className={styles.statusContainer}>
                        {getStatusBadge(questionnaire.status)}
                        {questionnaire.progress > 0 && (
                          <div className={styles.progressBar}>
                            <div 
                              className={styles.progressFill} 
                              style={{ width: `${questionnaire.progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                      <button 
                        className="btn primary"
                        onClick={() => startQuestionnaire(questionnaire)}
                      >
                        {questionnaire.status === 'completed' ? 'Xem lại' : 
                         questionnaire.status === 'in_progress' ? 'Tiếp tục' : 'Bắt đầu'}
                      </button>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            </>
          )}

          {!loading && !error && apiQuestionnaires.length === 0 && (
            <div className={styles.emptySection}>
              <p>Chưa có bảng câu hỏi nào từ hệ thống</p>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>{activeQuestionnaire.title}</h2>
            <p className={styles.formDescription}>
              {activeQuestionnaire.sections[currentSection].description || 'Vui lòng trả lời các câu hỏi dưới đây'}
            </p>
            
            <div className={styles.formProgress}>
              <div className={styles.formProgressBar}>
                <div 
                  className={styles.formProgressFill} 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <div className={styles.formProgressText}>
                {calculateProgress()}% hoàn thành
              </div>
            </div>
              </div>
              
          <div className={styles.formBody}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                {currentSection + 1}. {activeQuestionnaire.sections[currentSection].title}
              </h3>
              
              {activeQuestionnaire.sections[currentSection].questions.map((question) => (
                shouldShowQuestion(question) && (
                  <div className={styles.questionItem} key={question.id}>
                    <div className={styles.questionHeader}>
                      <label className={styles.questionText}>
                        {question.text}
                        {question.required && <span className={styles.requiredMark}>*</span>}
                          </label>
                      {question.type === 'scale' && (
                        <div className={styles.questionHelp}>
                          Chọn một giá trị từ thang điểm dưới đây
                        </div>
                      )}
                    </div>
                          
                    {question.type === 'radio' && question.options && (
                      <div className={styles.radioOptions}>
                        {question.options.map(option => (
                          <div className={styles.optionItem} key={option.value}>
                            <input
                              type="radio"
                              id={`${question.id}_${option.value}`}
                              name={question.id}
                              value={option.value}
                              checked={answers[question.id] === option.value}
                              onChange={() => handleAnswerChange(question.id, option.value)}
                              className={styles.optionInput}
                            />
                            <label htmlFor={`${question.id}_${option.value}`} className={styles.optionLabel}>
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                          )}
                          
                    {question.type === 'checkbox' && question.options && (
                      <div className={styles.checkboxOptions}>
                        {question.options.map(option => (
                          <div className={styles.optionItem} key={option.value}>
                            <input
                              type="checkbox"
                              id={`${question.id}_${option.value}`}
                                    name={question.id}
                              value={option.value}
                              checked={(answers[question.id] || []).includes(option.value)}
                              onChange={(e) => {
                                const currentValues = answers[question.id] || [];
                                const newValues = e.target.checked
                                  ? [...currentValues, option.value]
                                  : currentValues.filter((val: string) => val !== option.value);
                                handleAnswerChange(question.id, newValues);
                              }}
                              className={styles.optionInput}
                                  />
                            <label htmlFor={`${question.id}_${option.value}`} className={styles.optionLabel}>
                              {option.label}
                            </label>
                                </div>
                              ))}
                            </div>
                          )}
                          
                    {question.type === 'scale' && question.options && (
                      <div className={styles.scale}>
                        {question.options.map(option => (
                          <div className={styles.scaleOption} key={option.value}>
                            <button
                              type="button"
                              className={`${styles.scaleButton} ${
                                answers[question.id] === option.value ? styles.selected : ''
                              }`}
                              onClick={() => handleAnswerChange(question.id, option.value)}
                            >
                              {option.value}
                            </button>
                            {option.label && (
                              <div className={styles.scaleLabel}>{option.label}</div>
                            )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                    {question.type === 'text' && (
                      <input
                        type="text"
                        id={question.id}
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className={styles.textInput}
                        placeholder="Nhập câu trả lời của bạn"
                      />
                    )}
                    
                    {question.type === 'textarea' && (
                      <textarea
                        id={question.id}
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className={styles.textArea}
                        placeholder="Nhập câu trả lời của bạn"
                        rows={4}
                      />
                    )}
                    
                    {formErrors[question.id] && (
                      <div className={styles.fieldError}>{formErrors[question.id]}</div>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
          
          <div className={styles.formFooter}>
            {renderSaveStatus()}
            
            <div className={styles.navigationButtons}>
                      <button
                className="btn"
                onClick={goToPreviousSection}
                disabled={currentSection === 0}
                      >
                Quay lại
                      </button>
              
                      <button
                        className="btn primary"
                onClick={goToNextSection}
                      >
                {currentSection < activeQuestionnaire.sections.length - 1 ? 'Tiếp theo' : 'Hoàn thành'}
                      </button>
            </div>
          </div>
        </div>
      )}
      
      <ThemeToggle />
    </div>
  );
};

export default Questionnaires; 