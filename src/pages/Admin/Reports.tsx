import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styles from '../../styles/pages/Admin/Reports.module.css';
import AlertMessage from '../../components/AlertMessage';
import * as reportsApi from '../../api/reports';

// Component chính
const AdminReports: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State cho dữ liệu báo cáo
  const [dashboardStats, setDashboardStats] = useState<reportsApi.DashboardStats | null>(null);
  const [userActivity, setUserActivity] = useState<reportsApi.UserActivity[]>([]);
  const [questionnaireRates, setQuestionnaireRates] = useState<reportsApi.QuestionnaireCompletionRate[]>([]);
  
  // State cho filter
  const [activityPeriod, setActivityPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  
  // State cho xuất báo cáo
  const [reportType, setReportType] = useState<'user_data' | 'questionnaires' | 'lab_results'>('user_data');
  const [reportFormat, setReportFormat] = useState<'excel' | 'csv' | 'pdf'>('excel');
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  // Validate user is admin
  if (user?.role !== 'admin') {
    return (
      <div className={styles.accessDenied}>
        <h1>Truy cập bị từ chối</h1>
        <p>Bạn không có quyền truy cập vào trang quản trị.</p>
        <button onClick={() => navigate('/')}>Quay lại trang chủ</button>
      </div>
    );
  }

  // Tải dữ liệu dashboard
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    }
  }, [activeTab]);

  // Tải dữ liệu user activity
  useEffect(() => {
    if (activeTab === 'user-activity') {
      fetchUserActivity();
    }
  }, [activeTab, activityPeriod]);

  // Tải dữ liệu questionnaire completion
  useEffect(() => {
    if (activeTab === 'questionnaires') {
      fetchQuestionnaireRates();
    }
  }, [activeTab]);

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await reportsApi.getDashboardStats();
      setDashboardStats(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải thống kê dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user activity
  const fetchUserActivity = async () => {
    try {
      setLoading(true);
      const data = await reportsApi.getUserActivity(activityPeriod, dateFrom || undefined, dateTo || undefined);
      setUserActivity(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu hoạt động người dùng');
    } finally {
      setLoading(false);
    }
  };

  // Fetch questionnaire completion rates
  const fetchQuestionnaireRates = async () => {
    try {
      setLoading(true);
      const data = await reportsApi.getQuestionnaireCompletionRates();
      setQuestionnaireRates(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu hoàn thành bảng câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  // Export report
  const handleExportReport = async () => {
    try {
      setExportLoading(true);
      const response = await reportsApi.generateReport({
        report_type: reportType,
        format: reportFormat,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined
      });
      
      // Tạo URL cho blob và tải xuống
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_report.${reportFormat === 'excel' ? 'xlsx' : reportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể xuất báo cáo');
    } finally {
      setExportLoading(false);
    }
  };

  // Hiển thị Dashboard Stats
  const renderDashboardStats = () => {
    if (!dashboardStats) return <div className={styles.noData}>Không có dữ liệu</div>;
    
    return (
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👤</div>
          <div className={styles.statInfo}>
            <h3>{dashboardStats.users.total}</h3>
            <p>Tổng người dùng</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statInfo}>
            <h3>{dashboardStats.users.active}</h3>
            <p>Người dùng đang hoạt động</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statInfo}>
            <h3>{dashboardStats.questionnaires.completed}</h3>
            <p>Bảng câu hỏi đã hoàn thành</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statInfo}>
            <h3>{dashboardStats.appointments.pending}</h3>
            <p>Cuộc hẹn đang chờ</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🧪</div>
          <div className={styles.statInfo}>
            <h3>{dashboardStats.lab_results.total}</h3>
            <p>Kết quả xét nghiệm</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statInfo}>
            <h3>{dashboardStats.recommendations.active}</h3>
            <p>Khuyến nghị đang hoạt động</p>
          </div>
        </div>
      </div>
    );
  };

  // Hiển thị User Activity
  const renderUserActivity = () => {
    if (userActivity.length === 0) return <div className={styles.noData}>Không có dữ liệu</div>;
    
    return (
      <div className={styles.userActivitySection}>
        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            <label>Thời gian:</label>
            <select 
              value={activityPeriod} 
              onChange={(e) => setActivityPeriod(e.target.value as 'week' | 'month' | 'year')}
            >
              <option value="week">Tuần gần đây</option>
              <option value="month">Tháng gần đây</option>
              <option value="year">Năm gần đây</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Từ ngày:</label>
            <input 
              type="date" 
              value={dateFrom} 
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Đến ngày:</label>
            <input 
              type="date" 
              value={dateTo} 
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <button 
            className={styles.filterButton}
            onClick={fetchUserActivity}
          >
            Áp dụng
          </button>
        </div>
        
        <div className={styles.activityTable}>
          <table>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Đăng ký mới</th>
                <th>Lượt đăng nhập</th>
              </tr>
            </thead>
            <tbody>
              {userActivity.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.date}</td>
                  <td>{activity.registrations}</td>
                  <td>{activity.logins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Hiển thị Questionnaire Completion Rates
  const renderQuestionnaireRates = () => {
    if (questionnaireRates.length === 0) return <div className={styles.noData}>Không có dữ liệu</div>;
    
    return (
      <div className={styles.questionnaireRatesSection}>
        <table className={styles.ratesTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Tổng giao</th>
              <th>Hoàn thành</th>
              <th>Tỷ lệ hoàn thành</th>
            </tr>
          </thead>
          <tbody>
            {questionnaireRates.map((rate) => (
              <tr key={rate.questionnaire_id}>
                <td>{rate.questionnaire_id}</td>
                <td>{rate.title}</td>
                <td>{rate.total_assigned}</td>
                <td>{rate.completed}</td>
                <td>{rate.completion_rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Hiển thị Export Report
  const renderExportReport = () => {
    return (
      <div className={styles.exportSection}>
        <div className={styles.exportForm}>
          <div className={styles.formGroup}>
            <label>Loại báo cáo:</label>
            <select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value as any)}
            >
              <option value="user_data">Dữ liệu người dùng</option>
              <option value="questionnaires">Bảng câu hỏi</option>
              <option value="lab_results">Kết quả xét nghiệm</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Định dạng:</label>
            <select 
              value={reportFormat} 
              onChange={(e) => setReportFormat(e.target.value as any)}
            >
              <option value="excel">Excel (.xlsx)</option>
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Từ ngày:</label>
            <input 
              type="date" 
              value={dateFrom} 
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Đến ngày:</label>
            <input 
              type="date" 
              value={dateTo} 
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          
          <button 
            className={styles.exportButton}
            onClick={handleExportReport}
            disabled={exportLoading}
          >
            {exportLoading ? 'Đang xuất...' : 'Xuất báo cáo'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Báo cáo và thống kê</h1>
        <p className={styles.description}>Xem thống kê hệ thống và xuất báo cáo</p>
      </div>

      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className={styles.tabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'dashboard' ? styles.active : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Tổng quan
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'user-activity' ? styles.active : ''}`}
          onClick={() => setActiveTab('user-activity')}
        >
          Hoạt động người dùng
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'questionnaires' ? styles.active : ''}`}
          onClick={() => setActiveTab('questionnaires')}
        >
          Bảng câu hỏi
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'export' ? styles.active : ''}`}
          onClick={() => setActiveTab('export')}
        >
          Xuất báo cáo
        </button>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboardStats()}
            {activeTab === 'user-activity' && renderUserActivity()}
            {activeTab === 'questionnaires' && renderQuestionnaireRates()}
            {activeTab === 'export' && renderExportReport()}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReports; 