import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const BlogPostList = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;
  const [isDeleting, setIsDeleting] = useState(false); // ✅ NEW

  const fetchBlogPost = async () => {
    try {
      const response = await axiosInstance.get(
        `/BlogPosts?pageNumber=${currentPage}&pageSize=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // setBlogPosts(response.data.items || []);
      setBlogPosts(response.data.items || []);
      setTotalPages(response.data.totalPages);
      setError("");
    } catch (error) {
      setError("Không thể tải danh sách blog.");
      console.error("Error fetching blog posts:", error);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa blog này không?")) return;

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
        return; // // ✅ Sau dòng này, code không chạy tiếp xuống dưới nữa
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
        setError("Không thể xóa blog.");
      }
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="container mt-4">
      <h2 className="d-flex justify-content-center mb-5">Quản lí Blog Posts</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Link to="/admin/create-blog" className="btn btn-primary me-2">
            Tạo Blog Post
          </Link>
          <Link to="/admin/blog-posts" className="btn btn-primary">
            Xem danh sách Blog Posts
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tiêu đề</th>
              <th>Thời gian tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {blogPosts.map((post, index) => (
              <tr key={post.id}>
                <td>{(currentPage - 1) * pageSize + index + 1}</td>
                <td>{post.title}</td>
                <td>{formatDate(post.createdAt)}</td>
                <td>
                  <Link
                    to={`/admin/edit-blog/${post.id}`}
                    className="btn btn-success btn-sm me-2"
                  >
                    Cập nhật
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(post.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="mt-4 d-flex justify-content-center">
            <nav>
              <ul className="pagination">
                {currentPage > 1 && (
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      &laquo;
                    </button>
                  </li>
                )}

                {getPageNumbers().map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      page === currentPage ? "active" : ""
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
      </div>
    </div>
  );
};

export default BlogPostList;
