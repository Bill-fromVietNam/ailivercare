import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import ThemeToggle from '../components/ThemeToggle';
import styles from '../styles/pages/Labs.module.css';

// Đăng ký các thành phần ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Định nghĩa kiểu dữ liệu
interface LabTest {
  id: number;
  name: string;
  category: string;
  unit: string;
  normalRange: {
    min: number;
    max: number;
  };
  results: LabResult[];
}

interface LabResult {
  id: number;
  value: number;
  date: string;
  abnormal: boolean;
}

// Dữ liệu mẫu cho xét nghiệm
const sampleLabTests: LabTest[] = [
  {
    id: 1,
    name: 'ALT (SGPT)',
    category: 'Chức năng gan',
    unit: 'U/L',
    normalRange: {
      min: 7,
      max: 55
    },
    results: [
      { id: 1, value: 45, date: '2025-05-01', abnormal: false },
      { id: 2, value: 62, date: '2025-06-01', abnormal: true },
      { id: 3, value: 58, date: '2025-07-01', abnormal: true },
      { id: 4, value: 50, date: '2025-08-01', abnormal: false },
    ]
  },
  {
    id: 2,
    name: 'AST (SGOT)',
    category: 'Chức năng gan',
    unit: 'U/L',
    normalRange: {
      min: 8,
      max: 48
    },
    results: [
      { id: 5, value: 42, date: '2025-05-01', abnormal: false },
      { id: 6, value: 55, date: '2025-06-01', abnormal: true },
      { id: 7, value: 50, date: '2025-07-01', abnormal: true },
      { id: 8, value: 44, date: '2025-08-01', abnormal: false },
    ]
  },
  {
    id: 3,
    name: 'GGT',
    category: 'Chức năng gan',
    unit: 'U/L',
    normalRange: {
      min: 9,
      max: 48
    },
    results: [
      { id: 9, value: 30, date: '2025-05-01', abnormal: false },
      { id: 10, value: 38, date: '2025-06-01', abnormal: false },
      { id: 11, value: 42, date: '2025-07-01', abnormal: false },
      { id: 12, value: 35, date: '2025-08-01', abnormal: false },
    ]
  },
  {
    id: 4,
    name: 'Bilirubin toàn phần',
    category: 'Chức năng gan',
    unit: 'mg/dL',
    normalRange: {
      min: 0.3,
      max: 1.2
    },
    results: [
      { id: 13, value: 0.8, date: '2025-05-01', abnormal: false },
      { id: 14, value: 1.1, date: '2025-06-01', abnormal: false },
      { id: 15, value: 1.4, date: '2025-07-01', abnormal: true },
      { id: 16, value: 1.0, date: '2025-08-01', abnormal: false },
    ]
  },
  {
    id: 5,
    name: 'Albumin',
    category: 'Chức năng gan',
    unit: 'g/dL',
    normalRange: {
      min: 3.5,
      max: 5.2
    },
    results: [
      { id: 17, value: 4.2, date: '2025-05-01', abnormal: false },
      { id: 18, value: 4.0, date: '2025-06-01', abnormal: false },
      { id: 19, value: 3.9, date: '2025-07-01', abnormal: false },
      { id: 20, value: 4.1, date: '2025-08-01', abnormal: false },
    ]
  }
];

const Labs: React.FC = () => {
  const [labTests] = useState<LabTest[]>(sampleLabTests);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [view, setView] = useState<'table' | 'chart'>('table');
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Lọc các xét nghiệm dựa trên điều kiện tìm kiếm
  const filteredTests = labTests.filter(test => {
    const matchesCategory = filter === 'all' || test.category === filter;
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Lấy danh sách các danh mục duy nhất
  const categories = Array.from(new Set(labTests.map(test => test.category)));

  // Định dạng ngày
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Xác định trạng thái giá trị
  const getValueStatus = (value: number, range: { min: number, max: number }): string => {
    if (value < range.min) return 'warningValue';
    if (value > range.max) return 'criticalValue';
    return 'normalValue';
  };

  // Tạo dữ liệu biểu đồ cho xét nghiệm được chọn
  const createChartData = (test: LabTest) => {
    const dates = test.results.map(r => formatDate(r.date));
    
    return {
      labels: dates,
      datasets: [
        {
          label: `${test.name} (${test.unit})`,
          data: test.results.map(r => r.value),
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          tension: 0.4,
          pointBackgroundColor: test.results.map(r => 
            r.abnormal ? '#e53935' : '#43a047'
          ),
          pointRadius: 6,
          pointHoverRadius: 8,
        }
      ]
    };
  };

  // Tạo tùy chọn cho biểu đồ
  const createChartOptions = (test: LabTest) => {
    const { min, max } = test.normalRange;
    const buffer = (max - min) * 0.2;
    
    return {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.raw;
              const isAbnormal = value < min || value > max;
              return `${test.name}: ${value} ${test.unit} ${isAbnormal ? '(Bất thường)' : '(Bình thường)'}`;
            }
          }
        }
      },
      scales: {
        y: {
          min: Math.max(0, min - buffer),
          max: max + buffer,
          ticks: {
            callback: (value: any) => `${value} ${test.unit}`
    }
  }
      }
    };
  };

  return (
    <div className={styles.labsContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Kết quả xét nghiệm</h1>
        <div className={styles.actions}>
          <button className="btn primary">Thêm kết quả xét nghiệm</button>
        </div>
      </div>
      
      <div className={styles.filtersRow}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Danh mục</label>
          <select 
            className={styles.filterSelect}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Tìm kiếm</label>
          <input 
            type="text"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm xét nghiệm..."
          />
        </div>
                </div>
                
      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <div className={styles.labsSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>Danh sách xét nghiệm</div>
              
              <div className={styles.viewOptions}>
                <button 
                  className={`${styles.viewButton} ${view === 'table' ? styles.active : ''}`}
                  onClick={() => setView('table')}
                >
                  Bảng
                </button>
                <button 
                  className={`${styles.viewButton} ${view === 'chart' ? styles.active : ''}`}
                  onClick={() => setView('chart')}
                >
                  Biểu đồ
                </button>
              </div>
                </div>
                
            {view === 'table' && (
              <div className={styles.tableWrapper}>
                <table className={styles.labsTable}>
                  <thead>
                    <tr>
                      <th>Xét nghiệm</th>
                      <th>Kết quả mới nhất</th>
                      <th>Ngày xét nghiệm</th>
                      <th>Giá trị chuẩn</th>
                      <th>Đơn vị</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.map(test => {
                      const latestResult = test.results[test.results.length - 1];
                      const status = getValueStatus(latestResult.value, test.normalRange);
                      
                      return (
                        <tr key={test.id}>
                          <td className={styles.labNameCell}>
                            <div className={styles.labName}>
                              <div 
                                className={`${styles.labIcon} ${
                                  test.category === 'Chức năng gan' ? styles.iconLiver : 
                                  styles.iconGeneral
                                }`}
                              >
                                {test.name.charAt(0)}
                              </div>
                              {test.name}
                            </div>
                          </td>
                          <td className={`${styles.valueCell} ${styles[status]}`}>
                            {latestResult.value}
                          </td>
                          <td className={styles.dateCell}>
                            {formatDate(latestResult.date)}
                          </td>
                          <td>
                            {test.normalRange.min} - {test.normalRange.max}
                          </td>
                          <td>{test.unit}</td>
                          <td>
                  <button 
                              className="btn-sm"
                              onClick={() => setSelectedTest(test)}
                  >
                              Chi tiết
                  </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            {view === 'chart' && selectedTest && (
              <div className={styles.chartsSection}>
                <div className={styles.chartContainer}>
                  <div className={styles.chartHeader}>
                    <div className={styles.chartTitle}>
                      {selectedTest.name} - Xu hướng theo thời gian
                    </div>
                  </div>
                  
                  <div className={styles.chart}>
                    <Line 
                      data={createChartData(selectedTest)}
                      options={createChartOptions(selectedTest)}
                    />
                  </div>
                  
                  <div className={styles.referenceLines}>
                    <div className={styles.referenceLine}>
                      <div className={`${styles.referenceColor} ${styles.refHigh}`}></div>
                      <span>Giới hạn trên: {selectedTest.normalRange.max} {selectedTest.unit}</span>
                    </div>
                    <div className={styles.referenceLine}>
                      <div className={`${styles.referenceColor} ${styles.refLow}`}></div>
                      <span>Giới hạn dưới: {selectedTest.normalRange.min} {selectedTest.unit}</span>
                    </div>
                    <div className={styles.referenceLine}>
                      <div className={`${styles.referenceColor} ${styles.refNormal}`}></div>
                      <span>Trong giới hạn bình thường</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {view === 'chart' && !selectedTest && (
              <div className={styles.chartsSection}>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <p>Vui lòng chọn một xét nghiệm để xem biểu đồ</p>
                </div>
            </div>
          )}
        </div>
      </div>

        <div className={styles.sidebarContent}>
          {selectedTest && (
            <div className={styles.detailsCard}>
              <div className={styles.detailsHeader}>
                <h3 className={styles.detailsTitle}>{selectedTest.name}</h3>
                <div className={styles.detailsDate}>
                  Cập nhật: {formatDate(selectedTest.results[selectedTest.results.length - 1].date)}
                </div>
              </div>
              <div className={styles.detailsBody}>
                <div className={styles.detailsList}>
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Danh mục:</div>
                    <div className={styles.detailValue}>{selectedTest.category}</div>
                  </div>
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Đơn vị:</div>
                    <div className={styles.detailValue}>{selectedTest.unit}</div>
                  </div>
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Giá trị chuẩn:</div>
                    <div className={styles.detailValue}>
                      {selectedTest.normalRange.min} - {selectedTest.normalRange.max} {selectedTest.unit}
                    </div>
                  </div>
                </div>
                
                <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>Lịch sử xét nghiệm</h4>
                <table className={styles.labsTable}>
                  <thead>
                    <tr>
                      <th>Ngày</th>
                      <th>Giá trị</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...selectedTest.results]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(result => {
                        const status = getValueStatus(result.value, selectedTest.normalRange);
                        
                        return (
                          <tr key={result.id}>
                            <td className={styles.dateCell}>
                              {formatDate(result.date)}
                            </td>
                            <td className={`${styles.valueCell} ${styles[status]}`}>
                              {result.value} {selectedTest.unit}
                            </td>
                            <td>
                              {result.abnormal ? (
                                <span className="badge warning">Bất thường</span>
                              ) : (
                                <span className="badge success">Bình thường</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
        </div>
            </div>
          )}
          
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Thông tin xét nghiệm gan</h3>
            <div className={styles.infoContent}>
              <p>Các xét nghiệm chức năng gan giúp đánh giá tình trạng hoạt động của gan. Dưới đây là một số thông tin quan trọng:</p>
              <ul className={styles.infoList}>
                <li>ALT và AST là enzyme chỉ điểm tổn thương tế bào gan</li>
                <li>GGT liên quan đến hệ thống enzyme gan và đường mật</li>
                <li>Bilirubin là sản phẩm phân hủy của hồng cầu, được xử lý bởi gan</li>
                <li>Albumin được tổng hợp bởi gan, phản ánh chức năng tổng hợp của gan</li>
              </ul>
              <p style={{ marginTop: '0.75rem' }}>Nếu bạn có bất kỳ kết quả bất thường nào, hãy tham khảo ý kiến bác sĩ để được tư vấn chuyên sâu.</p>
                    </div>
                  </div>
        </div>
      </div>
      
      <ThemeToggle />
    </div>
  );
};

export default Labs; 