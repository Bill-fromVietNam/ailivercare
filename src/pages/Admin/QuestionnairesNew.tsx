import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Table, 
  Space, 
  Tag, 
  Popconfirm, 
  message, 
  Typography, 
  Row, 
  Col, 
  Statistic,
  Modal,
  Form,
  Input,
  Select,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons';
import { QuestionnairesAPI } from '../../api/questionnaires';
import { QuestionnaireTemplate } from '../../components/QuestionnaireEditor/QuestionnaireEditor';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface QuestionnaireWithStats extends QuestionnaireTemplate {
  id: string;
  submissionCount: number;
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
}

const AdminQuestionnairesNew: React.FC = () => {
  const navigate = useNavigate();
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState<QuestionnaireWithStats | null>(null);
  const [form] = Form.useForm();

  // Fetch questionnaires
  const fetchQuestionnaires = async () => {
    try {
      setLoading(true);
      const response = await QuestionnairesAPI.getAllQuestionnaires(1, 100);
      
      const questionnairesWithStats: QuestionnaireWithStats[] = response.items.map(q => ({
        ...q,
        id: String(q.id),
        submissionCount: 0, // TODO: Get from API
        status: (q.status || 'draft') as 'active' | 'draft' | 'archived',
        created_at: q.created_at || new Date().toISOString(),
        updated_at: q.updated_at || new Date().toISOString()
      }));
      
      setQuestionnaires(questionnairesWithStats);
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
      message.error('Có lỗi xảy ra khi tải danh sách bảng câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  // Handle create/edit
  const handleCreate = () => {
    setEditingQuestionnaire(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: QuestionnaireWithStats) => {
    setEditingQuestionnaire(record);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      status: record.status
    });
    setModalVisible(true);
  };

  // Handle save
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingQuestionnaire) {
        // Update existing
        await QuestionnairesAPI.updateQuestionnaire(editingQuestionnaire.id, {
          ...editingQuestionnaire,
          ...values
        });
        message.success('Cập nhật bảng câu hỏi thành công');
      } else {
        // Create new
        await QuestionnairesAPI.createQuestionnaire({
          id: '',
          title: values.title,
          description: values.description,
          status: values.status || 'draft',
          sections: [],
          created_at: '',
          updated_at: ''
        });
        message.success('Tạo bảng câu hỏi thành công');
      }
      
      setModalVisible(false);
      fetchQuestionnaires();
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      message.error('Có lỗi xảy ra khi lưu bảng câu hỏi');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await QuestionnairesAPI.deleteQuestionnaire(id);
      message.success('Xóa bảng câu hỏi thành công');
      fetchQuestionnaires();
    } catch (error) {
      console.error('Error deleting questionnaire:', error);
      message.error('Có lỗi xảy ra khi xóa bảng câu hỏi');
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (record: QuestionnaireWithStats) => {
    try {
      const newStatus = record.status === 'active' ? 'draft' : 'active';
      await QuestionnairesAPI.toggleQuestionnaireStatus(record.id, newStatus);
      message.success(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'tạm dừng'} bảng câu hỏi`);
      fetchQuestionnaires();
    } catch (error) {
      console.error('Error toggling status:', error);
      message.error('Có lỗi xảy ra khi thay đổi trạng thái');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: QuestionnaireWithStats) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'active' ? 'green' : status === 'draft' ? 'orange' : 'red';
        const text = status === 'active' ? 'Hoạt động' : status === 'draft' ? 'Nháp' : 'Lưu trữ';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Số phần',
      dataIndex: 'sections',
      key: 'sections',
      render: (sections: any[]) => sections?.length || 0,
    },
    {
      title: 'Số câu hỏi',
      key: 'questions',
      render: (record: QuestionnaireWithStats) => {
        const totalQuestions = record.sections?.reduce((total, section) => 
          total + (section.questions?.length || 0), 0) || 0;
        return totalQuestions;
      },
    },
    {
      title: 'Lượt trả lời',
      dataIndex: 'submissionCount',
      key: 'submissionCount',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (record: QuestionnaireWithStats) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/questionnaires/preview/${record.id}`)}
            title="Xem trước"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Chỉnh sửa"
          />
          <Button
            type="text"
            icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={() => handleStatusToggle(record)}
            title={record.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bảng câu hỏi này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Statistics
  const totalQuestionnaires = questionnaires.length;
  const activeQuestionnaires = questionnaires.filter(q => q.status === 'active').length;
  const draftQuestionnaires = questionnaires.filter(q => q.status === 'draft').length;
  const totalSubmissions = questionnaires.reduce((sum, q) => sum + q.submissionCount, 0);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Quản lý bảng câu hỏi</Title>
        <Text type="secondary">
          Tạo và quản lý các bảng câu hỏi cho người dùng
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số bảng câu hỏi"
              value={totalQuestionnaires}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={activeQuestionnaires}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Bản nháp"
              value={draftQuestionnaires}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng lượt trả lời"
              value={totalSubmissions}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Actions */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Tạo bảng câu hỏi mới
        </Button>
      </div>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={questionnaires}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} bảng câu hỏi`,
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingQuestionnaire ? 'Chỉnh sửa bảng câu hỏi' : 'Tạo bảng câu hỏi mới'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề bảng câu hỏi" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea 
              rows={3} 
              placeholder="Nhập mô tả bảng câu hỏi"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            initialValue="draft"
          >
            <Select>
              <Option value="draft">Nháp</Option>
              <Option value="active">Hoạt động</Option>
              <Option value="archived">Lưu trữ</Option>
            </Select>
          </Form.Item>
        </Form>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">
            Để chỉnh sửa chi tiết câu hỏi, hãy sử dụng trình soạn thảo chuyên dụng
          </Text>
          <br />
          <Button 
            type="link" 
            onClick={() => {
              setModalVisible(false);
              if (editingQuestionnaire) {
                navigate(`/admin/questionnaires/edit/${editingQuestionnaire.id}`);
              } else {
                navigate('/admin/questionnaires/create');
              }
            }}
          >
            Mở trình soạn thảo
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminQuestionnairesNew;
