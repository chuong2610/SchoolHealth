import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

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

  //sử lí upload ảnh
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // Tên tham số backend yêu cầu

    try {
      const res = await axios.post(
        "http://localhost:5182/api/Upload/image", // API upload ảnh của bạn
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imagePath = res.data.filePath; // Lấy đường dẫn ảnh từ response
      setFormData((prev) => ({
        ...prev,
        imageUrl: `http://localhost:5182${imagePath}`, // Gắn url tuyệt đối vào blog
      }));
    } catch (error) {
      console.error("Upload image failed:", error);
      setError("Upload ảnh thất bại");
    }
  };

  //kết thúc sử lí upload ảnh

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Sử dụng object JSON thay vì FormData
    const data = {
      title: formData.title,
      content: formData.content,
      author: formData.author,
      imageUrl: formData.imageUrl || "none",
    };

    try {
      const response = await axios.post(
        "http://localhost:5182/api/BlogPosts",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Đúng với dữ liệu JSON
          },
        }
      );
      setSuccess("Blog post have created successfully!!!");
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
          "Failed to create blog post. Try again."
      );
      console.error("Error:", error);
    }
  };

  // const handleImageChange = (e) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     image: e.target.files[0], //lấy file đầu tiên
  //   }));
  // };

  return (
    <div className="container mt-4">
      <h2 className="d-flex justify-content-center mb-5">Tạo Blog Post</h2>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Link to="/admin/createBlogPost" className="btn btn-primary me-2">
            Thêm Blog Post
          </Link>
          <Link to="/admin/blog-posts" className="btn btn-primary">
            Quản lí Blog Posts
          </Link>
        </div>

        <div></div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            className="form-control"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>
          <ReactQuill
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Write your post here..."
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
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
              "list",
              "bullet",
              "link",
              "image",
            ]}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload ảnh</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3 mb-5">
          Lưu
        </button>
      </form>
    </div>
  );
};

export default CreateBlogPost;
