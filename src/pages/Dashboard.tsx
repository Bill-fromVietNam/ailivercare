import React, { useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import Sidebar from '../components/Sidebar';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Button, 
  Space, 
  Progress
} from 'antd';
import {
  BarChartOutlined,
  ArrowDownOutlined,
  FormOutlined,
  CalendarOutlined
} from '@ant-design/icons';

// Đăng ký ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler
);

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Dữ liệu cho biểu đồ đường
  const lineChartData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        label: 'ALT',
        data: [35, 38, 45, 50, 48, 42, 40, 41, 39, 37, 35, 32],
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'AST',
        data: [28, 32, 38, 42, 40, 37, 35, 34, 32, 30, 28, 27],
        borderColor: '#52c41a',
        backgroundColor: 'rgba(82, 196, 26, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Dữ liệu cho biểu đồ tròn
  const doughnutChartData = {
    labels: ['Hoàn thành', 'Đang thực hiện', 'Chưa thực hiện'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ['#52c41a', '#1890ff', '#d9d9d9'],
        hoverBackgroundColor: ['#389e0d', '#096dd9', '#bfbfbf']
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'U/L'
        }
      }
    }
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    }
  };


      return (
        <Sidebar>
          <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <Title level={2} style={{ margin: 0, display: 'inline-block' }}>
              Tổng quan
            </Title>
            <Space style={{ float: 'right' }}>
              <Button 
                type={period === 'week' ? 'primary' : 'default'}
                onClick={() => setPeriod('week')}
              >
                Tuần
              </Button>
              <Button 
                type={period === 'month' ? 'primary' : 'default'}
                onClick={() => setPeriod('month')}
              >
                Tháng
              </Button>
              <Button 
                type={period === 'year' ? 'primary' : 'default'}
                onClick={() => setPeriod('year')}
              >
                Năm
              </Button>
            </Space>
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Chỉ số ALT"
                  value={32}
                  suffix="U/L"
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<BarChartOutlined />}
                />
                <div style={{ marginTop: '8px' }}>
                  <Text type="secondary">
                    <ArrowDownOutlined style={{ color: '#52c41a' }} /> -3 U/L so với tháng trước
                  </Text>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Chỉ số AST"
                  value={27}
                  suffix="U/L"
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<BarChartOutlined />}
                />
                <div style={{ marginTop: '8px' }}>
                  <Text type="secondary">
                    <ArrowDownOutlined style={{ color: '#52c41a' }} /> -1 U/L so với tháng trước
                  </Text>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Lịch hẹn sắp tới"
                  value={2}
                  valueStyle={{ color: '#fa8c16' }}
                  prefix={<CalendarOutlined />}
                />
                <div style={{ marginTop: '8px' }}>
                  <Text type="secondary">Trong 7 ngày tới</Text>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Bảng câu hỏi"
                  value={1}
                  valueStyle={{ color: '#722ed1' }}
                   prefix={<FormOutlined />}
                />
                <div style={{ marginTop: '8px' }}>
                  <Text type="secondary">Cần hoàn thành</Text>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
            <Col xs={24} lg={16}>
              <Card 
                title="Xu hướng chỉ số gan" 
                extra={<Text type="secondary">Theo dõi ALT và AST theo thời gian</Text>}
              >
                <div style={{ height: '300px' }}>
                  <Line data={lineChartData} options={lineChartOptions} />
                </div>
              </Card>
            </Col>
            
            <Col xs={24} lg={8}>
              <Card 
                title="Tiến độ nhiệm vụ" 
                extra={<Text type="secondary">Trạng thái các nhiệm vụ sức khỏe</Text>}
              >
                <div style={{ height: '300px' }}>
                  <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
            <Col xs={24} lg={12}>
              <Card title="Nhiệm vụ gần đây">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>Hoàn thành bảng câu hỏi sức khỏe</Text>
                    <Progress percent={100} size="small" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>Xét nghiệm máu định kỳ</Text>
                    <Progress percent={75} size="small" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>Tham gia tư vấn dinh dưỡng</Text>
                    <Progress percent={50} size="small" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>Kiểm tra sức khỏe tổng quát</Text>
                    <Progress percent={25} size="small" />
                  </div>
                </Space>
              </Card>
            </Col>
            
            <Col xs={24} lg={12}>
              <Card title="Thông báo mới">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <Text strong>Lịch hẹn khám sắp tới</Text>
                    <br />
                    <Text type="secondary">Bạn có lịch hẹn khám vào ngày 15/12/2024</Text>
                  </div>
                  <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <Text strong>Kết quả xét nghiệm</Text>
                    <br />
                    <Text type="secondary">Kết quả xét nghiệm ALT đã có sẵn</Text>
                  </div>
                  <div style={{ padding: '8px 0' }}>
                    <Text strong>Khuyến nghị mới</Text>
                    <br />
                    <Text type="secondary">Cập nhật chế độ ăn uống phù hợp</Text>
                  </div>
                </Space>
              </Card>
             </Col>
           </Row>
      </div>
    </Sidebar>
  );
};

export default Dashboard;