import React, { useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  RadialLinearScale 
} from 'chart.js';
import { Line, Radar } from 'react-chartjs-2';
import ThemeToggle from '../components/ThemeToggle';
import styles from '../styles/pages/Assessments.module.css';
import { generatePDF } from '../components/AssessmentPDF';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

// Định nghĩa các kiểu dữ liệu
type Step = 'intro' | 'personal' | 'lifestyle' | 'symptoms' | 'history' | 'results';
type RiskLevel = 'low' | 'medium' | 'high';

interface Question {
  id: string;
  text: string;
  type: 'radio' | 'checkbox' | 'scale' | 'text';
  options?: Array<{ value: string; label: string; points: number }>;
  condition?: {
    questionId: string;
    value: string;
  };
  required: boolean;
}

interface Section {
  id: string;
  title: string;
  questions: Question[];
}

interface AssessmentResults {
  totalScore: number;
  maxScore: number;
  riskLevel: RiskLevel;
  categoryScores: {
    [key: string]: {
      score: number;
      maxScore: number;
      percentage: number;
    };
  };
  recommendations: string[];
}

// Dữ liệu mẫu cho đánh giá
const sections: Section[] = [
  {
    id: 'personal',
    title: 'Thông tin cá nhân',
    questions: [
      {
        id: 'age',
        text: 'Độ tuổi của bạn?',
        type: 'radio',
        options: [
          { value: 'under30', label: 'Dưới 30', points: 0 },
          { value: '30to45', label: '30-45', points: 1 },
          { value: '46to60', label: '46-60', points: 2 },
          { value: 'over60', label: 'Trên 60', points: 3 },
        ],
        required: true,
      },
      {
        id: 'gender',
        text: 'Giới tính của bạn?',
        type: 'radio',
        options: [
          { value: 'male', label: 'Nam', points: 1 },
          { value: 'female', label: 'Nữ', points: 0 },
        ],
        required: true,
      },
      {
        id: 'weight',
        text: 'Cân nặng của bạn (kg)?',
        type: 'text',
        required: true,
      },
      {
        id: 'height',
        text: 'Chiều cao của bạn (cm)?',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'lifestyle',
    title: 'Lối sống',
    questions: [
      {
        id: 'alcohol',
        text: 'Bạn có thường xuyên uống rượu bia không?',
        type: 'radio',
        options: [
          { value: 'never', label: 'Không bao giờ', points: 0 },
          { value: 'occasionally', label: 'Thỉnh thoảng', points: 1 },
          { value: 'weekly', label: 'Hàng tuần', points: 2 },
          { value: 'daily', label: 'Hàng ngày', points: 3 },
        ],
        required: true,
      },
      {
        id: 'smoking',
        text: 'Bạn có hút thuốc không?',
        type: 'radio',
        options: [
          { value: 'never', label: 'Không bao giờ', points: 0 },
          { value: 'former', label: 'Đã bỏ', points: 1 },
          { value: 'occasionally', label: 'Thỉnh thoảng', points: 2 },
          { value: 'regularly', label: 'Thường xuyên', points: 3 },
        ],
        required: true,
      },
      {
        id: 'exercise',
        text: 'Bạn thường xuyên tập thể dục không?',
        type: 'radio',
        options: [
          { value: 'daily', label: 'Hàng ngày', points: 0 },
          { value: 'weekly', label: 'Vài lần một tuần', points: 1 },
          { value: 'monthly', label: 'Vài lần một tháng', points: 2 },
          { value: 'never', label: 'Không bao giờ', points: 3 },
        ],
        required: true,
      },
      {
        id: 'diet',
        text: 'Chế độ ăn uống của bạn có cân bằng không?',
        type: 'scale',
        options: [
          { value: '1', label: 'Không cân bằng', points: 3 },
          { value: '2', label: '', points: 2 },
          { value: '3', label: '', points: 1 },
          { value: '4', label: '', points: 1 },
          { value: '5', label: 'Rất cân bằng', points: 0 },
        ],
        required: true,
      },
    ],
  },
  {
    id: 'symptoms',
    title: 'Triệu chứng',
    questions: [
      {
        id: 'fatigue',
        text: 'Bạn có thường xuyên cảm thấy mệt mỏi không?',
        type: 'radio',
        options: [
          { value: 'never', label: 'Không bao giờ', points: 0 },
          { value: 'rarely', label: 'Hiếm khi', points: 1 },
          { value: 'sometimes', label: 'Thỉnh thoảng', points: 2 },
          { value: 'often', label: 'Thường xuyên', points: 3 },
        ],
        required: true,
      },
      {
        id: 'abdominal_pain',
        text: 'Bạn có đau bụng phần trên bên phải không?',
        type: 'radio',
        options: [
          { value: 'never', label: 'Không bao giờ', points: 0 },
          { value: 'rarely', label: 'Hiếm khi', points: 1 },
          { value: 'sometimes', label: 'Thỉnh thoảng', points: 2 },
          { value: 'often', label: 'Thường xuyên', points: 3 },
        ],
        required: true,
      },
      {
        id: 'jaundice',
        text: 'Bạn có từng bị vàng da hoặc vàng mắt không?',
        type: 'radio',
        options: [
          { value: 'never', label: 'Không bao giờ', points: 0 },
          { value: 'past', label: 'Trước đây có', points: 2 },
          { value: 'current', label: 'Hiện tại có', points: 3 },
        ],
        required: true,
      },
      {
        id: 'other_symptoms',
        text: 'Bạn có các triệu chứng khác không? (chọn tất cả)',
        type: 'checkbox',
        options: [
          { value: 'itching', label: 'Ngứa da', points: 1 },
          { value: 'dark_urine', label: 'Nước tiểu sẫm màu', points: 1 },
          { value: 'pale_stool', label: 'Phân nhạt màu', points: 1 },
          { value: 'loss_appetite', label: 'Chán ăn', points: 1 },
          { value: 'nausea', label: 'Buồn nôn', points: 1 },
        ],
        required: false,
      },
    ],
  },
  {
    id: 'history',
    title: 'Tiền sử',
    questions: [
      {
        id: 'liver_disease',
        text: 'Bạn có tiền sử bệnh gan không?',
        type: 'radio',
        options: [
          { value: 'no', label: 'Không', points: 0 },
          { value: 'yes', label: 'Có', points: 3 },
        ],
        required: true,
      },
      {
        id: 'family_history',
        text: 'Gia đình bạn có ai mắc bệnh gan không?',
        type: 'radio',
        options: [
          { value: 'no', label: 'Không', points: 0 },
          { value: 'distant', label: 'Họ hàng xa', points: 1 },
          { value: 'close', label: 'Họ hàng gần (cha mẹ, anh chị em)', points: 2 },
        ],
        required: true,
      },
      {
        id: 'viral_hepatitis',
        text: 'Bạn đã từng mắc viêm gan virus không?',
        type: 'radio',
        options: [
          { value: 'no', label: 'Không', points: 0 },
          { value: 'unsure', label: 'Không chắc', points: 1 },
          { value: 'yes', label: 'Có', points: 3 },
        ],
        required: true,
      },
      {
        id: 'liver_disease_type',
        text: 'Nếu bạn đã được chẩn đoán bệnh gan, vui lòng chọn loại:',
        type: 'checkbox',
        options: [
          { value: 'fatty_liver', label: 'Gan nhiễm mỡ', points: 2 },
          { value: 'hepatitis', label: 'Viêm gan', points: 2 },
          { value: 'cirrhosis', label: 'Xơ gan', points: 3 },
          { value: 'other', label: 'Khác', points: 2 },
        ],
        condition: {
          questionId: 'liver_disease',
          value: 'yes',
        },
        required: false,
      },
    ],
  },
];

// Xóa tham số không sử dụng answers
const getRecommendations = (riskLevel: RiskLevel): string[] => {
  const commonRecs = [
    'Duy trì chế độ ăn uống cân bằng, giảm chất béo bão hòa',
    'Hạn chế đồ uống có cồn',
    'Tập thể dục đều đặn, ít nhất 30 phút mỗi ngày',
  ];

  if (riskLevel === 'low') {
    return [
      ...commonRecs,
      'Kiểm tra sức khỏe định kỳ 1 năm/lần',
    ];
  } else if (riskLevel === 'medium') {
    return [
      ...commonRecs,
      'Nên gặp bác sĩ để kiểm tra chi tiết hơn trong 3 tháng tới',
      'Theo dõi chức năng gan 6 tháng/lần',
    ];
  } else {
    return [
      ...commonRecs,
      'Cần gặp bác sĩ chuyên khoa gan mật càng sớm càng tốt (trong vòng 30 ngày)',
      'Cân nhắc thực hiện các xét nghiệm chẩn đoán hình ảnh',
      'Theo dõi sát chức năng gan 3 tháng/lần',
    ];
  }
};

const AssessmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assessments' | 'new'>('assessments');
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<AssessmentResults | null>(null);
  // Xóa tham số không sử dụng answers
  const [pastAssessments] = useState([
    {
      id: 1,
      date: '10/07/2025',
      score: 12,
      maxScore: 45,
      riskLevel: 'low' as RiskLevel,
    },
    {
      id: 2,
      date: '20/06/2025',
      score: 28,
      maxScore: 45,
      riskLevel: 'medium' as RiskLevel,
    },
    {
      id: 3,
      date: '05/05/2025',
      score: 35,
      maxScore: 45,
      riskLevel: 'high' as RiskLevel,
    },
  ]);

  // Xử lý thay đổi câu trả lời
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Kiểm tra xem câu hỏi có hiển thị hay không dựa trên điều kiện
  const shouldShowQuestion = (question: Question) => {
    if (!question.condition) return true;
    
    const { questionId, value } = question.condition;
    return answers[questionId] === value;
  };

  // Kiểm tra tính hợp lệ của phần hiện tại
  const validateCurrentSection = () => {
    const section = sections[currentSection];
    
    for (const question of section.questions) {
      if (!shouldShowQuestion(question)) continue;
      
      if (question.required && (answers[question.id] === undefined || answers[question.id] === '')) {
        return false;
      }
    }
    
    return true;
  };

  // Chuyển đến bước tiếp theo
  const goToNextStep = () => {
    if (currentStep === 'intro') {
      setCurrentStep('personal');
      return;
    }

    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      // Tính toán kết quả
      calculateResults();
      setCurrentStep('results');
    }
  };

  // Quay lại bước trước
  const goToPreviousStep = () => {
    if (currentStep === 'personal' && currentSection === 0) {
      setCurrentStep('intro');
      return;
    }

    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Tính toán kết quả đánh giá
  const calculateResults = () => {
    let totalScore = 0;
    let maxScore = 0;
    const categoryScores: AssessmentResults['categoryScores'] = {};

    // Tính điểm cho từng mục
    sections.forEach(section => {
      categoryScores[section.id] = { score: 0, maxScore: 0, percentage: 0 };

      section.questions.forEach(question => {
        if (!shouldShowQuestion(question)) return;

        if (question.type === 'checkbox') {
          const selectedOptions = answers[question.id] || [];
          
          question.options?.forEach(option => {
            // Thêm điểm tối đa có thể
            categoryScores[section.id].maxScore += option.points;
            maxScore += option.points;

            // Cộng điểm nếu option được chọn
            if (selectedOptions.includes(option.value)) {
              const points = option.points;
              totalScore += points;
              categoryScores[section.id].score += points;
            }
          });
        } else if (question.type === 'radio' || question.type === 'scale') {
          const selectedValue = answers[question.id];
          const selectedOption = question.options?.find(opt => opt.value === selectedValue);
          
          if (selectedOption) {
            // Tìm điểm tối đa cho câu hỏi này
            const optionWithMaxPoints = [...(question.options || [])].sort((a, b) => b.points - a.points)[0];
            const maxPointsForQuestion = optionWithMaxPoints?.points || 0;
            
            totalScore += selectedOption.points;
            categoryScores[section.id].score += selectedOption.points;
            categoryScores[section.id].maxScore += maxPointsForQuestion;
            maxScore += maxPointsForQuestion;
          }
        }
      });

      // Tính phần trăm
      if (categoryScores[section.id].maxScore > 0) {
        categoryScores[section.id].percentage = (categoryScores[section.id].score / categoryScores[section.id].maxScore) * 100;
      }
    });

    // Xác định mức độ rủi ro
    let riskLevel: RiskLevel = 'low';
    const riskPercentage = (totalScore / maxScore) * 100;
    
    if (riskPercentage >= 70) {
      riskLevel = 'high';
    } else if (riskPercentage >= 40) {
      riskLevel = 'medium';
    }

    // Tạo kết quả
    const recommendations = getRecommendations(riskLevel);
    
    setResults({
      totalScore,
      maxScore,
      riskLevel,
      categoryScores,
      recommendations
    });
  };

  // Bắt đầu đánh giá mới
  const startNewAssessment = () => {
    setAnswers({});
    setCurrentSection(0);
    setCurrentStep('intro');
    setResults(null);
    setActiveTab('new');
  };

  // Dữ liệu cho biểu đồ lịch sử
  const historyChartData = {
    labels: pastAssessments.map(a => a.date).reverse(),
    datasets: [
      {
        label: 'Điểm rủi ro',
        data: pastAssessments.map(a => (a.score / a.maxScore) * 100).reverse(),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4,
      }
    ]
  };

  // Hiển thị kết quả
  const renderResults = () => {
    if (!results) return null;

    const scorePercentage = (results.totalScore / results.maxScore) * 100;
    
    // Dữ liệu cho biểu đồ radar
    const radarData = {
      labels: Object.keys(results.categoryScores).map(key => {
        switch (key) {
          case 'personal': return 'Cá nhân';
          case 'lifestyle': return 'Lối sống';
          case 'symptoms': return 'Triệu chứng';
          case 'history': return 'Tiền sử';
          default: return key;
        }
      }),
      datasets: [
        {
          label: 'Điểm số của bạn',
          data: Object.values(results.categoryScores).map(cat => cat.percentage),
          fill: true,
          backgroundColor: 'rgba(25, 118, 210, 0.2)',
          borderColor: 'rgba(25, 118, 210, 1)',
          pointBackgroundColor: 'rgba(25, 118, 210, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(25, 118, 210, 1)'
        }
      ]
    };

  return (
      <div className={styles.resultsContainer}>
        <div className={styles.resultsHeader}>
          <h2 className={styles.resultsTitle}>Kết quả đánh giá rủi ro</h2>
          <p className={styles.resultsSubtitle}>Dựa trên thông tin bạn cung cấp, đây là kết quả đánh giá của chúng tôi</p>
        </div>
        
        <div className={styles.scoreCard}>
          <div 
            className={`${styles.scoreCircle} ${
              results.riskLevel === 'low' ? styles.lowRisk :
              results.riskLevel === 'medium' ? styles.mediumRisk : 
              styles.highRisk
            }`}
          >
            <div className={styles.scoreNumber}>{Math.round(scorePercentage)}%</div>
            <div className={styles.scoreMaximum}>rủi ro</div>
          </div>

          <h3 className={styles.scoreCategoryTitle}>
            {results.riskLevel === 'low' ? 'Nguy cơ thấp' :
             results.riskLevel === 'medium' ? 'Nguy cơ trung bình' :
             'Nguy cơ cao'}
          </h3>
          <p className={styles.scoreCategoryDescription}>
            {results.riskLevel === 'low' ? 
              'Dựa trên thông tin bạn cung cấp, nguy cơ mắc bệnh gan của bạn đang ở mức thấp. Tiếp tục duy trì lối sống lành mạnh.' :
              results.riskLevel === 'medium' ? 
              'Dựa trên thông tin bạn cung cấp, bạn có một số yếu tố rủi ro đối với sức khỏe gan. Nên cân nhắc thăm khám bác sĩ.' :
              'Dựa trên thông tin bạn cung cấp, nguy cơ mắc bệnh gan của bạn đang ở mức cao. Nên đến gặp bác sĩ càng sớm càng tốt.'}
          </p>

          <div style={{ height: '300px', marginTop: '2rem' }}>
            <Radar 
              data={radarData} 
              options={{
                responsive: true,
                scales: {
                  r: {
                    min: 0,
                    max: 100,
                    ticks: { display: false },
                  }
                },
                plugins: {
                  legend: { position: 'bottom' },
                }
              }}
            />
          </div>
                </div>
                
        <div className={styles.recommendationsSection}>
          <h3 className={styles.sectionTitle}>Đề xuất của chúng tôi</h3>
          <div className={styles.recommendationsList}>
            {results.recommendations.map((rec, idx) => (
              <div key={idx} className={styles.recommendationItem}>
                <div className={styles.recommendationIcon}>✓</div>
                <div className={styles.recommendationContent}>
                  <div className={styles.recommendationTitle}>{rec}</div>
                </div>
              </div>
            ))}
          </div>
                </div>
                
        <div className={styles.actionsRow}>
                  <button 
                    className="btn"
            onClick={startNewAssessment}
                  >
            Đánh giá mới
                  </button>
                  <button
                    className="btn primary"
            onClick={() => results && generatePDF(results)}
                  >
            Tải xuống PDF
                  </button>
                </div>
                  </div>
    );
  };

  return (
    <div className={styles.assessmentsContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Đánh giá rủi ro</h1>
        <div className={styles.actions}>
          {activeTab === 'assessments' && (
            <button 
              className="btn primary"
              onClick={startNewAssessment}
            >
              Đánh giá mới
            </button>
          )}
        </div>
      </div>

      <div className={styles.tabList}>
        <div 
          className={`${styles.tab} ${activeTab === 'assessments' ? styles.active : ''}`}
          onClick={() => setActiveTab('assessments')}
        >
          Lịch sử đánh giá
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'new' ? styles.active : ''}`}
          onClick={() => activeTab === 'new' || startNewAssessment()}
        >
          Đánh giá mới
        </div>
      </div>

      {activeTab === 'assessments' ? (
        <>
          <div className={styles.assessmentGrid}>
            {pastAssessments.map(assessment => (
              <div key={assessment.id} className={styles.assessmentCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Đánh giá ngày {assessment.date}</h3>
                  <div className={styles.cardSubtitle}>
                    {assessment.riskLevel === 'low' ? 'Nguy cơ thấp' :
                     assessment.riskLevel === 'medium' ? 'Nguy cơ trung bình' :
                     'Nguy cơ cao'}
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.assessmentInfo}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Điểm số:</span>
                      <span className={styles.infoValue}>{assessment.score}/{assessment.maxScore}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Phần trăm:</span>
                      <span className={styles.infoValue}>{Math.round((assessment.score / assessment.maxScore) * 100)}%</span>
                    </div>
                  </div>

                  <div className={styles.riskScore}>
                    <div className={styles.scoreLabel}>Mức độ rủi ro</div>
                    <div 
                      className={`${styles.scoreValue} ${
                        assessment.riskLevel === 'low' ? styles.lowRisk :
                        assessment.riskLevel === 'medium' ? styles.mediumRisk : 
                        styles.highRisk
                      }`}
                    >
                      {Math.round((assessment.score / assessment.maxScore) * 100)}%
                    </div>
                    <div className={styles.scoreText}>
                      {assessment.riskLevel === 'low' ? 'Thấp' :
                      assessment.riskLevel === 'medium' ? 'Trung bình' : 
                      'Cao'}
                    </div>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.cardDate}>{assessment.date}</div>
                  <button className="btn-sm primary">Xem chi tiết</button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.chartSection} style={{ marginTop: '2rem' }}>
            <h3 className={styles.sectionTitle}>Xu hướng rủi ro theo thời gian</h3>
            <div style={{ height: '300px' }}>
              <Line 
                data={historyChartData}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Phần trăm rủi ro (%)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {currentStep === 'intro' && (
            <div className={styles.wizardContainer}>
              <div className={styles.wizardHeader}>
                <h2 className={styles.wizardTitle}>Đánh giá nguy cơ bệnh gan</h2>
                <p className={styles.wizardSubtitle}>
                  Công cụ này sẽ giúp đánh giá nguy cơ mắc bệnh gan dựa trên thông tin bạn cung cấp
                </p>
              </div>
              <div className={styles.wizardBody}>
                <p>
                  Bạn sẽ trả lời một loạt câu hỏi về:
                </p>
                <ul style={{ marginTop: '1rem', marginLeft: '1.5rem', listStyleType: 'disc' }}>
                  <li>Thông tin cá nhân cơ bản</li>
                  <li>Lối sống và thói quen</li>
                  <li>Triệu chứng bạn có thể gặp phải</li>
                  <li>Tiền sử bệnh tật của bạn và gia đình</li>
                </ul>
                <p style={{ marginTop: '1.5rem' }}>
                  Dựa trên câu trả lời của bạn, chúng tôi sẽ cung cấp đánh giá về nguy cơ mắc bệnh gan và đưa ra các khuyến nghị phù hợp.
                </p>
                <p style={{ marginTop: '1rem' }}>
                  <strong>Lưu ý:</strong> Đây không phải là chẩn đoán y tế. Kết quả chỉ mang tính tham khảo và không thay thế cho tư vấn từ bác sĩ chuyên khoa.
                </p>
              </div>
              <div className={styles.wizardFooter}>
                <div></div>
                <button
                  className="btn primary"
                  onClick={goToNextStep}
                >
                  Bắt đầu đánh giá
                </button>
              </div>
            </div>
          )}
          
          {(currentStep === 'personal' || currentStep === 'lifestyle' || currentStep === 'symptoms' || currentStep === 'history') && (
            <div className={styles.wizardContainer}>
              <div className={styles.wizardHeader}>
                <h2 className={styles.wizardTitle}>Đánh giá nguy cơ bệnh gan</h2>
                <p className={styles.wizardSubtitle}>
                  Phần {currentSection + 1}/{sections.length}: {sections[currentSection].title}
                </p>
                
                <div className={styles.stepProgress}>
                  <div 
                    className={styles.progressTrack}
                    style={{ width: `${((currentSection) / sections.length) * 100}%` }}
                  ></div>
                  
                  {sections.map((section, index) => (
                    <div 
                      key={section.id}
                      className={`${styles.stepItem} ${
                        index < currentSection ? styles.completed :
                        index === currentSection ? styles.active : ''
                      }`}
                    >
                      <div className={styles.stepCircle}>
                        {index < currentSection ? '✓' : index + 1}
                      </div>
                      <div className={styles.stepName}>{section.title}</div>
                      {index < sections.length - 1 && (
                        <div className={`${styles.stepConnector} ${index < currentSection ? styles.completed : ''}`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.wizardBody}>
                {sections[currentSection].questions.map(question => (
                  shouldShowQuestion(question) && (
                    <div key={question.id} className={styles.questionItem}>
                      <div className={styles.questionHeader}>
                        <div className={styles.questionText}>
                          {question.text}
                          {question.required && <span className={styles.requiredMark}>*</span>}
                        </div>
                        {question.type === 'scale' && (
                          <div className={styles.questionHelp}>
                            Vui lòng chọn giá trị phù hợp nhất
                          </div>
                        )}
                      </div>
                      
                      {question.type === 'radio' && (
                        <div className={styles.radioOptions}>
                          {question.options?.map(option => (
                            <div key={option.value} className={styles.optionItem}>
                              <input
                                type="radio"
                                id={`${question.id}_${option.value}`}
                                name={question.id}
                                value={option.value}
                                checked={answers[question.id] === option.value}
                                onChange={() => handleAnswerChange(question.id, option.value)}
                                className={styles.optionInput}
                              />
                              <label 
                                htmlFor={`${question.id}_${option.value}`}
                                className={styles.optionLabel}
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'checkbox' && (
                        <div className={styles.checkboxOptions}>
                          {question.options?.map(option => (
                            <div key={option.value} className={styles.optionItem}>
                              <input
                                type="checkbox"
                                id={`${question.id}_${option.value}`}
                                name={question.id}
                                value={option.value}
                                checked={answers[question.id]?.includes(option.value)}
                                onChange={(e) => {
                                  const currentValues = answers[question.id] || [];
                                  const newValues = e.target.checked
                                    ? [...currentValues, option.value]
                                    : currentValues.filter((v: string) => v !== option.value);
                                  handleAnswerChange(question.id, newValues);
                                }}
                                className={styles.optionInput}
                              />
                              <label 
                                htmlFor={`${question.id}_${option.value}`}
                                className={styles.optionLabel}
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'scale' && (
                        <div className={styles.scale}>
                          {question.options?.map(option => (
                            <div key={option.value} className={styles.scaleOption}>
                              <button
                                type="button"
                                className={`${styles.scaleButton} ${answers[question.id] === option.value ? styles.selected : ''}`}
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
                        <div>
                          <input
                            type="text"
                            id={question.id}
                            value={answers[question.id] || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className={styles.textInput}
                            placeholder="Nhập câu trả lời của bạn"
                          />
                    </div>
                      )}
                    </div>
                  )
                ))}
              </div>
              
              <div className={styles.wizardFooter}>
                <button
                  className="btn"
                  onClick={goToPreviousStep}
                >
                  Quay lại
                </button>
                <button
                  className="btn primary"
                  onClick={goToNextStep}
                  disabled={!validateCurrentSection()}
                >
                  {currentSection < sections.length - 1 ? 'Tiếp theo' : 'Hoàn thành'}
                </button>
                    </div>
                  </div>
          )}

          {currentStep === 'results' && renderResults()}
        </>
      )}

      <ThemeToggle />
    </div>
  );
};

export default AssessmentsPage; 