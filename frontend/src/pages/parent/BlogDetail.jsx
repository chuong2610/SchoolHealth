import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Gọi API khi component được muont hoặc khi id thay đổi
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5182/api/BlogPosts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBlog(response.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]); //dependancy array khi có id, chạy lại khi id thay đổi

  //bắt đầu sử lí phần loading và lỗi
  if (loading) {
    return (
      <div
        style={{ background: "#f5f7fa", minHeight: "100vh", padding: "32px 0" }}
      >
        <div className="container" style={{ maxWidth: 800 }}>
          <p className="text-center">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div
        style={{ background: "#f5f7fa", minHeight: "100vh", padding: "32px 0" }}
      >
        <div className="container" style={{ maxWidth: 800 }}>
          <p className="text-center text-danger">
            {error || "Bài viết không tồn tại."}
          </p>
          <button
            className="btn btn-outline-primary d-block mx-auto"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  //Kết thúc hàm format ngày

  return (
    <div
      style={{ background: "#f5f7fa", minHeight: "100vh", padding: "32px 0" }}
    >
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="card-img-top rounded-top-4"
            style={{ maxHeight: 320, objectFit: "cover" }}
            //sử lí lỗi
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.jp/800x180.png?text=No+Image";
            }}
            //kết thúc sử lí lỗi
          />
          <div className="card-body p-4">
            <div className="text-muted mb-2" style={{ fontSize: 16 }}>
              {formatDate(blog.createdAt)}
            </div>
            <h1 className="fw-bold mb-3" style={{ fontSize: 30 }}>
              {blog.title}
            </h1>

            {/* Nội dung HTML từ API */}
            <div
              className="blog-content"
              style={{ lineHeight: 1.7, fontSize: 16 }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>

            <button
              className="btn btn-outline-primary mt-4"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left me-2"></i>Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
