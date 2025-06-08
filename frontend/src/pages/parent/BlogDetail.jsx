import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const blog = blogData.find((b) => b.id === id) || blogData[0];
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API khi component được muont hoặc khi id thay đổi
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiZW1haWwiOiJwYXJlbnRAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiUGFyZW50IiwiZXhwIjoxNzQ5MDM4OTI3LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxODIiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUxODIifQ.bPbFgD4y0GGSlryFzZj7YYYzlkWFL9pDbg6uHdZGz4U";
        const response = await axios.get(
          `http://localhost:5182/api/BlogPosts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        //Parse chuỗi JSON trong content
        if (typeof response.data.content === "string") {
          response.data.content = JSON.parse(response.data.content);
        }
        // response.data.content = JSON.parse(response.data.content);
        //Kết thúc việc parse chuỗi

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
  //kết thúc sử lí phần loading và lỗi

  //Hàm format ngày
  // const formatDate = (dateString) => {
  //   return (
  //     new Date(dateString).toLocaleDateString("vi-VN"),
  //     {
  //       day: "2-digit",
  //       month: "2-digit",
  //       year: "numeric",
  //     }
  //   );
  // };

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
              {blog.createdAt}
            </div>
            <h1 className="fw-bold mb-3" style={{ fontSize: 30 }}>
              {blog.title}
            </h1>

            {/* Render nội dung từ JSON */}
            <div>
              <h2>Giới thiệu</h2>
              <p>{blog.content.Introduction}</p>

              <h2>Các triệu chứng</h2>
              <ul>
                {blog.content.symptoms.map((sympton, index) => (
                  <li key={index}>{sympton}</li>
                ))}
              </ul>

              <h2>Cách phòng tránh</h2>
              <h3>Tiêm phòng</h3>
              <p>{blog.content.prevention.vaccination}</p>
              <h3>Vệ sinh cá nhân</h3>
              <ul>
                {blog.content.prevention.personalHygiene.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h3>Tăng cường sức đề kháng</h3>
              <ul>
                {blog.content.prevention.immunityBoost.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h2>Khi nào cần gặp bác sĩ</h2>
              <ul>
                {blog.content.whenToSeeDoctor.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

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
