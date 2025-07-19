# 🏥 School Health Management System

Một hệ thống quản lý y tế học đường hiện đại, hỗ trợ nhà trường, y tá và phụ huynh theo dõi, trao đổi và cập nhật tình trạng sức khỏe học sinh một cách hiệu quả và trực quan.

> 🎥 Video hướng dẫn sử dụng: [YouTube](https://studio.youtube.com/video/8_oJIh_t-mY/edit)

---

## 🚀 Truy cập hệ thống

🔗 **Website chính thức**: [https://schoolhealth.vercel.app](https://schoolhealth.vercel.app)

### 👤 Tài khoản dùng thử

| Role     | Số điện thoại  | Mật khẩu     |
|----------|----------------|--------------|
| Phụ huynh| 0333333333     | parent123    |

## 🧩 Tính năng chính

### 👑 Admin
- Quản lý người dùng theo vai trò
- Gửi thông báo y tế
- Quản lý kho thuốc
- Viết blog sức khỏe
- Cập nhật hồ sơ cá nhân

### 🧑‍⚕️ Y tá
- Nhận thuốc từ phụ huynh
- Ghi nhận sự kiện y tế
- Xem lịch khám & tư vấn
- Giao tiếp realtime với phụ huynh
- Quản lý hồ sơ cá nhân

### 👨‍👩‍👧‍👦 Phụ huynh
- Khai báo sức khỏe cho con
- Gửi thuốc kèm hướng dẫn
- Chat tư vấn với y tá
- Nhận thông báo y tế
- Theo dõi lịch sử sức khỏe
- Quản lý lịch tư vấn

---

## 🛠️ Công nghệ sử dụng

### 🔧 Backend (.NET)
- REST API + Entity Framework
- Swagger (tài liệu API)
- `JwtBearer`: xác thực người dùng bằng token
- `Google Authentication`: đăng nhập bằng Google
- `MailKit`: gửi email (OTP, thông báo)
- `ClosedXML`: import/export file Excel
- `SignalR`: chat và thông báo realtime
- `Redis`: lưu OTP, tin nhắn chưa đọc
- `Nginx`: cấu hình domain + SSL
- Triển khai bằng Docker & VPS

### 🎨 Frontend (React)
- `antd`, `bootstrap`, `react-bootstrap`: UI components
- `chart.js`, `recharts`, `@ant-design/charts`: biểu đồ
- `react-table`: bảng dữ liệu filter/sort
- `axios`: gọi API
- `@microsoft/signalr`: giao tiếp realtime
- `react-router-dom`: routing SPA
- `react-toastify`: thông báo toast
- `react-quill`: soạn thảo văn bản
- `@react-oauth/google`: Google login
- `firebase`: nền tảng hỗ trợ Auth
- `framer-motion`: hiệu ứng chuyển động

---

