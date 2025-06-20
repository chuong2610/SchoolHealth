import React, { useState, useEffect } from 'react';
import {
  FaUsers,
  FaUserGraduate,
  FaUserMd,
  FaUserTie,
  FaChartLine,
  FaBell,
  FaHeartbeat,
  FaPills,
  FaFileAlt,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaDownload,
  FaPlus,
  FaCalendarAlt,
  FaChartBar,
  FaShieldAlt,
  FaCog
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// Import admin dashboard specific CSS
// Styles được import từ main.jsx

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger load state
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced stats data with better structure
  const statsData = [
    {
      id: 1,
      title: 'Tổng số học sinh',
      value: '2,847',
      change: '+12.5%',
      isPositive: true,
      icon: FaUserGraduate,
      color: 'primary',
      description: 'Học sinh đang học',
      trend: [2400, 2500, 2650, 2750, 2847]
    },
    {
      id: 2,
      title: 'Tổng số phụ huynh',
      value: '2,234',
      change: '+8.2%',
      isPositive: true,
      icon: FaUsers,
      color: 'success',
      description: 'Phụ huynh đã đăng ký',
      trend: [2100, 2150, 2180, 2200, 2234]
    },
    {
      id: 3,
      title: 'Tổng số y tá',
      value: '87',
      change: '+2.1%',
      isPositive: true,
      icon: FaUserMd,
      color: 'info',
      description: 'Y tá đã đăng ký',
      trend: [82, 84, 85, 86, 87]
    },
    {
      id: 4,
        title: 'Tổng số học sinh bị bệnh',
      value: '143',
      change: '-5.2%',
      isPositive: false,
      icon: FaShieldAlt,
      color: 'warning',
      description: 'Học sinh đang bị bệnh',
      trend: [180, 165, 155, 150, 143]
    }
  ];

  const chartData = [
    { month: 'Tháng 1', students: 2400, health_checks: 890, medicines: 245 },
    { month: 'Tháng 2', students: 2210, health_checks: 920, medicines: 280 },
    { month: 'Tháng 3', students: 2290, health_checks: 1100, medicines: 320 },
    { month: 'Tháng 4', students: 2000, health_checks: 980, medicines: 290 },
    { month: 'Tháng 5', students: 2181, health_checks: 1200, medicines: 350 },
    { month: 'Tháng 6', students: 2500, health_checks: 1350, medicines: 380 },
    { month: 'Tháng 7', students: 2847, health_checks: 1580, medicines: 420 }
  ];

  const healthStatusData = [
    { name: 'Khỏe mạnh', value: 2156, color: '#4CAF50', percentage: 75.7 },
    { name: 'Vắng mặt', value: 521, color: '#FF9800', percentage: 18.3 },
    { name: 'Đang điều trị', value: 143, color: '#F44336', percentage: 5.0 },
    { name: 'Nghi ngờ', value: 27, color: '#9C27B0', percentage: 1.0 }
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'Kiểm tra sức khỏe hoàn thành',
      description: 'Lớp 10A - 28 học sinh đã được kiểm tra',
      time: '2 minutes ago',
      icon: FaHeartbeat,
      type: 'success'
    },
    {
      id: 2,
      title: 'Yêu cầu thuốc được phê duyệt',
      description: 'Paracetamol cho Nguyễn Văn A',
      time: '5 minutes ago',
      icon: FaPills,
      type: 'info'
    },
    {
      id: 3,
      title: 'Đăng ký phụ huynh mới',
      description: 'Bà Trần Thị B đã đăng ký thành công',
      time: '12 minutes ago',
      icon: FaUsers,
      type: 'primary'
    },
    {
      id: 4,
      title: 'Cảnh báo hệ thống',
      description: 'Tồn kho thuốc thấp đã được phát hiện',
      time: '30 minutes ago',
      icon: FaBell,
      type: 'warning'
    },
    {
      id: 5,
      title: 'Báo cáo tháng được tạo',
      description: 'Thống kê sức khỏe cho tháng 6 2024',
      time: '1 hour ago',
      icon: FaFileAlt,
      type: 'success'
    }
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Thêm người dùng mới',
      description: 'Tạo tài khoản học sinh, phụ huynh hoặc nhân viên',
      icon: FaPlus,
      route: '/admin/accounts'
    },
    {
      id: 2,
      title: 'Tạo báo cáo',
      description: 'Tạo báo cáo sức khỏe hoặc hoạt động',
      icon: FaFileAlt,
      route: '/admin/reports'
    },
    {
      id: 3,
      title: 'Gửi thông báo',
      description: 'Gửi thông báo đến người dùng',
      icon: FaBell,
      route: '/admin/notification/management'
    },
    {
      id: 4,
      title: 'Quản lý thuốc',
      description: 'Cập nhật tồn kho thuốc',
      icon: FaPills,
      route: '/admin/medicines/inventory'
    },
    {
      id: 5,
      title: 'Xem thống kê',
      description: 'Thống kê chi tiết hệ thống',
      icon: FaChartLine,
      route: '/admin/reports'
    },
    {
      id: 6,
      title: 'Cấu hình hệ thống',
      description: 'Cấu hình hệ thống',
      icon: FaCog,
      route: '/admin/settings'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
        icon: 'text-blue-600',
        border: 'border-blue-200',
        trend: 'text-blue-600 bg-blue-100'
      },
      emerald: {
        bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
        icon: 'text-emerald-600',
        border: 'border-emerald-200',
        trend: 'text-emerald-600 bg-emerald-100'
      },
      purple: {
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
        icon: 'text-purple-600',
        border: 'border-purple-200',
        trend: 'text-purple-600 bg-purple-100'
      },
      orange: {
        bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
        icon: 'text-orange-600',
        border: 'border-orange-200',
        trend: 'text-orange-600 bg-orange-100'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="admin-container">
      {/* Enhanced Header */}
      <div className="admin-page-header">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h1 className="admin-page-title">
              🎯 Trang chủ quản trị viên
            </h1>
            <p className="admin-page-subtitle">
              Chào mừng bạn đến với hệ thống quản lý sức khỏe của trường
            </p>
          </div>
          <div className="col-lg-4 text-end">
            <div className="d-flex gap-3 justify-content-end align-items-center">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="form-select admin-btn-secondary"
                style={{
                  width: 'auto',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'black'
                }}
              >
                <option value="7days">7 ngày qua</option>
                <option value="30days">30 ngày qua</option>
                <option value="90days">3 tháng qua</option>
                <option value="year">Năm nay</option>
              </select>
              
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4">
        {/* Enhanced Stats Grid */}
        <div className="admin-stats-grid">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.id}
                className={`admin-stat-card admin-animate-scale`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="admin-stat-icon">
                    <Icon />
                  </div>
                  <div className={`admin-stat-change ${stat.isPositive ? 'positive' : 'negative'}`}>
                    {stat.isPositive ? <FaArrowUp /> : <FaArrowDown />}
                    {stat.change}
                  </div>
                </div>
                <div className="admin-stat-value">{stat.value}</div>
                <div className="admin-stat-label">{stat.title}</div>
                <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.875rem' }}>
                  {stat.description}
                </p>

                {/* Mini trend chart */}
                <div className="mt-3" style={{ height: '40px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stat.trend.map((value, idx) => ({ value }))}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={stat.isPositive ? '#4CAF50' : '#F44336'}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="row mb-4">
          {/* Main Activity Chart */}
          <div className="col-lg-8">
            <div className="admin-card">
              <div className="admin-card-header">
                <h4 className="admin-card-title">
                  <FaChartLine />
                  Tổng quan hoạt động hệ thống
                </h4>
              </div>
              <div className="admin-card-body">
                <div className="mb-3">
                  <div className="btn-group" role="group">
                    <input type="radio" className="btn-check" name="chartType" id="students" defaultChecked />
                    <label className="btn btn-outline-primary btn-sm" htmlFor="students">Học sinh</label>

                    <input type="radio" className="btn-check" name="chartType" id="health" />
                    <label className="btn btn-outline-primary btn-sm" htmlFor="health">Kiểm tra sức khỏe</label>

                    <input type="radio" className="btn-check" name="chartType" id="medicines" />
                    <label className="btn btn-outline-primary btn-sm" htmlFor="medicines">Thuốc</label>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="studentsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF9500" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FF9500" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9C27B0" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#9C27B0" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="medicinesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis dataKey="month" stroke="#757575" fontSize={12} />
                    <YAxis stroke="#757575" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        fontSize: '14px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="students"
                      stroke="#FF9500"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#studentsGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="health_checks"
                      stroke="#9C27B0"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#healthGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="medicines"
                      stroke="#4CAF50"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#medicinesGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Health Status Pie Chart */}
          <div className="col-lg-4">
            <div className="admin-card">
              <div className="admin-card-header">
                <h4 className="admin-card-title">
                  <FaHeartbeat />
                  Tình trạng sức khỏe học sinh
                </h4>
              </div>
              <div className="admin-card-body">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={healthStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {healthStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        fontSize: '14px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-3">
                  {healthStatusData.map((item, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle me-2"
                          style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: item.color
                          }}
                        ></div>
                        <small className="text-muted">{item.name}</small>
                      </div>
                      <div className="text-end">
                        <strong style={{ fontSize: '0.875rem' }}>{item.value}</strong>
                        <small className="text-muted ms-1">({item.percentage}%)</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="row">
          {/* Recent Activities */}
          <div className="col-lg-6">
            <div className="admin-card">
              <div className="admin-card-header">
                <h4 className="admin-card-title">
                  <FaBell />
                  Hoạt động gần đây
                </h4>
              </div>
              <div className="admin-card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;

                  return (
                    <div
                      key={activity.id}
                      className={`d-flex align-items-start mb-3 pb-3 admin-animate-slide-left ${index < recentActivities.length - 1 ? 'border-bottom' : ''}`}
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        borderColor: '#E0E0E0 !important'
                      }}
                    >
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: '40px',
                          height: '40px',
                          background: 'linear-gradient(135deg, #FF9500, #9C27B0)',
                          color: 'white',
                          fontSize: '0.875rem'
                        }}
                      >
                        <Icon />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1" style={{ fontSize: '0.95rem', fontWeight: '600' }}>
                          {activity.title}
                        </h6>
                        <p className="mb-1 text-muted" style={{ fontSize: '0.875rem' }}>
                          {activity.description}
                        </p>
                        <small className="text-muted">{activity.time}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-lg-6">
            <div className="admin-card">
              <div className="admin-card-header">
                <h4 className="admin-card-title">
                  <FaChartBar />
                  Hành động nhanh
                </h4>
              </div>
              <div className="admin-card-body">
                <div className="row g-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;

                    return (
                      <div key={action.id} className="col-md-6">
                        <button
                          className={`w-100 p-3 border-0 rounded-3 admin-animate-scale`}
                          style={{
                            animationDelay: `${index * 0.1}s`,
                            background: 'linear-gradient(135deg, #FFFFFF, #FFF8F3)',
                            border: '1px solid rgba(255, 149, 0, 0.1)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-4px)';
                            e.target.style.boxShadow = '0 8px 32px rgba(255, 149, 0, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 16px rgba(255, 149, 0, 0.15)';
                          }}
                        >
                          <div className="text-start">
                            <div
                              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                              style={{
                                width: '40px',
                                height: '40px',
                                background: 'linear-gradient(135deg, #FF9500, #9C27B0)',
                                color: 'white'
                              }}
                            >
                              <Icon style={{ fontSize: '1rem' }} />
                            </div>
                            <h6 className="mb-1" style={{ fontSize: '0.95rem', fontWeight: '600', color: '#424242' }}>
                              {action.title}
                            </h6>
                            <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>
                              {action.description}
                            </p>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
