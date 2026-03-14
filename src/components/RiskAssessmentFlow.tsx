import React from 'react'

interface Step {
  id: number
  title: string
  description: string
  icon: string
}

interface RiskAssessmentFlowProps {
  currentStep?: number
}

const RiskAssessmentFlow: React.FC<RiskAssessmentFlowProps> = ({ currentStep = 0 }) => {
  const steps: Step[] = [
    {
      id: 1,
      title: 'Thu thập thông tin',
      description: 'Nhập thông tin lối sống, tiền sử và triệu chứng',
      icon: '📋'
    },
    {
      id: 2,
      title: 'Xét nghiệm',
      description: 'Thêm kết quả xét nghiệm AST/ALT',
      icon: '🔬'
    },
    {
      id: 3,
      title: 'Phân tích',
      description: 'Hệ thống AI đánh giá nguy cơ',
      icon: '🧠'
    },
    {
      id: 4,
      title: 'Kết quả và khuyến nghị',
      description: 'Nhận kết quả đánh giá và các khuyến nghị phù hợp',
      icon: '📊'
    }
  ]

  return (
    <div className="flow-chart">
      <div className="steps">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`step ${currentStep >= step.id ? 'step-completed' : ''} ${currentStep === step.id ? 'step-active' : ''}`}
          >
            <div className="step-icon">{step.icon}</div>
            <div className="step-content">
              <h4 className="step-title">{step.title}</h4>
              <p className="step-description">{step.description}</p>
            </div>
            {step.id < steps.length && (
              <div className="step-connector"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RiskAssessmentFlow 