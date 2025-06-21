# CSS Structure Documentation

## 📁 Organized CSS Architecture

### 🏗️ Folder Structure

```
styles/
├── common/           # Shared styles across all roles
├── admin/           # Admin-specific styles
├── nurse/           # Nurse-specific styles
├── parent/          # Parent-specific styles
├── components/      # Reusable component styles (future use)
└── README.md        # This documentation
```

---

## 📂 Detailed Breakdown

### 🌐 common/ - Shared Styles
- `main.css` - Global application styles
- `themes.css` - Color themes and CSS variables  
- `sidebar.css` - Navigation sidebar styles
- `header.css` - Header component styles
- `layout-fix.css` - Layout fixes and utilities
- `dashboard.css` - Dashboard styles used by all roles
- `index.css` - **Entry point** importing all common styles

### 👨‍💼 admin/ - Admin Role Styles
- `admin-clean.css` - Clean admin theme base
- `admin-animations.css` - Animation effects
- `admin-components.css` - Admin-specific components
- `admin-dashboard.css` - Admin dashboard layout
- `admin-override.css` - Bootstrap overrides for admin
- `admin-responsive.css` - Responsive design rules
- `admin-tables.css` - Table styling
- `admin-tables-override.css` - Table override fixes
- `admin-theme.css` - Main admin theme
- `accounts-modal.css` - Account management modals
- `accounts-modal-override.css` - Modal override fixes
- `accounts-table.css` - Account management table
- `category-table.css` - Category management table
- `medicine-table.css` - Medicine inventory table
- `notification-table.css` - Notifications table
- `plan-table.css` - Medicine plan table
- `index.css` - **Entry point** importing all admin styles

### 👩‍⚕️ nurse/ - Nurse Role Styles
- `nurse-theme-pink.css` - Pink theme for nurse interface
- `nurse-modal-fix.css` - Modal fixes specific to nurse role
- `index.css` - **Entry point** importing all nurse styles

### 👨‍👩‍👧‍👦 parent/ - Parent Role Styles
- `parent-theme.css` - Parent interface theme
- `index.css` - **Entry point** importing all parent styles

### 🧩 components/ - Component Styles (Future Use)
Reserved for reusable component styles that can be shared across roles.

---

## 🚀 Usage

### Import in main.jsx
```jsx
import './styles/common/index.css';     // Always load first
import './styles/admin/index.css';      // Admin styles
import './styles/nurse/index.css';      // Nurse styles  
import './styles/parent/index.css';     // Parent styles
```

### Import in Components
```jsx
// For role-specific styling
import '../../styles/admin/accounts-modal.css';

// For common components
import '../../styles/common/sidebar.css';
```

---

## 🗑️ Removed Files

### Deleted Duplicates & Unused
- `admin-patch.css` (31KB) - Duplicate functionality
- `accounts-modal-force-override.css` (1B) - Empty file
- `accounts-modal-test.css` (1KB) - Test file
- `nurse-theme-pink-override.css` (1B) - Empty file  
- `nurse-theme.css` (106KB) - Duplicate of nurse-theme-pink.css
- `pink-modal-fix.css` - Renamed/consolidated
- `pink-override.css` - Renamed/consolidated

### Total Space Saved: ~139KB

---

## 📋 Maintenance Guidelines

### ✅ Do:
- Keep role-specific styles in their respective folders
- Use `index.css` files as entry points
- Document new files in this README
- Follow the naming convention: `{role}-{component}.css`

### ❌ Don't:
- Mix role styles (admin styles in nurse folder)
- Create duplicate functionality
- Leave empty or test files in production
- Use hard-coded colors (use CSS variables)

---

## 🎨 Color System

### CSS Variables (defined in common/themes.css)
```css
:root {
  --admin-primary: #5865F2;      /* Discord Purple */
  --nurse-primary: #ff6b6b;      /* Pink */
  --parent-primary: #your-color;  /* Parent theme */
  --common-bg: #f8f9fa;          /* Background */
}
```

---

## 🔄 Migration Notes

### Changed Imports
**Before:**
```jsx
import './styles/admin-clean.css';
import './styles/admin-animations.css';
import './styles/accounts-modal-override.css';
// ... many individual imports
```

**After:**
```jsx
import './styles/admin/index.css';  // One import for all admin styles
```

### File Locations Changed
- `styles/admin-*.css` → `styles/admin/admin-*.css`
- `styles/accounts-*.css` → `styles/admin/accounts-*.css`
- `styles/nurse-*.css` → `styles/nurse/nurse-*.css`
- `styles/main.css` → `styles/common/main.css`

---

**📝 Last Updated:** December 20, 2025  
**👨‍💻 Organized by:** CSS Architecture Cleanup 