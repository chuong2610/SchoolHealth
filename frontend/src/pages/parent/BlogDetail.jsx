import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Badge, Spinner, Alert } from "react-bootstrap";
import { FaArrowLeft, FaCalendarAlt, FaUser, FaClock, FaTags, FaBookOpen } from "react-icons/fa";
import axios from "axios";
// Styles được import từ main.jsx

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        if (typeof response.data.content === "string") {
          response.data.content = JSON.parse(response.data.content);
        }

        setBlog(response.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="parent-theme">
        <style>
          {`
            .blog-loading {
              background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
              min-height: 100vh !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
            
            .loading-content {
              text-align: center !important;
              background: white !important;
              padding: 3rem !important;
              border-radius: 20px !important;
              box-shadow: 0 10px 30px rgba(37, 99, 235, 0.15) !important;
            }
            
            .loading-spinner {
              color: #2563eb !important;
              width: 3rem !important;
              height: 3rem !important;
              margin-bottom: 1rem !important;
            }
          `}
        </style>
        <div className="blog-loading">
          <div className="loading-content">
            <Spinner animation="border" className="loading-spinner" />
            <h5>Đang tải bài viết...</h5>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="parent-theme">
        <Container className="py-5">
          <Alert variant="danger" className="text-center">
            <h5>Có lỗi xảy ra</h5>
            <p>{error || "Bài viết không tồn tại."}</p>
            <Button variant="primary" onClick={() => navigate(-1)}>
              <FaArrowLeft className="me-2" />
              Quay lại
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="parent-theme">
      <style>
        {`
          .blog-detail-page {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            min-height: 100vh !important;
            padding: 2rem 0 !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
          }
          
          .blog-header {
            background: linear-gradient(135deg, #2563eb 0%, #38b6ff 100%) !important;
            color: white !important;
            padding: 2rem 0 !important;
            margin-bottom: 3rem !important;
            border-radius: 0 0 30px 30px !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          .blog-header::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1.5" fill="white" opacity="0.08"/><circle cx="40" cy="80" r="2.5" fill="white" opacity="0.06"/></svg>') repeat !important;
            pointer-events: none !important;
          }
          
          .header-content {
            position: relative !important;
            z-index: 2 !important;
          }
          
          .back-btn {
            background: rgba(255, 255, 255, 0.2) !important;
            border: 2px solid rgba(255, 255, 255, 0.3) !important;
            color: white !important;
            padding: 0.75rem 1.5rem !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
          }
          
          .back-btn:hover {
            background: rgba(255, 255, 255, 0.3) !important;
            border-color: rgba(255, 255, 255, 0.5) !important;
            color: white !important;
            transform: translateX(-5px) !important;
          }
          
          .blog-container {
            margin: -2rem 1rem 0 1rem !important;
            position: relative !important;
            z-index: 10 !important;
            max-width: 900px !important;
          }
          
          .blog-card {
            background: white !important;
            border-radius: 25px !important;
            box-shadow: 0 15px 50px rgba(37, 99, 235, 0.15) !important;
            border: none !important;
            overflow: hidden !important;
          }
          
          .blog-image {
            width: 100% !important;
            height: 400px !important;
            object-fit: cover !important;
            border-radius: 25px 25px 0 0 !important;
          }
          
          .blog-content {
            padding: 3rem 2rem !important;
          }
          
          .blog-title {
            font-size: 2.5rem !important;
            font-weight: 800 !important;
            color: #1f2937 !important;
            margin-bottom: 1.5rem !important;
            line-height: 1.3 !important;
          }
          
          .blog-meta {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 1.5rem !important;
            margin-bottom: 2rem !important;
            padding-bottom: 1.5rem !important;
            border-bottom: 2px solid #e5e7eb !important;
          }
          
          .meta-item {
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
            color: #6b7280 !important;
            font-weight: 600 !important;
            font-size: 0.95rem !important;
          }
          
          .meta-icon {
            color: #2563eb !important;
          }
          
          .blog-content-section {
            margin-bottom: 2rem !important;
          }
          
          .section-title {
            font-size: 1.5rem !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
            margin-bottom: 1rem !important;
            padding-bottom: 0.5rem !important;
            border-bottom: 2px solid #e5e7eb !important;
          }
          
          .content-text {
            font-size: 1.1rem !important;
            color: #374151 !important;
            line-height: 1.8 !important;
            margin-bottom: 1rem !important;
          }
          
          .content-list {
            list-style: none !important;
            padding: 0 !important;
          }
          
          .content-list li {
            padding: 0.5rem 0 !important;
            padding-left: 1.5rem !important;
            position: relative !important;
            color: #374151 !important;
            line-height: 1.6 !important;
          }
          
          .content-list li::before {
            content: '•' !important;
            color: #2563eb !important;
            font-weight: bold !important;
            position: absolute !important;
            left: 0 !important;
          }
          
          .subsection-title {
            font-size: 1.25rem !important;
            font-weight: 600 !important;
            color: #2563eb !important;
            margin: 1.5rem 0 1rem 0 !important;
          }
          
          .blog-actions {
            background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%) !important;
            padding: 2rem !important;
            border-radius: 0 0 25px 25px !important;
            text-align: center !important;
          }
          
          .action-btn {
            background: linear-gradient(135deg, #2563eb, #38b6ff) !important;
            border: none !important;
            color: white !important;
            padding: 1rem 2rem !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
          }
          
          .action-btn:hover {
            background: linear-gradient(135deg, #1d4ed8, #2563eb) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3) !important;
            color: white !important;
          }
          
          @media (max-width: 768px) {
            .blog-title {
              font-size: 2rem !important;
            }
            
            .blog-container {
              margin: -1rem 0.5rem 0 0.5rem !important;
            }
            
            .blog-content {
              padding: 2rem 1.5rem !important;
            }
            
            .blog-image {
              height: 250px !important;
            }
            
            .blog-meta {
              flex-direction: column !important;
              gap: 0.75rem !important;
            }
          }
        `}
      </style>

      <div className="blog-detail-page">
        {/* Header */}
        <div className="blog-header">
          <Container>
            <div className="header-content">
              <Button variant="outline-light" className="back-btn" onClick={() => navigate(-1)}>
                <FaArrowLeft className="me-2" />
                Quay lại
              </Button>
            </div>
          </Container>
        </div>

        {/* Main Content */}
        <Container className="blog-container">
          <Card className="blog-card">
            {/* Blog Image */}
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="blog-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.jp/800x400.png?text=No+Image";
              }}
            />

            {/* Blog Content */}
            <div className="blog-content">
              <h1 className="blog-title">{blog.title}</h1>

              <div className="blog-meta">
                <div className="meta-item">
                  <FaCalendarAlt className="meta-icon" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <div className="meta-item">
                  <FaUser className="meta-icon" />
                  <span>Hệ thống Y tế Học đường</span>
                </div>
                <div className="meta-item">
                  <FaClock className="meta-icon" />
                  <span>5 phút đọc</span>
                </div>
                <div className="meta-item">
                  <FaTags className="meta-icon" />
                  <Badge bg="primary">Sức khỏe học đường</Badge>
                </div>
              </div>

              {/* Render content from JSON */}
              {blog.content && (
                <>
                  <div className="blog-content-section">
                    <h2 className="section-title">Giới thiệu</h2>
                    <p className="content-text">{blog.content.Introduction}</p>
                  </div>

                  <div className="blog-content-section">
                    <h2 className="section-title">Các triệu chứng</h2>
                    <ul className="content-list">
                      {blog.content.symptoms?.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="blog-content-section">
                    <h2 className="section-title">Cách phòng tránh</h2>

                    <h3 className="subsection-title">Tiêm phòng</h3>
                    <p className="content-text">{blog.content.prevention?.vaccination}</p>

                    <h3 className="subsection-title">Vệ sinh cá nhân</h3>
                    <ul className="content-list">
                      {blog.content.prevention?.personalHygiene?.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>

                    <h3 className="subsection-title">Tăng cường sức đề kháng</h3>
                    <ul className="content-list">
                      {blog.content.prevention?.immunityBoost?.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="blog-content-section">
                    <h2 className="section-title">Khi nào cần gặp bác sĩ</h2>
                    <ul className="content-list">
                      {blog.content.whenToSeeDoctor?.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Blog Actions */}
            <div className="blog-actions">
              <Button className="action-btn" onClick={() => navigate(-1)}>
                <FaBookOpen className="me-2" />
                Xem thêm bài viết
              </Button>
            </div>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default BlogDetail;
