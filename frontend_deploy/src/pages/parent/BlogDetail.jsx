import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaTags,
  FaBookOpen,
} from "react-icons/fa";
import axios from "axios";
import styles from "./BlogDetail.module.css";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/BlogPosts/${id}`, {
          headers: {
            "Cache-Control": "no-cache",
          },
        });

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
      <div className={styles.loadingBox}>
        <Spinner animation="border" className={styles.spinner} />
        <h5 className={styles.loadingText}>Đang tải bài viết...</h5>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className={styles.errorBox}>
        <h5>Có lỗi xảy ra</h5>
        <p>{error || "Bài viết không tồn tại."}</p>
        <Button
          className={styles.backBtn}
          variant="primary"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className={styles.iconLeft} />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgTop}></div>
      <div className={styles.container}>
        <div className={styles.card}>
          <img
            className={styles.image}
            src={blog.imageUrl}
            alt={blog.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.jp/800x400.png?text=No+Image";
            }}
          />
          <div className={styles.contentBox}>
            <h1 className={styles.title}>{blog.title}</h1>
            <div className={styles.metaBox}>
              <div className={styles.metaItem}>
                <FaCalendarAlt /> <span>{formatDate(blog.createdAt)}</span>
              </div>
              <div className={styles.metaItem}>
                <FaUser /> <span>Hệ thống Y tế Học đường</span>
              </div>
              <div className={styles.metaItem}>
                <FaClock /> <span>5 phút đọc</span>
              </div>
              <div className={styles.metaItem}>
                <FaTags />{" "}
                <span className={styles.badge}>Sức khỏe học đường</span>
              </div>
            </div>
            {blog.content && (
              <div className={styles.contentSection}>
                <h2 className={styles.sectionTitle}>Nội dung</h2>
                <div
                  className={styles.htmlContent}
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>
            )}
          </div>
        </div>
        <div className={styles.backBox}>
          <Button
            className={styles.backBtn}
            variant="outline-secondary"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className={styles.iconLeft} />
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
