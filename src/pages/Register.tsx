import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { register, clearError, clearRegistrationSuccess } from '../store/slices/authSlice'
import ThemeToggle from '../components/ThemeToggle'
import { Card, Form as AntForm, Input, Button, Typography, Space, Alert, Row, Col, Checkbox } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'

const { Title, Text } = Typography;

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
  full_name: Yup.string()
    .required('Vui lòng nhập họ và tên'),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'Vui lòng chấp nhận điều khoản sử dụng')
})

interface RegisterFormValues {
  email: string
  password: string
  confirmPassword: string
  full_name: string
  acceptTerms: boolean
}

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error, registrationSuccess } = useSelector((state: RootState) => state.auth)

  // Clear errors and registration status when component mounts/unmounts
  useEffect(() => {
    dispatch(clearError())
    
    return () => {
      dispatch(clearError())
      dispatch(clearRegistrationSuccess())
    }
  }, [dispatch])
  
  // Redirect to login after successful registration with a slight delay
  useEffect(() => {
    if (registrationSuccess) {
      const timer = setTimeout(() => {
        navigate('/login')
      }, 5000) // Redirect after 5 seconds
      
      return () => clearTimeout(timer)
    }
  }, [registrationSuccess, navigate])

  const handleSubmit = async (values: RegisterFormValues, { setSubmitting }: FormikHelpers<RegisterFormValues>) => {
    try {
      await dispatch(register({
        email: values.email,
        password: values.password,
        full_name: values.full_name
      })).unwrap()
    } catch (err) {
      // Error is handled by the Redux state
      console.error('Registration error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (registrationSuccess) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <Row justify="center" style={{ width: '100%', maxWidth: '500px' }}>
          <Col span={24}>
            <Card
              style={{
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: 'none',
                textAlign: 'center'
              }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ color: '#52c41a', fontSize: '48px' }}>✅</div>
                <Title level={2} style={{ color: '#52c41a' }}>
                  Đăng ký thành công!
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  Vui lòng kiểm tra email để xác thực tài khoản của bạn.
                </Text>
                <Text type="secondary">
                  Bạn sẽ được chuyển hướng đến trang đăng nhập sau 5 giây...
                </Text>
                <Button type="primary" size="large">
                  <Link to="/login" style={{ color: 'white' }}>
                    Đăng nhập ngay
                  </Link>
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
        <div style={{ position: 'fixed', top: '20px', right: '20px' }}>
          <ThemeToggle type="inline" />
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Row justify="center" style={{ width: '100%', maxWidth: '500px' }}>
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
                  Tạo tài khoản
                </Title>
                <Text type="secondary">
                  Đăng ký để quản lý sức khỏe gan
                </Text>
              </div>

              {error && (
                <Alert
                  message="Lỗi đăng ký"
                  description={error}
                  type="error"
                  showIcon
                  closable
                  onClose={() => dispatch(clearError())}
                />
              )}

              <Formik
                initialValues={{
                  email: '',
                  password: '',
                  confirmPassword: '',
                  full_name: '',
                  acceptTerms: false
                }}
                validationSchema={RegisterSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, touched, errors, values, handleChange, handleBlur, handleSubmit }) => (
                  <AntForm
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                  >
                    <AntForm.Item
                      label="Họ và tên"
                      validateStatus={errors.full_name && touched.full_name ? 'error' : ''}
                      help={errors.full_name && touched.full_name ? errors.full_name : ''}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Nguyễn Văn A"
                        name="full_name"
                        value={values.full_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        size="large"
                      />
                    </AntForm.Item>

                    <AntForm.Item
                      label="Email"
                      validateStatus={errors.email && touched.email ? 'error' : ''}
                      help={errors.email && touched.email ? errors.email : ''}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="you@example.com"
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
                        placeholder="••••••••"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        size="large"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      />
                    </AntForm.Item>

                    <AntForm.Item
                      label="Xác nhận mật khẩu"
                      validateStatus={errors.confirmPassword && touched.confirmPassword ? 'error' : ''}
                      help={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ''}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="••••••••"
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        size="large"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      />
                    </AntForm.Item>

                    <AntForm.Item
                      validateStatus={errors.acceptTerms && touched.acceptTerms ? 'error' : ''}
                      help={errors.acceptTerms && touched.acceptTerms ? errors.acceptTerms : ''}
                    >
                      <Checkbox
                        name="acceptTerms"
                        checked={values.acceptTerms}
                        onChange={handleChange}
                      >
                        Tôi đồng ý với{' '}
                        <a href="#" style={{ color: '#1890ff' }}>Điều khoản sử dụng</a>
                        {' '}và{' '}
                        <a href="#" style={{ color: '#1890ff' }}>Chính sách bảo mật</a>
                      </Checkbox>
                    </AntForm.Item>

                    <AntForm.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading || isSubmitting}
                        size="large"
                        style={{ width: '100%' }}
                      >
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                      </Button>
                    </AntForm.Item>

                    <AntForm.Item style={{ textAlign: 'center', marginBottom: 0 }}>
                      <Text>
                        Đã có tài khoản?{' '}
                        <Link to="/login" style={{ color: '#1890ff', fontWeight: 'bold' }}>
                          Đăng nhập ngay
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
  )
}

export default Register 