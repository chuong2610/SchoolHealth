import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import {
  FaList,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaSpinner,
  FaFileAlt,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import "../../styles/admin/blog-post-list.css";

const BlogPostList = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 3;
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/BlogPosts?pageNumber=${currentPage}&pageSize=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlogPosts(response.data.items || []);
      setTotalPages(response.data.totalPages);
      setError("");
    } catch (error) {
      setError("Không thể tải danh sách blog posts. Vui lòng thử lại.");
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Lắng nghe currentPage hoặc isDeleting
  useEffect(() => {
    if (!isDeleting) fetchBlogPost();
  }, [currentPage, isDeleting]);

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);
    if (currentPage === 1) endPage = Math.min(3, totalPages);
    if (currentPage === totalPages) startPage = Math.max(1, totalPages - 2);
    const pages = [];
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Bạn có chắc muốn xóa blog "${title}" không?\n\nThao tác này không thể hoàn tác.`)) return;

    try {
      setIsDeleting(true);
      await axiosInstance.delete(`/BlogPosts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Nếu chỉ còn 1 blog và không phải trang đầu → lùi trang
      if (blogPosts.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
        // Đợi một chút rồi fetch (đảm bảo currentPage đã cập nhật)
        setTimeout(() => {
          fetchBlogPost();
          setIsDeleting(false);
        }, 200); // Delay nhẹ cho React cập nhật xong state
        return;
      }

      await fetchBlogPost();
      setIsDeleting(false);
    } catch (error) {
      console.error("Xóa thất bại:", error);
      if (error.response?.status === 404) {
        // Đã xóa rồi nhưng phản hồi 404
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
        else fetchBlogPost();
      } else {
        setError("Không thể xóa blog post. Vui lòng thử lại.");
      }
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Không xác định";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Không xác định";
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="admin-blog-list-container">
        <div className="admin-blog-list-loading">
          <div className="admin-blog-list-spinner"></div>
          <p style={{ color: "white", marginLeft: "1rem", fontSize: "1.2rem" }}>
            Đang tải danh sách blog posts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-blog-list-container">
      {/* Header */}
      <div className="admin-blog-list-header">
        <h1 className="admin-blog-list-title">
          <FaList />
          Quản lý Blog Posts
        </h1>
        <p className="admin-blog-list-subtitle">
          Xem, chỉnh sửa và quản lý tất cả các bài viết blog của hệ thống
        </p>
      </div>

      {/* Action Buttons */}
      <div className="admin-blog-list-actions">
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/admin/create-blog" className="admin-blog-list-btn admin-blog-list-btn-primary">
            <FaPlus />
            Tạo bài viết mới
          </Link>
          <Link to="/admin/blog-posts" className="admin-blog-list-btn admin-blog-list-btn-secondary">
            <FaList />
            Danh sách bài viết
          </Link>
        </div>
      </div>

      {/* Alert */}
      {error && (
        <div className="admin-blog-list-alert admin-blog-list-alert-danger">
          <FaExclamationTriangle />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="admin-blog-list-table-container">
        {blogPosts.length === 0 ? (
          <div className="admin-blog-list-empty-state">
            <FaFileAlt className="admin-blog-list-empty-icon" />
            <h3 className="admin-blog-list-empty-title">Chưa có bài viết nào</h3>
            <p className="admin-blog-list-empty-subtitle">
              Hãy tạo bài viết đầu tiên của bạn để bắt đầu chia sẻ nội dung!
            </p>
            <Link to="/admin/create-blog" className="admin-blog-list-btn admin-blog-list-btn-primary" style={{ marginTop: "1rem" }}>
              <FaPlus />
              Tạo bài viết đầu tiên
            </Link>
          </div>
        ) : (
          <>
            <table className="admin-blog-list-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tiêu đề</th>
                  <th>Tác giả</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {blogPosts.map((post, index) => (
                  <tr key={post.id}>
                    <td>
                      <strong>#{(currentPage - 1) * pageSize + index + 1}</strong>
                    </td>
                    <td>
                      <div style={{
                        maxWidth: "300px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: "600",
                        color: "#2d3748"
                      }}>
                        {post.title}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: "500", color: "#4a5568" }}>
                        {post.author || "Không xác định"}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <FaCalendarAlt style={{ color: "#4ECDC4" }} />
                        {formatDate(post.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div className="admin-blog-list-action-btns">
                        <Link
                          to={`/admin/edit-blog/${post.id}`}
                          className="admin-blog-list-action-btn admin-blog-list-action-btn-edit"
                          title="Chỉnh sửa bài viết"
                        >
                          <FaEdit />
                          Sửa
                        </Link>
                        <button
                          className="admin-blog-list-action-btn admin-blog-list-action-btn-delete"
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={isDeleting}
                          title="Xóa bài viết"
                        >
                          {isDeleting ? <FaSpinner className="fa-spin" /> : <FaTrash />}
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="admin-blog-list-pagination-container">
                <ul className="admin-blog-list-pagination">
                  {currentPage > 1 && (
                    <li className="admin-blog-list-pagination-item">
                      <button
                        className="admin-blog-list-pagination-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        title="Trang trước"
                      >
                        <FaChevronLeft />
                      </button>
                    </li>
                  )}

                  {getPageNumbers().map((page) => (
                    <li
                      key={page}
                      className={`admin-blog-list-pagination-item ${page === currentPage ? "active" : ""
                        }`}
                    >
                      <button
                        className="admin-blog-list-pagination-link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}

                  {currentPage < totalPages && (
                    <li className="admin-blog-list-pagination-item">
                      <button
                        className="admin-blog-list-pagination-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        title="Trang sau"
                      >
                        <FaChevronRight />
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPostList;
