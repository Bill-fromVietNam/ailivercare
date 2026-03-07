import React, { useState, useEffect } from 'react';
import styles from '../styles/layout/ThemeToggle.module.css';

type ThemeToggleProps = {
  type?: 'floating' | 'inline';
};

const ThemeToggle: React.FC<ThemeToggleProps> = ({ type = 'floating' }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Kiểm tra localStorage trước
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    
    // Kiểm tra prefers-color-scheme của hệ thống
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Áp dụng theme khi component mount và khi isDarkMode thay đổi
  useEffect(() => {
    // Thêm hoặc xóa class dark-theme khỏi html element
    if (isDarkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
    
    // Lưu lựa chọn vào localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Cập nhật meta theme-color cho mobile devices
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDarkMode ? '#121212' : '#ffffff');
    }
  }, [isDarkMode]);

  // Lắng nghe sự thay đổi prefers-color-scheme của hệ thống
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Chỉ tự động thay đổi nếu không có lựa chọn nào được lưu trong localStorage
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };
    
    // Thêm event listener nếu browser hỗ trợ
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback cho Safari cũ hơn
      mediaQuery.addListener(handleChange);
    }
    
    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Hàm xử lý toggle
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return type === 'floating' ? null : (
    <div className={styles.inlineToggle}>
      <span className={styles.toggleLabel}>
        {isDarkMode ? 'Chế độ tối' : 'Chế độ sáng'}
      </span>
      <label className={styles.toggleSwitch}>
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={toggleDarkMode}
          aria-label={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
        />
        <span className={styles.toggleSlider}></span>
      </label>
    </div>
  );
};

export default ThemeToggle; 