import { useEffect, useState } from "react";
import styled, { keyframes } from 'styled-components';
import { FaBell, FaSyringe, FaStethoscope, FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { sendConsentApi } from "../../api/parent/sendConsentApi";
import { getNotificationDetailById, getNotifications } from "../../api/parent/notificationApi";
import { formatDateTime } from "../../utils/dateFormatter";
import '../../styles/parent-theme.css';

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;
const PageWrapper = styled.div`
  background: #f5f5f5;
  min-height: 100vh;
  padding: 32px 0;
`;
const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const MainCard = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(44,62,80,0.08);
  padding: 32px 32px 24px 32px;
  max-width: 800px;
  margin: 0 auto;
  animation: ${fadeIn} 0.7s;
`;
const Tabs = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;
const Tab = styled.button`
  background: ${({ active }) => (active ? 'linear-gradient(90deg, #2980B9 60%, #38b6ff 100%)' : '#f0f5ff')};
  color: ${({ active }) => (active ? '#fff' : '#2563eb')};
  border: none;
  border-radius: 12px;
  padding: 10px 28px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: ${({ active }) => (active ? '0 2px 12px rgba(56,182,255,0.18)' : 'none')};
`;
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 8px 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(44,62,80,0.04);
`;
const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 1rem;
  flex: 1;
  margin-left: 8px;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;
`;
const Thead = styled.thead`
  background: #f0f5ff;
`;
const Th = styled.th`
  padding: 12px 8px;
  font-weight: 700;
  color: #2563eb;
  font-size: 1.05rem;
  text-align: left;
`;
const Tr = styled.tr`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(56,182,255,0.08);
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 8px 24px rgba(56,182,255,0.15);
    transform: scale(1.01);
  }
`;
const Td = styled.td`
  padding: 14px 8px;
  font-size: 1rem;
  color: #2D3436;
  vertical-align: middle;
`;
const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  border-radius: 12px;
  padding: 4px 16px;
  font-size: 1rem;
  background: ${({ status }) =>
    status === 'Confirmed' ? '#E8F8F5' : status === 'Rejected' ? '#FDEDEC' : '#FEF5E7'};
  color: ${({ status }) =>
    status === 'Confirmed' ? '#27AE60' : status === 'Rejected' ? '#E74C3C' : '#F39C12'};
`;
const ActionButton = styled.button`
  background: linear-gradient(90deg, #2980B9 60%, #38b6ff 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 18px;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(56,182,255,0.10);
  &:hover {
    background: linear-gradient(90deg, #38b6ff 0%, #2980B9 100%);
    box-shadow: 0 6px 24px rgba(56,182,255,0.18);
    transform: scale(1.05);
  }
`;
const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
`;
const PageBtn = styled.button`
  background: #f0f5ff;
  color: #2563eb;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover, &[aria-current='true'] {
    background: linear-gradient(90deg, #2980B9 60%, #38b6ff 100%);
    color: #fff;
  }
`;
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(44,62,80,0.18);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ModalBox = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44,62,80,0.18);
  padding: 32px 32px 24px 32px;
  min-width: 340px;
  max-width: 480px;
  animation: ${fadeIn} 0.4s;
`;
const ModalTitle = styled.h3`
  color: #2563eb;
  margin-bottom: 18px;
`;
const ModalClose = styled.button`
  position: absolute;
  top: 18px;
  right: 24px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #aaa;
  cursor: pointer;
`;
const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;
const ModalInput = styled.textarea`
  width: 100%;
  border-radius: 10px;
  border: 2px solid #e6eaf0;
  background: #f8f9fa;
  padding: 10px 14px;
  font-size: 1rem;
  margin-top: 8px;
  margin-bottom: 8px;
  resize: vertical;
`;
const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2980B9;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
  margin: 32px auto;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
const EmptyState = styled.div`
  text-align: center;
  color: #aaa;
  margin: 48px 0;
  font-size: 1.1rem;
`;

const tabList = [
  { key: "all", label: (<><FaBell /> Tất cả</>) },
  { key: "Vaccination", label: (<><FaSyringe /> Tiêm chủng</>) },
  { key: "HealthCheck", label: (<><FaStethoscope /> Khám sức khỏe</>) },
];

const icons = {
  Vaccination: <FaSyringe style={{ color: '#2980B9' }} />,
  HealthCheck: <FaStethoscope style={{ color: '#27AE60' }} />,
};

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, notification: null, consent: false });
  const [reason, setReason] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      const sortedNotifications = res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sortedNotifications);
    } catch (error) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchNotifications(); }, []);

  // Filtered notifications
  const filtered = notifications.filter(n =>
    (activeTab === 'all' || n.type === activeTab) &&
    (n.title?.toLowerCase().includes(search.toLowerCase()) || n.message?.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPage = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Modal logic
  const openModal = async (notificationId, studentId) => {
    const data = { notificationId, studentId };
    const detail = await getNotificationDetailById(data);
    setModal({ show: true, notification: { ...detail }, consent: false });
  };
  const closeModal = () => setModal({ ...modal, show: false });
  const handleSubmitConsent = async (consent, status, reason) => {
    const data = {
      notificationId: modal.notification.id,
      studentId: modal.notification.studentId,
      status: status,
      reason,
    };
    try {
      await sendConsentApi(data);
      fetchNotifications();
      closeModal();
    } catch (error) { }
  };

  return (
    <PageWrapper>
      <MainCard>
        <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Thông báo</h1>
        <Tabs>
          {tabList.map(tab => (
            <Tab key={tab.key} active={activeTab === tab.key} onClick={() => { setActiveTab(tab.key); setPage(1); }}>
              {tab.label}
            </Tab>
          ))}
        </Tabs>
        <SearchBar>
          <FaSearch />
          <SearchInput
            placeholder="Tìm kiếm theo tiêu đề, nội dung..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </SearchBar>
        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <EmptyState>Không có thông báo nào.</EmptyState>
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th style={{ width: 48 }}></Th>
                <Th>Tiêu đề</Th>
                <Th>Ngày</Th>
                <Th>Trạng thái</Th>
                <Th style={{ textAlign: 'center' }}>Thao tác</Th>
              </tr>
            </Thead>
            <tbody>
              {paged.map((notification, idx) => (
                <Tr key={notification.id}>
                  <Td>{icons[notification.type] || <FaBell />}</Td>
                  <Td>{notification.title}</Td>
                  <Td>{formatDateTime(notification.createdAt)}</Td>
                  <Td>
                    <StatusBadge status={notification.status}>
                      {notification.status === 'Confirmed' && <FaCheckCircle />}
                      {notification.status === 'Rejected' && <FaTimesCircle />}
                      {notification.status === 'Pending' && <FaExclamationCircle />}
                      {notification.status === 'Confirmed' ? 'Đã xác nhận' : notification.status === 'Rejected' ? 'Đã từ chối' : 'Chờ xác nhận'}
                    </StatusBadge>
                  </Td>
                  <Td style={{ textAlign: 'center' }}>
                    <ActionButton onClick={() => openModal(notification.id, notification.studentId)} title="Xem chi tiết">
                      <FaInfoCircle /> Chi tiết
                    </ActionButton>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
        {totalPage > 1 && (
          <Pagination>
            <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><FaChevronLeft /></PageBtn>
            {[...Array(totalPage)].map((_, i) => (
              <PageBtn key={i} aria-current={page === i + 1} onClick={() => setPage(i + 1)}>{i + 1}</PageBtn>
            ))}
            <PageBtn onClick={() => setPage(p => Math.min(totalPage, p + 1))} disabled={page === totalPage}><FaChevronRight /></PageBtn>
          </Pagination>
        )}
      </MainCard>
      {modal.show && (
        <ModalOverlay>
          <ModalBox>
            <ModalClose onClick={closeModal}>&times;</ModalClose>
            <ModalTitle>{modal.notification?.title}</ModalTitle>
            <div style={{ marginBottom: 12 }}>
              <b>Ngày:</b> {modal.notification?.date ? new Date(modal.notification.date).toLocaleDateString('vi-VN') : ''}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Địa điểm:</b> {modal.notification?.location || '---'}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Nội dung:</b> {modal.notification?.message || ''}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Ghi chú:</b> {modal.notification?.note || ''}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Trạng thái:</b> <StatusBadge status={modal.notification?.status}>
                {modal.notification?.status === 'Confirmed' && <FaCheckCircle />}
                {modal.notification?.status === 'Rejected' && <FaTimesCircle />}
                {modal.notification?.status === 'Pending' && <FaExclamationCircle />}
                {modal.notification?.status === 'Confirmed' ? 'Đã xác nhận' : modal.notification?.status === 'Rejected' ? 'Đã từ chối' : 'Chờ xác nhận'}
              </StatusBadge>
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Lý do từ chối:</b>
              <ModalInput
                rows={2}
                          value={reason}
                onChange={e => setReason(e.target.value)}
                          placeholder="Điền lý do nếu từ chối"
                disabled={modal.notification?.status !== 'Pending'}
              />
            </div>
            <ModalFooter>
              <ActionButton style={{ background: '#e0e0e0', color: '#2563eb' }} onClick={closeModal}>Đóng</ActionButton>
              <ActionButton
                style={{ background: '#E74C3C', color: '#fff' }}
                disabled={modal.notification?.status !== 'Pending'}
                onClick={() => handleSubmitConsent(false, "Rejected", reason)}
              >Từ chối</ActionButton>
              <ActionButton
                style={{ background: '#27AE60', color: '#fff' }}
                disabled={modal.notification?.status !== 'Pending'}
                onClick={() => handleSubmitConsent(true, "Confirmed")}
              >Đồng ý</ActionButton>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
}
