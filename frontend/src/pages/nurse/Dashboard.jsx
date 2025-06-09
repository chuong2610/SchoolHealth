import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table, Statistic, Tag, Tabs, Progress, Avatar } from "antd";
import { FaPills, FaClock, FaCalendarAlt, FaUserCheck, FaCheckCircle, FaTimesCircle, FaUserNurse, FaEnvelope } from "react-icons/fa";
import { PieChart, Pie as RePie, Cell, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAuth } from "../../context/AuthContext";
import HealthDeclaration from "./HealthDeclaration";

// import './Dashboard.css';

// Mock nurse profile (bạn có thể lấy từ context nếu có)
const nurseProfile = {
  name: "Nguyễn Thị B",
  role: "Y tá",
  email: "nurse.b@school.edu.vn",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg"
};

const cardStyles = [
  {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    boxShadow: '0 4px 24px 0 rgba(168,237,234,0.12)',
    color: '#1890ff',
    icon: <FaPills size={44} style={{ color: '#1890ff', opacity: 0.18, position: 'absolute', right: 16, bottom: 8 }} />,
    mainIcon: <FaPills size={28} style={{ color: '#1890ff' }} />,
  },
  {
    background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    boxShadow: '0 4px 24px 0 rgba(251,194,235,0.12)',
    color: '#faad14',
    icon: <FaClock size={44} style={{ color: '#faad14', opacity: 0.18, position: 'absolute', right: 16, bottom: 8 }} />,
    mainIcon: <FaClock size={28} style={{ color: '#faad14' }} />,
  },
  {
    background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    boxShadow: '0 4px 24px 0 rgba(246,211,101,0.12)',
    color: '#52c41a',
    icon: <FaCalendarAlt size={44} style={{ color: '#52c41a', opacity: 0.18, position: 'absolute', right: 16, bottom: 8 }} />,
    mainIcon: <FaCalendarAlt size={28} style={{ color: '#52c41a' }} />,
  },
  {
    background: 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)',
    boxShadow: '0 4px 24px 0 rgba(207,217,223,0.12)',
    color: '#13c2c2',
    icon: <FaUserCheck size={44} style={{ color: '#13c2c2', opacity: 0.18, position: 'absolute', right: 16, bottom: 8 }} />,
    mainIcon: <FaUserCheck size={28} style={{ color: '#13c2c2' }} />,
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const nurseId = user?.id;
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [medicineShowAll, setMedicineShowAll] = useState(false);
  const MEDICINE_ROW_LIMIT = 3;

  useEffect(() => {
    if (!nurseId) return;
    const fetchDashboard = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:5182/api/Home/nurse/${nurseId}`);
      const data = await res.json();
      setDashboardData(data.data);
      setLoading(false);
    };
    fetchDashboard();
  }, [nurseId]);

  if (loading || !dashboardData) return <div>Đang tải dashboard...</div>;

  // Map số liệu từ API
  const medicineToTake = dashboardData.activeMedicationsNumber || 0;
  const pendingMedicine = dashboardData.pendingMedicationsNumber || 0;
  const todayAppointments = dashboardData.todayAppointmentsNumber || dashboardData.medicalEvents?.length || 0;
  const newHealthDeclarations = dashboardData.notificationsNumber || 0;

  // Map bảng lịch cho uống thuốc: chỉ lấy học sinh chờ uống
  const medicineSchedule = (dashboardData.medications || [])
    .map(med => ({
      time: med.time || "",
      student: med.studentName,
      class: med.studentClassName,
      medicine: med.medications?.[0]?.medicationName || "",
      status: med.status === "Completed" ? "done" : "pending"
    }))
    .filter(med => med.status !== 'done');

  // Map bảng lịch khám sức khỏe
  const healthCheckSchedule = (dashboardData.medicalEvents || []).map(ev => ({
    time: ev.time || "",
    class: ev.className || "",
    type: ev.type || "",
    status: ev.status === "done" ? "done" : "pending"
  }));

  // Map bảng lịch khám hôm nay
  const todayHealthAppointments = (dashboardData.medicalEvents || []).map(ev => ({
    time: ev.time || "",
    student: ev.studentName || "",
    class: ev.className || "",
    type: ev.type || ""
  }));

  // Pie chart xác nhận thuốc
  const medicineStats = {
    confirmed: dashboardData.completedMedicationsNumber || 0,
    pending: dashboardData.pendingMedicationsNumber || 0
  };
  const pieData = [
    { name: 'Đã xác nhận', value: medicineStats.confirmed, color: '#52c41a' },
    { name: 'Chờ xác nhận', value: medicineStats.pending, color: '#faad14' },
  ];

  // Xác định thứ hiện tại (theo tiếng Anh, trùng với key trong weeklyMedicalEventCounts)
  const today = new Date();
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const todayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1; // getDay: 0=CN, 1=Thứ 2...

  // Chỉ lấy dữ liệu đến ngày hiện tại
  const healthEventData = dashboardData.weeklyMedicalEventCounts ?
    Object.entries(dashboardData.weeklyMedicalEventCounts)
      .map(([day, value], idx) => ({ day, events: value, idx }))
      .filter(d => d.idx <= todayIdx)
      .map(({ day, events }) => ({ day, events }))
    : [];

  // Columns cho bảng
  const medicineColumns = [
    { title: 'Học sinh', dataIndex: 'student', key: 'student', width: 140 },
    { title: 'Lớp', dataIndex: 'class', key: 'class', width: 80 },
    { title: 'Thuốc', dataIndex: 'medicine', key: 'medicine', width: 120 },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 100, render: v => v === 'done' ? <Tag color="green"><FaCheckCircle /> Hoàn thành</Tag> : <Tag color="orange"><FaClock /> Chờ uống</Tag> },
  ];
  const healthCheckColumns = [
    { title: 'Lớp', dataIndex: 'class', key: 'class', width: 80 },
    { title: 'Loại', dataIndex: 'type', key: 'type', width: 120 },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 100, render: v => v === 'done' ? <Tag color="green"><FaCheckCircle /> Đã khám</Tag> : <Tag color="blue"><FaClock /> Chờ khám</Tag> },
  ];
  const todayColumns = [
    { title: 'Học sinh', dataIndex: 'student', key: 'student', width: 140 },
    { title: 'Lớp', dataIndex: 'class', key: 'class', width: 80 },
    { title: 'Loại', dataIndex: 'type', key: 'type', width: 120 },
  ];

  // Custom table header style
  const tableHeaderStyle1 = {
    background: 'linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)',
    color: '#1890ff',
    fontWeight: 700,
    fontSize: 16,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  };
  const tableHeaderStyle2 = {
    background: 'linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%)',
    color: '#faad14',
    fontWeight: 700,
    fontSize: 16,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  };
  const tableHeaderStyle3 = {
    background: 'linear-gradient(90deg, #f6d365 0%, #fda085 100%)',
    color: '#52c41a',
    fontWeight: 700,
    fontSize: 16,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  };
  // const handleRowClick = {HealthDeclaration}=>{
  //   navigate
  // }
  return (
    <div style={{ background: 'linear-gradient(120deg, #f6f8fc 60%, #e0e7ff 100%)', minHeight: '100vh', padding: 32 }}>
      {/* Profile nurse */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col xs={24} md={8} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              background: 'linear-gradient(90deg, #e0e7ff 0%, #f0fdfa 100%)',
              boxShadow: '0 4px 24px 0 rgba(80,120,255,0.08)',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              minHeight: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
            className="profile-card"
            hoverable
            bodyStyle={{ padding: 24, display: 'flex', alignItems: 'center', gap: 24 }}
          >
            <Avatar
              src={nurseProfile.avatar}
              size={80}
              style={{ boxShadow: '0 2px 8px #b5cfff', border: '3px solid #fff' }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: 22, color: '#2d3a4a', marginBottom: 4 }}>{nurseProfile.name}</div>
              <div style={{ color: '#6b7280', fontWeight: 500, fontSize: 16, marginBottom: 4 }}><FaUserNurse style={{ marginRight: 6, color: '#6366f1' }} /> {nurseProfile.role}</div>
              <div style={{ color: '#64748b', fontSize: 15 }}><FaEnvelope style={{ marginRight: 6, color: '#38bdf8' }} /> {nurseProfile.email}</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={16} lg={18}>
          <Row gutter={24}>
            {[{
              title: 'Thuốc cần uống',
              value: medicineToTake,
              icon: cardStyles[0].mainIcon,
              style: cardStyles[0],
              
              
            }, {
              title: 'Thuốc chờ xác nhận',
              value: pendingMedicine,
              icon: cardStyles[1].mainIcon,
              style: cardStyles[1],
            }, {
              title: 'Lịch khám hôm nay',
              value: todayAppointments,
              icon: cardStyles[2].mainIcon,
              style: cardStyles[2],
            }, {
              title: 'Khai báo y tế mới',
              value: newHealthDeclarations,
              icon: cardStyles[3].mainIcon,
              style: cardStyles[3],
            }].map((item, idx) => (
              <Col xs={24} sm={12} md={6} key={item.title}>
                <div style={{ position: 'relative' }}>
                  <Card
                    bordered={false}
                    className="dashboard-card vibrant-card"
                    style={{
                      ...item.style,
                      color: '#222',
                      borderRadius: 18,
                      minHeight: 120,
                      overflow: 'hidden',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer',
                    }}
                    bodyStyle={{ padding: 24, position: 'relative', zIndex: 2 }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {item.icon} {item.title}
                    </div>
                    <Statistic value={item.value} valueStyle={{ fontSize: 32, fontWeight: 800, color: item.style.color }} />
                  </Card>
                  {cardStyles[idx].icon}
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      {/* Row 2: 3 bảng chia đều */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card bordered={false} className="dashboard-table-card" style={{ marginBottom: 24, borderRadius: 18, overflow: 'hidden' }}>
            <div style={tableHeaderStyle1} className="table-header-animated">
              <FaPills style={{ color: '#1890ff', marginRight: 8, fontSize: 20, verticalAlign: 'middle' }} /> Lịch cho uống thuốc
            </div>
            <Table
              columns={medicineColumns}
              dataSource={medicineShowAll ? medicineSchedule : medicineSchedule.slice(0, MEDICINE_ROW_LIMIT)}
              pagination={false}
              size="small"
              rowKey={(r, i) => i}
              className="vibrant-table vibrant-table-1"
            />
            {medicineSchedule.length > MEDICINE_ROW_LIMIT && (
              <div className="text-center mt-2">
                <button className="btn btn-link vibrant-btn" onClick={() => setMedicineShowAll(v => !v)}>
                  {medicineShowAll ? 'Thu gọn' : 'Xem thêm'}
                </button>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} className="dashboard-table-card" style={{ marginBottom: 24, borderRadius: 18, overflow: 'hidden' }}>
            <div style={tableHeaderStyle2} className="table-header-animated">
              <FaCalendarAlt style={{ color: '#faad14', marginRight: 8, fontSize: 20, verticalAlign: 'middle' }} /> Lịch khám sức khỏe
            </div>
            <Table
              columns={healthCheckColumns}
              dataSource={healthCheckSchedule}
              pagination={false}
              size="small"
              rowKey={(r, i) => i}
              className="vibrant-table vibrant-table-2"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} className="dashboard-table-card" style={{ borderRadius: 18, overflow: 'hidden' }}>
            <div style={tableHeaderStyle3} className="table-header-animated">
              <FaCalendarAlt style={{ color: '#52c41a', marginRight: 8, fontSize: 20, verticalAlign: 'middle' }} /> Lịch khám hôm nay
            </div>
            <Table
              columns={todayColumns}
              dataSource={todayHealthAppointments}
              pagination={false}
              size="small"
              rowKey={(r, i) => i}
              className="vibrant-table vibrant-table-3"
            />
          </Card>
        </Col>
      </Row>
      {/* Row 3: Chart tỉ lệ thuốc đã xác nhận/chờ xác nhận và line chart sự kiện y tế */}
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Card bordered={false} className="dashboard-table-card">
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 8 }}><FaPills style={{ color: '#1890ff' }} /> Tỉ lệ xác nhận thuốc</div>
            <div style={{ width: '100%', minHeight: 260 }}>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <RePie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </RePie>
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card bordered={false} className="dashboard-table-card">
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12, color: '#f67280', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaCalendarAlt style={{ color: '#f67280' }} /> Sự kiện y tế trong tuần
            </div>
            <div style={{ width: '100%', minHeight: 260 }}>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={healthEventData} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="day" tick={{ fontWeight: 600, fill: '#8884d8' }} />
                  <YAxis allowDecimals={false} tick={{ fontWeight: 600, fill: '#f67280' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, background: '#fff0f6', color: '#f67280', fontWeight: 600 }} />
                  <Line type="monotone" dataKey="events" stroke="#f67280" strokeWidth={3} dot={{ r: 6, fill: '#fff', stroke: '#f67280', strokeWidth: 3 }} activeDot={{ r: 9, fill: '#f67280', stroke: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
      {/* Hiệu ứng CSS cho profile */}
      <style>{`
        .profile-card:hover {
          transform: translateY(-4px) scale(1.025);
          box-shadow: 0 8px 32px 0 rgba(80,120,255,0.16);
        }
        .dashboard-card, .dashboard-table-card {
          border-radius: 18px !important;
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
        }
        .vibrant-card:hover {
          transform: scale(1.04);
          box-shadow: 0 8px 32px 0 rgba(80,120,255,0.18);
          filter: brightness(1.07);
        }
        .vibrant-table tr {
          transition: background 0.18s, box-shadow 0.18s, border-left 0.18s;
        }
        .vibrant-table-1 tr:hover td {
          background: #e0f7fa !important;
          border-left: 4px solid #1890ff;
          box-shadow: 0 2px 12px 0 rgba(24,144,255,0.08);
        }
        .vibrant-table-2 tr:hover td {
          background: #f3e8ff !important;
          border-left: 4px solid #faad14;
          box-shadow: 0 2px 12px 0 rgba(250,173,20,0.08);
        }
        .vibrant-table-3 tr:hover td {
          background: #fffbe6 !important;
          border-left: 4px solid #52c41a;
          box-shadow: 0 2px 12px 0 rgba(82,196,26,0.08);
        }
        .ant-table-thead > tr > th {
          font-weight: 700;
          font-size: 15px;
          background: transparent !important;
        }
        .table-header-animated {
          padding: 14px 24px 10px 24px;
          letter-spacing: 0.5px;
          animation: fadeInDown 0.7s;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
