import React, { useState } from 'react';
import { 
  Card, 
  Upload, 
  Button, 
  message, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Progress, 
  Divider,
  Statistic,
  Tag,
  Alert
} from 'antd';
import { 
  CameraOutlined, 
  FileImageOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface LiverAnalysisResult {
  id: string;
  imageUrl: string;
  analysisDate: string;
  status: 'processing' | 'completed' | 'error';
  parameters: {
    liverSize: {
      value: number;
      unit: string;
      normal: boolean;
      description: string;
    };
    liverTexture: {
      value: string;
      normal: boolean;
      description: string;
    };
    fatContent: {
      value: number;
      unit: string;
      normal: boolean;
      description: string;
    };
    fibrosis: {
      value: number;
      unit: string;
      normal: boolean;
      description: string;
    };
    lesions: {
      count: number;
      size: number;
      unit: string;
      normal: boolean;
      description: string;
    };
  };
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
}

const LiverImageAnalysis: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [analysisResult, setAnalysisResult] = useState<LiverAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Mock analysis results
  const mockAnalysisResults: LiverAnalysisResult[] = [
    {
      id: '1',
      imageUrl: '/api/placeholder/400/300',
      analysisDate: new Date().toISOString(),
      status: 'completed',
      parameters: {
        liverSize: {
          value: 15.2,
          unit: 'cm',
          normal: true,
          description: 'Kích thước gan bình thường'
        },
        liverTexture: {
          value: 'Mịn, đồng nhất',
          normal: true,
          description: 'Cấu trúc gan bình thường'
        },
        fatContent: {
          value: 8.5,
          unit: '%',
          normal: true,
          description: 'Lượng mỡ gan trong giới hạn bình thường'
        },
        fibrosis: {
          value: 1.2,
          unit: 'F0-F4',
          normal: true,
          description: 'Không có dấu hiệu xơ hóa'
        },
        lesions: {
          count: 0,
          size: 0,
          unit: 'mm',
          normal: true,
          description: 'Không phát hiện tổn thương'
        }
      },
      recommendations: [
        'Duy trì chế độ ăn uống lành mạnh',
        'Tập thể dục đều đặn 30 phút/ngày',
        'Hạn chế rượu bia',
        'Khám định kỳ 6 tháng/lần'
      ],
      riskLevel: 'low',
      confidence: 94.5
    },
    {
      id: '2',
      imageUrl: '/api/placeholder/400/300',
      analysisDate: new Date().toISOString(),
      status: 'completed',
      parameters: {
        liverSize: {
          value: 18.5,
          unit: 'cm',
          normal: false,
          description: 'Gan to hơn bình thường'
        },
        liverTexture: {
          value: 'Thô, không đồng nhất',
          normal: false,
          description: 'Cấu trúc gan bất thường'
        },
        fatContent: {
          value: 25.8,
          unit: '%',
          normal: false,
          description: 'Gan nhiễm mỡ độ vừa'
        },
        fibrosis: {
          value: 2.8,
          unit: 'F0-F4',
          normal: false,
          description: 'Xơ hóa gan độ nhẹ'
        },
        lesions: {
          count: 2,
          size: 8.5,
          unit: 'mm',
          normal: false,
          description: 'Phát hiện 2 tổn thương nhỏ'
        }
      },
      recommendations: [
        'Cần thay đổi chế độ ăn uống ngay lập tức',
        'Giảm cân nếu thừa cân',
        'Tránh hoàn toàn rượu bia',
        'Tham khảo ý kiến bác sĩ chuyên khoa',
        'Xét nghiệm máu định kỳ'
      ],
      riskLevel: 'high',
      confidence: 87.2
    }
  ];

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ được upload file ảnh!');
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('Kích thước file phải nhỏ hơn 10MB!');
        return false;
      }
      return false; // Prevent auto upload
    },
    onChange: (info) => {
      setFileList(info.fileList);
    },
    onDrop: (e) => {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleAnalyze = async () => {
    if (fileList.length === 0) {
      message.warning('Vui lòng chọn ảnh để phân tích!');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisResult(null);

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Simulate analysis completion
    setTimeout(() => {
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // Randomly select a mock result
      const randomResult = mockAnalysisResults[Math.floor(Math.random() * mockAnalysisResults.length)];
      setAnalysisResult({
        ...randomResult,
        id: Date.now().toString(),
        analysisDate: new Date().toISOString()
      });
      
      setIsAnalyzing(false);
      message.success('Phân tích ảnh gan hoàn tất!');
    }, 3000);
  };

  const handleReset = () => {
    setFileList([]);
    setAnalysisResult(null);
    setAnalysisProgress(0);
    setIsAnalyzing(false);
  };


  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low': return 'Thấp';
      case 'medium': return 'Trung bình';
      case 'high': return 'Cao';
      default: return 'Không xác định';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <CameraOutlined style={{ marginRight: '8px' }} />
          Phân tích ảnh chụp gan
        </Title>
        <Text type="secondary">
          Upload ảnh chụp gan để nhận được phân tích chi tiết về tình trạng sức khỏe gan
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Upload Section */}
        <Col xs={24} lg={12}>
          <Card title="Upload ảnh chụp gan" style={{ height: '100%' }}>
            <Dragger {...uploadProps} style={{ marginBottom: '16px' }}>
              <p className="ant-upload-drag-icon">
                <FileImageOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text">
                Click hoặc kéo thả ảnh vào đây để upload
              </p>
              <p className="ant-upload-hint">
                Hỗ trợ: JPG, PNG, GIF. Kích thước tối đa 10MB
              </p>
            </Dragger>

            {fileList.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Ảnh đã chọn:</Text>
                <div style={{ marginTop: '8px' }}>
                  {fileList.map(file => (
                    <div key={file.uid} style={{ 
                      padding: '8px', 
                      background: '#f5f5f5', 
                      borderRadius: '4px',
                      marginBottom: '4px'
                    }}>
                      <FileImageOutlined style={{ marginRight: '8px' }} />
                      {file.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Space>
              <Button
                type="primary"
                icon={<CameraOutlined />}
                onClick={handleAnalyze}
                loading={isAnalyzing}
                disabled={fileList.length === 0}
              >
                {isAnalyzing ? 'Đang phân tích...' : 'Phân tích ảnh'}
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                disabled={isAnalyzing}
              >
                Làm mới
              </Button>
            </Space>

            {isAnalyzing && (
              <div style={{ marginTop: '16px' }}>
                <Text>Tiến độ phân tích: {Math.round(analysisProgress)}%</Text>
                <Progress 
                  percent={Math.round(analysisProgress)} 
                  status={analysisProgress === 100 ? 'success' : 'active'}
                />
              </div>
            )}
          </Card>
        </Col>

        {/* Analysis Results */}
        <Col xs={24} lg={12}>
          <Card title="Kết quả phân tích" style={{ height: '100%' }}>
            {!analysisResult ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <FileImageOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
                <div style={{ marginTop: '16px' }}>
                  <Text type="secondary">
                    {isAnalyzing ? 'Đang phân tích ảnh...' : 'Chưa có kết quả phân tích'}
                  </Text>
                </div>
              </div>
            ) : (
              <div>
                {/* Risk Level Alert */}
                <Alert
                  message={`Mức độ rủi ro: ${getRiskLevelText(analysisResult.riskLevel)}`}
                  type={analysisResult.riskLevel === 'high' ? 'error' : 
                        analysisResult.riskLevel === 'medium' ? 'warning' : 'success'}
                  icon={analysisResult.riskLevel === 'high' ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}
                  style={{ marginBottom: '16px' }}
                />

                {/* Confidence Score */}
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>Độ tin cậy: </Text>
                  <Tag color="blue">{analysisResult.confidence}%</Tag>
                </div>

                {/* Parameters */}
                <Title level={4}>Thông số phân tích</Title>
                
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card size="small">
                      <Statistic
                        title="Kích thước gan"
                        value={analysisResult.parameters.liverSize.value}
                        suffix={analysisResult.parameters.liverSize.unit}
                        valueStyle={{ 
                          color: analysisResult.parameters.liverSize.normal ? '#52c41a' : '#ff4d4f' 
                        }}
                      />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {analysisResult.parameters.liverSize.description}
                      </Text>
                    </Card>
                  </Col>
                  
                  <Col span={12}>
                    <Card size="small">
                      <Statistic
                        title="Lượng mỡ gan"
                        value={analysisResult.parameters.fatContent.value}
                        suffix={analysisResult.parameters.fatContent.unit}
                        valueStyle={{ 
                          color: analysisResult.parameters.fatContent.normal ? '#52c41a' : '#ff4d4f' 
                        }}
                      />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {analysisResult.parameters.fatContent.description}
                      </Text>
                    </Card>
                  </Col>
                  
                  <Col span={12}>
                    <Card size="small">
                      <Statistic
                        title="Mức độ xơ hóa"
                        value={analysisResult.parameters.fibrosis.value}
                        suffix={analysisResult.parameters.fibrosis.unit}
                        valueStyle={{ 
                          color: analysisResult.parameters.fibrosis.normal ? '#52c41a' : '#ff4d4f' 
                        }}
                      />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {analysisResult.parameters.fibrosis.description}
                      </Text>
                    </Card>
                  </Col>
                  
                  <Col span={12}>
                    <Card size="small">
                      <Statistic
                        title="Tổn thương"
                        value={analysisResult.parameters.lesions.count}
                        suffix="cái"
                        valueStyle={{ 
                          color: analysisResult.parameters.lesions.normal ? '#52c41a' : '#ff4d4f' 
                        }}
                      />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {analysisResult.parameters.lesions.description}
                      </Text>
                    </Card>
                  </Col>
                </Row>

                <Divider />

                {/* Recommendations */}
                <Title level={4}>Khuyến nghị</Title>
                <ul style={{ paddingLeft: '20px' }}>
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>
                      <Text>{rec}</Text>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LiverImageAnalysis;
