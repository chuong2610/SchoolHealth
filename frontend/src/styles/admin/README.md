# Admin Styles Documentation

## 🎨 Tổng quan

Hệ thống CSS cho phần **Admin** với **màu chủ đạo Emerald** (#10B981), thiết kế đơn giản nhưng hiện đại, đảm bảo tính nhất quán giữa các trang.

## 📁 Cấu trúc File CSS

```
frontend/src/styles/admin/
├── accounts.css              # Quản lý tài khoản
├── dashboard.css             # Trang chủ admin
├── medicine-inventory.css    # Quản lý kho thuốc
├── notifications-management.css # Quản lý thông báo
├── reports.css               # Báo cáo & thống kê
├── settings.css              # Cài đặt hệ thống
├── profile.css               # Hồ sơ cá nhân
└── README.md                 # Tài liệu này
```

## 🎨 Color Palette - Emerald Theme

### Màu chính
- **Primary**: `#10B981` (Emerald 500)
- **Primary Dark**: `#059669` (Emerald 600)
- **Primary Light**: `#34D399` (Emerald 400)

### Màu nền
- **Background**: `linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)`
- **Card Background**: `#FFFFFF`
- **Light Background**: `rgba(16, 185, 129, 0.05)`

### Màu phụ
- **Text Primary**: `#1F2937`
- **Text Secondary**: `#6B7280` 
- **Text Muted**: `#9CA3AF`
- **Border**: `#D1FAE5`
- **Border Light**: `#E5E7EB`

### Màu trạng thái
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Danger**: `#EF4444`
- **Info**: `#3B82F6`

## 🧩 Component Patterns

### 1. Container Classes
```css
.admin-[page]-container {
  padding: 2rem;
  background: linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%);
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### 2. Header Patterns
```css
.admin-[page]-header {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.25);
}
```

### 3. Card Components
```css
.admin-[component]-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1);
  overflow: hidden;
}
```

### 4. Button Styles
```css
.admin-[page]-btn-primary {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.admin-[page]-btn-secondary {
  background: white;
  border: 2px solid #10B981;
  color: #10B981;
}
```

## 📱 Responsive Design

Tất cả components đều responsive với breakpoints:
- **Mobile**: `max-width: 768px`
- **Tablet**: `max-width: 1024px`
- **Desktop**: `min-width: 1025px`

## ✨ Animation & Effects

### Hover Effects
- `transform: translateY(-2px)` cho buttons
- `box-shadow` động cho cards
- `background-color` transitions

### Loading States
- Spinner animation với emerald color
- Skeleton loading cho tables

### Micro-interactions
- Button hover effects
- Card elevation changes
- Smooth transitions (0.3s ease)

## 🔧 Import Instructions

Mỗi trang admin đã được import CSS tương ứng:

```javascript
// Accounts.jsx
import "../../styles/admin/accounts.css";

// Dashboard.jsx  
import "../../styles/admin/dashboard.css";

// MedicineInventory.jsx
import "../../styles/admin/medicine-inventory.css";

// NotificationsManagement.jsx
import "../../styles/admin/notifications-management.css";

// Reports.jsx
import "../../styles/admin/reports.css";

// Settings.jsx
import "../../styles/admin/settings.css";

// Profile.jsx
import "../../styles/admin/profile.css";
```

## 🎯 Features Implemented

### ✅ Accounts Page
- Emerald-themed navigation tabs
- Modern table design
- Search and filter components
- Modal forms with emerald accents
- Pagination component

### ✅ Dashboard Page  
- Stats cards với emerald icons
- Chart containers
- Quick actions grid
- Activity timeline
- Responsive grid layout

### ✅ Medicine Inventory
- Inventory stats cards
- Search and filter bar
- Data table với emerald headers
- Progress bars and status badges
- Action buttons

### ✅ Notifications Management
- Notification cards layout
- Stats overview
- Tab navigation
- Search functionality
- Status indicators

### ✅ Reports
- Report type cards
- Filters section
- Chart containers
- Export options
- Summary cards với emerald theme

### ✅ Settings
- Two-column layout
- Form components
- Toggle switches với emerald
- Security cards
- File upload components

### ✅ Profile
- Two-column profile layout
- Avatar section
- Info grids
- Activity timeline
- Security status indicators

## 🚀 Best Practices

1. **Consistent Naming**: Tất cả class names theo pattern `admin-[page]-[component]`
2. **Color Consistency**: Sử dụng emerald color variables
3. **Responsive First**: Mobile-first design approach
4. **Performance**: Optimized CSS với minimal redundancy
5. **Accessibility**: Proper contrast ratios và focus states

## 📈 Future Enhancements

- [ ] CSS Variables cho easier theming
- [ ] Dark mode support
- [ ] More animation variants
- [ ] Component library extraction
- [ ] CSS-in-JS migration option

---

**Tác giả**: Admin UI Team  
**Cập nhật**: Tháng 1, 2025  
**Theme**: Emerald Modern Admin 