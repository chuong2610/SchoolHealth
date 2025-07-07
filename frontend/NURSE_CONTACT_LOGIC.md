# Logic Liên Hệ Y Tá - Tích Hợp Đầy Đủ

## Tổng Quan
Hệ thống liên hệ y tá đã được tối ưu hóa theo logic REST API đơn giản và hiệu quả.

## Luồng Hoạt Động

### 1. Khi Người Dùng Mở Phần "Liên Hệ Y Tá"

#### 1.1 Load Danh Sách Cuộc Trò Chuyện
```javascript
// Gọi API để lấy danh sách cuộc trò chuyện
GET /api/Chat/conversations?userId={currentUserId}
```

**Response:**
```json
[
  {
    "User": "nurseId",
    "userName": "Tên Y Tá",
    "lastMessage": "Tin nhắn cuối cùng",
    "timestamp": "2024-01-01T10:00:00",
    "hasUnread": true
  }
]
```

#### 1.2 Khi Chọn Cuộc Trò Chuyện Cụ Thể
```javascript
// Gọi API để lấy lịch sử tin nhắn
GET /api/Chat/history?userA={currentUserId}&userB={nurseId}&skip=0&take=50
```

**Response:**
```json
[
  {
    "fromUserId": "currentUserId",
    "toUserId": "nurseId", 
    "message": "Nội dung tin nhắn",
    "timestamp": "2024-01-01T10:00:00"
  }
]
```

### 2. Hiển Thị Tin Nhắn Theo Thời Gian

- Tin nhắn được sắp xếp theo thứ tự thời gian (cũ nhất ở trên, mới nhất ở dưới)
- Hỗ trợ pagination để tải thêm tin nhắn cũ
- Auto-scroll xuống tin nhắn mới nhất

### 3. Gửi Tin Nhắn Mới

```javascript
// Gửi tin nhắn mới
POST /api/Chat/send
```

**Request Body:**
```json
{
  "FromUserId": "currentUserId",
  "ToUserId": "nurseId",
  "Message": "Nội dung tin nhắn mới"
}
```

## Các Trường Hợp Đặc Biệt

### 3.1 Trò Chuyện Mới (Không Có Y Tá Cụ Thể)
```json
{
  "FromUserId": "currentUserId",
  "Message": "Nội dung tin nhắn mới"
}
```

### 3.2 Trò Chuyện Mới (Có Y Tá Cụ Thể)
```json
{
  "FromUserId": "currentUserId", 
  "ToUserId": "specificNurseId",
  "Message": "Nội dung tin nhắn mới"
}
```

## Cấu Trúc Component

### ParentChat.jsx
- **State Management**: Quản lý conversations, messages, pagination
- **API Integration**: Sử dụng simpleChatAPI cho tất cả API calls
- **Real-time Updates**: SignalR cho tin nhắn real-time
- **Responsive Design**: Hỗ trợ mobile và desktop

### simpleChatApi.js
- **getConversations()**: Load danh sách cuộc trò chuyện
- **getChatHistory()**: Load lịch sử tin nhắn với pagination
- **sendMessage()**: Gửi tin nhắn mới
- **Error Handling**: Xử lý lỗi và retry logic

## Tối Ưu Hóa

### 1. Performance
- Debounce cho API calls (300ms)
- Pagination cho chat history (50 tin nhắn/lần)
- Lazy loading cho tin nhắn cũ

### 2. User Experience
- Loading states cho tất cả operations
- Error handling với user-friendly messages
- Auto-scroll và smooth animations
- Mobile-responsive design

### 3. Real-time Features
- SignalR integration cho tin nhắn real-time
- Auto-refresh conversation list
- Unread message indicators

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Chat/conversations?userId` | Lấy danh sách cuộc trò chuyện |
| GET | `/api/Chat/history?userA&userB&skip&take` | Lấy lịch sử tin nhắn |
| POST | `/api/Chat/send` | Gửi tin nhắn mới |
| GET | `/api/Node/has-unread-message/{userId}` | Kiểm tra tin nhắn chưa đọc |

## Error Handling

### Common Errors
1. **Network Error**: Hiển thị thông báo "Không thể kết nối"
2. **API Error**: Hiển thị thông báo lỗi từ server
3. **Validation Error**: Hiển thị thông báo validation

### Retry Logic
- Tự động retry cho network errors
- Manual retry cho user-initiated actions
- Graceful degradation khi API không khả dụng

## Testing

### Manual Testing
1. Mở trang "Liên hệ y tá"
2. Kiểm tra load danh sách cuộc trò chuyện
3. Chọn cuộc trò chuyện và kiểm tra load history
4. Gửi tin nhắn mới và kiểm tra real-time update
5. Test pagination cho tin nhắn cũ
6. Test mobile responsiveness

### API Testing
```bash
# Test conversations
curl -X GET "http://localhost:5000/api/Chat/conversations?userId=1"

# Test chat history  
curl -X GET "http://localhost:5000/api/Chat/history?userA=1&userB=2&skip=0&take=50"

# Test send message
curl -X POST "http://localhost:5000/api/Chat/send" \
  -H "Content-Type: application/json" \
  -d '{"FromUserId": 1, "ToUserId": 2, "Message": "Test message"}'
``` 