# Admin & Nurse Styling Guide

## Tổng quan
Đã redesign CSS cho admin role và fix modal styling cho nurse role để đảm bảo:
- Tables responsive và đẹp
- Modals không bị tràn ra ngoài
- Consistent design system
- Smooth animations

## Files CSS mới

### 1. admin-tables.css
CSS chuyên dụng cho các components admin:
- Modern table styling với hover effects
- Professional modal design
- Responsive breakpoints
- Clean color scheme

### 2. nurse-modal-fix.css
CSS fix cho nurse modals:
- Prevent overflow
- Max height/width constraints
- Mobile responsive
- Nurse color theme

## Cách sử dụng

### Admin Components
Các trang admin đã được update để sử dụng `admin-tables.css`:
```jsx
import "../../styles/admin-tables.css";
```

Components được style:
- Categories.jsx ✅
- MedicineInventory.jsx ✅  
- MedicinePlan.jsx ✅
- Accounts.jsx (cần update)

### Nurse Modals
Để sử dụng nurse modal styling, thêm class `nurse-modal`:

```jsx
<Modal show={showModal} onHide={handleClose} className="nurse-modal" centered>
  <Modal.Header closeButton>
    <Modal.Title>Tiêu đề Modal</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {/* Content không bị overflow */}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary">Hủy</Button>
    <Button variant="primary">Lưu</Button>
  </Modal.Footer>
</Modal>
```

## CSS Classes chính

### Admin Tables
- `.admin-container` - Main container
- `.accounts-header` - Header section với gradient
- `.search-filter-bar` - Filter controls
- `.stat-card` - Statistics cards
- `.table-container` - Table wrapper
- `.accounts-table` - Modern table styling
- `.action-btn` - Action buttons

### Nurse Modals  
- `.nurse-modal` - Main modal class
- `.nurse-modal .modal-dialog` - Responsive dialog
- `.nurse-modal .modal-body` - Scrollable body
- `.nurse-modal .btn-primary` - Nurse themed buttons

## Responsive Breakpoints
- Desktop: > 1200px
- Tablet: 768px - 1200px
- Mobile: < 768px
- Small mobile: < 480px

## Color Variables
```css
/* Admin Colors */
--admin-table-primary: #667eea;
--admin-table-secondary: #764ba2;
--admin-table-success: #10B981;
--admin-table-warning: #F59E0B;
--admin-table-danger: #EF4444;

/* Nurse Colors */
--nurse-primary: #ff6b6b;
--nurse-secondary: #ee5a52;
```

## Animations
- Fade in effects
- Slide transitions
- Hover animations
- Loading states

## Best Practices
1. Luôn sử dụng `centered` prop cho modals
2. Thêm `nurse-modal` class cho nurse components
3. Sử dụng responsive grid cho tables
4. Test trên mobile devices

## Migration Notes
- ✅ Categories component đã update
- ✅ MedicineInventory component đã update  
- ✅ MedicinePlan component đã update
- ⏳ Accounts component cần update
- ⏳ Nurse components cần thêm nurse-modal class 