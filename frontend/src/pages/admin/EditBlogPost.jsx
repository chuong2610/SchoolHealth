import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axiosInstance from "../../api/axiosInstance";
import {
  FaEdit,
  FaUser,
  FaPen,
  FaImage,
  FaSave,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner
} from "react-icons/fa";
import "../../styles/admin/edit-blog-post.css";

const EditBlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "", // Sử dụng ReactQuill cho content HTML
    imageUrl: "",
    image: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      setPageLoading(true);
      const response = await axiosInstance.get(`/BlogPosts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({
        title: response.data.title || "",
        author: response.data.author || "",
        content: response.data.content || "", //HTML từ api
        imageUrl: response.data.imageUrl || "",
      });
    } catch (error) {
      setError("Không thể tải thông tin bài viết. Vui lòng thử lại.");
      console.error(
        "Fetch error: ",
        error.response ? error.response.data : error.message
      );
    } finally {
      setPageLoading(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (!formData.title.trim()) {
      setError("Tiêu đề không được để trống");
      setLoading(false);
      return;
    }

    if (!formData.author.trim()) {
      setError("Tác giả không được để trống");
      setLoading(false);
      return;
    }

    // Chuẩn bị payload
    const updatedData = {
      title: formData.title,
      author: formData.author,
      content: formData.content,
    };

    if (isImageChanged) {
      updatedData.imageUrl = formData.imageUrl || "none"; // hoặc giữ nguyên formData.imageUrl
    }

    try {
      await axiosInstance.patch(`/BlogPosts/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setSuccess("Cập nhật bài viết thành công!");
      setTimeout(() => navigate("/admin/blog-posts"), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Cập nhật bài viết thất bại. Vui lòng thử lại.");
      console.error("Update error:", error); // Debug
    } finally {
      setLoading(false);
    }
  };

  //sử lí upload ảnh
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file); // Tên tham số backend yêu cầu

    try {
      setError("");
      const res = await axiosInstance.post(
        "/Upload/image", // API upload ảnh của bạn
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imagePath = res.data.filePath; // Lấy đường dẫn ảnh từ response
      const fileName = res.data.fileName; // giả sử backend trả về tên file
      setFormData((prev) => ({
        ...prev,
        imageUrl: fileName, // chỉ lưu 'abc123.jpg'
      }));
      setIsImageChanged(true);
      setSuccess("Upload ảnh thành công!");
    } catch (error) {
      console.error("Upload image failed:", error);
      setError("Upload ảnh thất bại. Vui lòng thử lại.");
    }
  };

  if (pageLoading) {
    return (
      <div className="admin-edit-blog-container">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="text-center">
            <FaSpinner className="fa-spin" style={{ fontSize: "3rem", color: "#4ECDC4" }} />
            <p className="mt-3" style={{ color: "white", fontSize: "1.2rem" }}>Đang tải thông tin bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-edit-blog-container">
      {/* Header */}
      <div className="admin-edit-blog-header">
        <h1 className="admin-edit-blog-title">
          <FaEdit />
          Chỉnh sửa bài viết
        </h1>
        <p className="admin-edit-blog-subtitle">
          Cập nhật thông tin và nội dung bài viết một cách dễ dàng
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="admin-edit-blog-alert admin-edit-blog-alert-danger">
          <FaExclamationTriangle />
          {error}
        </div>
      )}
      {success && (
        <div className="admin-edit-blog-alert admin-edit-blog-alert-success">
          <FaCheckCircle />
          {success}
        </div>
      )}

      {/* Form */}
      <div className="admin-edit-blog-form-container">
        <form onSubmit={handleSubmit}>
          <div className="admin-edit-blog-form-group">
            <label className="admin-edit-blog-label">
              <FaPen style={{ marginRight: "0.5rem" }} />
              Tiêu đề bài viết
            </label>
            <input
              type="text"
              className="admin-edit-blog-input"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nhập tiêu đề bài viết..."
              required
            />
          </div>

          <div className="admin-edit-blog-form-group">
            <label className="admin-edit-blog-label">
              <FaUser style={{ marginRight: "0.5rem" }} />
              Tác giả
            </label>
            <input
              type="text"
              className="admin-edit-blog-input"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Nhập tên tác giả..."
              required
            />
          </div>

          <div className="admin-edit-blog-form-group">
            <label className="admin-edit-blog-label">
              <FaPen style={{ marginRight: "0.5rem" }} />
              Nội dung bài viết
            </label>
            <div className="admin-edit-blog-editor">
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

          <div className="admin-edit-blog-form-group">
            <label className="admin-edit-blog-label">
              <FaImage style={{ marginRight: "0.5rem" }} />
              Ảnh đại diện
            </label>
            <input
              type="file"
              className="admin-edit-blog-file-input"
              accept="image/*"
              onChange={handleImageChange}
            />
            <small style={{ color: "#6b7280", marginTop: "0.5rem", display: "block" }}>
              Chấp nhận các định dạng: JPG, PNG, GIF. Kích thước tối đa: 5MB
            </small>

            {formData.imageUrl && (
              <div className="admin-edit-blog-current-image">
                <label className="admin-edit-blog-image-label">Ảnh hiện tại:</label>
                <img
                  src={`${formData.imageUrl}`}
                  alt="Ảnh hiện tại"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="admin-edit-blog-actions">
            <button
              type="submit"
              className="admin-edit-blog-btn admin-edit-blog-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="admin-edit-blog-loading">
                  <div className="admin-edit-blog-spinner"></div>
                  Đang cập nhật...
                </div>
              ) : (
                <>
                  <FaSave />
                  Cập nhật bài viết
                </>
              )}
            </button>
            <Link
              to="/admin/blog-posts"
              className="admin-edit-blog-btn admin-edit-blog-btn-secondary"
            >
              <FaArrowLeft />
              Quay lại danh sách
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogPost;
