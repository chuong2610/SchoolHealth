import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import {
  FaPlus,
  FaUser,
  FaPen,
  FaImage,
  FaSave,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaList,
  FaFileAlt
} from "react-icons/fa";
import "../../styles/admin/create-blog-post.css";
const CreateBlogPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    imageUrl: "", //lưu file ảnh
    image: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      setImageUploading(true);
      setError("");
      const res = await axiosInstance.post("/Upload/image", uploadFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;

      // Chỉ lưu tên file được backend trả về vào userInfo
      setFormData((prev) => ({
        ...prev,
        imageUrl: data.fileName, // Ví dụ: "abc123.jpg"
      }));
      setSuccess("Upload ảnh thành công!");
    } catch (error) {
      setError("Tải ảnh thất bại! Vui lòng thử lại.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.title.trim()) {
      setError("Tiêu đề không được để trống");
      return;
    }

    if (!formData.author.trim()) {
      setError("Tác giả không được để trống");
      return;
    }

    if (!formData.content.trim()) {
      setError("Nội dung không được để trống");
      return;
    }

    // Sử dụng object JSON thay vì FormData
    const data = {
      title: formData.title,
      content: formData.content,
      author: formData.author,
      imageUrl: formData.imageUrl || "none",
    };

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/BlogPosts",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Đúng với dữ liệu JSON
          },
        }
      );
      setSuccess("Tạo bài viết thành công!");
      setFormData({
        title: "",
        content: "",
        author: "",
        imageUrl: "", // sửa lại thành imageUrl
      });
      setTimeout(() => navigate("/admin/blog-posts"), 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Tạo bài viết thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-create-blog-container">
      {/* Header */}
      <div className="admin-create-blog-header">
        <h1 className="admin-create-blog-title">
          <FaPlus />
          Tạo bài viết mới
        </h1>
        <p className="admin-create-blog-subtitle">
          Tạo và chia sẻ nội dung hữu ích với cộng đồng
        </p>
      </div>

      {/* Action Buttons */}
      <div className="admin-create-blog-actions">
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/admin/create-blog" className="admin-create-blog-btn admin-create-blog-btn-primary">
            <FaPlus />
            Tạo bài viết
          </Link>
          <Link to="/admin/blog-posts" className="admin-create-blog-btn admin-create-blog-btn-secondary">
            <FaList />
            Quản lý bài viết
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="admin-create-blog-alert admin-create-blog-alert-danger">
          <FaExclamationTriangle />
          {error}
        </div>
      )}
      {success && (
        <div className="admin-create-blog-alert admin-create-blog-alert-success">
          <FaCheckCircle />
          {success}
        </div>
      )}

      {/* Form */}
      <div className="admin-create-blog-form-container">
        <form onSubmit={handleSubmit}>
          <div className="admin-create-blog-form-group">
            <label className="admin-create-blog-label required">
              <FaPen style={{ marginRight: "0.5rem" }} />
              Tiêu đề bài viết
            </label>
            <input
              type="text"
              className="admin-create-blog-input"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nhập tiêu đề bài viết..."
              required
            />
          </div>

          <div className="admin-create-blog-form-group">
            <label className="admin-create-blog-label required">
              <FaUser style={{ marginRight: "0.5rem" }} />
              Tác giả
            </label>
            <input
              type="text"
              className="admin-create-blog-input"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Nhập tên tác giả..."
              required
            />
          </div>

          <div className="admin-create-blog-form-group">
            <label className="admin-create-blog-label required">
              <FaFileAlt style={{ marginRight: "0.5rem" }} />
              Nội dung bài viết
            </label>
            <div className="admin-create-blog-editor">
              <ReactQuill
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Viết nội dung bài viết của bạn tại đây..."
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ color: [] }, { background: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ align: [] }],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
                formats={[
                  "header",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "color",
                  "background",
                  "list",
                  "bullet",
                  "align",
                  "link",
                  "image",
                ]}
              />
            </div>
          </div>

          <div className="admin-create-blog-form-group">
            <label className="admin-create-blog-label">
              <FaImage style={{ marginRight: "0.5rem" }} />
              Ảnh đại diện
            </label>
            <input
              type="file"
              className="admin-create-blog-file-input"
              accept="image/*"
              onChange={handleImageChange}
              disabled={imageUploading}
            />
            <small className="admin-create-blog-file-hint">
              Chấp nhận các định dạng: JPG, PNG, GIF. Kích thước tối đa: 5MB
            </small>

            {imageUploading && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "1rem",
                color: "#4ECDC4"
              }}>
                <FaSpinner className="fa-spin" />
                Đang upload ảnh...
              </div>
            )}

            {formData.imageUrl && (
              <div className="admin-create-blog-image-preview">
                <label className="admin-create-blog-image-label">Ảnh đã chọn:</label>
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL_IMAGE}/uploads/${formData.imageUrl}`}
                  alt="Preview"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="admin-create-blog-btn admin-create-blog-btn-submit"
            disabled={loading || imageUploading}
          >
            {loading ? (
              <div className="admin-create-blog-loading">
                <div className="admin-create-blog-spinner"></div>
                Đang tạo bài viết...
              </div>
            ) : (
              <>
                <FaSave />
                Tạo bài viết
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPost;
