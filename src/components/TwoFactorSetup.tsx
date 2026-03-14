import React, { useState, useEffect } from 'react';
import { SecurityAPI, TwoFactorSetupResponse } from '../api/security';
import styles from '../styles/components/TwoFactorSetup.module.css';
import AlertMessage from './AlertMessage';

interface TwoFactorSetupProps {
  onSetupComplete?: () => void;
  onCancel?: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  onSetupComplete,
  onCancel
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [setupData, setSetupData] = useState<TwoFactorSetupResponse | null>(null);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [step, setStep] = useState<'setup' | 'verify'>('setup');

  useEffect(() => {
    if (step === 'setup') {
      initializeSetup();
    }
  }, []);

  const initializeSetup = async () => {
    try {
      setLoading(true);
      const response = await SecurityAPI.setupTwoFactor();
      setSetupData(response);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Không thể khởi tạo xác thực hai yếu tố');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode) {
      setError('Vui lòng nhập mã xác thực');
      return;
    }

    try {
      setLoading(true);
      await SecurityAPI.verifyAndEnableTwoFactor({ code: verificationCode });
      setError(null);
      if (onSetupComplete) {
        onSetupComplete();
      }
    } catch (err: any) {
      setError(err?.message || 'Mã xác thực không hợp lệ');
    } finally {
      setLoading(false);
    }
  };

  const renderSetupInstructions = () => (
    <div className={styles.setupInstructions}>
      <h3 className={styles.instructionTitle}>Thiết lập xác thực hai yếu tố (2FA)</h3>
      
      <ol className={styles.instructionSteps}>
        <li>Tải ứng dụng <strong>Google Authenticator</strong> hoặc <strong>Authy</strong> trên điện thoại của bạn.</li>
        <li>Quét mã QR bên dưới bằng ứng dụng hoặc nhập mã bí mật theo cách thủ công.</li>
        <li>Nhập mã 6 chữ số hiển thị trên ứng dụng để xác minh thiết lập.</li>
      </ol>
      
      <div className={styles.warning}>
        <strong>Lưu ý quan trọng:</strong> Hãy lưu mã bí mật ở nơi an toàn. Nếu bạn mất quyền truy cập vào ứng dụng xác thực, 
        bạn sẽ cần mã bí mật này để khôi phục quyền truy cập vào tài khoản.
      </div>
    </div>
  );

  const renderSetupStep = () => (
    <>
      {renderSetupInstructions()}
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Đang tải mã QR...</p>
        </div>
      ) : setupData ? (
        <div className={styles.setupContainer}>
          <div className={styles.qrCodeContainer}>
            <img 
              src={setupData.qr_code_url} 
              alt="QR Code for 2FA setup" 
              className={styles.qrCode} 
            />
          </div>
          
          <div className={styles.secretKeyContainer}>
            <p className={styles.secretKeyLabel}>Mã bí mật:</p>
            <div className={styles.secretKey}>
              <code>{setupData.secret_key}</code>
              <button 
                className={styles.copyButton}
                onClick={() => {
                  navigator.clipboard.writeText(setupData.secret_key);
                  alert('Đã sao chép mã bí mật vào clipboard');
                }}
                title="Sao chép mã bí mật"
              >
                📋
              </button>
            </div>
          </div>
          
          <div className={styles.actionButtons}>
            <button 
              className={styles.cancelButton}
              onClick={onCancel}
              disabled={loading}
            >
              Hủy
            </button>
            <button 
              className={styles.nextButton}
              onClick={() => setStep('verify')}
              disabled={loading}
            >
              Tiếp tục
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.errorContainer}>
          <p>Không thể tải mã QR. Vui lòng thử lại.</p>
          <button 
            className={styles.retryButton}
            onClick={initializeSetup}
          >
            Thử lại
          </button>
        </div>
      )}
    </>
  );

  const renderVerifyStep = () => (
    <div className={styles.verifyContainer}>
      <h3 className={styles.verifyTitle}>Xác minh thiết lập</h3>
      <p className={styles.verifyInstructions}>
        Nhập mã 6 chữ số từ ứng dụng xác thực của bạn để hoàn tất thiết lập.
      </p>
      
      <div className={styles.codeInputContainer}>
        <input
          type="text"
          maxLength={6}
          className={styles.codeInput}
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="123456"
          autoFocus
        />
      </div>
      
      <div className={styles.actionButtons}>
        <button 
          className={styles.backButton}
          onClick={() => setStep('setup')}
          disabled={loading}
        >
          Quay lại
        </button>
        <button 
          className={styles.verifyButton}
          onClick={handleVerify}
          disabled={loading || verificationCode.length !== 6}
        >
          {loading ? 'Đang xác minh...' : 'Xác minh'}
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      
      {step === 'setup' ? renderSetupStep() : renderVerifyStep()}
    </div>
  );
};

export default TwoFactorSetup; 