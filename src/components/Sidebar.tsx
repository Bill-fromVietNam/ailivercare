import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AnyAction } from '@reduxjs/toolkit';
import { Layout, Menu, Typography, Button, Space, Avatar, Dropdown, Badge } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  FormOutlined,
  ExperimentOutlined,
  CalendarOutlined,
  BulbOutlined,
  ProjectOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuOutlined,
  SunOutlined,
  MoonOutlined,
  MessageOutlined,
  CrownOutlined,
  TeamOutlined,
  BarChartOutlined,
  CameraOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';

const { Sider, Header } = Layout;
const { Title } = Typography;

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Chào bạn! 👋 Tôi có thể giúp gì cho bạn hôm nay?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Mock data cho các câu hỏi và câu trả lời về bệnh gan
  const chatOptions = [
    {
      id: 'liver-indicators',
      title: 'Chỉ số gan bình thường',
      description: 'Tìm hiểu về các chỉ số gan ALT, AST, GGT...'
    },
    {
      id: 'liver-symptoms',
      title: 'Triệu chứng bệnh gan',
      description: 'Các dấu hiệu cảnh báo bệnh gan cần chú ý'
    },
    {
      id: 'liver-diet',
      title: 'Chế độ ăn cho người bệnh gan',
      description: 'Thực phẩm tốt và không tốt cho gan'
    },
    {
      id: 'liver-exercise',
      title: 'Tập luyện cho người bệnh gan',
      description: 'Các bài tập phù hợp với tình trạng gan'
    },
    {
      id: 'liver-medication',
      title: 'Thuốc và bổ sung cho gan',
      description: 'Các loại thuốc hỗ trợ chức năng gan'
    },
    {
      id: 'liver-prevention',
      title: 'Phòng ngừa bệnh gan',
      description: 'Cách bảo vệ và duy trì sức khỏe gan'
    }
  ];

  const chatResponses = {
    'liver-indicators': {
      title: 'Chỉ số gan bình thường',
      content: `**Các chỉ số gan quan trọng:**

**ALT (Alanine Aminotransferase):**
- Bình thường: 7-56 U/L (nam), 7-40 U/L (nữ)
- Tăng cao: Có thể do viêm gan, tổn thương tế bào gan

**AST (Aspartate Aminotransferase):**
- Bình thường: 10-40 U/L
- Tăng cao: Có thể do viêm gan, xơ gan, nhồi máu cơ tim

**GGT (Gamma-Glutamyl Transferase):**
- Bình thường: 8-61 U/L (nam), 5-36 U/L (nữ)
- Tăng cao: Có thể do uống rượu, tắc mật, viêm gan

**Bilirubin:**
- Bình thường: 0.1-1.2 mg/dL
- Tăng cao: Có thể do tắc mật, viêm gan, xơ gan

**Albumin:**
- Bình thường: 3.5-5.0 g/dL
- Giảm: Có thể do suy dinh dưỡng, xơ gan, bệnh thận`
    },
    'liver-symptoms': {
      title: 'Triệu chứng bệnh gan',
      content: `**Các triệu chứng cảnh báo bệnh gan:**

**Triệu chứng sớm:**
- Mệt mỏi, suy nhược
- Chán ăn, buồn nôn
- Đau bụng vùng hạ sườn phải
- Vàng da, vàng mắt

**Triệu chứng nặng:**
- Phù chân, bụng to (cổ trướng)
- Chảy máu cam, chảy máu chân răng
- Rối loạn tâm thần, hôn mê
- Nước tiểu sẫm màu, phân nhạt màu

**Khi nào cần gặp bác sĩ:**
- Vàng da kéo dài
- Đau bụng dữ dội
- Sốt cao không rõ nguyên nhân
- Thay đổi màu sắc da, mắt`
    },
    'liver-diet': {
      title: 'Chế độ ăn cho người bệnh gan',
      content: `**Thực phẩm tốt cho gan:**

**Rau xanh:**
- Rau cải, bông cải xanh
- Rau chân vịt, rau muống
- Cà rốt, cà chua

**Trái cây:**
- Cam, chanh, bưởi
- Táo, lê, nho
- Quả mọng (dâu tây, việt quất)

**Protein:**
- Cá, thịt gà, thịt bò nạc
- Đậu phụ, đậu nành
- Trứng (vừa phải)

**Thực phẩm cần tránh:**
- Rượu bia, đồ uống có cồn
- Thực phẩm chiên rán
- Đồ ăn cay, mặn
- Thực phẩm chế biến sẵn`
    },
    'liver-exercise': {
      title: 'Tập luyện cho người bệnh gan',
      content: `**Các bài tập phù hợp:**

**Tập luyện nhẹ nhàng:**
- Đi bộ 30 phút/ngày
- Yoga, thái cực quyền
- Bơi lội (nếu sức khỏe cho phép)
- Đạp xe chậm

**Tập luyện vừa phải:**
- Chạy bộ nhẹ
- Tập tạ nhẹ
- Aerobic cường độ thấp

**Lưu ý quan trọng:**
- Không tập quá sức
- Uống đủ nước
- Nghỉ ngơi khi mệt
- Tham khảo ý kiến bác sĩ trước khi tập

**Lợi ích:**
- Cải thiện tuần hoàn máu
- Tăng cường miễn dịch
- Giảm stress, căng thẳng
- Hỗ trợ chức năng gan`
    },
    'liver-medication': {
      title: 'Thuốc và bổ sung cho gan',
      content: `**Các loại thuốc hỗ trợ gan:**

**Thuốc bảo vệ gan:**
- Silymarin (chiết xuất từ cây kế sữa)
- Ursodeoxycholic acid
- Essentiale (phospholipid)

**Vitamin và khoáng chất:**
- Vitamin E (chống oxy hóa)
- Vitamin C (tăng cường miễn dịch)
- Selenium (chống oxy hóa)
- Zinc (hỗ trợ chức năng gan)

**Thảo dược:**
- Atiso (hỗ trợ tiêu hóa)
- Nghệ (chống viêm)
- Gừng (kháng viêm)
- Trà xanh (chống oxy hóa)

**Lưu ý:**
- Chỉ dùng theo chỉ định bác sĩ
- Không tự ý mua thuốc
- Báo cáo tác dụng phụ
- Kiểm tra định kỳ`
    },
    'liver-prevention': {
      title: 'Phòng ngừa bệnh gan',
      content: `**Cách bảo vệ sức khỏe gan:**

**Lối sống lành mạnh:**
- Không uống rượu bia
- Không hút thuốc lá
- Tập thể dục đều đặn
- Ngủ đủ giấc (7-8 tiếng/ngày)

**Chế độ ăn uống:**
- Ăn nhiều rau xanh, trái cây
- Hạn chế đồ chiên rán
- Uống đủ nước (2-3 lít/ngày)
- Ăn đúng giờ, không bỏ bữa

**Vệ sinh cá nhân:**
- Rửa tay thường xuyên
- Không dùng chung đồ cá nhân
- Tiêm phòng viêm gan A, B
- Quan hệ tình dục an toàn

**Khám sức khỏe định kỳ:**
- Xét nghiệm máu 6 tháng/lần
- Siêu âm gan 1 năm/lần
- Theo dõi chỉ số gan
- Tư vấn bác sĩ khi cần`
    }
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: '/assessments',
      icon: <FileTextOutlined />,
      label: 'Đánh giá',
    },
    {
      key: '/questionnaires',
      icon: <FormOutlined />,
      label: 'Bảng câu hỏi',
    },
    {
      key: '/labs',
      icon: <ExperimentOutlined />,
      label: 'Xét nghiệm',
    },
    {
      key: '/appointments',
      icon: <CalendarOutlined />,
      label: 'Lịch hẹn',
    },
    {
      key: '/recommendations',
      icon: <BulbOutlined />,
      label: 'Khuyến nghị',
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: 'Dự án/Nhiệm vụ',
    },
    {
      key: '/liver-analysis',
      icon: <CameraOutlined />,
      label: 'Phân tích ảnh gan',
    },
    // Admin menu items
    ...(user?.role === 'admin' ? [
      {
        key: 'admin-divider',
        type: 'divider' as const,
      },
      {
        key: 'admin-section',
        label: 'Quản trị',
        type: 'group' as const,
      },
      {
        key: '/admin/dashboard',
        icon: <CrownOutlined />,
        label: 'Admin Dashboard',
      },
      {
        key: '/admin/questionnaires',
        icon: <FormOutlined />,
        label: 'Quản lý bảng câu hỏi',
      },
      {
        key: '/admin/recommendations',
        icon: <BulbOutlined />,
        label: 'Quản lý khuyến nghị',
      },
      {
        key: '/admin/notifications',
        icon: <BellOutlined />,
        label: 'Quản lý thông báo',
      },
      {
        key: '/admin/users',
        icon: <TeamOutlined />,
        label: 'Quản lý người dùng',
      },
      {
        key: '/admin/reports',
        icon: <BarChartOutlined />,
        label: 'Báo cáo',
      },
    ] : []),
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'logout':
        // Gọi logout action để đăng xuất thực sự
        dispatch(logout() as unknown as AnyAction);
        navigate('/login');
        break;
      default:
        break;
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
    
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newMode ? '#121212' : '#ffffff');
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleOptionClick = (optionId: string) => {
    const response = chatResponses[optionId as keyof typeof chatResponses];
    if (response) {
      // Thêm tin nhắn người dùng
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: response.title,
        timestamp: new Date()
      };
      
      // Thêm tin nhắn bot
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.content,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage, botMessage]);
      
      // Hiển thị options sau khi trả lời
      setTimeout(() => {
        showOptions();
      }, 1000);
    }
  };

  const showOptions = () => {
    const optionsMessage = {
      id: Date.now(),
      type: 'bot',
      content: 'Bạn có muốn tìm hiểu thêm về chủ đề nào khác không?',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, optionsMessage]);
  };

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: 'Chào bạn! 👋 Tôi có thể giúp gì cho bạn hôm nay?',
        timestamp: new Date()
      }
    ]);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: inputValue,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      
      // Simulate bot response
      setIsTyping(true);
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: 'Cảm ơn bạn đã hỏi! Tôi có thể giúp bạn với các chủ đề về sức khỏe gan. Hãy chọn một trong các tùy chọn bên dưới hoặc hỏi trực tiếp.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        
        // Hiển thị options sau khi bot trả lời
        setTimeout(() => {
          showOptions();
        }, 500);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Get current path for menu selection
  const getCurrentKey = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return '/dashboard';
    
    // Handle admin routes
    if (path.startsWith('/admin/')) {
      return path;
    }
    
    return path;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100
        }}
      >
        <div style={{ 
          padding: '16px', 
          textAlign: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            {collapsed ? 'LC' : 'LiverCare'}
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[getCurrentKey()]}
          items={menuItems}
          style={{ border: 'none' }}
          onClick={({ key }) => {
            // Skip divider and group clicks
            if (key !== 'admin-divider' && key !== 'admin-section') {
              handleMenuClick({ key });
            }
          }}
        />
      </Sider>
      
      <Layout style={{ 
        marginLeft: collapsed ? '80px' : '200px',
        overflow: 'hidden'
      }}>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          right: 0,
          left: collapsed ? '80px' : '200px',
          zIndex: 99,
          transition: 'left 0.2s',
          height: '64px',
          lineHeight: '64px',
          overflow: 'hidden'
        }}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px' }}
          />
          
          <Space size="middle">
            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: '18px' }} />
            </Badge>
            
            <Button
              type="text"
              shape="circle"
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleDarkMode}
              style={{ fontSize: '18px' }}
              title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            />
            
            <Button
              type="text"
              shape="circle"
              icon={<MessageOutlined />}
              onClick={toggleChat}
              style={{ fontSize: '18px' }}
              title="Mở chat box"
            />
            
            <Dropdown
              menu={{ 
                items: userMenuItems,
                onClick: handleUserMenuClick
              }}
              placement="bottomRight"
              arrow
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                height: '100%',
                padding: '8px 0'
              }}>
                <Avatar 
                  size="small"
                  style={{ backgroundColor: user?.role === 'admin' ? '#722ed1' : '#1890ff' }}
                  icon={user?.role === 'admin' ? <CrownOutlined /> : <UserOutlined />}
                />
                {!collapsed && (
                  <div className="header-user-info" style={{ 
                    marginLeft: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100%'
                  }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 'bold',
                      lineHeight: '1.2',
                      marginBottom: '2px'
                    }}>
                      {user?.full_name || 'User'}
                    </div>
                    {user?.role === 'admin' && (
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#722ed1',
                        lineHeight: '1'
                      }}>
                        Admin
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Dropdown>
          </Space>
        </Header>
        
        <div style={{ 
          marginTop: '64px', // Height of header
          minHeight: 'calc(100vh - 64px)',
          background: '#f0f2f5'
        }}>
          {children}
        </div>
      </Layout>
      
      {/* Chat Box */}
      {isChatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '350px',
          height: '500px',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          border: '1px solid #f0f0f0',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}>
           {/* Chat Header */}
           <div style={{
             padding: '16px',
             borderBottom: '1px solid #f0f0f0',
             display: 'flex',
             justifyContent: 'space-between',
             alignItems: 'center',
             background: '#1890ff',
             color: 'white',
             borderRadius: '12px 12px 0 0'
           }}>
             <div>
               <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Hỗ trợ trực tuyến</div>
               <div style={{ fontSize: '12px', opacity: 0.8 }}>Chúng tôi sẽ phản hồi trong vài phút</div>
             </div>
             <div style={{ display: 'flex', gap: '8px' }}>
               <Button
                 type="text"
                 shape="circle"
                 icon="🔄"
                 onClick={resetChat}
                 style={{ color: 'white', fontSize: '16px' }}
                 title="Bắt đầu lại"
               />
               <Button
                 type="text"
                 shape="circle"
                 icon={<MessageOutlined />}
                 onClick={toggleChat}
                 style={{ color: 'white', fontSize: '18px' }}
                 title="Đóng chat"
               />
             </div>
           </div>
          
           {/* Chat Messages */}
           <div style={{
             flex: 1,
             padding: '16px',
             overflowY: 'auto',
             background: '#fafafa'
           }}>
             {messages.map((message) => (
               <div key={message.id} style={{
                 marginBottom: '12px',
                 display: 'flex',
                 justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
               }}>
                 <div style={{
                   background: message.type === 'user' ? '#1890ff' : '#e6f7ff',
                   color: message.type === 'user' ? 'white' : '#333',
                   padding: '12px',
                   borderRadius: '12px',
                   maxWidth: '80%',
                   fontSize: '14px',
                   lineHeight: '1.4'
                 }}>
                   {message.type === 'bot' && message.content.includes('**') ? (
                     <div style={{ whiteSpace: 'pre-line' }}>
                       {message.content.split('\n').map((line, index) => {
                         if (line.startsWith('**') && line.endsWith('**')) {
                           return (
                             <div key={index} style={{ fontWeight: 'bold', marginBottom: '8px', marginTop: '8px' }}>
                               {line.replace(/\*\*/g, '')}
                             </div>
                           );
                         } else if (line.startsWith('- ')) {
                           return (
                             <div key={index} style={{ marginLeft: '16px', marginBottom: '4px' }}>
                               {line}
                             </div>
                           );
                         } else {
                           return (
                             <div key={index} style={{ marginBottom: '4px' }}>
                               {line}
                             </div>
                           );
                         }
                       })}
                     </div>
                   ) : (
                     <div>{message.content}</div>
                   )}
                 </div>
               </div>
             ))}
             
             {isTyping && (
               <div style={{
                 marginBottom: '12px',
                 display: 'flex',
                 justifyContent: 'flex-start'
               }}>
                 <div style={{
                   background: '#e6f7ff',
                   padding: '12px',
                   borderRadius: '12px',
                   fontSize: '14px',
                   color: '#666'
                 }}>
                   Bot đang soạn tin...
                 </div>
               </div>
             )}
             
             {/* Quick Options - Hiển thị sau mỗi câu trả lời */}
             {messages.length > 0 && messages[messages.length - 1].type === 'bot' && 
              (messages[messages.length - 1].content.includes('Bạn có muốn tìm hiểu thêm') || 
               messages[messages.length - 1].content.includes('Chào bạn! 👋')) && (
               <div style={{ marginTop: '16px' }}>
                 <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                   Chọn chủ đề bạn quan tâm:
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   {chatOptions.map((option) => (
                     <button
                       key={option.id}
                       onClick={() => handleOptionClick(option.id)}
                       style={{
                         background: '#fff',
                         border: '1px solid #d9d9d9',
                         borderRadius: '8px',
                         padding: '12px',
                         textAlign: 'left',
                         cursor: 'pointer',
                         fontSize: '12px',
                         transition: 'all 0.2s'
                       }}
                       onMouseOver={(e) => {
                         e.currentTarget.style.background = '#f0f8ff';
                         e.currentTarget.style.borderColor = '#1890ff';
                       }}
                       onMouseOut={(e) => {
                         e.currentTarget.style.background = '#fff';
                         e.currentTarget.style.borderColor = '#d9d9d9';
                       }}
                     >
                       <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                         {option.title}
                       </div>
                       <div style={{ color: '#666' }}>
                         {option.description}
                       </div>
                     </button>
                   ))}
                 </div>
               </div>
             )}
             
             {/* Nút "Xem thêm chủ đề" cho các tin nhắn bot khác */}
             {messages.length > 0 && messages[messages.length - 1].type === 'bot' && 
              !messages[messages.length - 1].content.includes('Bạn có muốn tìm hiểu thêm') && 
              !messages[messages.length - 1].content.includes('Chào bạn! 👋') && (
               <div style={{ marginTop: '16px', textAlign: 'center' }}>
                 <button
                   onClick={showOptions}
                   style={{
                     background: '#f0f8ff',
                     border: '1px solid #1890ff',
                     borderRadius: '20px',
                     padding: '8px 16px',
                     cursor: 'pointer',
                     fontSize: '12px',
                     color: '#1890ff',
                     transition: 'all 0.2s'
                   }}
                   onMouseOver={(e) => {
                     e.currentTarget.style.background = '#1890ff';
                     e.currentTarget.style.color = 'white';
                   }}
                   onMouseOut={(e) => {
                     e.currentTarget.style.background = '#f0f8ff';
                     e.currentTarget.style.color = '#1890ff';
                   }}
                 >
                   💡 Xem thêm chủ đề khác
                 </button>
               </div>
             )}
           </div>
          
           {/* Chat Input */}
           <div style={{
             padding: '16px',
             borderTop: '1px solid #f0f0f0',
             background: '#fff',
             borderRadius: '0 0 12px 12px'
           }}>
             <div style={{ display: 'flex', gap: '8px' }}>
               <input
                 type="text"
                 placeholder="Nhập tin nhắn..."
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 onKeyPress={handleKeyPress}
                 style={{
                   flex: 1,
                   padding: '8px 12px',
                   border: '1px solid #d9d9d9',
                   borderRadius: '20px',
                   outline: 'none',
                   fontSize: '14px'
                 }}
               />
               <Button
                 type="primary"
                 shape="circle"
                 icon={<MessageOutlined />}
                 onClick={handleSendMessage}
                 disabled={!inputValue.trim()}
                 style={{ background: '#1890ff' }}
               />
             </div>
           </div>
        </div>
      )}
    </Layout>
  );
};

export default Sidebar;
