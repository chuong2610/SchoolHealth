import React from 'react';
import {
    FaUserGraduate,
    FaUserFriends,
    FaUserNurse,
    FaUserShield,
    FaArrowUp,
    FaArrowDown,
    FaBell,
    FaCalendarCheck,
    FaSyringe,
    FaPills
} from 'react-icons/fa';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    // Dummy data for statistics
    const stats = [
        {
            title: 'Học sinh',
            value: '1,250',
            icon: <FaUserGraduate />,
            change: '+5.2%',
            isIncrease: true
        },
        {
            title: 'Phụ huynh',
            value: '2,100',
            icon: <FaUserFriends />,
            change: '+3.1%',
            isIncrease: true
        },
        {
            title: 'Y tá',
            value: '15',
            icon: <FaUserNurse />,
            change: '0%',
            isIncrease: false
        },
        {
            title: 'Quản trị viên',
            value: '5',
            icon: <FaUserShield />,
            change: '+1',
            isIncrease: true
        }
    ];

    // Health trends data
    const healthTrendsData = {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [
            {
                label: 'Số ca bệnh',
                data: [65, 59, 80, 81, 56, 55, 40, 45, 50, 48, 52, 55],
                borderColor: '#F44336',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                tension: 0.4
            },
            {
                label: 'Số ca khỏi bệnh',
                data: [28, 48, 40, 19, 86, 27, 90, 60, 70, 75, 80, 85],
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4
            }
        ]
    };

    // Medicine distribution data
    const medicineData = {
        labels: ['Paracetamol', 'Vitamin C', 'Ibuprofen', 'Amoxicillin'],
        datasets: [{
            data: [35, 25, 20, 20],
            backgroundColor: [
                'rgba(33, 150, 243, 0.8)',
                'rgba(76, 175, 80, 0.8)',
                'rgba(255, 152, 0, 0.8)',
                'rgba(244, 67, 54, 0.8)'
            ],
            borderColor: [
                'rgba(33, 150, 243, 1)',
                'rgba(76, 175, 80, 1)',
                'rgba(255, 152, 0, 1)',
                'rgba(244, 67, 54, 1)'
            ],
            borderWidth: 1
        }]
    };

    // Chart options
    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#fff'
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#fff'
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#fff'
                }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#fff'
                }
            }
        }
    };

    // Recent health records
    const recentRecords = [
        {
            student: 'Nguyễn Văn A',
            class: '10A1',
            status: 'Khỏe mạnh',
            time: '08:00 20/03/2024'
        },
        {
            student: 'Trần Thị B',
            class: '10A2',
            status: 'Có triệu chứng',
            time: '08:15 20/03/2024'
        },
        {
            student: 'Lê Văn C',
            class: '11A1',
            status: 'Khỏe mạnh',
            time: '08:30 20/03/2024'
        }
    ];

    // Dummy data for new tables
    const healthEvents = [
        { name: 'Khám sức khỏe định kỳ', status: 'Chờ duyệt', date: '20/03/2024' },
        { name: 'Tiêm phòng cúm', status: 'Đã duyệt', date: '15/03/2024' },
        { name: 'Khám mắt', status: 'Từ chối', date: '10/03/2024' }
    ];
    const medicineTransactions = {
        total: 2500,
        sent: 1500,
        received: 1000,
        pending: 25
    };
    const notifications = [
        { title: 'Thông báo mới', content: 'Lịch tiêm chủng tháng 3 đã được cập nhật.' },
        { title: 'Cảnh báo tồn kho', content: 'Thuốc Paracetamol sắp hết hàng.' }
    ];

    return (
        <div className="dashboard-container">
            {/* Stats Row */}
            <div className="row g-3 mb-3">
                {stats.map((stat, index) => (
                    <div key={index} className="col-6 col-md-3">
                        <div className="stat-card h-100">
                            <div className="stat-header d-flex justify-content-between align-items-center mb-2">
                                <div className="stat-title">{stat.title}</div>
                                <div className="stat-icon">{stat.icon}</div>
                            </div>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-change" style={{ color: stat.isIncrease ? '#4CAF50' : '#F44336' }}>
                                {stat.isIncrease ? <FaArrowUp /> : <FaArrowDown />} {stat.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Row: Tiêm chủng, Sự kiện y tế, Gửi nhận thuốc, Thông báo mới */}
            <div className="row g-3 mb-3">
                {/* Tiêm chủng */}
                <div className="col-12 col-md-4">
                    <div className="card chart-card h-100">
                        <div className="d-flex align-items-center mb-2">
                            <FaSyringe className="me-2" />
                            <span className="fw-bold">Tiêm chủng</span>
                        </div>
                        <div className="mb-2">1250/1500</div>
                        <div className="progress mb-2" style={{ height: 8 }}>
                            <div className="progress-bar" role="progressbar" style={{ width: '83.3%' }} aria-valuenow={83.3} aria-valuemin={0} aria-valuemax={100}></div>
                        </div>
                        <div className="text-muted" style={{ fontSize: 13 }}>Tỷ lệ hoàn thành: 83.3%</div>
                    </div>
                </div>
                {/* Sự kiện y tế */}
                <div className="col-12 col-md-4">
                    <div className="card chart-card h-100">
                        <div className="d-flex align-items-center mb-2">
                            <FaCalendarCheck className="me-2" />
                            <span className="fw-bold">Sự kiện y tế</span>
                        </div>
                        <div className="mb-2">35 sự kiện</div>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                            <span className="badge bg-warning text-dark">Chờ duyệt: 15</span>
                            <span className="badge bg-success">Đã duyệt: 12</span>
                            <span className="badge bg-danger">Từ chối: 8</span>
                        </div>
                        <ul className="list-unstyled mb-0" style={{ fontSize: 13 }}>
                            {healthEvents.map((e, i) => (
                                <li key={i} className="mb-1">
                                    <span className="fw-semibold">{e.name}</span> - <span>{e.status}</span> <span className="text-muted">({e.date})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* Gửi nhận thuốc */}
                <div className="col-12 col-md-4">
                    <div className="card chart-card h-100">
                        <div className="d-flex align-items-center mb-2">
                            <FaPills className="me-2" />
                            <span className="fw-bold">Gửi nhận thuốc</span>
                        </div>
                        <div className="mb-2" style={{ color: '#4CAF50', fontWeight: 600, fontSize: 18 }}>2500 giao dịch</div>
                        <div className="d-flex flex-column gap-1 mb-2" style={{ fontSize: 13 }}>
                            <span>Đã gửi: <b>{medicineTransactions.sent}</b></span>
                            <span>Đã nhận: <b>{medicineTransactions.received}</b></span>
                            <span>Đang chờ: <b>{medicineTransactions.pending}</b></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row: Thông báo mới */}
            <div className="row g-3 mb-3">
                <div className="col-12 col-md-4">
                    <div className="card chart-card h-100">
                        <div className="d-flex align-items-center mb-2">
                            <FaBell className="me-2" />
                            <span className="fw-bold">Thông báo mới</span>
                        </div>
                        <ul className="list-unstyled mb-0" style={{ fontSize: 13 }}>
                            {notifications.map((n, i) => (
                                <li key={i} className="mb-2">
                                    <span className="fw-semibold">{n.title}:</span> {n.content}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* Biểu đồ đường */}
                <div className="col-12 col-md-8">
                    <div className="card chart-card h-100">
                        <div className="chart-header">
                            <h5 className="chart-title">Thống kê sức khỏe theo tháng</h5>
                        </div>
                        <Line data={healthTrendsData} options={lineOptions} />
                    </div>
                </div>
            </div>

            {/* Row: Biểu đồ tròn + bảng khai báo sức khỏe */}
            <div className="row g-3 mb-3">
                <div className="col-12 col-md-4">
                    <div className="card chart-card h-100">
                        <div className="chart-header">
                            <h5 className="chart-title">Phân bổ thuốc</h5>
                        </div>
                        <Pie data={medicineData} options={pieOptions} />
                    </div>
                </div>
                <div className="col-12 col-md-8">
                    <div className="table-container h-100">
                        <div className="chart-header">
                            <h5 className="chart-title">Khai báo sức khỏe gần đây</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Học sinh</th>
                                        <th>Lớp</th>
                                        <th>Tình trạng</th>
                                        <th>Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentRecords.map((record, index) => (
                                        <tr key={index}>
                                            <td>{record.student}</td>
                                            <td>{record.class}</td>
                                            <td>
                                                <span className={`status-tag ${record.status === 'Khỏe mạnh' ? 'status-healthy' : 'status-sick'}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td>{record.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 