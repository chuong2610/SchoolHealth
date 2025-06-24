import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";

const MedicineInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState({ id: "", name: "", quantity: "" });
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  //debounce search
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  const fetchInventory = async () => {
    try {
      const respond = await axiosInstance.get(
        `/MedicalSupply?pageNumber=${currentPage}&pageSize=3${
          search ? `&search=${search}` : ""
        } `,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = respond.data.data || [];
      console.log("Fetched inventory:", data); // Log toàn bộ dữ liệu
      setInventory(data.items || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      setError("Failed to fetch inventory.");
      console.error("Fetch error:", error);
    }
  };

  // Fetch danh sách vật tư y tế
  useEffect(() => {
    fetchInventory();
  }, [currentPage, search]);

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
    if (name === "quantity") {
      const parsedValue = parseInt(value) || 1; //chuyển đổi thành số mặc định là 1 nếu không hợp lệ
      setForm((prev) => ({
        ...prev,
        [name]: Math.max(1, parsedValue), //đảm bảo không dưới 1
      }));
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //Thêm vật tư
  const handleAdd = async (e) => {
    e.preventDefault();
    if (form.quantity < 1) {
      setError("Số lượng phải lớn hơn hoặc bằng 1.");
      return;
    }
    try {
      const response = await axiosInstance.post(
        "/MedicalSupply",
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
    if (form.quantity < 1) {
      setError("Số lượng phải lớn hơn hoặc bằng 1.");
      return;
    }
    try {
      const response = await axiosInstance.patch(
        `/MedicalSupply/${form.id}`,
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
  const handleDelete = async (id) => {
    // Thêm log để kiểm tra id
    console.log("Received id for delete:", id, "Type:", typeof id); // Log id
    try {
      const response = await axiosInstance.delete(
        `/MedicalSupply/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInventory(inventory.filter((item) => item.id !== id));
    } catch (error) {
      setError("Failed to delete item.");
      console.log("Delete error:", error);
    }
  };

  //lấy số trang
  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (currentPage === 1) {
      endPage = Math.min(totalPages, 3);
    }

    if (currentPage === totalPages) {
      startPage = Math.max(1, totalPages - 2);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
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
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 d-flex justify-content-center">
                  <nav>
                    <ul className="pagination">
                      {currentPage > 1 && (
                        <li className="page-item">
                          <button
                            className="page-link"
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                          >
                            &laquo;
                          </button>
                        </li>
                      )}

                      {getPageNumbers().map((page) => (
                        <li
                          key={page}
                          className={`page-item ${
                            currentPage === page ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}

                      {currentPage < totalPages && (
                        <li className="page-item">
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                          >
                            &raquo;
                          </button>
                        </li>
                      )}
                    </ul>
                  </nav>
                </div>
              )}

              {/** */}
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
                min="1" // Thêm thuộc tính min
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
                min="1" // Thêm thuộc tính min
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
