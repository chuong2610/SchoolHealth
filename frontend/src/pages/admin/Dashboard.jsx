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
  FaEye,
  FaDownload,
  FaPlus
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
  ResponsiveContainer
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

  // Mock data
  const statsData = [
    {
      id: 1,
      title: 'Total Students',
      value: '2,847',
      change: '+12.5%',
      icon: FaUserGraduate,
      color: 'blue',
      description: 'Active students this semester'
    },
    {
      id: 2,
      title: 'Total Parents',
      value: '2,234',
      change: '+8.2%',
      icon: FaUsers,
      color: 'emerald',
      description: 'Registered parent accounts'
    },
    {
      id: 3,
      title: 'Medical Staff',
      value: '87',
      change: '+2.1%',
      icon: FaUserMd,
      color: 'purple',
      description: 'Active nurses and doctors'
    },
    {
      id: 4,
      title: 'Administrators',
      value: '24',
      change: '0%',
      icon: FaUserTie,
      color: 'orange',
      description: 'System administrators'
    }
  ];

  const chartData = [
    { name: 'Jan', students: 2400, health_checks: 890 },
    { name: 'Feb', students: 2210, health_checks: 920 },
    { name: 'Mar', students: 2290, health_checks: 1100 },
    { name: 'Apr', students: 2000, health_checks: 980 },
    { name: 'May', students: 2181, health_checks: 1200 },
    { name: 'Jun', students: 2500, health_checks: 1350 },
    { name: 'Jul', students: 2847, health_checks: 1580 }
  ];

  const healthStatusData = [
    { name: 'Healthy', value: 2156, color: '#10B981' },
    { name: 'Minor Issues', value: 521, color: '#F59E0B' },
    { name: 'Under Treatment', value: 143, color: '#EF4444' },
    { name: 'Monitoring', value: 27, color: '#8B5CF6' }
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'Health Check Completed',
      description: 'Grade 10A - 28 students checked',
      time: '2 minutes ago',
      icon: FaHeartbeat,
      color: 'emerald'
    },
    {
      id: 2,
      title: 'Medicine Request Approved',
      description: 'Paracetamol for Nguyen Van A',
      time: '5 minutes ago',
      icon: FaPills,
      color: 'blue'
    },
    {
      id: 3,
      title: 'New Parent Registration',
      description: 'Mrs. Tran Thi B registered successfully',
      time: '12 minutes ago',
      icon: FaUsers,
      color: 'purple'
    },
    {
      id: 4,
      title: 'Monthly Report Generated',
      description: 'Health statistics for June 2024',
      time: '1 hour ago',
      icon: FaFileAlt,
      color: 'orange'
    }
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Add New User',
      description: 'Create student, parent or staff account',
      icon: FaPlus,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Generate Report',
      description: 'Create health or activity reports',
      icon: FaFileAlt,
      color: 'emerald'
    },
    {
      id: 3,
      title: 'Send Notification',
      description: 'Broadcast message to users',
      icon: FaBell,
      color: 'purple'
    },
    {
      id: 4,
      title: 'View Analytics',
      description: 'Detailed system analytics',
      icon: FaChartLine,
      color: 'orange'
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
    <div className="admin-dashboard">
      {/* Header Section */}
      <section className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="dashboard-title">
              Welcome back, Administrator
            </h1>
            <p className="dashboard-subtitle">
              Here's what's happening with your school health system today
            </p>
          </div>
          <div className="header-actions">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-selector"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 3 months</option>
              <option value="year">This year</option>
            </select>
            <button type="button" className="export-btn">
              <FaDownload />
              Export Report
            </button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="stats-grid">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = getColorClasses(stat.color);

          return (
            <div
              key={stat.id}
              className={`stat-card animate-scaleIn`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="stat-card-header">
                <div className={`stat-icon ${colorClasses.bg} ${colorClasses.border}`}>
                  <Icon className={colorClasses.icon} />
                </div>
                <div className={`stat-trend ${colorClasses.trend}`}>
                  <FaArrowUp />
                  {stat.change}
                </div>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-title">{stat.title}</p>
                <p className="stat-description">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <div className="charts-grid">
          {/* Main Chart */}
          <div className="chart-card main-chart">
            <div className="chart-header">
              <h3>System Activity Overview</h3>
              <div className="chart-actions">
                <button type="button" className="chart-btn active">Students</button>
                <button type="button" className="chart-btn">Health Checks</button>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="studentsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      fontSize: '14px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#667eea"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#studentsGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="health_checks"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#healthGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Health Status Pie Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Student Health Status</h3>
              <button type="button" className="view-details-btn">
                <FaEye />
                View Details
              </button>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={healthStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
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
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      fontSize: '14px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {healthStatusData.map((item, index) => (
                  <div key={index} className="legend-item">
                    <div
                      className="legend-color"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="legend-label">{item.name}</span>
                    <span className="legend-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="bottom-section">
        {/* Recent Activities */}
        <div className="activities-card">
          <div className="card-header">
            <h3>Recent Activities</h3>
            <button type="button" className="view-all-btn">View All</button>
          </div>
          <div className="activities-list">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              const colorClasses = getColorClasses(activity.color);

              return (
                <div
                  key={activity.id}
                  className={`activity-item animate-slideInLeft`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`activity-icon ${colorClasses.bg}`}>
                    <Icon className={colorClasses.icon} />
                  </div>
                  <div className="activity-content">
                    <h4 className="activity-title">{activity.title}</h4>
                    <p className="activity-description">{activity.description}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const colorClasses = getColorClasses(action.color);

              return (
                <button
                  key={action.id}
                  type="button"
                  className={`quick-action-btn animate-slideInRight`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`action-icon ${colorClasses.bg}`}>
                    <Icon className={colorClasses.icon} />
                  </div>
                  <div className="action-content">
                    <h4 className="action-title">{action.title}</h4>
                    <p className="action-description">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
