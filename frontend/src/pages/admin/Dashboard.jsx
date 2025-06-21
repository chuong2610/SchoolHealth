import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
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
  FaCog,
  FaSpinner
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch admin dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/Home/admin');
      setDashboardData(response.data.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Trigger load animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced stats data with real data from API
  const statsData = dashboardData ? [
    {
      id: 1,
      title: 'Tổng số học sinh',
      value: dashboardData.numberOfStudents?.toLocaleString() || '0',

      isPositive: true,
      icon: FaUserGraduate,
      color: 'primary',
      description: 'Học sinh đang học',
      trend: [2400, 2500, 2650, 2750, dashboardData.numberOfStudents || 0]
    },
    {
      id: 2,
      title: 'Tổng số phụ huynh',
      value: dashboardData.numberOfParents?.toLocaleString() || '0',

      isPositive: true,
      icon: FaUsers,
      color: 'success',
      description: 'Phụ huynh đã đăng ký',
      trend: [2100, 2150, 2180, 2200, dashboardData.numberOfParents || 0]
    },
    {
      id: 3,
      title: 'Tổng số y tá',
      value: dashboardData.numberOfNurses?.toLocaleString() || '0',

      isPositive: true,
      icon: FaUserMd,
      color: 'info',
      description: 'Y tá đã đăng ký',
      trend: [82, 84, 85, 86, dashboardData.numberOfNurses || 0]
    },
    {
      id: 4,
      title: 'Đơn thuốc chờ xử lý',
      value: dashboardData.pendingMedicationsNumber?.toLocaleString() || '0',

      isPositive: false,
      icon: FaPills,
      color: 'warning',
      description: 'Đơn thuốc chờ xác nhận',
      trend: [180, 165, 155, 150, dashboardData.pendingMedicationsNumber || 0]
    }
  ] : [];

  // Convert weekly medical event counts to chart data
  const chartData = dashboardData?.weeklyMedicalEventCounts
    ? Object.entries(dashboardData.weeklyMedicalEventCounts).map(([day, count]) => ({
      day,
      medical_events: count,
      medicines: dashboardData.activeMedicationsNumber || 0,
      health_checks: Math.floor(count * 1.5) // Estimated based on medical events
    }))
    : [
      { day: 'Monday', medical_events: 45, medicines: 12, health_checks: 67 },
      { day: 'Tuesday', medical_events: 52, medicines: 18, health_checks: 78 },
      { day: 'Wednesday', medical_events: 38, medicines: 15, health_checks: 57 },
      { day: 'Thursday', medical_events: 61, medicines: 22, health_checks: 91 },
      { day: 'Friday', medical_events: 49, medicines: 16, health_checks: 73 },
      { day: 'Saturday', medical_events: 23, medicines: 8, health_checks: 34 },
      { day: 'Sunday', medical_events: 18, medicines: 5, health_checks: 27 }
    ];

  // Calculate medication status data from real API data
  const medicationStatusData = dashboardData ? [
    {
      name: 'Chờ xử lý',
      value: dashboardData.pendingMedicationsNumber || 0,
      color: '#FFA62B',
      percentage: dashboardData.pendingMedicationsNumber ? ((dashboardData.pendingMedicationsNumber / (dashboardData.pendingMedicationsNumber + dashboardData.activeMedicationsNumber + dashboardData.completedMedicationsNumber)) * 100).toFixed(1) : 0
    },
    {
      name: 'Đang xử lý',
      value: dashboardData.activeMedicationsNumber || 0,
      color: '#2196F3',
      percentage: dashboardData.activeMedicationsNumber ? ((dashboardData.activeMedicationsNumber / (dashboardData.pendingMedicationsNumber + dashboardData.activeMedicationsNumber + dashboardData.completedMedicationsNumber)) * 100).toFixed(1) : 0
    },
    {
      name: 'Hoàn thành',
      value: dashboardData.completedMedicationsNumber || 0,
      color: '#4CAF50',
      percentage: dashboardData.completedMedicationsNumber ? ((dashboardData.completedMedicationsNumber / (dashboardData.pendingMedicationsNumber + dashboardData.activeMedicationsNumber + dashboardData.completedMedicationsNumber)) * 100).toFixed(1) : 0
    }
  ] : [
    { name: 'Chờ xử lý', value: 0, color: '#FFA62B', percentage: 0 },
    { name: 'Đang xử lý', value: 0, color: '#2196F3', percentage: 0 },
    { name: 'Hoàn thành', value: 0, color: '#4CAF50', percentage: 0 }
  ];

  // Generate recent activities from real data
  const recentActivities = dashboardData ? [
    ...dashboardData.medicalEvents?.slice(0, 3).map((event, index) => ({
      id: index + 1,
      title: 'Sự kiện y tế mới',
      description: event.description || `Sự kiện y tế cho ${event.studentName || 'học sinh'}`,
      time: new Date(event.eventDate).toLocaleDateString('vi-VN'),
      icon: FaHeartbeat,
      type: 'success'
    })) || [],
    ...dashboardData.medications?.slice(0, 2).map((medication, index) => ({
      id: index + 4,
      title: 'Đơn thuốc mới',
      description: `${medication.medicationName || 'Thuốc'} - ${medication.status || 'Chờ xử lý'}`,
      time: new Date(medication.createdDate).toLocaleDateString('vi-VN'),
      icon: FaPills,
      type: 'info'
    })) || []
  ].slice(0, 5) : [
    {
      id: 1,
      title: 'Đang tải dữ liệu...',
      description: 'Vui lòng chờ trong giây lát',
      time: 'Just now',
      icon: FaSpinner,
      type: 'info'
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

  // Show loading state
  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-page-header">
          <div className="row align-items-center">
            <div className="col-lg-12 text-center">
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                  <FaSpinner className="fa-spin mb-3" size={48} style={{ color: '#4ECDC4' }} />
                  <h4>Đang tải dữ liệu dashboard...</h4>
                  <p className="text-muted">Vui lòng chờ trong giây lát</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="admin-container">
        <div className="admin-page-header">
          <div className="row align-items-center">
            <div className="col-lg-12 text-center">
              <div className="alert alert-danger">
                <h4>Lỗi tải dữ liệu</h4>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={fetchDashboardData}>
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    <input type="radio" className="btn-check" name="chartType" id="medical_events" defaultChecked />
                    <label className="btn btn-outline-primary btn-sm" htmlFor="medical_events">Sự kiện y tế</label>

                    <input type="radio" className="btn-check" name="chartType" id="health" />
                    <label className="btn btn-outline-primary btn-sm" htmlFor="health">Kiểm tra sức khỏe</label>

                    <input type="radio" className="btn-check" name="chartType" id="medicines" />
                    <label className="btn btn-outline-primary btn-sm" htmlFor="medicines">Thuốc</label>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="medicalEventsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#26D0CE" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#26D0CE" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="medicinesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis dataKey="day" stroke="#757575" fontSize={12} />
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
                      dataKey="medical_events"
                      stroke="#4ECDC4"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#medicalEventsGradient)"
                      name="Sự kiện y tế"
                    />
                    <Area
                      type="monotone"
                      dataKey="health_checks"
                      stroke="#26D0CE"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#healthGradient)"
                      name="Kiểm tra sức khỏe"
                    />
                    <Area
                      type="monotone"
                      dataKey="medicines"
                      stroke="#4CAF50"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#medicinesGradient)"
                      name="Thuốc"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Medication Status Pie Chart */}
          <div className="col-lg-4">
            <div className="admin-card">
              <div className="admin-card-header">
                <h4 className="admin-card-title">
                  <FaPills />
                  Trạng thái đơn thuốc
                </h4>
              </div>
              <div className="admin-card-body">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={medicationStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {medicationStatusData.map((entry, index) => (
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
                  {medicationStatusData.map((item, index) => (
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
                          background: 'linear-gradient(135deg, #4ECDC4, #26D0CE)',
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
                            background: 'linear-gradient(135deg, #FFFFFF, #F8FFFE)',
                            border: '1px solid rgba(78, 205, 196, 0.1)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-4px)';
                            e.target.style.boxShadow = '0 8px 32px rgba(78, 205, 196, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 16px rgba(78, 205, 196, 0.15)';
                          }}
                        >
                          <div className="text-start">
                            <div
                              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                              style={{
                                width: '40px',
                                height: '40px',
                                background: 'linear-gradient(135deg, #4ECDC4, #26D0CE)',
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
