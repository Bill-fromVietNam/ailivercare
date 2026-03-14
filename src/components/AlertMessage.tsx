import React from 'react';
import styles from '../styles/components/AlertMessage.module.css';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertMessageProps {
  type: AlertType;
  message: string | null;
  onClose?: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message, onClose }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <div className={styles.content}>
        <span className={styles.icon}>{getIcon()}</span>
        <span className={styles.message}>{message}</span>
      </div>
      {onClose && (
        <button type="button" className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
};

export default AlertMessage; 