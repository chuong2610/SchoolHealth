# Hướng Dẫn Sử Dụng Tính Năng Liên Hệ Y Tá

## Tổng Quan
Tính năng "Liên hệ y tá" cho phép phụ huynh trò chuyện trực tiếp với y tá nhà trường để được tư vấn về sức khỏe của con em.

## Cách Sử Dụng

### 1. Truy Cập Tính Năng
- Đăng nhập vào hệ thống với tài khoản phụ huynh
- Vào menu "Liên hệ y tá" trong sidebar
- Hoặc click vào biểu tượng chat trong header

### 2. Xem Danh Sách Cuộc Trò Chuyện
- Hệ thống sẽ tự động load danh sách các cuộc trò chuyện đã có
- Mỗi cuộc trò chuyện hiển thị:
  - Tên y tá
  - Tin nhắn cuối cùng
  - Thời gian tin nhắn cuối
  - Số tin nhắn chưa đọc (nếu có)

### 3. Bắt Đầu Cuộc Trò Chuyện Mới
- Click nút "+ Trò chuyện mới"
- Nhập tin nhắn đầu tiên
- Hệ thống sẽ tự động phân bổ y tá phù hợp

### 4. Trò Chuyện Với Y Tá Cụ Thể
- Chọn cuộc trò chuyện với y tá từ danh sách
- Hệ thống sẽ load lịch sử tin nhắn
- Nhập tin nhắn mới và nhấn Enter hoặc click nút gửi

### 5. Tính Năng Bổ Sung
- **Pagination**: Tải thêm tin nhắn cũ bằng nút "Tải thêm tin nhắn cũ hơn"
- **Real-time**: Tin nhắn mới sẽ xuất hiện tự động
- **Mobile**: Giao diện tối ưu cho điện thoại di động

## Các Trường Hợp Sử Dụng

### Trường Hợp 1: Tư Vấn Chung
```
Phụ huynh → Hệ thống: "Con tôi bị sốt, tôi nên làm gì?"
Hệ thống → Y tá: Phân bổ tin nhắn cho y tá
Y tá → Phụ huynh: "Chào bạn, con bạn sốt bao nhiêu độ?"
```

### Trường Hợp 2: Liên Hệ Trực Tiếp
```
Phụ huynh → Y tá cụ thể: "Chào cô, con tôi cần tư vấn"
Y tá → Phụ huynh: "Chào bạn, tôi có thể giúp gì?"
```

### Trường Hợp 3: Theo Dõi Tình Trạng
```
Phụ huynh → Y tá: "Con tôi đã uống thuốc, tình trạng thế nào?"
Y tá → Phụ huynh: "Tốt lắm, con bạn đã khỏe hơn nhiều"
```

## Lưu Ý Quan Trọng

### 1. Thời Gian Phản Hồi
- Y tá sẽ phản hồi trong thời gian sớm nhất có thể
- Trong giờ làm việc: Phản hồi trong vòng 30 phút
- Ngoài giờ làm việc: Phản hồi vào ngày làm việc tiếp theo

### 2. Nội Dung Tin Nhắn
- Chỉ sử dụng cho mục đích tư vấn sức khỏe
- Không chia sẻ thông tin cá nhân nhạy cảm
- Tuân thủ quy định của nhà trường

### 3. Khẩn Cấp
- Nếu tình trạng khẩn cấp, vui lòng liên hệ trực tiếp
- Không sử dụng chat cho các trường hợp cần can thiệp ngay

## Xử Lý Sự Cố

### Vấn Đề Thường Gặp

#### 1. Không Load Được Tin Nhắn
**Nguyên nhân:** Lỗi kết nối mạng hoặc server
**Giải pháp:**
- Kiểm tra kết nối internet
- Refresh trang web
- Thử lại sau vài phút

#### 2. Không Gửi Được Tin Nhắn
**Nguyên nhân:** Lỗi validation hoặc server
**Giải pháp:**
- Kiểm tra nội dung tin nhắn (không để trống)
- Đảm bảo đã chọn cuộc trò chuyện
- Thử lại sau vài giây

#### 3. Tin Nhắn Không Hiển Thị Real-time
**Nguyên nhân:** Lỗi kết nối SignalR
**Giải pháp:**
- Refresh trang web
- Kiểm tra kết nối internet
- Đợi vài giây để tin nhắn xuất hiện

### Liên Hệ Hỗ Trợ
Nếu gặp vấn đề không thể tự khắc phục:
- Email: support@schoolhealth.com
- Hotline: 1900-xxxx
- Thời gian: 8:00 - 17:00 (Thứ 2 - Thứ 6)

## Tính Năng Kỹ Thuật

### API Endpoints
- `GET /api/Chat/conversations` - Lấy danh sách cuộc trò chuyện
- `GET /api/Chat/history` - Lấy lịch sử tin nhắn
- `POST /api/Chat/send` - Gửi tin nhắn mới

### Real-time Communication
- Sử dụng SignalR để cập nhật tin nhắn real-time
- Tự động reconnect khi mất kết nối
- Hiển thị trạng thái kết nối

### Security
- Xác thực người dùng qua JWT token
- Mã hóa tin nhắn trong quá trình truyền tải
- Lưu trữ an toàn trong database

## Cập Nhật Gần Đây

### Version 2.0 (Hiện tại)
- ✅ Tối ưu hóa performance
- ✅ Cải thiện UX/UI
- ✅ Hỗ trợ mobile tốt hơn
- ✅ Pagination cho tin nhắn cũ
- ✅ Real-time notifications

### Version 1.0 (Trước đó)
- ✅ Chat cơ bản
- ✅ Gửi/nhận tin nhắn
- ✅ Danh sách cuộc trò chuyện

## Roadmap

### Version 2.1 (Sắp tới)
- 🔄 Gửi file đính kèm
- 🔄 Emoji reactions
- 🔄 Voice messages
- 🔄 Video call integration

### Version 2.2 (Tương lai)
- 🔄 AI chatbot hỗ trợ
- 🔄 Multi-language support
- 🔄 Advanced search
- 🔄 Message templates 