import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import * as reportsApi from '../../api/reports';
import styles from '../../styles/pages/Admin/Dashboard.module.css';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    recently_active: number;
  };
  questionnaires: {
    completed: number;
  };
  appointments: {
    pending: number;
  };
  lab_results: {
    total: number;
  };
  recommendations: {
    active: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
  };
  tasks: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Verify user is admin
  if (user?.role !== 'admin') {
    return (
      <div className={styles.accessDenied}>
        <h1>Truy cập bị từ chối</h1>
        <p>Bạn không có quyền truy cập vào trang quản trị.</p>
        <button onClick={() => navigate('/')}>Quay lại trang chủ</button>
      </div>
    );
  }

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const data = await reportsApi.getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Không thể tải số liệu thống kê');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h1>Có lỗi xảy ra</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bảng điều khiển quản trị</h1>
        <p className={styles.description}>
          Tổng quan về hoạt động của hệ thống.
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statsCard}>
          <div className={styles.statsHeader}>
            <h2>Người dùng</h2>
            <span className={styles.statsIcon}>👥</span>
          </div>
          <div className={styles.statsContent}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Tổng số:</span>
              <span className={styles.statValue}>{stats?.users.total || 0}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Đang hoạt động:</span>
              <span className={styles.statValue}>{stats?.users.active || 0}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Hoạt động gần đây:</span>
              <span className={styles.statValue}>{stats?.users.recently_active || 0}</span>
            </div>
          </div>
          <button 
            className={styles.cardButton}
            onClick={() => navigate('/admin/users')}
          >
            Quản lý người dùng
          </button>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.statsHeader}>
            <h2>Bảng câu hỏi</h2>
            <span className={styles.statsIcon}>📝</span>
          </div>
          <div className={styles.statsContent}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Đã hoàn thành:</span>
              <span className={styles.statValue}>{stats?.questionnaires.completed || 0}</span>
            </div>
          </div>
          <button 
            className={styles.cardButton}
            onClick={() => navigate('/admin/questionnaires')}
          >
            Quản lý bảng câu hỏi
          </button>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.statsHeader}>
            <h2>Cuộc hẹn</h2>
            <span className={styles.statsIcon}>📅</span>
          </div>
          <div className={styles.statsContent}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Đang chờ:</span>
              <span className={styles.statValue}>{stats?.appointments.pending || 0}</span>
            </div>
          </div>
          <button 
            className={styles.cardButton}
            onClick={() => navigate('/appointments')}
          >
            Xem lịch hẹn
          </button>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.statsHeader}>
            <h2>Xét nghiệm</h2>
            <span className={styles.statsIcon}>🧪</span>
          </div>
          <div className={styles.statsContent}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Tổng số:</span>
              <span className={styles.statValue}>{stats?.lab_results.total || 0}</span>
            </div>
          </div>
          <button 
            className={styles.cardButton}
            onClick={() => navigate('/labs')}
          >
            Xem kết quả xét nghiệm
          </button>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.statsHeader}>
            <h2>Dự án</h2>
            <span className={styles.statsIcon}>📁</span>
          </div>
          <div className={styles.statsContent}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Tổng số:</span>
              <span className={styles.statValue}>{stats?.projects.total || 0}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Đang hoạt động:</span>
              <span className={styles.statValue}>{stats?.projects.active || 0}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Đã hoàn thành:</span>
              <span className={styles.statValue}>{stats?.projects.completed || 0}</span>
            </div>
          </div>
          <button 
            className={styles.cardButton}
            onClick={() => navigate('/projects')}
          >
            Xem dự án
          </button>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.statsHeader}>
            <h2>Nhiệm vụ</h2>
            <span className={styles.statsIcon}>✓</span>
          </div>
          <div className={styles.statsContent}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Tổng số:</span>
              <span className={styles.statValue}>{stats?.tasks.total || 0}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Chưa bắt đầu:</span>
              <span className={styles.statValue}>{stats?.tasks.pending || 0}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Đang thực hiện:</span>
              <span className={styles.statValue}>{stats?.tasks.in_progress || 0}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Đã hoàn thành:</span>
              <span className={styles.statValue}>{stats?.tasks.completed || 0}</span>
            </div>
          </div>
          <button 
            className={styles.cardButton}
            onClick={() => navigate('/tasks')}
          >
            Xem nhiệm vụ
          </button>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.statsHeader}>
            <h2>Khuyến nghị</h2>
            <span className={styles.statsIcon}>🎯</span>
          </div>
          <div className={styles.statsContent}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Đang hoạt động:</span>
              <span className={styles.statValue}>{stats?.recommendations.active || 0}</span>
            </div>
          </div>
          <button 
            className={styles.cardButton}
            onClick={() => navigate('/admin/recommendations')}
          >
            Quản lý khuyến nghị
          </button>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.statsHeader}>
            <h2>Báo cáo & Thống kê</h2>
            <span className={styles.statsIcon}>📊</span>
          </div>
          <div className={styles.statsContent}>
            <p className={styles.statDescription}>
              Truy cập báo cáo chi tiết và thống kê của hệ thống.
            </p>
          </div>
          <button 
            className={styles.cardButton}
            onClick={() => navigate('/admin/reports')}
          >
            Xem báo cáo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 