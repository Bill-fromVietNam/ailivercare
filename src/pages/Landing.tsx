import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Layout, Typography, Button, Row, Col, Card, Space, Statistic } from 'antd';
import '../styles/pages/Landing.css';
import type { RootState } from '../store/store';

const { Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const featuresRef = useRef<HTMLDivElement>(null);

  // Countdown end time persisted in localStorage
  const [endTime, setEndTime] = useState<number>(() => {
    const saved = localStorage.getItem('lpCountdownEnd');
    if (saved) {
      const n = Number(saved);
      if (!Number.isNaN(n) && n > Date.now()) return n;
    }
    const threeDays = Date.now() + 3 * 24 * 60 * 60 * 1000;
    localStorage.setItem('lpCountdownEnd', String(threeDays));
    return threeDays;
  });

  // Auto extend if expired to keep it running (sales-like behavior)
  useEffect(() => {
    if (endTime <= Date.now()) {
      const next = Date.now() + 3 * 24 * 60 * 60 * 1000;
      localStorage.setItem('lpCountdownEnd', String(next));
      setEndTime(next);
    }
  }, [endTime]);

  const scrollToFeatures = () => featuresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleConsultationClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <Layout>

      <Content>
        {/* Promo Top Bar */}
        <section className="landing-topbar">
          <Row align="middle" justify="space-between">
            <Col>
              <Text strong>Giảm giá 10%</Text>
              <Text style={{ marginLeft: 12 }}>Toàn bộ dịch vụ ra mắt tháng này!</Text>
            </Col>
            <Col>
              <Button type="default" className="topbar-cta" onClick={handleConsultationClick}>Tư vấn cho tôi</Button>
            </Col>
          </Row>
        </section>
        
        {/* Hero */}
        <section className="landing-hero">
          <Row gutter={[0, 24]} align="middle">
            <Col xs={24} md={12}>
              <Title className="landing-hero-title hero-accent" level={2}>Chăm sóc sức khỏe gan</Title>
              <Title className="landing-hero-title hero-main" level={1} style={{ marginTop: 0 }}>THĂNG HẠNG SỨC KHỎE</Title>
              <Paragraph className="landing-hero-subtitle">
                Nền tảng theo dõi, quản lý và cải thiện sức khỏe gan của bạn.
                Kết nối chuyên gia, cập nhật chỉ số và nhận khuyến nghị khoa học.
              </Paragraph>
              <div className="hero-actions">
                <div className="promo-column">
                  <div className="promo-block">
                    <div className="promo-label">GIẢM GIÁ ĐẾN</div>
                    <div className="promo-percent">20%</div>
                  </div>
                  <Button size="large" type="primary" onClick={scrollToFeatures}>Khám phá ngay</Button>
                </div>
                <div className="hero-features">
                  <Space direction="vertical" size={10}>
                    <Card hoverable className="hero-feature-pill" title="Bảng câu hỏi" />
                    <Card hoverable className="hero-feature-pill" title="Cuộc hẹn" />
                    <Card hoverable className="hero-feature-pill" title="Xét nghiệm (Labs)" />
                  </Space>
                </div>
              </div>
              {/* moved feature grid below the hero row */}
            </Col>
            <Col xs={24} md={12}>
              <div className="hero-media">
                <img src="/123.png" alt="Minh họa" className="hero-image" />
                <div className="hero-countdown">
                  <Text strong>Ưu đãi sắp kết thúc</Text>
                  <div className="hero-countdown-box">
                    <Statistic.Countdown value={endTime} format="DD:HH:mm:ss" />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <div className="hero-features-grid" ref={featuresRef as any}>
            <Row gutter={[10, 10]} className="feature-grid secondary-feature-grid" style={{ marginTop: 8 }}>
              <Col xs={12} sm={8} md={8} lg={4} xl={4}>
                <Card hoverable className="feature-card feature-card-sm" title="Đánh giá rủi ro" />
              </Col>
              <Col xs={12} sm={8} md={8} lg={4} xl={4}>
                <Card hoverable className="feature-card feature-card-sm" title="Khuyến nghị" />
              </Col>
              <Col xs={12} sm={8} md={8} lg={4} xl={4}>
                <Card hoverable className="feature-card feature-card-sm" title="Báo cáo" />
              </Col>
              <Col xs={12} sm={8} md={8} lg={4} xl={4}>
                <Card hoverable className="feature-card feature-card-sm" title="Thông báo" />
              </Col>
              <Col xs={12} sm={8} md={8} lg={4} xl={4}>
                <Card hoverable className="feature-card feature-card-sm" title="Tác vụ (Tasks)" />
              </Col>
              <Col xs={12} sm={8} md={8} lg={4} xl={4}>
                <Card hoverable className="feature-card feature-card-sm" title="Bảo mật" />
              </Col>
            </Row>
          </div>
        </section>

        

        {/* Section removed per request */}

        {/* Phần dưới đã được lược bỏ theo yêu cầu */}
      </Content>

      <Footer className="landing-footer">
        © {new Date().getFullYear()} LiverCare. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default Landing;


