import React, { useEffect, useState } from "react";
import {
  FaPills,
  FaClock,
  FaCalendarAlt,
  FaUserCheck,
  FaCheckCircle,
  FaUserNurse,
  FaHeartbeat,
} from "react-icons/fa";
import { PieChart, Pie as RePie, Cell, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import MedicalExaminationFemaleSvg from "../../assets/medical-examination-female-svgrepo-com.svg";
import styles from "./NurseDashboard.module.css";

const Dashboard = () => {
  const { user } = useAuth();
  const nurseId = user?.id;
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const nurseProfile = {
    name: user?.fullName || user?.name || "Y tá",
    role: user?.role || "Y tá",
    email: user?.email || "Chưa cập nhật",
    avatar:
      user?.avatar ||
      "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(user?.fullName || user?.name || "Nurse") +
      "&background=F06292&color=fff&size=200",
  };

  useEffect(() => {
    if (!nurseId) return;
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/Home/nurse/${nurseId}`);
        setDashboardData(res.data.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [nurseId]);

  if (loading || !dashboardData) {
    return (
      <div>
        <div>
          <div></div>
          <div>Đang tải dashboard...</div>
        </div>
      </div>
    );
  }

  const medicineToTake = dashboardData.activeMedicationsNumber || 0;
  const pendingMedicine = dashboardData.pendingMedicationsNumber || 0;
  const todayAppointments =
    dashboardData.todayAppointmentsNumber ||
    dashboardData.medicalEvents?.length ||
    0;
  const newHealthDeclarations = dashboardData.notificationsNumber || 0;

  const medicineSchedule = (dashboardData.medications || [])
    .map((med) => ({
      key: med.id || Math.random(),
      time: med.time || "",
      student: med.studentName,
      class: med.studentClass,
      medicine: med.medications?.[0]?.medicationName || "",
      status: med.status === "Completed" ? "completed" : "pending",
    }))
    .filter((med) => med.status !== "completed");

  const todayHealthAppointments = (dashboardData.medicalEvents || []).map(
    (ev) => ({
      key: ev.id || Math.random(),
      eventType: ev.eventType,
      location: ev.location,
      studentName: ev.studentName,
      date: ev.date,
    })
  );

  const medicineStats = {
    confirmed: dashboardData.completedMedicationsNumber || 0,
    pending: dashboardData.pendingMedicationsNumber || 0,
  };
  const pieData = [
    { name: "Đã xác nhận", value: medicineStats.confirmed, color: "#81C784" },
    { name: "Chờ xác nhận", value: medicineStats.pending, color: "#FFB300" },
  ];

  const today = new Date();
  const todayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const healthEventData = dashboardData.weeklyMedicalEventCounts
    ? Object.entries(dashboardData.weeklyMedicalEventCounts)
      .map(([day, value], idx) => ({
        day:
          day === "Monday"
            ? "T2"
            : day === "Tuesday"
              ? "T3"
              : day === "Wednesday"
                ? "T4"
                : day === "Thursday"
                  ? "T5"
                  : day === "Friday"
                    ? "T6"
                    : day === "Saturday"
                      ? "T7"
                      : "CN",
        events: value,
        idx,
      }))
      .filter((d) => d.idx <= todayIdx)
      .map(({ day, events }) => ({ day, events }))
    : [];

  const medicineColumns = [
    {
      title: "Học sinh",
      dataIndex: "student",
      key: "student",
      width: 130,
      render: (name) => <span>{name}</span>,
    },
    {
      title: "Lớp",
      dataIndex: "class",
      key: "class",
      width: 70,
      render: (className) => (
        <span>{className}</span>
      ),
    },
    {
      title: "Thuốc",
      dataIndex: "medicine",
      key: "medicine",
      width: 120,
      render: (medicine) => <span>{medicine}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status) =>
        status === "completed" ? (
          <span>
            <FaCheckCircle /> Hoàn thành
          </span>
        ) : (
          <span>
            <FaClock /> Chờ uống
          </span>
        ),
    },
  ];

  const todayColumns = [
    {
      title: "Tên sự kiện",
      dataIndex: "eventType",
      key: "eventType",
      render: (eventType) => <span>{eventType}</span>,
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      render: (location) => <span>{location}</span>,
    },
    {
      title: "Tên học sinh",
      dataIndex: "studentName",
      key: "studentName",
      render: (studentName) => <span>{studentName}</span>,
    },
    {
      title: "Thời gian",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <span>
          {date
            ? new Date(date).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            : ""}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.dashboardRoot}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}><FaUserNurse /></span>
          <div>
            <h2 className={styles.headerTitle}>Chào mừng, {nurseProfile.name}</h2>
          </div>
        </div>
        <img src={MedicalExaminationFemaleSvg} alt="Medical Examination" className={styles.headerImg} />
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={`${styles.statCard} ${styles.statCardPink}`}>
          <FaPills className={styles.statIcon} />
          <div>
            <div className={styles.statLabel}>Thuốc cần uống</div>
            <div className={styles.statValue}>{medicineToTake}</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardYellow}`}>
          <FaClock className={styles.statIcon} />
          <div>
            <div className={styles.statLabel}>Thuốc chờ xác nhận</div>
            <div className={styles.statValue}>{pendingMedicine}</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <FaCalendarAlt className={styles.statIcon} />
          <div>
            <div className={styles.statLabel}>Sự kiện hôm nay</div>
            <div className={styles.statValue}>{todayAppointments}</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardOrange}`}>
          <FaUserCheck className={styles.statIcon} />
          <div>
            <div className={styles.statLabel}>Khai báo y tế mới</div>
            <div className={styles.statValue}>{newHealthDeclarations}</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className={styles.flexRow}>
        <div className={styles.flexCol}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}><FaPills /> Tỉ lệ xác nhận thuốc</div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <RePie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5}>
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={idx === 0 ? "#4A90E2" : "#F5A623"} />
                  ))}
                </RePie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={styles.flexCol}>
          <div className={styles.section}>
            <div className={`${styles.sectionHeader} ${styles.sectionHeaderBlue}`}><FaHeartbeat /> Sự kiện y tế trong tuần</div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={healthEventData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="events" fill="#F8BBD9" stroke="#FF6B8D" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Medicine Table */}
      <div className={styles.section} style={{ marginBottom: 24 }}>
        <div className={`${styles.sectionHeader} ${styles.sectionHeaderPink}`}><FaPills /> Lịch cho uống thuốc</div>
        <div className={styles.scrollTableContent}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Học sinh</th>
                <th>Lớp</th>
                <th>Thuốc</th>
                <th>Trạng thái</th>
                {/* <th>Hành động</th> */}
              </tr>
            </thead>
            <tbody>
              {medicineSchedule.length > 0 ? (
                medicineSchedule.map((row) => (
                  <tr key={row.key}>
                    <td>{row.student}</td>
                    <td>{row.class}</td>
                    <td>{row.medicine}</td>
                    <td>
                      {row.status === "completed" ? (
                        <span className={styles.statusCompleted}><FaCheckCircle /> Đã dùng</span>
                      ) : (
                        <span className={styles.statusPending}><FaClock /> Chờ dùng</span>
                      )}
                    </td>
                    {/* <td>
                      <button className={styles.actionBtn} title="Xác nhận"><FaCheckCircle /></button>
                      <button className={styles.actionBtn} title="Từ chối"><span style={{color:'#ff4d4f'}}>✗</span></button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Không có lịch uống thuốc hôm nay.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Today Events as Cards */}
      <div className={styles.section} style={{ background: '#fff', color: '#ff6b8d' }}>
        <div className={styles.sectionHeader} style={{ color: '#ff6b8d' }}><FaCalendarAlt /> Sự kiện hôm nay</div>
        <div className={styles.eventCardRow}>
          {todayHealthAppointments.length > 0 ? (
            todayHealthAppointments.map((ev, idx) => (
              <div
                key={ev.key || idx}
                className={
                  `${styles.eventCard} ` +
                  (idx % 3 === 0
                    ? styles.eventCardYellow
                    : idx % 3 === 1
                      ? styles.eventCardGreen
                      : styles.eventCardRed)
                }
              >
                <div className={styles.eventTitle}>{ev.eventType}</div>
                <div className={styles.eventInfo}>👤 {ev.studentName}</div>
                <div className={styles.eventInfo}>📍 {ev.location}</div>
                <div className={styles.eventTime}>
                  {ev.date
                    ? new Date(ev.date).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    : ""}
                </div>
                {/* <button className={styles.eventBtn}>Xem chi tiết</button> */}
              </div>
            ))
          ) : (
            <div style={{ color: '#ff6b8d', fontWeight: 500 }}>Không có sự kiện nào hôm nay.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
