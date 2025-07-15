import { useEffect, useState } from "react";
import { getClassList } from "../../api/admin/notification";
import {
  getConsultationById,
  getConsultations,
  getStudentsByClassId,
  postConsultation,
} from "../../api/nurse/ConsultationApi";
import { formatDateTime } from "../../utils/dateFormatter";
import { toast } from "react-toastify";
import PaginationBar from "../../components/common/PaginationBar";
import styles from "./Consultation.module.css";
import { FaCalendarPlus, FaSearch, FaEye, FaUserNurse, FaUserGraduate, FaMapMarkerAlt, FaRegClock, FaHeading, FaAlignLeft, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

export default function Consultation() {
  const nurseId = localStorage.userId;
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [form, setForm] = useState({
    nurseId: nurseId,
    studentNumber: "",
    title: "",
    date: "",
    location: "",
    description: "",
  });
  const [validated, setValidated] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [appointment, setAppointment] = useState({});
  const [modal, setModal] = useState(false);

  const fetchClassList = async () => {
    try {
      const res = await getClassList();
      if (res) {
        setClassList(res);
      } else {
        setClassList([]);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchClassList();
  }, []);

  const fetchStudentList = async () => {
    try {
      const res = await getStudentsByClassId(selectedClass);
      if (res) {
        setStudentList(res.items);
      } else {
        setStudentList([]);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchStudentList();
    }
  }, [selectedClass]);

  const fetchConsultations = async () => {
    try {
      const res = await getConsultations(
        nurseId,
        pageSize,
        currentPage,
        search,
      );
      if (res) {
        setAppointments(res.items);
        if (res.totalPages) setTotalPages(res.totalPages);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [nurseId, currentPage, search]);

  const fetchConsultationDetail = async (consultationAppointmentId) => {
    try {
      const res = await getConsultationById(consultationAppointmentId);
      if (res) {
        setAppointment(res);
      } else {
        setAppointment({});
      }
    } catch (error) {
      throw error;
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.target;
    let valid = true;
    // Simple validation
    if (!selectedClass || !form.studentNumber || !form.title || !form.date || !form.location || !form.description) {
      valid = false;
    }
    setValidated(!valid);
    if (!valid) return;
    try {
      const res = await postConsultation(form);
      if (res === true) {
        toast.success("Tạo lịch tư vấn thành công.");
        fetchConsultations();
      } else {
        toast.error("Tạo lịch tư vấn thất bại.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo lịch.");
      throw error;
    }
    setForm({ nurseId: nurseId, studentNumber: "", date: "", location: "", description: "", title: "" });
    setValidated(false);
  };

  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    now.setMinutes(now.getMinutes() - offset);
    return now.toISOString().slice(0, 16);
  };

  // Modal close on overlay click or close btn
  const handleModalClose = () => setModal(false);

  return (
    <div className={styles.consultationContainer}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <FaUserNurse className={styles.headerIcon} />
          <h2 className={styles.headerTitle}>Đặt lịch tư vấn</h2>
        </div>
      </div>

      {/* Appointment Form Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <FaCalendarPlus /> Tạo lịch tư vấn mới
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className={styles.formGrid}>
            {/* Class & Student */}
            <div className={styles.formGroupCol}>
              <div className={styles.formSectionTitle}><FaUserGraduate /> Thông tin học sinh</div>
              <div className={styles.formInputRow}>
                <label>
                  Lớp <span className={styles.required}>*</span>
                </label>
                <select
                  required
                  name="classId"
                  value={selectedClass || ""}
                  onChange={e => setSelectedClass(e.target.value)}
                  className={validated && !selectedClass ? styles.invalid : ''}
                >
                  <option value="">-- Chọn lớp --</option>
                  {classList.map((cls) => (
                    <option key={cls.classId} value={cls.classId}>{cls.className}</option>
                  ))}
                </select>
                {validated && !selectedClass && <div className={styles.invalidMsg}>Vui lòng chọn lớp.</div>}
              </div>
              <div className={styles.formInputRow}>
                <label>
                  Học sinh <span className={styles.required}>*</span>
                </label>
                <select
                  disabled={!selectedClass}
                  required
                  name="studentNumber"
                  value={form.studentNumber}
                  onChange={handleChange}
                  className={validated && !form.studentNumber ? styles.invalid : ''}
                >
                  {!selectedClass ? (
                    <option value="">-- Vui lòng chọn lớp --</option>
                  ) : (
                    <option value="">-- Chọn học sinh --</option>
                  )}
                  {studentList?.map((s) => (
                    <option key={s.id} value={s.studentNumber}>{s.studentName}</option>
                  ))}
                </select>
                {validated && !form.studentNumber && <div className={styles.invalidMsg}>Vui lòng chọn học sinh.</div>}
              </div>
            </div>
            {/* Date & Location */}
            <div className={styles.formGroupCol}>
              <div className={styles.formSectionTitle}><FaRegClock /> Thời gian & Địa điểm</div>
              <div className={styles.formInputRow}>
                <label>
                  Thời gian <span className={styles.required}>*</span>
                </label>
                <input
                  required
                  type="datetime-local"
                  name="date"
                  min={getCurrentDateTimeLocal()}
                  value={form.date}
                  onChange={handleChange}
                  className={validated && !form.date ? styles.invalid : ''}
                />
                {validated && !form.date && <div className={styles.invalidMsg}>Vui lòng chọn thời gian hợp lệ.</div>}
              </div>
              <div className={styles.formInputRow}>
                <label>
                  Địa điểm <span className={styles.required}>*</span>
                </label>
                <input
                  required
                  type="text"
                  name="location"
                  placeholder="Nhập địa điểm"
                  value={form.location}
                  onChange={handleChange}
                  className={validated && !form.location ? styles.invalid : ''}
                />
                {validated && !form.location && <div className={styles.invalidMsg}>Vui lòng nhập địa điểm.</div>}
              </div>
            </div>
            {/* Title & Description */}
            <div className={styles.formGroupCol}>
              <div className={styles.formSectionTitle}><FaHeading /> Nội dung tư vấn</div>
              <div className={styles.formInputRow}>
                <label>
                  Tiêu đề <span className={styles.required}>*</span>
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  placeholder="Nhập tiêu đề tư vấn"
                  value={form.title}
                  onChange={handleChange}
                  className={validated && !form.title ? styles.invalid : ''}
                />
                {validated && !form.title && <div className={styles.invalidMsg}>Vui lòng nhập tiêu đề tư vấn.</div>}
              </div>
              <div className={styles.formInputRow}>
                <label>
                  Nội dung <span className={styles.required}>*</span>
                </label>
                <textarea
                  required
                  name="description"
                  placeholder="Nhập nội dung tư vấn"
                  value={form.description}
                  onChange={handleChange}
                  className={validated && !form.description ? styles.invalid : ''}
                  rows={3}
                />
                {validated && !form.description && <div className={styles.invalidMsg}>Vui lòng nhập nội dung tư vấn.</div>}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <button type="submit" className={styles.actionBtn}>
              <FaCalendarPlus /> Đặt lịch
            </button>
          </div>
        </form>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <FaCalendarPlus /> Danh sách lịch đã đặt
        </div>
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên học sinh hoặc y tá..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.actionBtn}>
            Tìm kiếm
          </button>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Học sinh</th>
                <th>Y tá</th>
                <th>Thời gian</th>
                <th>Địa điểm</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    Không có cuộc hẹn nào được tìm thấy.
                  </td>
                </tr>
              ) : (
                appointments.map((a, idx) => (
                  <tr key={a.consultationAppointmentId}>
                    <td>{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td>{a.studentName}</td>
                    <td>{a.nurseName}</td>
                    <td>{formatDateTime(a.date)}</td>
                    <td>{a.location}</td>
                    <td>
                      <span className={
                        a.status === "Pending" ? styles.statusPending :
                          a.status === "Confirmed" ? styles.statusConfirmed :
                            styles.statusRejected
                      }>
                        {a.status === "Pending"
                          ? "Chờ xác nhận"
                          : a.status === "Confirmed"
                            ? "Đã xác nhận"
                            : a.status === "Rejected"
                              ? "Đã từ chối"
                              : a.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={styles.viewButton}
                        onClick={() => {
                          if (a.consultationAppointmentId) {
                            fetchConsultationDetail(a.consultationAppointmentId);
                            setModal(true);
                          }
                        }}
                        aria-label="Xem chi tiết"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className={styles.paginationContainer}>
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                if (page < 1 || page > totalPages) return;
                setCurrentPage(page);
              }}
            />
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {modal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={handleModalClose}>
          <div
            className={styles.modalBody}
            style={{ background: '#fff', borderRadius: 20, minWidth: 340, maxWidth: 500, width: '95%', position: 'relative', boxShadow: '0 4px 32px rgba(0,0,0,0.13)', padding: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.modalHeader} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '20px 20px 0 0' }}>
              <div className={styles.modalTitle} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22 }}>
                <FaCalendarPlus style={{ fontSize: 28 }} />
                <span>Chi tiết lịch hẹn</span>
              </div>
              <button onClick={handleModalClose} style={{ background: 'none', border: 'none', fontSize: 28, color: '#fff', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
            </div>
            <div className={styles.modalCardBody} style={{ padding: 24 }}>
              <div className={styles.modalCardRow}>
                <FaUserGraduate className={styles.modalCardIcon} />
                <div>
                  <div className={styles.modalLabel}>Học sinh</div>
                  <div className={styles.modalValue}>{appointment?.studentName}</div>
                </div>
              </div>
              <div className={styles.modalCardRow}>
                <FaUserNurse className={styles.modalCardIcon} />
                <div>
                  <div className={styles.modalLabel}>Y tá</div>
                  <div className={styles.modalValue}>{appointment?.nurseName}</div>
                </div>
              </div>
              <div className={styles.modalCardRow}>
                <FaHeading className={styles.modalCardIcon} />
                <div>
                  <div className={styles.modalLabel}>Tiêu đề</div>
                  <div className={styles.modalValue}>{appointment?.title}</div>
                </div>
              </div>
              <div className={styles.modalCardRow}>
                <FaAlignLeft className={styles.modalCardIcon} />
                <div>
                  <div className={styles.modalLabel}>Nội dung</div>
                  <div className={styles.modalValue}>{appointment?.description}</div>
                </div>
              </div>
              <div className={styles.modalCardRow}>
                <FaRegClock className={styles.modalCardIcon} />
                <div>
                  <div className={styles.modalLabel}>Thời gian</div>
                  <div className={styles.modalValue}>{formatDateTime(appointment?.date)}</div>
                </div>
              </div>
              <div className={styles.modalCardRow}>
                <FaMapMarkerAlt className={styles.modalCardIcon} />
                <div>
                  <div className={styles.modalLabel}>Địa điểm</div>
                  <div className={styles.modalValue}>{appointment?.location}</div>
                </div>
              </div>
              <div className={styles.modalCardRow}>
                {appointment?.status === "Confirmed" && <FaCheckCircle className={styles.modalCardIcon} style={{ color: '#43a047' }} />}
                {appointment?.status === "Rejected" && <FaTimesCircle className={styles.modalCardIcon} style={{ color: '#d32f2f' }} />}
                {appointment?.status === "Pending" && <FaRegClock className={styles.modalCardIcon} style={{ color: '#ffb300' }} />}
                <div>
                  <div className={styles.modalLabel}>Trạng thái</div>
                  <div className={
                    appointment?.status === "Pending" ? styles.statusPending :
                      appointment?.status === "Confirmed" ? styles.statusConfirmed :
                        styles.statusRejected
                  }>
                    {appointment?.status === "Confirmed"
                      ? "Đã xác nhận"
                      : appointment?.status === "Rejected"
                        ? "Đã từ chối"
                        : "Chờ xác nhận"}
                  </div>
                </div>
              </div>
              {appointment?.status === "Rejected" && (
                <div className={styles.modalCardRow}>
                  <FaTimesCircle className={styles.modalCardIcon} style={{ color: '#d32f2f' }} />
                  <div>
                    <div className={styles.modalLabel}>Lý do từ chối</div>
                    <div className={styles.modalValue}>{appointment?.reason}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
