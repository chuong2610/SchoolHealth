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
  getHealthEventStatistics,
  getMedicalEventDetail,
  getMedicalEvents,
  getMedicalSupply,
  postMedicalEvent,
} from "../../api/nurse/healthEventsApi";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import cendal from "../../assets/calendar-svgrepo-com.svg";
import nearly from "../../assets/history-svgrepo-com.svg";
import Today from "../../assets/clock-islam-svgrepo-com.svg";
import {
  FaCalendarAlt,

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
  FaNotesMedical,
  FaTimes,
  FaUserMd,
  FaInfoCircle,
  FaUserFriends,
  FaSyringe,
} from "react-icons/fa";
import PaginationBar from "../../components/common/PaginationBar";
import axiosInstance from "../../api/axiosInstance";
import styles from "./HealthEvents.module.css";

const HealthEvents = () => {
  const { user } = useAuth();
  const formRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [modalEvent, setModalEvent] = useState(false);
  const [modalEventDetail, setModalEventDetail] = useState({});
  const [modalAdd, setModalAdd] = useState(false);
  const [medicalSupplies, setMedicalSupplies] = useState([]);
  const [classList, setClassList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [formAdd, setFormAdd] = useState({
    eventType: "",
    location: "",
    description: "",
    studentNumber: "",
    medicalEventSupplys: [{ medicalSupplyId: "", quantity: 1 }],
  });

  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [animateStats, setAnimateStats] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [nurseNote, setNurseNote] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    dateFrom: "",
    dateTo: "",
    eventType: "",
    location: "",
    status: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const [healthEventStatistics, setHealthEventStatistics] = useState({
    totalCount: 0,
    last7DaysCount: 0,
    todayCount: 0,
  });

  const fetchHealthEventStatistics = async () => {
    try {
      const res = await getHealthEventStatistics();
      if (res) {
        setHealthEventStatistics({
          totalCount: res.totalCount,
          last7DaysCount: res.last7DaysCount,
          todayCount: res.todayCount,
        });
      } else {
        setHealthEventStatistics({
          totalCount: 0,
          last7DaysCount: 0,
          todayCount: 0,
        });
      }
    } catch (error) {
      setHealthEventStatistics({
        totalCount: 0,
        last7DaysCount: 0,
        todayCount: 0,
      });
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const [search, setSearch] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);

  const [allShowAll, setAllShowAll] = useState(false);
  const [recentShowAll, setRecentShowAll] = useState(false);
  const [todayShowAll, setTodayShowAll] = useState(false);
  const [emergencyShowAll, setEmergencyShowAll] = useState(false);

  const [validated, setValidated] = useState(false);
  const ROW_LIMIT = 5;

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const exportToExcel = (data, filename) => {
    try {
      const headers = [
        "STT",
        "Loại sự kiện",
        "Địa điểm",
        "Ngày",
        "Học sinh",
        "Y tá",
        "Mô tả",
      ];
      const csvContent = [
        headers.join(","),
        ...data.map((event, index) =>
          [
            index + 1,
            `"${event.eventType || "N/A"}"`,
            `"${event.location || "N/A"}"`,
            `"${formatDateTime(event.date) || "N/A"}"`,
            `"${event.studentName || "N/A"}"`,
            `"${event.nurseName || "N/A"}"`,
            `"${event.description || "N/A"}"`,
          ].join(",")
        ),
      ].join("\n");

      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${filename}-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification("Xuất Excel thành công!", "success");
    } catch (error) {
      showNotification("Lỗi khi xuất Excel!", "error");
    }
  };

  const applyFilters = (data) => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.filter((event) => {
      const eventDate = new Date(event.date);
      const fromDate = filterOptions.dateFrom
        ? new Date(filterOptions.dateFrom)
        : null;
      const toDate = filterOptions.dateTo
        ? new Date(filterOptions.dateTo)
        : null;

      return (
        (!fromDate || eventDate >= fromDate) &&
        (!toDate || eventDate <= toDate) &&
        (!filterOptions.eventType ||
          event.eventType
            ?.toLowerCase()
            .includes(filterOptions.eventType.toLowerCase())) &&
        (!filterOptions.location ||
          event.location
            ?.toLowerCase()
            .includes(filterOptions.location.toLowerCase()))
      );
    });
  };

  const clearFilters = () => {
    setFilterOptions({
      dateFrom: "",
      dateTo: "",
      eventType: "",
      location: "",
      status: "",
    });
    showNotification("Đã xóa bộ lọc", "info");
  };

  const today = new Date().toDateString();
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const allEvents = applyFilters(events || []).filter(
    (event) =>
      event.eventType?.toLowerCase().includes(search.toLowerCase()) ||
      event.location?.toLowerCase().includes(search.toLowerCase()) ||
      event.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      event.nurseName?.toLowerCase().includes(search.toLowerCase())
  );

  const recentEvents = applyFilters(events || []).filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate >= lastWeek &&
      (event.eventType?.toLowerCase().includes(search.toLowerCase()) ||
        event.location?.toLowerCase().includes(search.toLowerCase()) ||
        event.studentName?.toLowerCase().includes(search.toLowerCase()) ||
        event.nurseName?.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const todayEvents = applyFilters(events || []).filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.toDateString() === today &&
      (event.eventType?.toLowerCase().includes(search.toLowerCase()) ||
        event.location?.toLowerCase().includes(search.toLowerCase()) ||
        event.studentName?.toLowerCase().includes(search.toLowerCase()) ||
        event.nurseName?.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const totalEvents = (events || []).length;
  const totalRecent = recentEvents.length;
  const totalToday = todayEvents.length;
  const totalEmergency = (events || []).filter(
    (e) => e.eventType === "emergency"
  ).length;

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
    const updatedSupplys = [
      ...formAdd.medicalEventSupplys,
      { medicalSupplyId: "", quantity: 1 },
    ];
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

    const hasStudentNumber =
      formAdd.studentNumber && formAdd.studentNumber.trim() !== "";

    try {
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

      if (!user?.id || isNaN(parseInt(user.id))) {
        showNotification("Không xác định được thông tin y tá!", "error");
        return;
      }

      const validSupplies = formAdd.medicalEventSupplys.filter(
        (supply) =>
          supply.medicalSupplyId &&
          supply.medicalSupplyId !== "" &&
          !isNaN(parseInt(supply.medicalSupplyId)) &&
          supply.quantity > 0 &&
          !isNaN(parseInt(supply.quantity))
      );

      const data = {
        eventType: formAdd.eventType,
        location: formAdd.location,
        description: formAdd.description,
        date: new Date().toISOString(),
        medicalEventSupplys:
          validSupplies.length > 0
            ? validSupplies.map((supply) => ({
              medicalSupplyId: parseInt(supply.medicalSupplyId),
              quantity: parseInt(supply.quantity),
            }))
            : [
              {
                medicalSupplyId: 0,
                quantity: 0,
              },
            ],
        nurseId: parseInt(user.id),
      };

      if (!hasStudentNumber) {
        showNotification("Vui lòng chọn lớp và học sinh!", "error");
        return;
      }

      data.studentNumber = formAdd.studentNumber.trim();

      if (validSupplies.length > 0) {
        data.medicalEventSupplys = validSupplies.map((supply) => ({
          medicalSupplyId: parseInt(supply.medicalSupplyId),
          quantity: parseInt(supply.quantity),
        }));
      }

      const res = await postMedicalEvent(data);
      toast.success("Thêm sự kiện y tế thành công")
      setModalAdd(false);
      resetFormAdd();

      const updatedEvents = await getMedicalEvents();
      setEvents(
        Array.isArray(updatedEvents)
          ? updatedEvents
          : Array.isArray(updatedEvents?.items)
            ? updatedEvents.items
            : []
      );
    } catch (error) {
      let errorMessage = "Lỗi khi thêm sự kiện!";

      if (error.response?.status === 500) {
        if (hasStudentNumber) {
          errorMessage = `Lỗi: Mã học sinh "${formAdd.studentNumber.trim()}" không tồn tại trong hệ thống!`;
        } else {
          errorMessage =
            "Lỗi server: Không thể tạo sự kiện. Vui lòng kiểm tra dữ liệu đầu vào.";
        }
      } else if (error.response?.status === 400) {
        errorMessage = `Dữ liệu không hợp lệ: ${error.response?.data?.message || "Vui lòng kiểm tra lại thông tin"
          }`;
      } else if (error.response?.data?.message) {
        errorMessage = `Lỗi: ${error.response.data.message}`;
      } else if (error.message) {
        errorMessage = `Lỗi: ${error.message}`;
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
    setSelectedClassId("");
    setStudentsList([]);
    setValidated(false);
  };

  const fetchClassList = async () => {
    try {
      const res = await axiosInstance.get("/Class");
      if (res.data && res.data.success) {
        const validClasses = (res.data.data || [])
          .filter(
            (cls) =>
              cls &&
              ((cls.classId !== undefined && cls.classId !== null) ||
                (cls.id !== undefined && cls.id !== null)) &&
              cls.className
          )
          .map((cls) => ({
            id: cls.classId || cls.id,
            className: cls.className,
          }));
        setClassList(validClasses);
      } else {
        setClassList([]);
      }
    } catch (error) {
      setClassList([]);
      showNotification("Lỗi khi tải danh sách lớp!", "error");
    }
  };

  const fetchStudentsByClass = async (classId) => {
    try {
      const res = await axiosInstance.get(
        `/Students/${classId}?pageNumber=1&pageSize=100`
      );
      if (res.data && res.data.success) {
        const validStudents = (res.data.data.items || []).filter(
          (student) =>
            student &&
            student.id !== undefined &&
            student.id !== null &&
            student.studentNumber
        );
        setStudentsList(validStudents);
      } else {
        setStudentsList([]);
      }
    } catch (error) {
      setStudentsList([]);
      if (error.response?.status === 404) {
        showNotification("Lớp này chưa có học sinh nào!", "info");
      } else {
        showNotification("Lỗi khi tải danh sách học sinh!", "error");
      }
    }
  };

  const handleClassChange = async (classId) => {
    setSelectedClassId(classId);
    setFormAdd((prev) => ({ ...prev, studentNumber: "" }));
    if (classId && classId !== "") {
      const numericClassId = parseInt(classId);
      if (!isNaN(numericClassId)) {
        await fetchStudentsByClass(numericClassId);
      } else {
        setStudentsList([]);
        showNotification("ID lớp không hợp lệ!", "error");
      }
    } else {
      setStudentsList([]);
    }
  };

  const fetchMedicalSupply = async () => {
    try {
      const res = await getMedicalSupply();
      setMedicalSupplies(res || []);
      await fetchClassList();
      setModalAdd(true);
    } catch (error) {
      showNotification("Lỗi khi tải danh sách vật tư!", "error");
    }
  };

  const loadMedicalEventDetailModal = async (eventId) => {
    try {
      setDetailLoading(true);
      const res = await getMedicalEventDetail(eventId);

      if (res && res.eventType) {
        setModalEventDetail(res);
        setModalEvent(true);
      } else {
        showNotification("Không tìm thấy thông tin chi tiết sự kiện!", "error");
      }
    } catch (error) {
      let errorMessage = "Lỗi khi tải chi tiết sự kiện!";

      if (error.response?.status === 404) {
        errorMessage = "Sự kiện không tồn tại hoặc đã bị xóa!";
      } else if (error.response?.status === 500) {
        errorMessage = "Lỗi hệ thống! Vui lòng thử lại sau.";
      } else if (error.message) {
        errorMessage = `Lỗi: ${error.message}`;
      }

      showNotification(errorMessage, "error");
    } finally {
      setDetailLoading(false);
    }
  };

  const renderActionButtons = (event) => (
    <div>
      <button className={styles.actionBtn}
        onClick={() => loadMedicalEventDetailModal(event.id)}
        title="Xem chi tiết"
      >
        <FaEye />
      </button>
    </div>
  );

  const renderTable = (

    type,
    // searchValue,
    // setSearch,
    showAll,
    setShowAll
  ) => (
    <div className={styles.tableWrapper}>

      <div style={{ overflowX: 'auto' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Loại sự kiện</th>
              <th>Địa điểm</th>
              <th>Ngày</th>
              <th>Học sinh</th>
              <th>Y tá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr className={styles.tableRow} key={event.id || `event-${index}`}>
                <td>{event.eventType}</td>
                <td>{event.location || "N/A"}</td>
                <td>{formatDateTime(event.date) || "N/A"}</td>
                <td><strong>{event.studentName || "N/A"}</strong></td>
                <td>{event.nurseName || "N/A"}</td>
                <td>{renderActionButtons(event)}</td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr className={styles.noDataRow}>
                <td colSpan={6} className={styles.noDataContent}>
                  <FaCalendarAlt style={{ fontSize: 22, marginBottom: 4 }} />
                  <div style={{ fontWeight: 700, margin: '8px 0' }}>Không có sự kiện nào</div>
                  <div style={{ fontWeight: 400, fontSize: 15 }}>
                    {type === "all"
                      ? "Hiện tại chưa có sự kiện y tế nào trong hệ thống"
                      : type === "recent"
                        ? "Không có sự kiện y tế nào trong 7 ngày qua"
                        : type === "today"
                          ? "Hôm nay chưa có sự kiện y tế nào được ghi nhận"
                          : "Không có sự kiện nào trong danh mục này"}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchMedicalEvents = async () => {
      try {
        setLoading(true);
        const res = await getMedicalEvents(currentPage, pageSize, search);
        setEvents(Array.isArray(res.items) ? res.items : []);
        setCurrentPage(res.currentPage);
        setTotalPages(res.totalPages || 1);
        setTotalItems(res.totalItems);
        setTimeout(() => setAnimateStats(true), 100);
      } catch (error) {
        setEvents([]);
        showNotification("Lỗi khi tải dữ liệu!", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchMedicalEvents();
    fetchHealthEventStatistics();
  }, [activeTab, currentPage, searchTrigger]);

  return (
    <div className={styles.receiveMedicineRoot}>
      {notification && (
        <div className="alert alert-dismissible" style={{ marginBottom: 18, borderRadius: 12, background: '#fff0f6', color: '#ff6b8d', border: 'none' }}>
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setNotification(null)} style={{ float: 'right', fontSize: 18, color: '#ff6b8d', background: 'none', border: 'none' }}></button>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}><FaUserNurse /></span>
          <span className={styles.headerTitle}>Quản lý Sự kiện Y tế</span>
        </div>
        <button
          className={styles.actionBtn}
          onClick={() => fetchMedicalSupply()}
        >
          <FaPlus style={{ fontSize: 20 }} /> Thêm Sự kiện Y tế
        </button>
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard + ' ' + styles.statCardPink}>
          <div><img src={cendal} alt="Calendar" className={styles.statIcon} /></div>
          <div>
            <div className={styles.statLabel}>Tổng sự kiện</div>
            <div className={styles.statValue}>{healthEventStatistics.totalCount}</div>
          </div>
        </div>
        <div className={styles.statCard + ' ' + styles.statCardBlue}>
          <div><img src={nearly} alt="Nearly" className={styles.statIcon} /></div>
          <div>
            <div className={styles.statLabel}>Gần đây (7 ngày)</div>
            <div className={styles.statValue}>{healthEventStatistics.last7DaysCount}</div>
          </div>
        </div>
        <div className={styles.statCard + ' ' + styles.statCardOrange}>
          <div><img src={Today} alt="Today" className={styles.statIcon} /></div>
          <div>
            <div className={styles.statLabel}>Hôm nay</div>
            <div className={styles.statValue}>{healthEventStatistics.todayCount}</div>
          </div>
        </div>
      </div>

      <div>
        {loading ? (
          <div>
            <FaSpinner />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            <div className={styles.searchInput}>
              <input
                type="text"
                placeholder="Tìm kiếm theo loại sự kiện, địa điểm, học sinh..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { setSearchTrigger(t => t + 1); } }}
              />
              <button
                className={styles.searchBtn}
                type="button"
                tabIndex={-1}
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}
                onClick={() => setSearchTrigger(t => t + 1)}
              >
                Tìm kiếm
              </button>
            </div>
            <Tabs
              activeKey={activeTab}
              onSelect={() => {
                setActiveTab();
                setCurrentPage(1);
              }}
            >

              <Tab
                eventKey="all"
              >

                <div>

                  {renderTable(

                    "all",

                    allShowAll,
                    setAllShowAll
                  )}
                </div>
              </Tab>
            </Tabs>
            {totalPages > 1 && (
              <div>
                <PaginationBar
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {modalEvent && (
        <div
          className={styles.modalOverlay}
          onClick={e => {
            if (e.target === e.currentTarget) {
              setModalEvent(false);
              setNurseNote("");
            }
          }}
        >
          <div className={styles.customModal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <span className={styles.modalHeaderIcon}><FaHeartbeat /></span>
                <span className={styles.modalHeaderTitle}>Chi tiết Sự kiện Y tế</span>
              </div>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}><FaClipboardList /> Thông tin sự kiện</div>
                <div className={styles.modalSectionRow}>
                  <span className={styles.modalSectionLabel}>Loại sự kiện:</span>
                  <span className={styles.modalSectionValue}>{modalEventDetail?.eventType}</span>
                </div>
                <div className={styles.modalSectionRow}>
                  <span className={styles.modalSectionLabel}>Thời gian:</span>
                  <span className={styles.modalSectionValue}>{formatDateTime(modalEventDetail?.date)}</span>
                </div>
                <div className={styles.modalSectionRow}>
                  <span className={styles.modalSectionLabel}>Địa điểm:</span>
                  <span className={styles.modalSectionValue}>{modalEventDetail?.location}</span>
                </div>
              </div>
              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}><FaUserFriends /> Người liên quan</div>
                <div className={styles.modalSectionRow}>
                  <span className={styles.modalSectionLabel}>Học sinh:</span>
                  <span className={styles.modalSectionValue}>{modalEventDetail?.studentName}</span>
                </div>
                <div className={styles.modalSectionRow}>
                  <span className={styles.modalSectionLabel}>Y tá:</span>
                  <span className={styles.modalSectionValue}>{modalEventDetail?.nurseName}</span>
                </div>
              </div>
              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}><FaStickyNote /> Mô tả chi tiết</div>
                <div className={styles.modalSectionValue}>{modalEventDetail?.description}</div>
              </div>
              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}><FaMedkit /> Vật tư y tế sử dụng</div>
                {(modalEventDetail?.supplies || []).map((s, idx) => (
                  <div key={idx} className={styles.modalSectionRow}>
                    <span className={styles.modalSectionLabel}>{s.medicalSupplyName}</span>
                    <span className={styles.modalSectionValue}>Số lượng: {s.quantity}</span>
                  </div>
                ))}
                {(modalEventDetail?.supplies || []).length === 0 && (
                  <div className={styles.modalSectionValue}>Không có vật tư y tế</div>
                )}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.actionBtn}
                onClick={() => {
                  setModalEvent(false);
                  setNurseNote("");
                }}
              >
                <FaTimes /> Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAdd && (
        <div className={styles.modalOverlay}>
          <div className={styles.customModal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <span className={styles.modalHeaderIcon}><FaHeartbeat /></span>
                <span className={styles.modalHeaderTitle}>Tạo Sự Kiện Y Tế</span>
              </div>
            </div>
            <form
              className={styles.modalContent}
              ref={formRef}
              noValidate
              onSubmit={handleSubmitForm}
            >
              <div className={styles.eventFormSection}>
                <div className={styles.modalSectionTitle}><FaHeartbeat /> Thông tin sự kiện</div>
                <label className={styles.eventFormLabel}>
                  Loại sự kiện <span>*</span>
                  <input
                    className={styles.eventFormInput}
                    placeholder="VD: Té ngã, sốt, đau bụng, nhức đầu,..."
                    value={formAdd.eventType}
                    onChange={e => setFormAdd({ ...formAdd, eventType: e.target.value })}
                    required
                  />
                </label>
                <label className={styles.eventFormLabel}>
                  Địa điểm <span>*</span>
                  <input
                    className={styles.eventFormInput}
                    type="text"
                    placeholder="VD: Phòng y tế, Lớp 10A1, ..."
                    value={formAdd.location}
                    onChange={e => setFormAdd({ ...formAdd, location: e.target.value })}
                    required
                  />
                </label>
                <label className={styles.eventFormLabel}>
                  Chọn lớp <span>*</span>
                  <select
                    className={styles.eventFormSelect}
                    value={selectedClassId}
                    onChange={e => handleClassChange(e.target.value)}
                    required
                  >
                    <option value="">Chọn lớp...</option>
                    {classList.map((cls, idx) => (
                      <option key={cls.id || idx} value={cls.id || ""}>
                        {cls.className || "Lớp không xác định"}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.eventFormLabel}>
                  Chọn học sinh <span>*</span>
                  <select
                    className={styles.eventFormSelect}
                    value={formAdd.studentNumber}
                    onChange={e => setFormAdd({ ...formAdd, studentNumber: e.target.value })}
                    disabled={!selectedClassId}
                    required
                  >
                    <option value="">
                      {selectedClassId
                        ? studentsList.length > 0
                          ? "Chọn học sinh..."
                          : "Không có học sinh trong lớp"
                        : "Vui lòng chọn lớp trước"}
                    </option>
                    {studentsList.map((student, idx) => (
                      <option
                        key={student.id || idx}
                        value={student.studentNumber || ""}
                      >
                        {(student.studentNumber || "N/A") + " - " + (student.studentName || "Tên không xác định")}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className={styles.eventFormSection}>
                <div className={styles.modalSectionTitle}><FaNotesMedical /> Mô tả chi tiết</div>
                <textarea
                  className={styles.eventFormTextarea}
                  rows={4}
                  placeholder="Mô tả chi tiết về sự kiện, triệu chứng, tình trạng, hành động đã thực hiện..."
                  value={formAdd.description}
                  onChange={e => setFormAdd({ ...formAdd, description: e.target.value })}
                  required
                />
              </div>
              <div className={styles.eventFormSection}>
                <div className={styles.modalSectionTitle}><FaMedkit /> Vật tư y tế sử dụng</div>
                {formAdd.medicalEventSupplys.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <select
                      className={styles.eventFormSelect}
                      value={item.medicalSupplyId}
                      onChange={e => handleChangeSelect(idx, e.target.value)}
                    >
                      <option value="">Chọn vật tư...</option>
                      {medicalSupplies.map((supply, i) => (
                        <option key={supply.id || i} value={supply.id || ""}>
                          {supply.name}
                        </option>
                      ))}
                    </select>
                    <input
                      className={styles.eventFormInput}
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={e => handleChangeQuantity(idx, e.target.value)}
                      style={{ maxWidth: 90 }}
                    />
                    {formAdd.medicalEventSupplys.length > 1 && (
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => handleRemoveSupply(idx)}
                        title="Xóa vật tư này"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className={styles.eventFormBtn}
                  style={{ background: '#e3f0ff', color: '#2563eb' }}
                  onClick={handleAddSupply}
                >
                  <FaPlus /> Thêm vật tư
                </button>
              </div>
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.actionBtn}
                  style={{ background: '#ffe0e6', color: '#ff6b8d' }}
                  onClick={() => {
                    setModalAdd(false);
                    resetFormAdd();
                  }}
                >
                  <FaTimes /> Hủy bỏ
                </button>
                <button
                  type="button"
                  className={styles.actionBtn}
                  style={{ background: '#fff0f6', color: '#ff6b8d' }}
                  onClick={resetFormAdd}
                >
                  <FaTrash /> Làm mới
                </button>
                <button
                  type="submit"
                  className={styles.eventFormBtn}

                >
                  <FaCheckCircle /> Lưu sự kiện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Modal
        show={showFilterModal}
        onHide={() => setShowFilterModal(false)}
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaFilter />
            Bộ lọc nâng cao
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Từ ngày</Form.Label>
                  <Form.Control
                    type="date"
                    value={filterOptions.dateFrom}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        dateFrom: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Đến ngày</Form.Label>
                  <Form.Control
                    type="date"
                    value={filterOptions.dateTo}
                    onChange={(e) =>
                      setFilterOptions({
                        ...filterOptions,
                        dateTo: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Địa điểm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tìm theo địa điểm"
                value={filterOptions.location}
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    location: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={clearFilters}>
            Xóa bộ lọc
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => setShowFilterModal(false)}
          >
            Áp dụng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HealthEvents;
