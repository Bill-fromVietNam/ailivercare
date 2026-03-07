import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { AuthAPI } from '../api/auth';
import ThemeToggle from '../components/ThemeToggle';
import AlertMessage from '../components/AlertMessage';
import styles from '../styles/pages/ForgotPassword.module.css';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc')
});

const ForgotPassword: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: { email: string }, { setSubmitting }: any) => {
    try {
      setError(null);
      await AuthAPI.forgotPassword({ email: values.email });
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err?.message || err?.response?.data?.detail || 'Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <div className={styles.forgotPasswordFormContainer}>
        <div className={styles.forgotPasswordHeader}>
          <h1 className={styles.forgotPasswordTitle}>Quên mật khẩu</h1>
          <p className={styles.forgotPasswordSubtitle}>
            {isSubmitted 
              ? 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến.' 
              : 'Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.'}
          </p>
        </div>

        {error && (
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {isSubmitted && (
          <AlertMessage
            type="success"
            message="Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến."
            onClose={() => {}}
          />
        )}

        {!isSubmitted ? (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className={styles.forgotPasswordForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>Email</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className={styles.formInput}
                    placeholder="Nhập email của bạn"
                  />
                  <ErrorMessage name="email" component="div" className={styles.errorMessage} />
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>

                <div className={styles.backToLoginContainer}>
                  <Link to="/login" className={styles.backToLoginLink}>
                    Quay lại đăng nhập
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div className={styles.successMessage}>
            <div className={styles.backToLoginContainer}>
              <Link to="/login" className={styles.backToLoginLink}>
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className={styles.themeToggleContainer}>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default ForgotPassword; 