import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf } from '@react-pdf/renderer';

// Định nghĩa kiểu dữ liệu
interface AssessmentResult {
  totalScore: number;
  maxScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  categoryScores: {
    [key: string]: {
      score: number;
      maxScore: number;
      percentage: number;
    };
  };
  recommendations: string[];
}

// Định nghĩa các styles cho PDF
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f7ff',
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 10,
    color: '#616161',
    textAlign: 'center',
  },
  date: {
    fontSize: 12,
    color: '#616161',
    textAlign: 'right',
  },
  section: {
    margin: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
  },
  resultContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 15,
    padding: 10,
    borderRadius: 5,
  },
  lowRisk: {
    backgroundColor: 'rgba(67, 160, 71, 0.1)',
  },
  mediumRisk: {
    backgroundColor: 'rgba(255, 160, 0, 0.1)',
  },
  highRisk: {
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
  },
  scoreBox: {
    width: 80,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    borderRadius: 40,
  },
  lowRiskBox: {
    backgroundColor: '#43a047',
  },
  mediumRiskBox: {
    backgroundColor: '#ffa000',
  },
  highRiskBox: {
    backgroundColor: '#e53935',
  },
  scoreText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  resultDetails: {
    flex: 1,
  },
  riskLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  riskDescription: {
    fontSize: 12,
    color: '#616161',
  },
  recommendationsSection: {
    margin: 10,
    padding: 10,
  },
  recommendationItem: {
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
  },
  recommendationBullet: {
    width: 16,
    color: '#1976d2',
    fontSize: 14,
    fontWeight: 'bold',
  },
  recommendationText: {
    flex: 1,
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#9e9e9e',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  categorySection: {
    margin: 5,
    padding: 5,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  categoryScore: {
    fontSize: 12,
    marginBottom: 3,
  },
  disclaimer: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#9e9e9e',
    marginTop: 20,
  },
});

// Component định nghĩa nội dung PDF
const AssessmentPDFContent = ({ results }: { results: AssessmentResult }) => {
  // Format date
  const currentDate = new Date().toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Xác định mức độ rủi ro
  const riskLevel = results.riskLevel;
  const scorePercentage = Math.round((results.totalScore / results.maxScore) * 100);

  // Xác định mô tả rủi ro
  let riskDescription = '';
  if (riskLevel === 'low') {
    riskDescription = 'Dựa trên thông tin bạn cung cấp, nguy cơ mắc bệnh gan của bạn đang ở mức thấp. Tiếp tục duy trì lối sống lành mạnh.';
  } else if (riskLevel === 'medium') {
    riskDescription = 'Dựa trên thông tin bạn cung cấp, bạn có một số yếu tố rủi ro đối với sức khỏe gan. Nên cân nhắc thăm khám bác sĩ.';
  } else {
    riskDescription = 'Dựa trên thông tin bạn cung cấp, nguy cơ mắc bệnh gan của bạn đang ở mức cao. Nên đến gặp bác sĩ càng sớm càng tốt.';
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Báo cáo Đánh giá Rủi ro Gan</Text>
          <Text style={styles.subtitle}>LiverCare - Hệ thống quản lý sức khỏe gan</Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>

        <View style={[styles.resultContainer, styles[`${riskLevel}Risk`] as any]}>
          <View style={[styles.scoreBox, styles[`${riskLevel}RiskBox`] as any]}>
            <Text style={styles.scoreText}>{scorePercentage}%</Text>
          </View>
          <View style={styles.resultDetails}>
            <Text style={styles.riskLabel}>
              {riskLevel === 'low' ? 'Nguy cơ Thấp' :
               riskLevel === 'medium' ? 'Nguy cơ Trung bình' : 
               'Nguy cơ Cao'}
            </Text>
            <Text style={styles.riskDescription}>{riskDescription}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết điểm số</Text>
          {Object.entries(results.categoryScores).map(([key, value]) => (
            <View style={styles.categorySection} key={key}>
              <Text style={styles.categoryTitle}>
                {key === 'personal' ? 'Thông tin cá nhân' :
                 key === 'lifestyle' ? 'Lối sống' :
                 key === 'symptoms' ? 'Triệu chứng' : 
                 key === 'history' ? 'Tiền sử' : key}
              </Text>
              <Text style={styles.categoryScore}>
                Điểm: {value.score}/{value.maxScore} ({Math.round(value.percentage)}%)
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>Đề xuất</Text>
          {results.recommendations.map((rec, index) => (
            <View style={styles.recommendationItem} key={index}>
              <Text style={styles.recommendationBullet}>•</Text>
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.disclaimer}>
          Lưu ý: Đánh giá này chỉ mang tính tham khảo và không thay thế cho tư vấn y tế chuyên nghiệp. 
          Vui lòng tham khảo ý kiến của bác sĩ để được chẩn đoán và điều trị phù hợp.
        </Text>

        <Text style={styles.footer}>
          © {new Date().getFullYear()} LiverCare. Báo cáo được tạo tự động từ hệ thống đánh giá rủi ro.
        </Text>
      </Page>
    </Document>
  );
};

// Component xuất PDF
const AssessmentPDF = ({ results }: { results: AssessmentResult }) => {
  return (
    <PDFDownloadLink
      document={<AssessmentPDFContent results={results} />}
      fileName="danh-gia-rui-ro-gan.pdf"
      className="btn primary"
      style={{
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {({ loading }) =>
        loading ? 'Đang tạo PDF...' : 'Tải xuống PDF'
      }
    </PDFDownloadLink>
  );
};

// Hàm tạo và tải xuống PDF theo cách thủ công
export const generatePDF = async (results: AssessmentResult) => {
  const blob = await pdf(<AssessmentPDFContent results={results} />).toBlob();
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = "danh-gia-rui-ro-gan.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default AssessmentPDF; 