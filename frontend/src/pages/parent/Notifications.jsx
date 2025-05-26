import React, { useState } from "react";

const notificationsData = [
  {
    id: 1,
    type: "vaccination",
    title: "Thông báo tiêm chủng",
    date: "15/03/2024",
    icon: "fas fa-syringe",
    badge: "Tiêm chủng",
    badgeClass: "bg-primary",
    content: [
      "Kính gửi Quý phụ huynh,",
      "Nhà trường thông báo lịch tiêm chủng vắc-xin phòng COVID-19 cho học sinh vào ngày 20/03/2024. Vui lòng xem chi tiết và xác nhận tham gia.",
    ],
    modal: {
      title: "Chi tiết thông báo tiêm chủng",
      info: [
        { icon: "fas fa-calendar", label: "Ngày", value: "20/03/2024" },
        { icon: "fas fa-clock", label: "Thời gian", value: "8:00 - 11:00" },
        {
          icon: "fas fa-map-marker-alt",
          label: "Địa điểm",
          value: "Phòng Y tế trường học",
        },
        {
          icon: "fas fa-syringe",
          label: "Loại vắc-xin",
          value: "Pfizer-BioNTech",
        },
      ],
      notes: [
        "Học sinh cần ăn sáng đầy đủ trước khi tiêm",
        "Mang theo sổ khám bệnh và giấy tờ tùy thân",
        "Phụ huynh cần ký xác nhận đồng ý tiêm chủng",
        "Theo dõi sức khỏe sau tiêm 30 phút tại trường",
      ],
      consentLabel: "Tôi đồng ý cho con tôi tham gia tiêm chủng",
      confirmBtn: { class: "btn-primary", label: "Xác nhận tham gia" },
    },
  },
  {
    id: 2,
    type: "checkup",
    title: "Thông báo khám sức khỏe",
    date: "10/03/2024",
    icon: "fas fa-stethoscope",
    badge: "Khám sức khỏe",
    badgeClass: "bg-success",
    content: [
      "Kính gửi Quý phụ huynh,",
      "Nhà trường tổ chức khám sức khỏe định kỳ cho học sinh vào ngày 25/03/2024. Vui lòng xem chi tiết và xác nhận tham gia.",
    ],
    modal: {
      title: "Chi tiết thông báo khám sức khỏe",
      info: [
        { icon: "fas fa-calendar", label: "Ngày", value: "25/03/2024" },
        { icon: "fas fa-clock", label: "Thời gian", value: "8:00 - 16:00" },
        {
          icon: "fas fa-map-marker-alt",
          label: "Địa điểm",
          value: "Phòng Y tế trường học",
        },
        {
          icon: "fas fa-user-md",
          label: "Đơn vị khám",
          value: "Bệnh viện Nhi đồng",
        },
      ],
      notes: [
        "Khám tổng quát",
        "Đo chiều cao, cân nặng",
        "Kiểm tra thị lực",
        "Khám răng miệng",
        "Khám tai mũi họng",
      ],
      consentLabel: "Tôi đồng ý cho con tôi tham gia khám sức khỏe",
      confirmBtn: { class: "btn-success", label: "Xác nhận tham gia" },
    },
  },
];

const tabList = [
  {
    key: "all",
    label: (
      <>
        <i className="fas fa-bell me-2"></i>Tất cả
      </>
    ),
  },
  {
    key: "vaccination",
    label: (
      <>
        <i className="fas fa-syringe me-2"></i>Tiêm chủng
      </>
    ),
  },
  {
    key: "checkup",
    label: (
      <>
        <i className="fas fa-stethoscope me-2"></i>Khám sức khỏe
      </>
    ),
  },
];

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [modal, setModal] = useState({
    show: false,
    notification: null,
    consent: false,
  });

  const filteredNotifications =
    activeTab === "all"
      ? notificationsData
      : notificationsData.filter((n) => n.type === activeTab);

  const openModal = (notification) => {
    setModal({ show: true, notification, consent: false });
  };
  const closeModal = () =>
    setModal({ show: false, notification: null, consent: false });

  return (
    <div
      style={{ background: "#f5f5f5", minHeight: "100vh", padding: "32px 0" }}
    >
      <div className="container">
        <h1 className="text-center mb-5">Thông báo</h1>
        {/* Tabs */}
        <ul className="nav nav-pills mb-4 justify-content-center">
          {tabList.map((tab) => (
            <li className="nav-item" key={tab.key}>
              <button
                className={`nav-link${activeTab === tab.key ? " active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
                type="button"
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
        {/* Notification List */}
        <div className="notification-list">
          {filteredNotifications.map((n) => (
            <div className="notification-card card mb-4" key={n.id}>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div
                    className={`notification-icon ${n.badgeClass}`}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 24,
                    }}
                  >
                    <i className={n.icon}></i>
                  </div>
                  <div className="ms-3">
                    <h5 className="card-title mb-1">{n.title}</h5>
                    <p className="text-muted mb-0">Ngày đăng: {n.date}</p>
                  </div>
                </div>
                {n.content.map((line, idx) => (
                  <p className="card-text" key={idx}>
                    {line}
                  </p>
                ))}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className={`badge ${n.badgeClass}`}>{n.badge}</span>
                  <button
                    className={`btn btn-sm ${n.badgeClass.replace(
                      "bg",
                      "btn"
                    )}`}
                    onClick={() => openModal(n)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {modal.show && (
          <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.3)" }}
            tabIndex={-1}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {modal.notification.modal.title}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-4">
                    <h6 className="fw-bold">
                      {modal.notification.type === "vaccination"
                        ? "Thông tin tiêm chủng:"
                        : "Thông tin khám sức khỏe:"}
                    </h6>
                    <ul className="list-unstyled">
                      {modal.notification.modal.info.map((item, idx) => (
                        <li key={idx}>
                          <i className={`${item.icon} me-2`}></i>
                          {item.label}: {item.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h6 className="fw-bold">
                      {modal.notification.type === "vaccination"
                        ? "Lưu ý quan trọng:"
                        : "Nội dung khám:"}
                    </h6>
                    <ul>
                      {modal.notification.modal.notes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="consentCheckbox"
                      checked={modal.consent}
                      onChange={(e) =>
                        setModal((m) => ({ ...m, consent: e.target.checked }))
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="consentCheckbox"
                    >
                      {modal.notification.modal.consentLabel}
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    className={`btn ${modal.notification.modal.confirmBtn.class}`}
                    disabled={!modal.consent}
                    onClick={() => {
                      alert("Đã xác nhận tham gia!");
                      closeModal();
                    }}
                  >
                    {modal.notification.modal.confirmBtn.label}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
