import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/vi';
import Sidebar from '../components/Sidebar';
import { Card, Typography, Button, Space, Row, Col, Tag, Modal } from 'antd';
import { PlusOutlined, CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Cài đặt ngôn ngữ cho moment
moment.locale('vi');
const localizer = momentLocalizer(moment);

// Định nghĩa kiểu dữ liệu
interface AppointmentEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  location: string;
  doctor: string;
  notes?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
}

// Dữ liệu mẫu cho các cuộc hẹn
const sampleEvents: AppointmentEvent[] = [
  {
    id: 1,
    title: 'Khám định kỳ',
    start: moment().add(1, 'days').hour(10).minute(0).toDate(),
    end: moment().add(1, 'days').hour(11).minute(0).toDate(),
    location: 'Phòng khám A - Tầng 2',
    doctor: 'BS. Nguyễn Văn A',
    status: 'confirmed',
    notes: 'Kiểm tra sức khỏe định kỳ 6 tháng'
  },
  {
    id: 2,
    title: 'Xét nghiệm máu',
    start: moment().add(3, 'days').hour(8).minute(30).toDate(),
    end: moment().add(3, 'days').hour(9).minute(30).toDate(),
    location: 'Phòng xét nghiệm - Tầng 1',
    doctor: 'BS. Trần Thị B',
    status: 'pending'
  },
  {
    id: 3,
    title: 'Tư vấn dinh dưỡng',
    start: moment().add(7, 'days').hour(14).minute(0).toDate(),
    end: moment().add(7, 'days').hour(15).minute(0).toDate(),
    location: 'Phòng tư vấn - Tầng 3',
    doctor: 'BS. Lê Văn C',
    status: 'confirmed'
  },
  {
    id: 4,
    title: 'Khám chuyên khoa',
    start: moment().add(10, 'days').hour(9).minute(0).toDate(),
    end: moment().add(10, 'days').hour(10).minute(30).toDate(),
    location: 'Phòng khám B - Tầng 2',
    doctor: 'BS. Phạm Thị D',
    status: 'cancelled',
    notes: 'Cuộc hẹn đã bị hủy do lý do cá nhân'
  }
];

const Appointments: React.FC = () => {
  const [events] = useState<AppointmentEvent[]>(sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState<AppointmentEvent | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { Title, Text } = Typography;

  // Lấy các cuộc hẹn sắp tới (trong 7 ngày tới)
  const upcomingEvents = events
    .filter(event => 
      moment(event.start).isAfter(moment()) && 
      moment(event.start).isBefore(moment().add(7, 'days'))
    )
    .sort((a, b) => moment(a.start).valueOf() - moment(b.start).valueOf());

  // Hàm xử lý khi chọn sự kiện
  const handleSelectEvent = (event: AppointmentEvent) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  // Hàm xử lý khi chọn slot trống
  const handleSelectSlot = (slotInfo: any) => {
    console.log('Selected slot:', slotInfo);
    // Có thể mở modal tạo cuộc hẹn mới ở đây
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedEvent(null);
  };

  // Hàm lấy màu sắc cho trạng thái
  const getEventColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#52c41a';
      case 'pending':
        return '#faad14';
      case 'cancelled':
        return '#ff4d4f';
      case 'completed':
        return '#1890ff';
      default:
        return '#d9d9d9';
    }
  };

  // Hàm lấy text cho trạng thái
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'completed':
        return 'Hoàn thành';
      default:
        return 'Không xác định';
    }
  };

  // Hàm tạo style cho sự kiện
  const eventStyleGetter = (event: AppointmentEvent) => {
    return {
      style: {
        backgroundColor: getEventColor(event.status),
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        opacity: 0.8,
      },
    };
  };

  return (
    <Sidebar>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>Lịch hẹn</Title>
          <Button type="primary" icon={<PlusOutlined />} size="large">
            Thêm cuộc hẹn
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                style={{ height: 600 }}
                views={['month', 'week', 'day']}
                defaultView="month"
                messages={{
                  next: 'Tiếp',
                  previous: 'Trước',
                  today: 'Hôm nay',
                  month: 'Tháng',
                  week: 'Tuần',
                  day: 'Ngày',
                  agenda: 'Lịch trình',
                  date: 'Ngày',
                  time: 'Giờ',
                  event: 'Sự kiện',
                  noEventsInRange: 'Không có cuộc hẹn nào trong khoảng thời gian này.',
                  showMore: (total) => `+ Xem thêm ${total} cuộc hẹn`,
                }}
                eventPropGetter={eventStyleGetter}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Cuộc hẹn sắp tới" extra={<CalendarOutlined />}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <Card key={event.id} size="small" style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <Text strong>{event.title}</Text>
                          <br />
                          <Text type="secondary">
                            <ClockCircleOutlined /> {moment(event.start).format('HH:mm')}
                          </Text>
                          <br />
                          <Text type="secondary">
                            <EnvironmentOutlined /> {event.location}
                          </Text>
                        </div>
                        <Tag color={getEventColor(event.status)}>
                          {getStatusText(event.status)}
                        </Tag>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Text type="secondary">Không có cuộc hẹn sắp tới</Text>
                )}
              </Space>
            </Card>
          </Col>
        </Row>

        <Modal
          title={selectedEvent?.title}
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={[
            <Button key="close" onClick={handleCloseModal}>
              Đóng
            </Button>,
            selectedEvent?.status === 'confirmed' && (
              <Button key="reschedule" type="primary">
                Đổi lịch
              </Button>
            ),
            selectedEvent?.status === 'pending' && (
              <Button key="confirm" type="primary">
                Xác nhận
              </Button>
            ),
          ]}
        >
          {selectedEvent && (
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Bác sĩ:</Text> {selectedEvent.doctor}
              </div>
              <div>
                <Text strong>Thời gian:</Text> {moment(selectedEvent.start).format('dddd, DD/MM/YYYY [lúc] HH:mm')}
              </div>
              <div>
                <Text strong>Địa điểm:</Text> {selectedEvent.location}
              </div>
              <div>
                <Text strong>Trạng thái:</Text> 
                <Tag color={getEventColor(selectedEvent.status)} style={{ marginLeft: '8px' }}>
                  {getStatusText(selectedEvent.status)}
                </Tag>
              </div>
              {selectedEvent.notes && (
                <div>
                  <Text strong>Ghi chú:</Text> {selectedEvent.notes}
                </div>
              )}
            </Space>
          )}
        </Modal>
      </div>
    </Sidebar>
  );
};

export default Appointments;