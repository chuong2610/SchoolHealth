import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import axios from "axios"; // Giả sử bạn đã cài đặt axios

// const inventory = [
//   {
//     id: "MED001",
//     name: "Paracetamol 500mg",
//     type: "Thuốc",
//     typeClass: "badge bg-primary",
//     quantity: 1000,
//     unit: "Viên",
//     expiry: "2024-12-31",
//     status: "Còn hàng",
//     statusClass: "badge bg-success",
//     note: "Thuốc giảm đau, hạ sốt",
//     history: [
//       {
//         date: "2024-04-01",
//         type: "Nhập kho",
//         typeClass: "badge bg-success",
//         quantity: "+500",
//         user: "Admin",
//         note: "Nhập hàng định kỳ",
//       },
//       {
//         date: "2024-03-15",
//         type: "Xuất kho",
//         typeClass: "badge bg-danger",
//         quantity: "-100",
//         user: "Y tá A",
//         note: "Cấp phát cho học sinh",
//       },
//       {
//         date: "2024-03-01",
//         type: "Nhập kho",
//         typeClass: "badge bg-success",
//         quantity: "+1000",
//         user: "Admin",
//         note: "Nhập hàng mới",
//       },
//     ],
//   },
//   {
//     id: "MED002",
//     name: "Băng y tế",
//     type: "Vật tư",
//     typeClass: "badge bg-info",
//     quantity: 500,
//     unit: "Cuộn",
//     expiry: "2025-12-31",
//     status: "Sắp hết",
//     statusClass: "badge bg-warning text-dark",
//     note: "Dùng để băng bó vết thương",
//     history: [],
//   },
//   {
//     id: "MED003",
//     name: "Vitamin C",
//     type: "Thuốc",
//     typeClass: "badge bg-primary",
//     quantity: 200,
//     unit: "Viên",
//     expiry: "2024-06-30",
//     status: "Hết hàng",
//     statusClass: "badge bg-danger",
//     note: "Bổ sung vitamin cho học sinh",
//     history: [],
//   },
// ];

// const typeOptions = [
//   { value: "Thuốc", label: "Thuốc" },
//   { value: "Vật tư", label: "Vật tư y tế" },
// ];
// const unitOptions = ["Viên", "Chai", "Hộp", "Gói", "Cuộn", "Cái"];

// const MedicineInventory = () => {
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showHistoryModal, setShowHistoryModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [form, setForm] = useState({
//     type: typeOptions[0].value,
//     name: "",
//     quantity: "",
//     unit: unitOptions[0],
//     expiry: "",
//     note: "",
//   });

//   // Mở modal thêm mới
//   const handleShowAdd = () => {
//     setForm({
//       type: typeOptions[0].value,
//       name: "",
//       quantity: "",
//       unit: unitOptions[0],
//       expiry: "",
//       note: "",
//     });
//     setShowAddModal(true);
//   };
//   // Mở modal sửa
//   const handleShowEdit = (item) => {
//     setForm({
//       type: item.type,
//       name: item.name,
//       quantity: item.quantity,
//       unit: item.unit,
//       expiry: item.expiry,
//       note: item.note || "",
//     });
//     setSelectedItem(item);
//     setShowEditModal(true);
//   };
//   // Mở modal lịch sử
//   const handleShowHistory = (item) => {
//     setSelectedItem(item);
//     setShowHistoryModal(true);
//   };

//   return (
//     <div className="container py-4">
//       <section className="section">
//         <h2 className="mb-4">Quản lý kho thuốc</h2>
//         <div className="card border-0 shadow-sm mb-4">
//           <div className="card-body">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <div className="d-flex gap-2">
//                 <button className="btn btn-primary" onClick={handleShowAdd}>
//                   <i className="fas fa-plus"></i> Thêm thuốc/vật tư mới
//                 </button>
//                 <div className="dropdown">
//                   <button
//                     className="btn btn-outline-secondary dropdown-toggle"
//                     type="button"
//                   >
//                     Lọc theo loại
//                   </button>
//                   <ul className="dropdown-menu">
//                     <li>
//                       <a className="dropdown-item" href="#">
//                         Tất cả
//                       </a>
//                     </li>
//                     <li>
//                       <a className="dropdown-item" href="#">
//                         Thuốc
//                       </a>
//                     </li>
//                     <li>
//                       <a className="dropdown-item" href="#">
//                         Vật tư y tế
//                       </a>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//               <div className="d-flex gap-2">
//                 <div className="input-group">
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Tìm kiếm..."
//                   />
//                   <button className="btn btn-outline-secondary" type="button">
//                     <i className="fas fa-search"></i>
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="table-responsive">
//               <table className="table table-hover align-middle mb-0">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Mã</th>
//                     <th>Tên thuốc/vật tư</th>
//                     <th>Loại</th>
//                     <th>Số lượng</th>
//                     <th>Đơn vị</th>
//                     <th>Hạn sử dụng</th>
//                     <th>Trạng thái</th>
//                     <th>Hành động</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {inventory.map((item) => (
//                     <tr key={item.id}>
//                       <td>{item.id}</td>
//                       <td>{item.name}</td>
//                       <td>
//                         <span className={item.typeClass}>{item.type}</span>
//                       </td>
//                       <td>{item.quantity}</td>
//                       <td>{item.unit}</td>
//                       <td>{item.expiry.split("-").reverse().join("/")}</td>
//                       <td>
//                         <span className={item.statusClass}>{item.status}</span>
//                       </td>
//                       <td>
//                         <button
//                           className="btn btn-sm btn-outline-primary me-1"
//                           onClick={() => handleShowEdit(item)}
//                         >
//                           <i className="fas fa-edit"></i>
//                         </button>
//                         <button
//                           className="btn btn-sm btn-outline-info me-1"
//                           onClick={() => handleShowHistory(item)}
//                         >
//                           <i className="fas fa-history"></i>
//                         </button>
//                         <button className="btn btn-sm btn-outline-danger">
//                           <i className="fas fa-trash"></i>
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//         {/* Thống kê kho */}
//         <div className="row g-4">
//           <div className="col-md-6">
//             <div className="card border-0 shadow-sm">
//               <div className="card-body">
//                 <h5 className="card-title mb-3">Thống kê tồn kho</h5>
//                 <div className="table-responsive">
//                   <table className="table table-bordered">
//                     <tbody>
//                       <tr>
//                         <td>Tổng số loại thuốc</td>
//                         <td>25</td>
//                       </tr>
//                       <tr>
//                         <td>Tổng số loại vật tư</td>
//                         <td>15</td>
//                       </tr>
//                       <tr>
//                         <td>Số thuốc sắp hết hạn</td>
//                         <td>5</td>
//                       </tr>
//                       <tr>
//                         <td>Số thuốc hết hàng</td>
//                         <td>3</td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-6">
//             <div className="card border-0 shadow-sm">
//               <div className="card-body">
//                 <h5 className="card-title mb-3">Cảnh báo</h5>
//                 <div className="alert alert-warning mb-2">
//                   <i className="fas fa-exclamation-triangle me-2"></i>
//                   Vitamin C sắp hết hạn (còn 30 ngày)
//                 </div>
//                 <div className="alert alert-danger mb-2">
//                   <i className="fas fa-exclamation-circle me-2"></i>
//                   Băng y tế sắp hết hàng (còn 50 cuộn)
//                 </div>
//                 <div className="alert alert-info mb-0">
//                   <i className="fas fa-info-circle me-2"></i>
//                   Có 3 yêu cầu thuốc mới cần duyệt
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Modal Thêm thuốc/vật tư mới */}
//       <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
//         <Form>
//           <Modal.Header closeButton>
//             <Modal.Title>Thêm thuốc/vật tư mới</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form.Group className="mb-3">
//               <Form.Label>Loại</Form.Label>
//               <Form.Select
//                 value={form.type}
//                 onChange={(e) => setForm({ ...form, type: e.target.value })}
//               >
//                 {typeOptions.map((opt) => (
//                   <option key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Tên thuốc/vật tư</Form.Label>
//               <Form.Control
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Số lượng</Form.Label>
//               <Form.Control
//                 type="number"
//                 value={form.quantity}
//                 onChange={(e) => setForm({ ...form, quantity: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Đơn vị</Form.Label>
//               <Form.Select
//                 value={form.unit}
//                 onChange={(e) => setForm({ ...form, unit: e.target.value })}
//               >
//                 {unitOptions.map((opt) => (
//                   <option key={opt} value={opt}>
//                     {opt}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Hạn sử dụng</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={form.expiry}
//                 onChange={(e) => setForm({ ...form, expiry: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Ghi chú</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 value={form.note}
//                 onChange={(e) => setForm({ ...form, note: e.target.value })}
//               />
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowAddModal(false)}>
//               Hủy
//             </Button>
//             <Button variant="primary" type="submit">
//               Thêm mới
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>

//       {/* Modal Chỉnh sửa thuốc/vật tư */}
//       <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
//         <Form>
//           <Modal.Header closeButton>
//             <Modal.Title>Chỉnh sửa thông tin thuốc/vật tư</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form.Group className="mb-3">
//               <Form.Label>Loại</Form.Label>
//               <Form.Select
//                 value={form.type}
//                 onChange={(e) => setForm({ ...form, type: e.target.value })}
//               >
//                 {typeOptions.map((opt) => (
//                   <option key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Tên thuốc/vật tư</Form.Label>
//               <Form.Control
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Số lượng</Form.Label>
//               <Form.Control
//                 type="number"
//                 value={form.quantity}
//                 onChange={(e) => setForm({ ...form, quantity: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Đơn vị</Form.Label>
//               <Form.Select
//                 value={form.unit}
//                 onChange={(e) => setForm({ ...form, unit: e.target.value })}
//               >
//                 {unitOptions.map((opt) => (
//                   <option key={opt} value={opt}>
//                     {opt}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Hạn sử dụng</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={form.expiry}
//                 onChange={(e) => setForm({ ...form, expiry: e.target.value })}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Ghi chú</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 value={form.note}
//                 onChange={(e) => setForm({ ...form, note: e.target.value })}
//               />
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowEditModal(false)}>
//               Hủy
//             </Button>
//             <Button variant="primary" type="submit">
//               Lưu thay đổi
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>

//       {/* Modal Lịch sử nhập xuất */}
//       <Modal
//         show={showHistoryModal}
//         onHide={() => setShowHistoryModal(false)}
//         size="lg"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Lịch sử nhập xuất</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="mb-3">
//             <strong>Tên thuốc/vật tư:</strong> {selectedItem?.name}
//           </div>
//           <div className="table-responsive">
//             <Table hover>
//               <thead className="table-light">
//                 <tr>
//                   <th>Ngày</th>
//                   <th>Loại</th>
//                   <th>Số lượng</th>
//                   <th>Người thực hiện</th>
//                   <th>Ghi chú</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedItem?.history && selectedItem.history.length > 0 ? (
//                   selectedItem.history.map((h, idx) => (
//                     <tr key={idx}>
//                       <td>{h.date.split("-").reverse().join("/")}</td>
//                       <td>
//                         <span className={h.typeClass}>{h.type}</span>
//                       </td>
//                       <td>{h.quantity}</td>
//                       <td>{h.user}</td>
//                       <td>{h.note}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={5} className="text-center text-muted">
//                       Chưa có lịch sử
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowHistoryModal(false)}
//           >
//             Đóng
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

const MedicineInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState({ id: "", name: "", quantity: "" });
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // Fetch danh sách vật tư y tế
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const respond = await axios.get(
        "http://localhost:5182/api/MedicalSupply",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInventory(respond.data.data || []);
    } catch (error) {
      setError("Failed to fetch inventory.");
      console.error("Fetch error:", error);
    }
  };

  //Mở modal thêm mới
  const handleShowAdd = () => {
    setForm({ id: "", name: "", quantity: "" });
    setShowAddModal(true);
  };

  // Mở modal sửa
  const handleShowEdit = (item) => {
    setForm({ id: item.id, name: item.name, quantity: item.quantity });
    setShowEditModal(true);
  };

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //Thêm vật tư
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5182/api/MedicalSupply",
        { name: form.name, quantity: form.quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setInventory([...inventory, response.data]);
      setShowAddModal(false);
      fetchInventory(); //cập nhật lại danh sách
    } catch (error) {
      setError("Faild to add item.");
      console.log("Add error:", error);
    }
  };

  //Cập nhật vật tư
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:5182/api/MedicalSupply/${form.id}`,
        {
          name: form.name,
          quantity: form.quantity,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setInventory(
        inventory.map((item) =>
          item.id === form.id ? { ...item, ...form } : item
        )
      );

      setShowEditModal(false);
      fetchInventory(); //cập nhật lại danh sách
    } catch (error) {
      setError("Failed to update item.");
      console.log("Update error:", error);
    }
  };

  //Xóa vật tư
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `http://localhost:5182/api/MedicalSupply/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInventory(inventory.filter((item) => item.id !== id));
    } catch (error) {
      setError("Faild to delete item.");
      console.log("Delete error:", error);
    }
  };

  return (
    <div className="container py-4">
      <section className="section">
        <h2 className="mb-4">Quản lý kho vật tư y tế</h2>
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={handleShowAdd}>
                  <i className="fas fa-plus"></i> Thêm vật tư mới
                </button>
              </div>
              <div className="d-flex gap-2">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm..."
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Mã</th>
                    <th>Tên vật tư</th>
                    <th>Số lượng</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => handleShowEdit(item)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
          </div>
        </div>
      </section>

      {/* Modal Thêm vật tư mới */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Form onSubmit={handleAdd}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm vật tư mới</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tên vật tư</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số lượng</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Thêm mới
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Chỉnh sửa vật tư */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Form onSubmit={handleUpdate}>
          <Modal.Header closeButton>
            <Modal.Title>Chỉnh sửa vật tư</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tên vật tư</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số lượng</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Lưu thay đổi
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default MedicineInventory;
