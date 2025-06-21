import { useEffect, useRef, useState } from "react";
import {
    Button,
    Card,
    Col,
    Container,
    Form,
    Modal,
    Row,
    Table,
    Badge,
    Tabs,
    Tab,
    Alert,
} from "react-bootstrap";
import { formatDateTime } from "../../utils/dateFormatter";
import {
    getMedicalEventDetail,
    getMedicalEvents,
    getMedicalSupply,
    postMedicalEvent,
} from "../../api/nurse/healthEventsApi";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
    FaCalendarAlt,
    FaSearch,
    FaPlus,
    FaEye,
    FaTrash,
    FaEdit,
    FaMedkit,
    FaUserGraduate,
    FaMapMarkerAlt,
    FaUserNurse,
    FaCheckCircle,
    FaStickyNote,
    FaList,
    FaStethoscope,
    FaHospital,
    FaUser,
    FaClipboardList,
    FaExclamationTriangle,
    FaClock,
    FaCheckDouble,
    FaChartBar,
    FaBell,
    FaFilter,
    FaDownload,
    FaCapsules,
    FaSpinner,
    FaTimesCircle,
    FaHistory,
    FaHeartbeat,
    FaAmbulance,
    FaNotesMedical
} from 'react-icons/fa';
// CSS được import tự động từ main.jsx

// Force CSS reload with timestamp
const timestamp = Date.now();

const HealthEvents = () => {
    const { user } = useAuth();
    const formRef = useRef(null);
    const [events, setEvents] = useState([]);
    const [modalEvent, setModalEvent] = useState(false);
    const [modalEventDetail, setModalEventDetail] = useState({});
    const [modalAdd, setModalAdd] = useState(false);
    const [medicalSupplies, setMedicalSupplies] = useState([]);
    const [formAdd, setFormAdd] = useState({
        eventType: "",
        location: "",
        description: "",
        studentNumber: "",
        medicalEventSupplys: [{ medicalSupplyId: "", quantity: 1 }],
    });

    // Professional state management
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const [animateStats, setAnimateStats] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        dateFrom: "",
        dateTo: "",
        eventType: "",
        location: "",
        status: ""
    });

    // Search states
    const [searchAll, setSearchAll] = useState("");
    const [searchRecent, setSearchRecent] = useState("");
    const [searchToday, setSearchToday] = useState("");
    const [searchEmergency, setSearchEmergency] = useState("");

    // Show all states
    const [allShowAll, setAllShowAll] = useState(false);
    const [recentShowAll, setRecentShowAll] = useState(false);
    const [todayShowAll, setTodayShowAll] = useState(false);
    const [emergencyShowAll, setEmergencyShowAll] = useState(false);

    const [validated, setValidated] = useState(false);
    const ROW_LIMIT = 5;

    // Professional notification system
    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    // Enhanced export functionality
    const exportToExcel = (data, filename) => {
        try {
            const headers = ["STT", "Loại sự kiện", "Địa điểm", "Ngày", "Học sinh", "Y tá", "Mô tả"];
            const csvContent = [
                headers.join(","),
                ...data.map((event, index) => [
                    index + 1,
                    `"${event.eventType || 'N/A'}"`,
                    `"${event.location || 'N/A'}"`,
                    `"${formatDateTime(event.date) || 'N/A'}"`,
                    `"${event.studentName || 'N/A'}"`,
                    `"${event.nurseName || 'N/A'}"`,
                    `"${event.description || 'N/A'}"`
                ].join(","))
            ].join("\n");

            const BOM = "\uFEFF";
            const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showNotification("Xuất Excel thành công!", "success");
        } catch (error) {
            showNotification("Lỗi khi xuất Excel!", "error");
        }
    };

    // Enhanced filter functionality
    const applyFilters = (data) => {
        return data.filter(event => {
            const eventDate = new Date(event.date);
            const fromDate = filterOptions.dateFrom ? new Date(filterOptions.dateFrom) : null;
            const toDate = filterOptions.dateTo ? new Date(filterOptions.dateTo) : null;

            return (!fromDate || eventDate >= fromDate) &&
                (!toDate || eventDate <= toDate) &&
                (!filterOptions.eventType || event.eventType?.toLowerCase().includes(filterOptions.eventType.toLowerCase())) &&
                (!filterOptions.location || event.location?.toLowerCase().includes(filterOptions.location.toLowerCase()));
        });
    };

    const clearFilters = () => {
        setFilterOptions({
            dateFrom: "",
            dateTo: "",
            eventType: "",
            location: "",
            status: ""
        });
        showNotification("Đã xóa bộ lọc", "info");
    };

    // Data filtering
    const today = new Date().toDateString();
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const allEvents = applyFilters(events).filter(event =>
        event.eventType?.toLowerCase().includes(searchAll.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchAll.toLowerCase()) ||
        event.studentName?.toLowerCase().includes(searchAll.toLowerCase()) ||
        event.nurseName?.toLowerCase().includes(searchAll.toLowerCase())
    );

    const recentEvents = applyFilters(events).filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= lastWeek && (
            event.eventType?.toLowerCase().includes(searchRecent.toLowerCase()) ||
            event.location?.toLowerCase().includes(searchRecent.toLowerCase()) ||
            event.studentName?.toLowerCase().includes(searchRecent.toLowerCase()) ||
            event.nurseName?.toLowerCase().includes(searchRecent.toLowerCase())
        );
    });

    const todayEvents = applyFilters(events).filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === today && (
            event.eventType?.toLowerCase().includes(searchToday.toLowerCase()) ||
            event.location?.toLowerCase().includes(searchToday.toLowerCase()) ||
            event.studentName?.toLowerCase().includes(searchToday.toLowerCase()) ||
            event.nurseName?.toLowerCase().includes(searchToday.toLowerCase())
        );
    });

    const emergencyEvents = applyFilters(events).filter(event => {
        const isEmergency = event.eventType?.toLowerCase().includes('cấp cứu') ||
            event.eventType?.toLowerCase().includes('khẩn') ||
            event.description?.toLowerCase().includes('cấp cứu') ||
            event.description?.toLowerCase().includes('khẩn');
        return isEmergency && (
            event.eventType?.toLowerCase().includes(searchEmergency.toLowerCase()) ||
            event.location?.toLowerCase().includes(searchEmergency.toLowerCase()) ||
            event.studentName?.toLowerCase().includes(searchEmergency.toLowerCase()) ||
            event.nurseName?.toLowerCase().includes(searchEmergency.toLowerCase())
        );
    });

    // Statistics
    const totalEvents = events.length;
    const totalRecent = recentEvents.length;
    const totalToday = todayEvents.length;
    const totalEmergency = emergencyEvents.length;

    // Original handlers with enhanced error handling
    const handleChangeSelect = (idx, value) => {
        const updatedSupplys = [...formAdd.medicalEventSupplys];
        updatedSupplys[idx] = {
            quantity: 1,
            medicalSupplyId: value === "" ? "" : parseInt(value),
        };
        setFormAdd((prev) => ({
            ...prev,
            medicalEventSupplys: updatedSupplys,
        }));
    };

    const handleChangeQuantity = (idx, value) => {
        const updatedSupplys = [...formAdd.medicalEventSupplys];
        const selectedSupply = updatedSupplys[idx];

        if (value === "" || isNaN(parseInt(value))) {
            updatedSupplys[idx] = {
                ...selectedSupply,
                quantity: 1,
            };
        } else {
            const maxQuantity =
                medicalSupplies.find(
                    (m) => String(m.id) === String(selectedSupply.medicalSupplyId)
                )?.quantity || 999;

            updatedSupplys[idx] = {
                ...selectedSupply,
                quantity: Math.min(Math.max(1, parseInt(value)), maxQuantity),
            };
        }

        setFormAdd((prev) => ({
            ...prev,
            medicalEventSupplys: updatedSupplys,
        }));
    };

    const handleRemoveSupply = (idx) => {
        const updatedSupplys = [...formAdd.medicalEventSupplys].filter(
            (_, i) => i !== idx
        );
        setFormAdd({ ...formAdd, medicalEventSupplys: updatedSupplys });
    };

    const handleAddSupply = () => {
        const updatedSupplys = [...formAdd.medicalEventSupplys, { medicalSupplyId: "", quantity: 1 }];
        setFormAdd({ ...formAdd, medicalEventSupplys: updatedSupplys });
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const form = formRef.current;

        if (!form.checkValidity()) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            // Validate required fields according to API
            if (!formAdd.eventType || formAdd.eventType.trim() === "") {
                showNotification("Vui lòng chọn loại sự kiện!", "error");
                return;
            }

            if (!formAdd.location || formAdd.location.trim() === "") {
                showNotification("Vui lòng chọn địa điểm!", "error");
                return;
            }

            if (!formAdd.description || formAdd.description.trim() === "") {
                showNotification("Vui lòng nhập mô tả sự kiện!", "error");
                return;
            }

            // Validate nurse ID
            if (!user?.id || isNaN(parseInt(user.id))) {
                showNotification("Không xác định được thông tin y tá!", "error");
                return;
            }

            // Filter out empty medical supplies - keep only valid ones
            const validSupplies = formAdd.medicalEventSupplys.filter(supply =>
                supply.medicalSupplyId &&
                supply.medicalSupplyId !== "" &&
                !isNaN(parseInt(supply.medicalSupplyId)) &&
                supply.quantity > 0 &&
                !isNaN(parseInt(supply.quantity))
            );

            // No validation error for medical supplies - they're optional

            // Check if studentNumber is provided and not empty
            const hasStudentNumber = formAdd.studentNumber.trim() !== "";

            // Prepare data exactly as API expects
            const data = {
                eventType: formAdd.eventType,
                location: formAdd.location,
                description: formAdd.description,
                date: new Date().toISOString(),
                medicalEventSupplys: validSupplies.length > 0 ? validSupplies.map(supply => ({
                    medicalSupplyId: parseInt(supply.medicalSupplyId),
                    quantity: parseInt(supply.quantity)
                })) : [
                    {
                        medicalSupplyId: 0,
                        quantity: 0
                    }
                ],
                nurseId: parseInt(user.id)
            };

            // Only include studentNumber if provided (backend might require existing student)
            if (hasStudentNumber) {
                data.studentNumber = formAdd.studentNumber.trim();
            } else {
                // Try empty string for general events
                data.studentNumber = "";
            }

            const res = await postMedicalEvent(data);
            showNotification("Thêm sự kiện thành công!", "success");
            setModalAdd(false);
            resetFormAdd();

            // Refresh data
            const updatedEvents = await getMedicalEvents();
            setEvents(updatedEvents);
        } catch (error) {

            // More detailed error handling
            let errorMessage = "Lỗi khi thêm sự kiện!";

            if (error.response?.status === 500) {
                if (hasStudentNumber) {
                    errorMessage = `❌ Lỗi: Mã học sinh "${formAdd.studentNumber.trim()}" không tồn tại trong hệ thống!`;
                } else {
                    errorMessage = "❌ Lỗi: Không thể tạo sự kiện chung. Vui lòng thử với mã học sinh hợp lệ.";
                }
            } else if (error.response?.data?.message) {
                errorMessage = `❌ Lỗi: ${error.response.data.message}`;
            } else if (error.message) {
                errorMessage = `❌ Lỗi: ${error.message}`;
            }

            showNotification(errorMessage, "error");
        }
    };

    const resetFormAdd = () => {
        setFormAdd({
            eventType: "",
            location: "",
            description: "",
            studentNumber: "",
            medicalEventSupplys: [{ medicalSupplyId: "", quantity: 1 }],
        });
        setValidated(false);
    };

    const fetchMedicalSupply = async () => {
        try {
            const res = await getMedicalSupply();
            setMedicalSupplies(res || []);
            setModalAdd(true);
        } catch (error) {
            showNotification("Lỗi khi tải danh sách vật tư!", "error");
        }
    };

    const loadMedicalEventDetailModal = async (eventId) => {
        try {
            setDetailLoading(true);
            const res = await getMedicalEventDetail(eventId);
            setModalEventDetail(res || {});
            setModalEvent(true);
        } catch (error) {
            showNotification("Lỗi khi tải chi tiết sự kiện!", "error");
        } finally {
            setDetailLoading(false);
        }
    };

    // Enhanced action buttons
    const renderActionButtons = (event) => (
        <div className="medicine-action-buttons" style={{
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap'
        }}>
            <button
                className="btn-action view"
                onClick={() => loadMedicalEventDetailModal(event.id)}
                title="Xem chi tiết"
                style={{
                    background: 'linear-gradient(135deg, #F06292, #E91E63)',
                    border: '1px solid #F06292',
                    color: 'white',
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(240, 98, 146, 0.25)',
                    outline: 'none'
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #E91E63, #C2185B)';
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 3px 10px rgba(240, 98, 146, 0.35)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #F06292, #E91E63)';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 6px rgba(240, 98, 146, 0.25)';
                }}
            >
                <FaEye />
            </button>
        </div>
    );

    // Professional table renderer
    const renderTable = (data, type, searchValue, setSearch, showAll, setShowAll) => (
        <div className="medicine-table-container">
            <div className="table-header">
                <div className="search-container">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Tìm kiếm theo loại sự kiện, địa điểm, học sinh..."
                            value={searchValue}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="action-buttons">
                        <Button
                            variant="outline-secondary"
                            className="filter-btn"
                            onClick={() => setShowFilterModal(true)}
                        >
                            <FaFilter /> Lọc
                        </Button>
                        <Button
                            variant="outline-success"
                            className="export-btn"
                            onClick={() => {
                                const filename = type === "all" ? "tat-ca-su-kien" :
                                    type === "recent" ? "su-kien-gan-day" :
                                        type === "today" ? "su-kien-hom-nay" : "su-kien-cap-cuu";
                                exportToExcel(data, filename);
                            }}
                        >
                            <FaDownload /> Xuất Excel
                        </Button>
                    </div>
                </div>
            </div>

            <div className="table-responsive medicine-table-wrapper" style={{ overflowX: 'auto', width: '100%', maxWidth: '100%' }}>
                <Table className="medicine-table" style={{ width: '100%', tableLayout: 'fixed', minWidth: '1000px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>Loại sự kiện</th>
                            <th style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>Địa điểm</th>
                            <th style={{ width: '140px', minWidth: '140px', maxWidth: '140px' }}>Ngày thực hiện</th>
                            <th style={{ width: '130px', minWidth: '130px', maxWidth: '130px' }}>Học sinh</th>
                            <th style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>Y tá</th>
                            <th style={{ width: '200px', minWidth: '200px', maxWidth: '200px' }}>Mô tả</th>
                            <th style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(showAll ? data : data.slice(0, ROW_LIMIT)).map((event, index) => (
                            <tr key={event.id || `event-${index}`} className="table-row">
                                <td style={{ width: '150px', minWidth: '150px', maxWidth: '150px' }}>
                                    <div className="medicine-id">
                                        <FaHeartbeat className="medicine-icon pill-bounce" />
                                        {event.eventType || 'N/A'}
                                    </div>
                                </td>
                                <td style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
                                    <Badge bg="secondary" className="class-badge">
                                        <FaMapMarkerAlt className="me-1" />
                                        {event.location || 'N/A'}
                                    </Badge>
                                </td>
                                <td style={{ width: '140px', minWidth: '140px', maxWidth: '140px' }}>
                                    <div className="date-info">
                                        <FaCalendarAlt className="date-icon" />
                                        {formatDateTime(event.date) || 'N/A'}
                                    </div>
                                </td>
                                <td style={{ width: '130px', minWidth: '130px', maxWidth: '130px' }}>
                                    <div className="student-info">
                                        <FaUser className="me-1" />
                                        <strong>{event.studentName || 'N/A'}</strong>
                                    </div>
                                </td>
                                <td style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
                                    <div className="parent-info">
                                        <FaUserNurse className="me-1" />
                                        {event.nurseName || 'N/A'}
                                    </div>
                                </td>
                                <td style={{ width: '200px', minWidth: '200px', maxWidth: '200px' }}>
                                    <div className="medicine-info">
                                        <FaNotesMedical className="me-1" />
                                        <span title={event.description}>{(event.description || 'N/A').substring(0, 50)}...</span>
                                    </div>
                                </td>
                                <td style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>{renderActionButtons(event)}</td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center empty-state">
                                    <div className="empty-content">
                                        <FaCalendarAlt className="empty-icon" />
                                        <p>Không có sự kiện nào</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {data.length > ROW_LIMIT && (
                <div className="table-footer">
                    <Button
                        variant="link"
                        className="show-more-btn"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? 'Thu gọn' : `Xem thêm ${data.length - ROW_LIMIT} sự kiện`}
                    </Button>
                </div>
            )}
        </div>
    );

    useEffect(() => {
        const fetchMedicalEvents = async () => {
            try {
                setLoading(true);
                const res = await getMedicalEvents();
                setEvents(res || []);

                // Trigger animations
                setTimeout(() => setAnimateStats(true), 100);
            } catch (error) {
                showNotification("Lỗi khi tải dữ liệu!", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchMedicalEvents();
    }, []);

    return (
        <div
            className="container-fluid nurse-theme medicine-management"
            style={{
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                backgroundColor: "#f8f9fc",
                minHeight: "100vh",
                position: "relative",
                zIndex: 1
            }}
        >
            {/* Updated CSS Styles with Pink Theme */}
            <style>
                {`
                    .medicine-management {
                        background: linear-gradient(135deg, #f8f9fc 0%, #fce4ec 100%) !important;
                        min-height: 100vh !important;
                        padding: 0 !important;
                    }
                    
                    .page-header {
                        background: linear-gradient(135deg, #F8BBD9 0%, #F06292 50%, #E91E63 100%) !important;
                        color: white !important;
                        padding: 2rem 2rem 3rem 2rem !important;
                        margin: 0rem -1.5rem 2rem -1.5rem !important;
                        border-radius: 0 0 20px 20px !important;
                        position: relative !important;
                        overflow: hidden !important;
                    }
                    
                    .stats-card {
                        background: white !important;
                        border-radius: 16px !important;
                        box-shadow: 0 8px 32px rgba(240, 98, 146, 0.08) !important;
                        border: none !important;
                        overflow: hidden !important;
                        transition: all 0.3s ease !important;
                        position: relative !important;
                    }
                    
                    .stats-card:hover {
                        transform: translateY(-4px) !important;
                        box-shadow: 0 16px 48px rgba(240, 98, 146, 0.15) !important;
                    }
                    
                    /* Enhanced Table Styling */
                    .medicine-table {
                        margin: 0 !important;
                        border: none !important;
                        background: white !important;
                        border-radius: 12px !important;
                        overflow: hidden !important;
                        box-shadow: 0 4px 20px rgba(240, 98, 146, 0.08) !important;
                    }
                    
                    .medicine-table thead th {
                        background: linear-gradient(135deg, #F06292 0%, #E91E63 50%, #C2185B 100%) !important;
                        color: white !important;
                        font-weight: 600 !important;
                        font-size: 0.85rem !important;
                        text-transform: uppercase !important;
                        letter-spacing: 0.5px !important;
                        padding: 1.25rem 1rem !important;
                        border: none !important;
                        position: sticky !important;
                        top: 0 !important;
                        z-index: 10 !important;
                        box-shadow: 0 2px 4px rgba(240, 98, 146, 0.2) !important;
                    }
                    
                    .medicine-table tbody td {
                        padding: 1.2rem 1rem !important;
                        border-bottom: 1px solid #fce4ec !important;
                        vertical-align: middle !important;
                        border-left: none !important;
                        border-right: none !important;
                        background: white !important;
                        transition: all 0.3s ease !important;
                        position: relative !important;
                    }
                    
                    .medicine-table .table-row:nth-child(even) {
                        background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 5%) !important;
                    }
                    
                    .medicine-table .table-row:hover {
                        background: linear-gradient(135deg, #f8bbd9 0%, #f06292 10%) !important;
                        transform: translateY(-2px) !important;
                        box-shadow: 0 8px 25px rgba(240, 98, 146, 0.15) !important;
                        border-radius: 8px !important;
                    }
                    
                    .medicine-table .table-row:hover td {
                        color: #4a1a2a !important;
                        font-weight: 500 !important;
                    }
                    
                    /* Enhanced Table Container */
                    .medicine-table-wrapper {
                        border-radius: 12px !important;
                        overflow: hidden !important;
                        box-shadow: 0 4px 20px rgba(240, 98, 146, 0.08) !important;
                        border: 2px solid #fce4ec !important;
                    }
                    
                    .medicine-table-container {
                        background: white !important;
                        border-radius: 16px !important;
                        padding: 1.5rem !important;
                        margin-bottom: 2rem !important;
                        box-shadow: 0 8px 32px rgba(240, 98, 146, 0.08) !important;
                    }
                    
                    /* Enhanced Medicine Tabs */
                    .medicine-tabs {
                        background: white !important;
                        border-radius: 16px !important;
                        box-shadow: 0 8px 32px rgba(240, 98, 146, 0.08) !important;
                        overflow: hidden !important;
                        border: none !important;
                    }
                    
                    .medicine-tabs .nav-tabs {
                        background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%) !important;
                        border-bottom: none !important;
                        padding: 1rem 1.5rem 0 1.5rem !important;
                    }
                    
                    /* Enhanced Action Buttons */
                    .btn-action {
                        width: 32px !important;
                        height: 32px !important;
                        padding: 6px !important;
                        margin: 0 2px !important;
                        display: inline-flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        border-radius: 8px !important;
                        border: 1px solid !important;
                        transition: all 0.3s ease !important;
                        font-size: 14px !important;
                        position: relative !important;
                    }
                    
                    .btn-action.view {
                        background: linear-gradient(135deg, #F06292, #E91E63) !important;
                        border: 1px solid #F06292 !important;
                        color: white !important;
                        box-shadow: 0 2px 8px rgba(240, 98, 146, 0.3) !important;
                    }
                    
                    .btn-action.view:hover {
                        background: linear-gradient(135deg, #E91E63, #C2185B) !important;
                        transform: scale(1.1) !important;
                        box-shadow: 0 4px 15px rgba(240, 98, 146, 0.4) !important;
                    }
                    
                    .btn-action svg {
                        font-size: 16px !important;
                        width: 16px !important;
                        height: 16px !important;
                    }
                    
                    /* Enhanced Stats Cards */
                    .stats-card.pending .stats-icon {
                        background: linear-gradient(135deg, #F8BBD9 0%, #F06292 100%) !important;
                        color: white !important;
                        border-radius: 12px !important;
                        width: 50px !important;
                        height: 50px !important;
                    }
                    
                    .stats-card.active .stats-icon {
                        background: linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 100%) !important;
                        color: #E91E63 !important;
                        border-radius: 12px !important;
                        width: 50px !important;
                        height: 50px !important;
                    }
                    
                    .stats-card.today .stats-icon {
                        background: linear-gradient(135deg, #FF4081 0%, #F06292 100%) !important;
                        color: white !important;
                        border-radius: 12px !important;
                        width: 50px !important;
                        height: 50px !important;
                    }
                    
                    .stats-card.completed .stats-icon {
                        background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%) !important;
                        color: white !important;
                        border-radius: 12px !important;
                        width: 50px !important;
                        height: 50px !important;
                    }
                    
                    /* Enhanced Tab Navigation */
                    .nurse-theme .nav-tabs .nav-link {
                        border: none !important;
                        border-radius: 12px 12px 0 0 !important;
                        margin-right: 0.5rem !important;
                        padding: 1rem 1.5rem !important;
                        font-weight: 600 !important;
                        color: #666 !important;
                        background: transparent !important;
                        transition: all 0.3s ease !important;
                    }
                    
                    .nurse-theme .nav-tabs .nav-link.active {
                        background: white !important;
                        color: #E91E63 !important;
                        border-bottom: 3px solid #F06292 !important;
                        box-shadow: 0 -4px 16px rgba(240, 98, 146, 0.1) !important;
                        border-radius: 12px 12px 0 0 !important;
                    }
                    
                    .nurse-theme .nav-tabs .nav-link:hover {
                        color: #F06292 !important;
                        background: rgba(248, 187, 217, 0.3) !important;
                        border-radius: 12px 12px 0 0 !important;
                    }
                    
                    .nurse-theme .tab-content {
                        padding: 2rem !important;
                        background: white !important;
                    }
                    
                    .nurse-theme .card {
                        border: none !important;
                        box-shadow: 0 8px 32px rgba(240, 98, 146, 0.08) !important;
                    }
                    
                    .nurse-theme .btn {
                        border-radius: 8px !important;
                        font-weight: 600 !important;
                        transition: all 0.3s ease !important;
                    }
                    
                    /* Enhanced Form Controls */
                    .nurse-theme .form-control {
                        border: 2px solid #fce4ec !important;
                        border-radius: 10px !important;
                        background: #ffffff !important;
                        transition: all 0.3s ease !important;
                        padding: 0.75rem 1rem !important;
                    }
                    
                    .nurse-theme .form-control:focus {
                        border-color: #F06292 !important;
                        box-shadow: 0 0 0 3px rgba(240, 98, 146, 0.1) !important;
                        background: #fefefe !important;
                    }
                    
                    .nurse-theme .form-select {
                        border: 2px solid #fce4ec !important;
                        border-radius: 10px !important;
                        padding: 0.75rem 1rem !important;
                        transition: all 0.3s ease !important;
                    }
                    
                    .nurse-theme .form-select:focus {
                        border-color: #F06292 !important;
                        box-shadow: 0 0 0 3px rgba(240, 98, 146, 0.1) !important;
                    }
                    
                    /* Enhanced Search and Filter */
                    .search-input {
                        border: 2px solid #fce4ec !important;
                        border-radius: 25px !important;
                        padding: 0.75rem 1rem 0.75rem 3rem !important;
                        background: white !important;
                        transition: all 0.3s ease !important;
                    }
                    
                    .search-input:focus {
                        border-color: #F06292 !important;
                        box-shadow: 0 0 0 3px rgba(240, 98, 146, 0.1) !important;
                        background: #fefefe !important;
                    }
                    
                    .search-box {
                        position: relative !important;
                        flex: 1 !important;
                    }
                    
                    .search-icon {
                        position: absolute !important;
                        left: 1rem !important;
                        top: 50% !important;
                        transform: translateY(-50%) !important;
                        color: #F06292 !important;
                        z-index: 5 !important;
                    }
                    
                    .filter-btn {
                        border: 2px solid #F06292 !important;
                        color: #F06292 !important;
                        border-radius: 10px !important;
                        padding: 0.75rem 1.5rem !important;
                        font-weight: 600 !important;
                        transition: all 0.3s ease !important;
                    }
                    
                    .filter-btn:hover {
                        background: linear-gradient(135deg, #F06292, #E91E63) !important;
                        color: white !important;
                        transform: translateY(-2px) !important;
                        box-shadow: 0 4px 15px rgba(240, 98, 146, 0.3) !important;
                    }
                    
                    .export-btn {
                        border: 2px solid #4CAF50 !important;
                        color: #4CAF50 !important;
                        border-radius: 10px !important;
                        padding: 0.75rem 1.5rem !important;
                        font-weight: 600 !important;
                        transition: all 0.3s ease !important;
                    }
                    
                    .export-btn:hover {
                        background: linear-gradient(135deg, #4CAF50, #388E3C) !important;
                        color: white !important;
                        transform: translateY(-2px) !important;
                        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3) !important;
                    }
                    
                    /* Enhanced Modal Styling */
                    .medicine-detail-modal .modal-content {
                        border: none !important;
                        border-radius: 20px !important;
                        box-shadow: 0 25px 80px rgba(240, 98, 146, 0.2) !important;
                        overflow: hidden !important;
                    }
                    
                    .modal-header-custom {
                        background: linear-gradient(135deg, #F8BBD9 0%, #F06292 50%, #E91E63 100%) !important;
                        color: white !important;
                        padding: 1.5rem 2rem !important;
                        border-bottom: none !important;
                    }
                    
                    .modal-body-custom {
                        background: linear-gradient(135deg, #fefefe 0%, #fce4ec 100%) !important;
                        padding: 2rem !important;
                    }
                    
                    .modal-footer-custom {
                        background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%) !important;
                        border-top: none !important;
                        padding: 1.5rem 2rem !important;
                    }
                    
                    .detail-content {
                        background: white !important;
                        border-radius: 12px !important;
                        padding: 1.5rem !important;
                        box-shadow: 0 4px 20px rgba(240, 98, 146, 0.08) !important;
                    }
                    
                    .detail-section {
                        margin-bottom: 1.5rem !important;
                        padding: 1rem !important;
                        background: linear-gradient(135deg, #fefefe 0%, #fce4ec 100%) !important;
                        border-radius: 10px !important;
                        border: 1px solid #f8bbd9 !important;
                    }
                    
                    .detail-section h6 {
                        color: #F06292 !important;
                        font-weight: 700 !important;
                        margin-bottom: 1rem !important;
                        display: flex !important;
                        align-items: center !important;
                        gap: 0.5rem !important;
                    }
                    
                    .detail-row {
                        display: flex !important;
                        justify-content: space-between !important;
                        padding: 0.5rem 0 !important;
                        border-bottom: 1px solid #fce4ec !important;
                    }
                    
                    .detail-row .label {
                        font-weight: 600 !important;
                        color: #E91E63 !important;
                        min-width: 120px !important;
                    }
                    
                    .detail-row .value {
                        color: #4a1a2a !important;
                        font-weight: 500 !important;
                    }
                    
                    /* Enhanced Icons and Badges */
                    .medicine-id .medicine-icon {
                        color: #F06292 !important;
                        animation: pulse 2s infinite !important;
                    }
                    
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                    
                    .date-icon {
                        color: #F06292 !important;
                    }
                    
                    .tab-badge {
                        background: linear-gradient(135deg, #F06292, #E91E63) !important;
                        color: white !important;
                        border-radius: 12px !important;
                        padding: 0.25rem 0.75rem !important;
                        font-weight: 600 !important;
                    }
                    
                    .show-more-btn {
                        color: #F06292 !important;
                        text-decoration: none !important;
                        font-weight: 600 !important;
                        padding: 0.5rem 1rem !important;
                        border-radius: 8px !important;
                        transition: all 0.3s ease !important;
                    }
                    
                    .show-more-btn:hover {
                        color: white !important;
                        background: linear-gradient(135deg, #F06292, #E91E63) !important;
                        text-decoration: none !important;
                        transform: translateY(-2px) !important;
                    }
                    
                    .loading-icon {
                        color: #F06292 !important;
                        font-size: 2rem !important;
                    }
                    
                    .empty-icon {
                        color: #F8BBD9 !important;
                        font-size: 3rem !important;
                    }
                    
                    .empty-content {
                        text-align: center !important;
                        padding: 2rem !important;
                        color: #999 !important;
                    }
                    
                    /* Force responsive design */
                    .nurse-theme .container-fluid {
                        padding-left: 15px !important;
                        padding-right: 15px !important;
                    }
                    
                    @media (max-width: 768px) {
                        .nurse-theme .medicine-table thead th {
                            font-size: 0.75rem !important;
                            padding: 0.75rem 0.5rem !important;
                        }
                        
                        .nurse-theme .medicine-table tbody td {
                            padding: 0.75rem 0.5rem !important;
                            font-size: 0.85rem !important;
                        }
                        
                        .nurse-theme .btn-action {
                            width: 28px !important;
                            height: 28px !important;
                            font-size: 12px !important;
                        }
                        
                        .nurse-theme .btn-action svg {
                            font-size: 14px !important;
                        }
                    }
                `}
            </style>

            {/* Notification */}
            {notification && (
                <Alert
                    variant={notification.type === "error" ? "danger" : notification.type}
                    className="notification-alert"
                    dismissible
                    onClose={() => setNotification(null)}
                >
                    {notification.message}
                </Alert>
            )}

            {/* Page Header */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="page-title">
                            <FaHeartbeat className="page-icon" />
                            <h1>Quản lý Sự kiện Y tế</h1>
                        </div>
                        <p className="page-subtitle">
                            Theo dõi và quản lý các sự kiện y tế trong trường
                        </p>
                    </div>
                    <div className="header-right">
                        <div className="quick-stats">
                            <div className="stat-item pending">
                                <FaCalendarAlt className="stat-icon" />
                                <span className="stat-value">{totalEvents}</span>
                                <span className="stat-label">Tổng sự kiện</span>
                            </div>
                            <div className="stat-item active">
                                <FaClock className="stat-icon" />
                                <span className="stat-value">{totalRecent}</span>
                                <span className="stat-label">Gần đây</span>
                            </div>
                            <div className="stat-item completed">
                                <FaExclamationTriangle className="stat-icon" />
                                <span className="stat-value">{totalEmergency}</span>
                                <span className="stat-label">Cấp cứu</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Dashboard */}
            <div className="stats-dashboard">
                <div className="row">
                    <div className="col-xl-3 col-md-6 mb-4">
                        <div className={`stats-card pending ${animateStats ? 'animate-in' : ''}`}
                            style={{ animationDelay: '0.1s' }}>
                            <div className="card-body">
                                <div className="stats-content">
                                    <div className="stats-icon pulse-animation">
                                        <FaCalendarAlt />
                                    </div>
                                    <div className="stats-info">
                                        <div className={`stats-number ${animateStats ? 'count-up' : ''}`}>{totalEvents}</div>
                                        <div className="stats-label">Tổng sự kiện</div>
                                    </div>
                                </div>
                                <div className="stats-footer">
                                    <FaList className="footer-icon bounce-subtle" />
                                    <span>Tất cả sự kiện</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6 mb-4">
                        <div className={`stats-card active ${animateStats ? 'animate-in' : ''}`}
                            style={{ animationDelay: '0.2s' }}>
                            <div className="card-body">
                                <div className="stats-content">
                                    <div className="stats-icon">
                                        <FaHistory />
                                    </div>
                                    <div className="stats-info">
                                        <div className={`stats-number ${animateStats ? 'count-up' : ''}`}>{totalRecent}</div>
                                        <div className="stats-label">Gần đây</div>
                                    </div>
                                </div>
                                <div className="stats-footer">
                                    <FaClock className="footer-icon tick-animation" />
                                    <span>7 ngày qua</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6 mb-4">
                        <div className={`stats-card today ${animateStats ? 'animate-in' : ''}`}
                            style={{ animationDelay: '0.3s' }}>
                            <div className="card-body">
                                <div className="stats-content">
                                    <div className="stats-icon">
                                        <FaCalendarAlt className="calendar-flip" />
                                    </div>
                                    <div className="stats-info">
                                        <div className={`stats-number ${animateStats ? 'count-up' : ''}`}>{totalToday}</div>
                                        <div className="stats-label">Hôm nay</div>
                                    </div>
                                </div>
                                <div className="stats-footer">
                                    <FaChartBar className="footer-icon chart-grow" />
                                    <span>Sự kiện trong ngày</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="col-xl-3 col-md-6 mb-4">
                        <div className={`stats-card completed ${animateStats ? 'animate-in' : ''}`}
                            style={{ animationDelay: '0.4s' }}>
                            <div className="card-body">
                                <div className="stats-content">
                                    <div className="stats-icon">
                                        <FaAmbulance className="check-animation" />
                                    </div>
                                    <div className="stats-info">
                                        <div className={`stats-number ${animateStats ? 'count-up' : ''}`}>{totalEmergency}</div>
                                        <div className="stats-label">Cấp cứu</div>
                                    </div>
                                </div>
                                <div className="stats-footer">
                                    <FaExclamationTriangle className="footer-icon" />
                                    <span>Cần ưu tiên</span>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>

            {/* Add Event Button */}
            <div className="mb-4 text-end">
                <Button
                    variant="success"
                    size="lg"
                    onClick={() => fetchMedicalSupply()}
                    style={{
                        background: "linear-gradient(135deg, #F06292, #E91E63)",
                        border: "none",
                        borderRadius: "25px",
                        padding: "12px 30px",
                        fontWeight: "600",
                        boxShadow: "0 4px 15px rgba(240, 98, 146, 0.3)"
                    }}
                >
                    <FaPlus className="me-2" /> Thêm Sự kiện Y tế
                </Button>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {loading ? (
                    <div className="loading-container">
                        <FaSpinner className="fa-spin loading-icon" />
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <Tabs
                        activeKey={activeTab}
                        onSelect={setActiveTab}
                        className="medicine-tabs"
                    >
                        <Tab
                            eventKey="all"
                            title={
                                <div className="tab-title pending">
                                    <FaList className="tab-icon" />
                                    <span>Tất cả</span>
                                    <Badge bg="primary" className="tab-badge">{totalEvents}</Badge>
                                </div>
                            }
                        >
                            <div className="tab-content">
                                {renderTable(
                                    allEvents,
                                    "all",
                                    searchAll,
                                    setSearchAll,
                                    allShowAll,
                                    setAllShowAll
                                )}
                            </div>
                        </Tab>

                        <Tab
                            eventKey="recent"
                            title={
                                <div className="tab-title active">
                                    <FaHistory className="tab-icon" />
                                    <span>Gần đây</span>
                                    <Badge bg="info" className="tab-badge">{totalRecent}</Badge>
                                </div>
                            }
                        >
                            <div className="tab-content">
                                {renderTable(
                                    recentEvents,
                                    "recent",
                                    searchRecent,
                                    setSearchRecent,
                                    recentShowAll,
                                    setRecentShowAll
                                )}
                            </div>
                        </Tab>

                        <Tab
                            eventKey="today"
                            title={
                                <div className="tab-title today">
                                    <FaCalendarAlt className="tab-icon" />
                                    <span>Hôm nay</span>
                                    <Badge bg="warning" className="tab-badge">{totalToday}</Badge>
                                </div>
                            }
                        >
                            <div className="tab-content">
                                {renderTable(
                                    todayEvents,
                                    "today",
                                    searchToday,
                                    setSearchToday,
                                    todayShowAll,
                                    setTodayShowAll
                                )}
                            </div>
                        </Tab>

                        <Tab
                            eventKey="emergency"
                            title={
                                <div className="tab-title completed">
                                    <FaAmbulance className="tab-icon" />
                                    <span>Cấp cứu</span>
                                    <Badge bg="danger" className="tab-badge">{totalEmergency}</Badge>
                                </div>
                            }
                        >
                            <div className="tab-content">
                                {renderTable(
                                    emergencyEvents,
                                    "emergency",
                                    searchEmergency,
                                    setSearchEmergency,
                                    emergencyShowAll,
                                    setEmergencyShowAll
                                )}
                            </div>
                        </Tab>
                    </Tabs>
                )}
            </div>

            {/* Professional Detail Modal */}
            <Modal
                show={modalEvent}
                onHide={() => setModalEvent(false)}
                size="lg"
                className="medicine-detail-modal"
            >
                <Modal.Header closeButton className="modal-header-custom">
                    <Modal.Title>
                        <FaHeartbeat className="modal-icon" />
                        Chi tiết Sự kiện Y tế
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-custom">
                    {detailLoading && (
                        <div className="modal-loading">
                            <FaSpinner className="fa-spin" />
                            <p>Đang tải chi tiết...</p>
                        </div>
                    )}
                    {!detailLoading && !modalEventDetail.id && (
                        <div className="modal-error">
                            <FaExclamationTriangle />
                            <p>Không tìm thấy chi tiết sự kiện.</p>
                        </div>
                    )}
                    {!detailLoading && modalEventDetail.id && (
                        <div className="detail-content">
                            <div className="detail-grid">
                                <div className="detail-section">
                                    <h6><FaCalendarAlt /> Thông tin sự kiện</h6>
                                    <div className="detail-row">
                                        <span className="label">Loại sự kiện:</span>
                                        <span className="value">{modalEventDetail.eventType}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Địa điểm:</span>
                                        <span className="value">{modalEventDetail.location}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Ngày thực hiện:</span>
                                        <span className="value">{formatDateTime(modalEventDetail.date)}</span>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h6><FaUser /> Thông tin liên quan</h6>
                                    <div className="detail-row">
                                        <span className="label">Học sinh:</span>
                                        <span className="value">{modalEventDetail.studentName || 'Không có'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Y tá phụ trách:</span>
                                        <span className="value">{modalEventDetail.nurseName}</span>
                                    </div>
                                </div>

                                <div className="detail-section full-width">
                                    <h6><FaClipboardList /> Mô tả chi tiết</h6>
                                    <div className="detail-row">
                                        <span className="label">Mô tả:</span>
                                        <span className="value note">{modalEventDetail.description}</span>
                                    </div>
                                </div>

                                {modalEventDetail.medicalEventSupplys && modalEventDetail.medicalEventSupplys.length > 0 && (
                                    <div className="detail-section full-width">
                                        <h6><FaMedkit /> Vật tư y tế đã sử dụng</h6>
                                        <div className="supplies-list">
                                            {modalEventDetail.medicalEventSupplys.map((supply, index) => (
                                                <div key={index} className="supply-item">
                                                    <span className="supply-name">{supply.medicalSupplyName}</span>
                                                    <span className="supply-quantity">SL: {supply.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="modal-footer-custom">
                    <Button variant="secondary" onClick={() => setModalEvent(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Professional Add Event Modal */}
            <Modal show={modalAdd} onHide={() => { setModalAdd(false); resetFormAdd(); }} size="xl" className="medicine-detail-modal add-event-modal">
                <Modal.Header closeButton className="modal-header-custom">
                    <Modal.Title>
                        <FaHeartbeat className="modal-icon pulse-animation" />
                        Tạo Sự kiện Y tế Mới
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-custom" style={{ maxHeight: '70vh', overflowY: 'auto' }}>



                    <Form ref={formRef} noValidate validated={validated} onSubmit={handleSubmitForm}>
                        <div className="add-event-content">
                            <Row>
                                {/* Left Column - Basic Info */}
                                <Col lg={6}>
                                    <div className="event-form-section">
                                        <div className="section-header">
                                            <FaHeartbeat className="section-icon" />
                                            <h5>Thông tin cơ bản</h5>
                                        </div>

                                        <div className="form-group-enhanced">
                                            <Form.Group className="mb-4" controlId="eventType">
                                                <Form.Label className="form-label-enhanced">
                                                    <FaHeartbeat className="me-2" />
                                                    Loại sự kiện <span className="required">*</span>
                                                </Form.Label>
                                                <div className="input-wrapper">
                                                    <Form.Select
                                                        value={formAdd.eventType}
                                                        onChange={(e) => setFormAdd({ ...formAdd, eventType: e.target.value })}
                                                        className="form-control-enhanced"
                                                        required
                                                    >
                                                        <option value="">Chọn loại sự kiện...</option>
                                                        <option value="health_check">Khám sức khỏe</option>
                                                        <option value="vaccination">Tiêm phòng</option>
                                                    </Form.Select>
                                                    <div className="input-icon">
                                                        <FaHeartbeat />
                                                    </div>
                                                </div>
                                                <Form.Control.Feedback type="invalid">
                                                    <FaExclamationTriangle className="me-1" />
                                                    Vui lòng chọn loại sự kiện
                                                </Form.Control.Feedback>
                                                <div className="form-help">
                                                    Chọn loại sự kiện y tế phù hợp
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-4" controlId="eventLocation">
                                                <Form.Label className="form-label-enhanced">
                                                    <FaMapMarkerAlt className="me-2" />
                                                    Địa điểm <span className="required">*</span>
                                                </Form.Label>
                                                <div className="input-wrapper">
                                                    <Form.Select
                                                        value={formAdd.location}
                                                        onChange={(e) => setFormAdd({ ...formAdd, location: e.target.value })}
                                                        className="form-control-enhanced"
                                                        required
                                                    >
                                                        <option value="">Chọn địa điểm...</option>
                                                        <option value="Phòng y tế">Phòng y tế</option>
                                                        <option value="Lớp học">Lớp học</option>
                                                        <option value="Sân chơi">Sân chơi</option>
                                                        <option value="Phòng thể dục">Phòng thể dục</option>
                                                        <option value="Căn tin">Căn tin</option>
                                                        <option value="Hành lang">Hành lang</option>
                                                        <option value="Cổng trường">Cổng trường</option>
                                                        <option value="Khác">Khác</option>
                                                    </Form.Select>
                                                    <div className="input-icon">
                                                        <FaMapMarkerAlt />
                                                    </div>
                                                </div>
                                                <Form.Control.Feedback type="invalid">
                                                    <FaExclamationTriangle className="me-1" />
                                                    Vui lòng chọn địa điểm
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group className="mb-4" controlId="studentNumber">
                                                <Form.Label className="form-label-enhanced">
                                                    <FaUser className="me-2" />
                                                    Mã học sinh liên quan
                                                </Form.Label>
                                                <div className="input-wrapper">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="VD: HS001, ST2024001... (để trống cho sự kiện chung)"
                                                        value={formAdd.studentNumber}
                                                        onChange={(e) => setFormAdd({ ...formAdd, studentNumber: e.target.value })}
                                                        className="form-control-enhanced"
                                                    />
                                                    <div className="input-icon">
                                                        <FaUser />
                                                    </div>
                                                </div>
                                                <div className="form-help">
                                                    <strong>⚠️ Lưu ý:</strong> Chỉ nhập mã học sinh đã tồn tại trong hệ thống. Để trống để tạo sự kiện chung.
                                                </div>
                                            </Form.Group>

                                            {/* <Form.Group className="mb-4" controlId="eventPriority">
                                                <Form.Label className="form-label-enhanced">
                                                    <FaExclamationTriangle className="me-2" />
                                                    Mức độ ưu tiên
                                                </Form.Label>
                                                <div className="priority-buttons">
                                                    <Button
                                                        variant="outline-success"
                                                        className="priority-btn"
                                                        onClick={() => setFormAdd({ ...formAdd, priority: 'normal' })}
                                                    >
                                                        <FaCheckCircle className="me-1" />
                                                        Bình thường
                                                    </Button>
                                                    <Button
                                                        variant="outline-warning"
                                                        className="priority-btn"
                                                        onClick={() => setFormAdd({ ...formAdd, priority: 'urgent' })}
                                                    >
                                                        <FaClock className="me-1" />
                                                        Khẩn
                                                    </Button>
                                                    {/* <Button
                                                        variant="outline-danger"
                                                        className="priority-btn"
                                                        onClick={() => setFormAdd({ ...formAdd, priority: 'emergency' })}
                                                    >
                                                        <FaAmbulance className="me-1" />
                                                        Cấp cứu
                                                    </Button> */}
                                            {/* </div>
                                            </Form.Group> */}
                                        </div>
                                    </div>
                                </Col>

                                {/* Right Column - Description & Supplies */}
                                <Col lg={6}>
                                    <div className="event-form-section">
                                        <div className="section-header">
                                            <FaClipboardList className="section-icon" />
                                            <h5>Mô tả chi tiết</h5>
                                        </div>

                                        <Form.Group className="mb-4" controlId="eventDescription">
                                            <Form.Label className="form-label-enhanced">
                                                <FaNotesMedical className="me-2" />
                                                Mô tả sự kiện <span className="required">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={6}
                                                placeholder="Mô tả chi tiết về sự kiện: triệu chứng, tình trạng, hành động đã thực hiện..."
                                                value={formAdd.description}
                                                onChange={(e) => setFormAdd({ ...formAdd, description: e.target.value })}
                                                className="form-control-enhanced"
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                <FaExclamationTriangle className="me-1" />
                                                Vui lòng mô tả chi tiết sự kiện
                                            </Form.Control.Feedback>
                                            <div className="form-help">
                                                Ghi rõ tình trạng của học sinh và các biện pháp đã thực hiện
                                            </div>
                                        </Form.Group>

                                        <div className="section-header mt-4">
                                            <FaMedkit className="section-icon" />
                                            <h5>Vật tư y tế sử dụng</h5>
                                        </div>

                                        <div className="supplies-section">
                                            {formAdd.medicalEventSupplys.map((item, idx) => (
                                                <div key={idx} className="supply-item-wrapper">
                                                    <div className="supply-item-header">
                                                        <span className="supply-number">#{idx + 1}</span>
                                                        {formAdd.medicalEventSupplys.length > 1 && (
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => handleRemoveSupply(idx)}
                                                                className="remove-supply-btn"
                                                                title="Xóa vật tư"
                                                            >
                                                                <FaTrash />
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <Row className="mb-3">
                                                        <Col md={8}>
                                                            <Form.Label className="form-label-small">
                                                                <FaMedkit className="me-1" />
                                                                Chọn vật tư
                                                            </Form.Label>
                                                            <Form.Select
                                                                value={item.medicalSupplyId}
                                                                onChange={(e) => handleChangeSelect(idx, e.target.value)}
                                                                className="form-control-enhanced"
                                                            >
                                                                <option value="">-- Chọn vật tư y tế --</option>
                                                                {medicalSupplies.map((supply) => (
                                                                    <option key={supply.id} value={supply.id}>
                                                                        {supply.name} (Tồn kho: {supply.quantity})
                                                                    </option>
                                                                ))}
                                                            </Form.Select>
                                                            <Form.Control.Feedback type="invalid">
                                                                Vui lòng chọn vật tư y tế
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                        <Col md={4}>
                                                            <Form.Label className="form-label-small">
                                                                <FaList className="me-1" />
                                                                Số lượng
                                                            </Form.Label>
                                                            <div className="quantity-input-wrapper">
                                                                <Form.Control
                                                                    type="number"
                                                                    placeholder="SL"
                                                                    value={item.quantity}
                                                                    onChange={(e) => handleChangeQuantity(idx, e.target.value)}
                                                                    min="1"
                                                                    max={medicalSupplies.find(s => String(s.id) === String(item.medicalSupplyId))?.quantity || 999}
                                                                    className="form-control-enhanced quantity-input"
                                                                />
                                                                {item.medicalSupplyId && (
                                                                    <small className="quantity-max">
                                                                        /{medicalSupplies.find(s => String(s.id) === String(item.medicalSupplyId))?.quantity || 0}
                                                                    </small>
                                                                )}
                                                            </div>
                                                            <Form.Control.Feedback type="invalid">
                                                                Nhập số lượng hợp lệ
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            ))}

                                            <div className="add-supply-section">
                                                <Button
                                                    variant="outline-primary"
                                                    onClick={handleAddSupply}
                                                    className="add-supply-btn"
                                                >
                                                    <FaPlus className="me-2" />
                                                    Thêm vật tư khác
                                                </Button>
                                                <small className="text-muted d-block mt-2">
                                                    Thêm tất cả vật tư y tế đã sử dụng trong sự kiện này
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </Modal.Body>

                <Modal.Footer className="modal-footer-custom">
                    <div className="footer-actions">
                        <Button
                            variant="outline-secondary"
                            onClick={() => { setModalAdd(false); resetFormAdd(); }}
                            className="btn-cancel"
                        >
                            <FaTimesCircle className="me-2" />
                            Hủy bỏ
                        </Button>
                        <Button
                            variant="outline-info"
                            onClick={resetFormAdd}
                            className="btn-reset"
                        >
                            <FaTrash className="me-2" />
                            Làm mới
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleSubmitForm}
                            className="btn-save"
                        >
                            <FaCheckCircle className="me-2" />
                            Lưu sự kiện
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>

            {/* Filter Modal */}
            <Modal
                show={showFilterModal}
                onHide={() => setShowFilterModal(false)}
                size="md"
                className="filter-modal"
            >
                <Modal.Header closeButton className="modal-header-custom">
                    <Modal.Title>
                        <FaFilter className="modal-icon" />
                        Bộ lọc nâng cao
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-custom">
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Từ ngày</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={filterOptions.dateFrom}
                                        onChange={(e) => setFilterOptions({ ...filterOptions, dateFrom: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Đến ngày</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={filterOptions.dateTo}
                                        onChange={(e) => setFilterOptions({ ...filterOptions, dateTo: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Loại sự kiện</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tìm theo loại sự kiện"
                                value={filterOptions.eventType}
                                onChange={(e) => setFilterOptions({ ...filterOptions, eventType: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Địa điểm</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tìm theo địa điểm"
                                value={filterOptions.location}
                                onChange={(e) => setFilterOptions({ ...filterOptions, location: e.target.value })}
                            />
                        </Form.Group>

                        {/* Filter Summary */}
                        <div className="filter-summary">
                            <h6>Tóm tắt bộ lọc</h6>
                            <div className="filter-tags">
                                {filterOptions.dateFrom && (
                                    <Badge bg="primary" className="me-1">Từ: {filterOptions.dateFrom}</Badge>
                                )}
                                {filterOptions.dateTo && (
                                    <Badge bg="primary" className="me-1">Đến: {filterOptions.dateTo}</Badge>
                                )}
                                {filterOptions.eventType && (
                                    <Badge bg="info" className="me-1">Loại: {filterOptions.eventType}</Badge>
                                )}
                                {filterOptions.location && (
                                    <Badge bg="warning" className="me-1">Địa điểm: {filterOptions.location}</Badge>
                                )}
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="modal-footer-custom">
                    <Button variant="outline-secondary" onClick={clearFilters}>
                        Xóa bộ lọc
                    </Button>
                    <Button variant="primary" onClick={() => setShowFilterModal(false)}>
                        Áp dụng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default HealthEvents;
