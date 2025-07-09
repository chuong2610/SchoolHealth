import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
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
  FaSpinner,
} from "react-icons/fa";

// Custom SVG Icon component for male student studying
import MaleStudentIcon from "../../assets/male-student-studying-svgrepo-com.svg";
import parent from "../../assets/person-feeding-baby-medium-dark-skin-tone-svgrepo-com.svg";
import nurse from "../../assets/health-worker-svgrepo-com.svg";
import medicine from "../../assets/pill-svgrepo-com.svg";
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
  Bar,
} from "recharts";

// Import admin dashboard specific CSS
import "../../styles/admin/dashboard.css";

/*
 * HƯỚNG DẪN THÊM ẢNH VÀO STATS CARDS:
 *
 * 1. Thêm ảnh vào thư mục assets hoặc public
 * 2. Import ảnh: import myIcon from '../../assets/my-icon.png';
 * 3. Cập nhật statsData:
 *    - imageSrc: myIcon (thay vì null)
 *    - imageAlt: 'Mô tả ảnh'
 *
 * Ví dụ:
 * {
 *   imageSrc: myIcon,
 *   imageAlt: 'Student Icon',
 *   icon: FaUserGraduate // Vẫn giữ icon làm fallback
 * }
 */

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch admin dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Add required parameters for medical supplies data
      const response = await axiosInstance.get("/Home/admin", {
        params: {
          pageNumber: 1,
          pageSize: 100, // Get more medical supplies for chart
          search: "", // Empty search to get all
        },
      });
      setDashboardData(response.data.data);
    } catch (err) {
      setError("Failed to load dashboard data");
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

  // Enhanced stats data with real data from API - Support both icons and images
  const statsData = dashboardData
    ? [
      {
        id: 1,
        title: "Tổng số học sinh",
        value: dashboardData.numberOfStudents?.toLocaleString() || "0",
        isPositive: true,
        icon: FaUserGraduate, // React icon fallback
        imageSrc: MaleStudentIcon, // Demo: Using the imported SVG as example
        imageAlt: "Students",
        color: "primary",
      },
      {
        id: 2,
        title: "Tổng số phụ huynh",
        value: dashboardData.numberOfParents?.toLocaleString() || "0",
        isPositive: true,
        icon: FaUsers, // React icon fallback
        imageSrc: parent, // Add image source here when needed
        imageAlt: "Parents",
        color: "success",
      },
      {
        id: 3,
        title: "Tổng số y tá",
        value: dashboardData.numberOfNurses?.toLocaleString() || "0",
        isPositive: true,
        icon: FaUserMd, // React icon fallback
        imageSrc: nurse, // Add image source here when needed
        imageAlt: "Nurses",
        color: "info",
      },
      {
        id: 4,
        title: "Đơn thuốc chờ xử lý",
        value:
          dashboardData.pendingMedicationsNumber?.toLocaleString() || "0",
        isPositive: false,
        icon: FaPills, // React icon fallback
        imageSrc: medicine, // Add image source here when needed
        imageAlt: "Medicines",
        color: "warning",
      },
    ]
    : [];

  // Convert weekly medical event counts to chart data
  const chartData = dashboardData?.weeklyMedicalEventCounts
    ? Object.entries(dashboardData.weeklyMedicalEventCounts).map(
      ([day, count]) => ({
        day,
        medical_events: count,
        medicines: dashboardData.activeMedicationsNumber || 0,
        health_checks: Math.floor(count * 1.5), // Estimated based on medical events
      })
    )
    : [
      { day: "Monday", medical_events: 45, medicines: 12, health_checks: 67 },
      {
        day: "Tuesday",
        medical_events: 52,
        medicines: 18,
        health_checks: 78,
      },
      {
        day: "Wednesday",
        medical_events: 38,
        medicines: 15,
        health_checks: 57,
      },
      {
        day: "Thursday",
        medical_events: 61,
        medicines: 22,
        health_checks: 91,
      },
      { day: "Friday", medical_events: 49, medicines: 16, health_checks: 73 },
      {
        day: "Saturday",
        medical_events: 23,
        medicines: 8,
        health_checks: 34,
      },
      { day: "Sunday", medical_events: 18, medicines: 5, health_checks: 27 },
    ];

  // Calculate medication status data from real API data
  const medicationStatusData = dashboardData
    ? [
      {
        name: "Chờ xử lý",
        value: dashboardData.pendingMedicationsNumber || 0,
        color: "#f59e0b",
        percentage: dashboardData.pendingMedicationsNumber
          ? (
            (dashboardData.pendingMedicationsNumber /
              (dashboardData.pendingMedicationsNumber +
                dashboardData.activeMedicationsNumber +
                dashboardData.completedMedicationsNumber)) *
            100
          ).toFixed(1)
          : 0,
      },
      {
        name: "Đang xử lý",
        value: dashboardData.activeMedicationsNumber || 0,
        color: "#10b981",
        percentage: dashboardData.activeMedicationsNumber
          ? (
            (dashboardData.activeMedicationsNumber /
              (dashboardData.pendingMedicationsNumber +
                dashboardData.activeMedicationsNumber +
                dashboardData.completedMedicationsNumber)) *
            100
          ).toFixed(1)
          : 0,
      },
      {
        name: "Hoàn thành",
        value: dashboardData.completedMedicationsNumber || 0,
        color: "#059669",
        percentage: dashboardData.completedMedicationsNumber
          ? (
            (dashboardData.completedMedicationsNumber /
              (dashboardData.pendingMedicationsNumber +
                dashboardData.activeMedicationsNumber +
                dashboardData.completedMedicationsNumber)) *
            100
          ).toFixed(1)
          : 0,
      },
    ]
    : [
      { name: "Chờ xử lý", value: 0, color: "#f59e0b", percentage: 0 },
      { name: "Đang xử lý", value: 0, color: "#10b981", percentage: 0 },
      { name: "Hoàn thành", value: 0, color: "#059669", percentage: 0 },
    ];

  // Generate pending medications data - students waiting to take medicine
  const pendingMedications = dashboardData
    ? dashboardData.medications
      ?.filter(
        (medication) =>
          medication.status === "Active" || medication.status === "active"
      )
      .map((medication, index) => ({
        id: medication.id || index + 1,
        studentName: medication.studentName || "Không xác định",
        studentClass:
          medication.studentClass ||
          medication.studentClassName ||
          "Không xác định",
        medications: medication.medications || "Không xác định",
        // dosage: medication.dosage || 'Không xác định',
        // note: medication.note || 'Không có ghi chú',
        createdDate: medication.createdDate
          ? new Date(medication.createdDate).toLocaleDateString("vi-VN")
          : "Không xác định",
        nurseName: medication.nurseName || "Chưa phân công",
        parentName: medication.parentName || "Không xác định",
      })) || []
    : [];

  // Generate recent activities from real data
  const recentActivities = dashboardData
    ? [
      ...(dashboardData.medicalEvents?.slice(0, 3).map((event, index) => ({
        id: index + 1,
        title: "Sự kiện y tế mới",
        description:
          event.description ||
          `Sự kiện y tế cho ${event.studentName || "học sinh"}`,
        time: new Date(event.eventDate).toLocaleDateString("vi-VN"),
        icon: FaHeartbeat,
        type: "success",
      })) || []),
      ...(dashboardData.medications?.slice(0, 2).map((medication, index) => ({
        id: index + 4,
        title: "Đơn thuốc mới",
        description: `${medication.medicationName || "Thuốc"} - ${medication.status || "Chờ xử lý"
          }`,
        time: new Date(medication.createdDate).toLocaleDateString("vi-VN"),
        icon: FaPills,
        type: "info",
      })) || []),
    ].slice(0, 5)
    : [
      {
        id: 1,
        title: "Đang tải dữ liệu...",
        description: "Vui lòng chờ trong giây lát",
        time: "Just now",
        icon: FaSpinner,
        type: "info",
      },
    ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-gradient-to-br from-blue-50 to-blue-100",
        icon: "text-blue-600",
        border: "border-blue-200",
        trend: "text-blue-600 bg-blue-100",
      },
      emerald: {
        bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
        icon: "text-emerald-600",
        border: "border-emerald-200",
        trend: "text-emerald-600 bg-emerald-100",
      },
      purple: {
        bg: "bg-gradient-to-br from-purple-50 to-purple-100",
        icon: "text-purple-600",
        border: "border-purple-200",
        trend: "text-purple-600 bg-purple-100",
      },
      orange: {
        bg: "bg-gradient-to-br from-orange-50 to-orange-100",
        icon: "text-orange-600",
        border: "border-orange-200",
        trend: "text-orange-600 bg-orange-100",
      },
    };
    return colors[color] || colors.blue;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-header">
          <div className="admin-dashboard-title">
            <FaSpinner className="fa-spin" />
            Đang tải dữ liệu dashboard...
          </div>
          <div className="admin-dashboard-subtitle">
            Vui lòng chờ trong giây lát
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-header">
          <div className="admin-dashboard-title">❌ Lỗi tải dữ liệu</div>
          <div className="admin-dashboard-subtitle">{error}</div>
          <button
            className="admin-dashboard-btn-primary"
            onClick={fetchDashboardData}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* Modern Header */}
      <div className="admin-dashboard-header">
        <div className="admin-dashboard-title">🎯 Trang chủ quản trị viên</div>
        <div className="admin-dashboard-subtitle">
          Chào mừng bạn đến với hệ thống quản lý sức khỏe của trường
        </div>
      </div>

      {/* Modern Stats Cards */}
      <div className="admin-dashboard-stats">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.id}
              className="admin-dashboard-stat-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="admin-dashboard-stat-icon">
                {stat.imageSrc ? (
                  <img
                    src={stat.imageSrc}
                    alt={stat.imageAlt || stat.title}
                    style={{
                      width: "24px",
                      height: "24px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Icon />
                )}
              </div>

              {/* Value */}
              <div className="admin-dashboard-stat-value">{stat.value}</div>

              {/* Label */}
              <div className="admin-dashboard-stat-label">{stat.title}</div>

              {/* Change indicator */}
              {/* <div className={`admin-dashboard-stat-change ${stat.isPositive ? 'positive' : 'negative'}`}>
                {stat.isPositive ? <FaArrowUp /> : <FaArrowDown />}
                {stat.description}
              </div> */}
            </div>
          );
        })}
      </div>

      {/* Modern Charts */}
      <div className="admin-dashboard-charts">
        {/* Medical Supplies Chart */}
        <div className="admin-dashboard-chart-card">
          <div className="admin-dashboard-chart-header">
            <div className="admin-dashboard-chart-title">
              <FaPills />
              Số lượng thuốc trong kho
            </div>
            <div className="admin-dashboard-chart-subtitle">
              Thống kê tồn kho các loại thuốc và vật tư y tế
              {dashboardData?.medicalSupplies
                ? `(${dashboardData.medicalSupplies.length} loại thuốc)`
                : "(Đang tải...)"}
            </div>
          </div>
          <div style={{ padding: "1.5rem" }}>
            {/* Debug info - remove in production */}
            {/* {process.env.NODE_ENV === "development" && (
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#666",
                  marginBottom: "1rem",
                  padding: "0.5rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                }}
              >
                <strong>Debug:</strong> Medical supplies count:{" "}
                {dashboardData?.medicalSupplies?.length || 0}
                {dashboardData?.medicalSupplies?.length > 0 && (
                  <div>
                    First item:{" "}
                    {JSON.stringify(dashboardData.medicalSupplies[0])}
                  </div>
                )}
              </div>
            )} */}

            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={(() => {
                  // Check if we have real data from API
                  if (
                    dashboardData?.medicalSupplies &&
                    dashboardData.medicalSupplies.length > 0
                  ) {
                    return dashboardData.medicalSupplies;
                  }
                  // Fallback data if no real data
                  return [
                    { name: "Bandages", quantity: 94 },
                    { name: "Antiseptic Wipes", quantity: 58 },
                    { name: "Paracetamol", quantity: 200 },
                  ];
                })()}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <defs>
                  <linearGradient
                    id="medicineGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  label={{
                    value: "Số lượng",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    fontSize: "14px",
                  }}
                  formatter={(value, name) => [`${value} đơn vị`, "Số lượng"]}
                  labelFormatter={(label) => `Thuốc: ${label}`}
                />
                <Bar
                  dataKey="quantity"
                  fill="url(#medicineGradient)"
                  name="Số lượng"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Medicine Statistics Summary */}
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                borderRadius: "12px",
                border: "1px solid #bbf7d0",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "1rem",
                  textAlign: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#059669",
                    }}
                  >
                    {dashboardData?.medicalSupplies?.length || 0}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#065f46",
                      fontWeight: "500",
                    }}
                  >
                    Loại thuốc
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#059669",
                    }}
                  >
                    {dashboardData?.medicalSupplies?.reduce(
                      (total, item) => total + (item.quantity || 0),
                      0
                    ) || 0}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#065f46",
                      fontWeight: "500",
                    }}
                  >
                    Tổng số lượng
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#059669",
                    }}
                  >
                    {(() => {
                      if (dashboardData?.medicalSupplies?.length > 0) {
                        const maxQuantity = Math.max(
                          ...dashboardData.medicalSupplies.map(
                            (m) => m.quantity || 0
                          )
                        );
                        const topItem = dashboardData.medicalSupplies.find(
                          (item) => (item.quantity || 0) === maxQuantity
                        );
                        return topItem?.name || "N/A";
                      }
                      return "Chưa có dữ liệu";
                    })()}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#065f46",
                      fontWeight: "500",
                    }}
                  >
                    Nhiều nhất
                  </div>
                </div>
              </div>

              {/* Show message if no data */}
              {(!dashboardData?.medicalSupplies ||
                dashboardData.medicalSupplies.length === 0) && (
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "1rem",
                      padding: "0.5rem",
                      backgroundColor: "rgba(251, 191, 36, 0.1)",
                      borderRadius: "8px",
                      border: "1px solid rgba(251, 191, 36, 0.3)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "#92400e",
                        fontWeight: "500",
                      }}
                    >
                      ⚠️ Chưa có dữ liệu thuốc trong kho
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#a16207",
                        marginTop: "0.25rem",
                      }}
                    >
                      Hãy thêm thuốc vào kho tại trang{" "}
                      <a
                        href="/admin/medicine-inventory"
                        style={{ color: "#059669", textDecoration: "underline" }}
                      >
                        Quản lý kho thuốc
                      </a>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Medication Status Pie Chart */}
        <div className="admin-dashboard-chart-card">
          <div className="admin-dashboard-chart-header">
            <div className="admin-dashboard-chart-title">
              <FaPills />
              Trạng thái đơn thuốc
            </div>
          </div>
          <div style={{ padding: "1.5rem" }}>
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
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    fontSize: "14px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ marginTop: "1rem" }}>
              {medicationStatusData.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: item.color,
                        borderRadius: "50%",
                        marginRight: "0.5rem",
                      }}
                    ></div>
                    <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
                      {item.name}
                    </span>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.875rem" }}>
                      {item.value}
                    </strong>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#94a3b8",
                        marginLeft: "0.25rem",
                      }}
                    >
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Medications Table */}
      <div className="admin-dashboard-pending-medications">
        <div className="admin-dashboard-pending-medications-header">
          <div className="admin-dashboard-pending-medications-title">
            <FaPills />
            Thuốc chờ uống
            {/* ({pendingMedications.length}) */}
          </div>
          <div className="admin-dashboard-pending-medications-subtitle">
            Danh sách học sinh đang có đơn thuốc cần theo dõi
          </div>
        </div>

        {pendingMedications.length === 0 ? (
          <div className="admin-dashboard-no-medications">
            <div className="admin-dashboard-no-medications-icon">
              <FaPills />
            </div>
            <div className="admin-dashboard-no-medications-title">
              Không có thuốc chờ uống
            </div>
            <div className="admin-dashboard-no-medications-description">
              Hiện tại không có học sinh nào đang chờ uống thuốc
            </div>
          </div>
        ) : (
          <div className="admin-dashboard-medications-table-container">
            <table className="admin-dashboard-medications-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên học sinh</th>
                  <th>Lớp</th>
                  <th>Tên thuốc</th>
                  <th>Liều dùng</th>
                  {/* <th>Ghi chú</th> */}
                  <th>Ngày tạo</th>
                  <th>Y tá</th>
                </tr>
              </thead>
              <tbody>
                {pendingMedications.slice(0, 8).map((medication, index) => (
                  <tr key={medication.id}>
                    <td>
                      <div className="admin-dashboard-medication-stt">
                        {index + 1}
                      </div>
                    </td>
                    <td>
                      <div className="admin-dashboard-medication-student">
                        <div className="admin-dashboard-medication-student-name">
                          {medication.studentName}
                        </div>
                        <div className="admin-dashboard-medication-parent">
                          PH: {medication.parentName}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-dashboard-medication-class">
                        {medication.studentClass}
                      </div>
                    </td>
                    <td>
                      <div className="admin-dashboard-medication-name">
                        {/* {medication.medicationName} */}
                        {medication.medications
                          .map((m, index) => m.medicationName)
                          .join(", ")}
                      </div>
                    </td>
                    <td>
                      <div className="admin-dashboard-medication-dosage">
                        {/* {medication.dosage} */}
                        {medication.medications
                          .map((m, index) => m.dosage)
                          .join(", ")}
                      </div>
                    </td>
                    {/* <td>
                      <div
                        className="admin-dashboard-medication-note"
                        title={medication?.note}
                      >
                        {medication?.note?.length > 20
                          ? `${medication.note.substring(0, 20)}...`
                          : medication.note}
                      </div>
                    </td> */}
                    <td>
                      <div className="admin-dashboard-medication-date">
                        {medication.createdDate}
                      </div>
                    </td>
                    <td>
                      <div className="admin-dashboard-medication-nurse">
                        {medication.nurseName}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pendingMedications.length > 8 && (
              <div className="admin-dashboard-medications-table-footer">
                <div className="admin-dashboard-medications-more">
                  Và {pendingMedications.length - 8} đơn thuốc khác...
                </div>
                <a
                  href="/admin/medicines/requests"
                  className="admin-dashboard-btn-secondary"
                >
                  <FaEye className="me-2" />
                  Xem tất cả
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
