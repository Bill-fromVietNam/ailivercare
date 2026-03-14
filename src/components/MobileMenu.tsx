import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/layout/MobileMenu.module.css';
import ThemeToggle from './ThemeToggle';
import { logout } from '../store/slices/authSlice';
import { RootState } from '../store/store';
import { AnyAction } from '@reduxjs/toolkit';

interface MenuLink {
  to: string;
  label: string;
  icon: string;
}

interface MobileMenuProps {
  isAdmin?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isAdmin = false, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Effect to listen for route changes
  useEffect(() => {
    const handleRouteChange = () => {
      onClose();
    };

    // This will listen for clicks on links that change the route
    document.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).tagName === 'A') {
        handleRouteChange();
      }
    });

    return () => {
      document.removeEventListener('click', handleRouteChange);
    };
  }, [onClose]);

  const handleLogout = () => {
    dispatch(logout() as unknown as AnyAction);
    onClose();
  };

  const publicLinks: MenuLink[] = [
    { to: '/login', label: 'Đăng nhập', icon: '🔑' },
    { to: '/register', label: 'Đăng ký', icon: '📝' }
  ];

  const privateLinks: MenuLink[] = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/assessments', label: 'Đánh giá', icon: '📋' },
    { to: '/appointments', label: 'Cuộc hẹn', icon: '📅' },
    { to: '/labs', label: 'Xét nghiệm', icon: '🔬' },
    { to: '/questionnaires', label: 'Bảng câu hỏi', icon: '📝' },
    { to: '/recommendations', label: 'Khuyến nghị', icon: '💡' },
    { to: '/projects', label: 'Dự án', icon: '📁' },
    { to: '/tasks', label: 'Nhiệm vụ', icon: '✓' },
    { to: '/notifications', label: 'Thông báo', icon: '🔔' }
  ];

  const adminLinks: MenuLink[] = [
    { to: '/admin', label: 'Quản trị', icon: '⚙️' },
    { to: '/admin/users', label: 'Quản lý người dùng', icon: '👥' },
    { to: '/admin/questionnaires', label: 'Quản lý bảng câu hỏi', icon: '📝' },
    { to: '/admin/recommendations', label: 'Quản lý khuyến nghị', icon: '💡' },
    { to: '/admin/notifications', label: 'Quản lý thông báo', icon: '🔔' },
    { to: '/admin/reports', label: 'Báo cáo & thống kê', icon: '📊' }
  ];

  return (
    <div id="mobileMenu" className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
      <div className={styles.menuHeader}>
        <span className={styles.menuLogo}>LiverCare</span>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>

      {isAuthenticated && user && (
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {(user.full_name || user.email.charAt(0)).charAt(0).toUpperCase()}
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>
              {user.full_name || 'Người dùng'}
              {isAdmin && <span className={styles.adminBadge}>Admin</span>}
            </div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>
        </div>
      )}

      <nav className={styles.navLinks}>
        {isAuthenticated ? (
          <>
            {privateLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                <span className={styles.linkIcon}>{link.icon}</span>
                <span className={styles.linkText}>{link.label}</span>
              </NavLink>
            ))}

            {isAdmin && (
              <div className={styles.adminSection}>
                <div className={styles.adminSectionTitle}>Quản trị viên</div>
                {adminLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `${styles.adminLink} ${isActive || window.location.pathname.startsWith(link.to + '/') ? styles.active : ''}`
                    }
                    onClick={onClose}
                  >
                    <span className={styles.linkIcon}>{link.icon}</span>
                    <span className={styles.linkText}>{link.label}</span>
                  </NavLink>
                ))}
              </div>
            )}

            <button className={styles.navLink} onClick={handleLogout}>
              <span className={styles.linkIcon}>🚪</span>
              <span className={styles.linkText}>Đăng xuất</span>
            </button>
          </>
        ) : (
          publicLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.linkIcon}>{link.icon}</span>
              <span className={styles.linkText}>{link.label}</span>
            </NavLink>
          ))
        )}
      </nav>

      <div className={styles.menuFooter}>
        <ThemeToggle />
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} LiverCare
        </div>
      </div>
    </div>
  );
};

export default MobileMenu; 