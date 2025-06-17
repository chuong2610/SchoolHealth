import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditBlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isImageChanged, setIsImageChanged] = useState(false);

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
      const response = await axios.get(
        `http://localhost:5182/api/BlogPosts/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormData({
        title: response.data.title || "",
        author: response.data.author || "",
        content: response.data.content || "", //HTML từ api
        imageUrl: response.data.imageUrl || "",
      });
    } catch (error) {
      setError("Failed to fetch blog post.");
      console.error(
        "Fetch error: ",
        error.response ? error.response.data : error.message
      );
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
      await axios.patch(
        `http://localhost:5182/api/BlogPosts/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("Blog post updated Successfully!");
      setTimeout(() => navigate("/admin/blog-posts"), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update blog post.");
      console.error("Update error:", error); // Debug
    }
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
      setIsImageChanged(true);
    } catch (error) {
      console.error("Upload image failed:", error);
      setError("Upload ảnh thất bại");
    }
  };

  //kết thúc sử lí upload ảnh

  return (
    <div className="container mt-4">
      <h2>Edit Blog Post</h2>
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
            type="text"
            className="form-control"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
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

        <div className="d-flex align-items-center mb-5">
          <button type="submit" className="btn btn-primary me-3">
            Cập nhật Blog Post
          </button>
          <Link to="/admin/blog-posts" className="btn btn-primary">
            Trở về quản lí Blog Post
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPost;
