import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { login, clearError } from '../store/slices/authSlice';
import ThemeToggle from '../components/ThemeToggle';
import { Card, Form as AntForm, Input, Button, Typography, Space, Alert, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const { Title, Text } = Typography;

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  password: Yup.string()
    .required('Mật khẩu là bắt buộc')
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Nếu đã đăng nhập thì chuyển hướng
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Xóa lỗi khi component unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    await dispatch(login(values));
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Row justify="center" style={{ width: '100%', maxWidth: '400px' }}>
        <Col span={24}>
          <Card
            style={{
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: 'none'
            }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
                  LiverCare
                </Title>
                <Text type="secondary">
                  Đăng nhập để quản lý sức khỏe gan
                </Text>
              </div>

              {error && (
                <Alert
                  message="Lỗi đăng nhập"
                  description={error}
                  type="error"
                  showIcon
                  closable
                  onClose={() => dispatch(clearError())}
                />
              )}

              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched, values, handleChange, handleBlur, handleSubmit }) => (
                  <AntForm
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                  >
                    <AntForm.Item
                      label="Email"
                      validateStatus={errors.email && touched.email ? 'error' : ''}
                      help={errors.email && touched.email ? errors.email : ''}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Nhập email của bạn"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        size="large"
                      />
                    </AntForm.Item>

                    <AntForm.Item
                      label="Mật khẩu"
                      validateStatus={errors.password && touched.password ? 'error' : ''}
                      help={errors.password && touched.password ? errors.password : ''}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Nhập mật khẩu của bạn"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        size="large"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      />
                    </AntForm.Item>

                    <AntForm.Item style={{ marginBottom: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <Link to="/forgot-password" style={{ color: '#1890ff' }}>
                          Quên mật khẩu?
                        </Link>
                      </div>
                    </AntForm.Item>

                    <AntForm.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading || isSubmitting}
                        size="large"
                        style={{ width: '100%' }}
                      >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                      </Button>
                    </AntForm.Item>

                    <AntForm.Item style={{ textAlign: 'center', marginBottom: 0 }}>
                      <Text>
                        Chưa có tài khoản?{' '}
                        <Link to="/register" style={{ color: '#1890ff', fontWeight: 'bold' }}>
                          Đăng ký ngay
                        </Link>
                      </Text>
                    </AntForm.Item>
                  </AntForm>
                )}
              </Formik>
            </Space>
          </Card>
        </Col>
      </Row>

      <div style={{ position: 'fixed', top: '20px', right: '20px' }}>
        <ThemeToggle type="inline" />
      </div>
    </div>
  );
};

export default Login; 