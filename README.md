# AILiverCare

Built by using React, TypeSCript and Vite. The project "AILiverCare" has its mission to improve Livercare health management system.
## Tính năng chính

- **Dashboard**: Tổng quan về sức khỏe gan với biểu đồ và thống kê
- **Assessments**: Đánh giá rủi ro sức khỏe gan với quy trình từng bước
- **Appointments**: Quản lý cuộc hẹn với bác sĩ qua lịch trực quan
- **Labs**: Theo dõi kết quả xét nghiệm với biểu đồ theo thời gian
- **Questionnaires**: Bảng câu hỏi đánh giá với lưu trữ tự động
- **Notifications**: Hệ thống thông báo theo danh mục và mức độ ưu tiên
- **Dark Mode**: Chế độ tối với khả năng lưu trữ lựa chọn

## Yêu cầu

- Node.js 14+ (khuyến nghị 16+)
- npm hoặc yarn
- Backend API (xem README.md ở thư mục gốc)

## Cài đặt

1. Clone dự án
```
git clone <repository-url>
```

2. Di chuyển vào thư mục frontend
```
cd frontend
```

3. Cài đặt các dependencies
```
npm install
```

4. Sao chép file cấu hình mẫu
```
cp .env.example .env
```

5. Cập nhật cấu hình trong `.env` theo môi trường của bạn

## Phát triển

Chạy môi trường phát triển:
```
npm run dev
```

Ứng dụng sẽ chạy tại địa chỉ [http://localhost:5173](http://localhost:5173)

## Xây dựng (Build)

Build ứng dụng cho môi trường production:
```
npm run build
```

Các file được tạo ra sẽ ở thư mục `dist`

## Cấu trúc dự án

```
frontend/
  ├─ src/
  │  ├─ api/          # API services
  │  ├─ components/   # Shared components
  │  ├─ hooks/        # Custom hooks
  │  ├─ pages/        # UI cho từng trang
  │  ├─ store/        # Redux store, slices
  │  ├─ styles/       # CSS modules và global CSS
  │  ├─ utils/        # Utilities và helpers
  │  ├─ App.tsx       # Component gốc
  │  └─ main.tsx      # Entry point
  ├─ public/          # Static assets
  ├─ .env.example     # Cấu hình mẫu
  ├─ index.html       # HTML template
  ├─ vite.config.ts   # Cấu hình Vite
  └─ package.json     # Dependencies và scripts
```

## Công nghệ sử dụng

- **React**: Thư viện UI
- **TypeScript**: Đảm bảo type safety
- **Redux Toolkit**: Quản lý state
- **Axios**: HTTP requests
- **Chart.js**: Hiển thị biểu đồ
- **React Router**: Client-side routing
- **React-Big-Calendar**: Calendar component
- **CSS Modules**: Styling scoped tới component

## API Integration

Tất cả các API services được định nghĩa trong thư mục `src/api`. Mỗi service tương ứng với một module backend:

- `auth.ts`: Xác thực người dùng
- `assessments.ts`: API đánh giá rủi ro
- `appointments.ts`: Quản lý cuộc hẹn
- `labs.ts`: Kết quả xét nghiệm
- `questionnaires.ts`: Bảng câu hỏi
- `notifications.ts`: Thông báo

## Responsive Design

- **Desktop**: Hiển thị đầy đủ với menu ngang
- **Tablet**: Layout thích ứng
- **Mobile**: Menu toggle và UI tối ưu cho màn hình nhỏ

## Best Practices

- **Dark Mode**: Áp dụng trên toàn hệ thống với CSS variables
- **Modular CSS**: Mỗi component có CSS modules riêng
- **API Service Layer**: Tách biệt logic API và UI
- **Authentication Flow**: Xử lý refresh token và token expiry
- **Performance**: Lazy loading và code splitting

## License

[MIT](LICENSE) 