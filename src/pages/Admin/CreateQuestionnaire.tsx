import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Form, 
  Input, 
  Select, 
  Space, 
  Typography, 
  Divider,
  Row,
  Col,
  message
} from 'antd';
import { 
  PlusOutlined, 
  MinusCircleOutlined,
  ArrowLeftOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { QuestionnairesAPI } from '../../api/questionnaires';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'radio' | 'checkbox' | 'select';
  required: boolean;
  options?: { value: string; label: string }[];
}

interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

const CreateQuestionnaire: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [sections, setSections] = useState<Section[]>([
    {
      id: 'section-1',
      title: 'Thông tin cơ bản',
      description: 'Các thông tin cơ bản về người bệnh',
      questions: []
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Add new section
  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: '',
      description: '',
      questions: []
    };
    setSections([...sections, newSection]);
  };

  // Remove section
  const removeSection = (sectionId: string) => {
    if (sections.length > 1) {
      setSections(sections.filter(s => s.id !== sectionId));
    }
  };

  // Update section
  const updateSection = (sectionId: string, field: keyof Section, value: any) => {
    setSections(sections.map(s => 
      s.id === sectionId ? { ...s, [field]: value } : s
    ));
  };

  // Add question to section
  const addQuestion = (sectionId: string) => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      text: '',
      type: 'text',
      required: false,
      options: []
    };
    
    setSections(sections.map(s => 
      s.id === sectionId 
        ? { ...s, questions: [...s.questions, newQuestion] }
        : s
    ));
  };

  // Remove question
  const removeQuestion = (sectionId: string, questionId: string) => {
    setSections(sections.map(s => 
      s.id === sectionId 
        ? { ...s, questions: s.questions.filter(q => q.id !== questionId) }
        : s
    ));
  };

  // Update question
  const updateQuestion = (sectionId: string, questionId: string, field: keyof Question, value: any) => {
    setSections(sections.map(s => 
      s.id === sectionId 
        ? { 
            ...s, 
            questions: s.questions.map(q => 
              q.id === questionId ? { ...q, [field]: value } : q
            )
          }
        : s
    ));
  };

  // Add option to question
  const addOption = (sectionId: string, questionId: string) => {
    setSections(sections.map(s => 
      s.id === sectionId 
        ? { 
            ...s, 
            questions: s.questions.map(q => 
              q.id === questionId 
                ? { 
                    ...q, 
                    options: [...(q.options || []), { value: '', label: '' }]
                  }
                : q
            )
          }
        : s
    ));
  };

  // Remove option
  const removeOption = (sectionId: string, questionId: string, optionIndex: number) => {
    setSections(sections.map(s => 
      s.id === sectionId 
        ? { 
            ...s, 
            questions: s.questions.map(q => 
              q.id === questionId 
                ? { 
                    ...q, 
                    options: q.options?.filter((_, index) => index !== optionIndex) || []
                  }
                : q
            )
          }
        : s
    ));
  };

  // Update option
  const updateOption = (sectionId: string, questionId: string, optionIndex: number, field: 'value' | 'label', value: string) => {
    setSections(sections.map(s => 
      s.id === sectionId 
        ? { 
            ...s, 
            questions: s.questions.map(q => 
              q.id === questionId 
                ? { 
                    ...q, 
                    options: q.options?.map((opt, index) => 
                      index === optionIndex ? { ...opt, [field]: value } : opt
                    ) || []
                  }
                : q
            )
          }
        : s
    ));
  };

  // Handle save
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const questionnaireData = {
        id: '',
        title: values.title,
        description: values.description,
        status: values.status || 'draft',
        sections: sections,
        created_at: '',
        updated_at: ''
      };

      await QuestionnairesAPI.createQuestionnaire(questionnaireData);
      message.success('Tạo bảng câu hỏi thành công');
      navigate('/admin/questionnaires');
    } catch (error) {
      console.error('Error creating questionnaire:', error);
      message.error('Có lỗi xảy ra khi tạo bảng câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/admin/questionnaires')}
          style={{ marginRight: '16px' }}
        >
          Quay lại
        </Button>
        <Title level={2} style={{ display: 'inline' }}>
          Tạo bảng câu hỏi mới
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <Card style={{ marginBottom: '24px' }}>
          <Title level={4}>Thông tin chung</Title>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Tiêu đề"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
              >
                <Input placeholder="Nhập tiêu đề bảng câu hỏi" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                initialValue="draft"
              >
                <Select>
                  <Option value="draft">Nháp</Option>
                  <Option value="active">Hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea 
              rows={3} 
              placeholder="Nhập mô tả bảng câu hỏi"
            />
          </Form.Item>
        </Card>

        {/* Sections */}
        {sections.map((section, sectionIndex) => (
          <Card 
            key={section.id} 
            style={{ marginBottom: '16px' }}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Phần {sectionIndex + 1}</span>
                {sections.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={() => removeSection(section.id)}
                  >
                    Xóa phần
                  </Button>
                )}
              </div>
            }
          >
            <Row gutter={16}>
              <Col span={12}>
                <Input
                  placeholder="Tiêu đề phần"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="Mô tả phần"
                  value={section.description}
                  onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                />
              </Col>
            </Row>

            <Divider />

            {/* Questions */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Text strong>Câu hỏi</Text>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => addQuestion(section.id)}
                >
                  Thêm câu hỏi
                </Button>
              </div>

              {section.questions.map((question, questionIndex) => (
                <Card 
                  key={question.id} 
                  size="small" 
                  style={{ marginBottom: '12px' }}
                  title={`Câu hỏi ${questionIndex + 1}`}
                  extra={
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => removeQuestion(section.id, question.id)}
                    />
                  }
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Input
                        placeholder="Nội dung câu hỏi"
                        value={question.text}
                        onChange={(e) => updateQuestion(section.id, question.id, 'text', e.target.value)}
                      />
                    </Col>
                    <Col span={6}>
                      <Select
                        value={question.type}
                        onChange={(value) => updateQuestion(section.id, question.id, 'type', value)}
                        style={{ width: '100%' }}
                      >
                        <Option value="text">Văn bản</Option>
                        <Option value="number">Số</Option>
                        <Option value="radio">Chọn một</Option>
                        <Option value="checkbox">Chọn nhiều</Option>
                        <Option value="select">Danh sách</Option>
                      </Select>
                    </Col>
                    <Col span={6}>
                      <Space>
                        <label>
                          <input
                            type="checkbox"
                            checked={question.required}
                            onChange={(e) => updateQuestion(section.id, question.id, 'required', e.target.checked)}
                          />
                          Bắt buộc
                        </label>
                      </Space>
                    </Col>
                  </Row>

                  {/* Options for radio, checkbox, select */}
                  {(question.type === 'radio' || question.type === 'checkbox' || question.type === 'select') && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <Text strong>Tùy chọn</Text>
                        <Button
                          type="dashed"
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={() => addOption(section.id, question.id)}
                        >
                          Thêm tùy chọn
                        </Button>
                      </div>
                      
                      {question.options?.map((option, optionIndex) => (
                        <Row key={optionIndex} gutter={8} style={{ marginBottom: '8px' }}>
                          <Col span={10}>
                            <Input
                              placeholder="Giá trị"
                              value={option.value}
                              onChange={(e) => updateOption(section.id, question.id, optionIndex, 'value', e.target.value)}
                            />
                          </Col>
                          <Col span={10}>
                            <Input
                              placeholder="Nhãn hiển thị"
                              value={option.label}
                              onChange={(e) => updateOption(section.id, question.id, optionIndex, 'label', e.target.value)}
                            />
                          </Col>
                          <Col span={4}>
                            <Button
                              type="text"
                              danger
                              icon={<MinusCircleOutlined />}
                              onClick={() => removeOption(section.id, question.id, optionIndex)}
                            />
                          </Col>
                        </Row>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </Card>
        ))}

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addSection}
            style={{ marginRight: '16px' }}
          >
            Thêm phần mới
          </Button>
          
          <Button
            type="primary"
            icon={<SaveOutlined />}
            htmlType="submit"
            loading={loading}
          >
            Lưu bảng câu hỏi
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateQuestionnaire;





