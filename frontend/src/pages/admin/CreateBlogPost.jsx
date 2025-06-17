// import { useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const CreateBlogPost = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     author: "",
//     content: {
//       introduction: "",
//       symptoms: [""],
//       prevention: {
//         vaccination: "",
//         personalHygiene: [""],
//         immunityBoost: [""],
//       },
//       whenToSeeDoctor: [""],
//     },
//     imageUrl: "",
//   });

//   //Bắt đầu sử lí logic cho form
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   //
//   const token = localStorage.getItem("token");
//   //

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleNestedChange = (e, field, subField = null) => {
//     const { value } = e.target;
//     setFormData((prev) => {
//       if (subField) {
//         return {
//           ...prev,
//           content: {
//             ...prev.content,
//             [field]: {
//               ...prev.content[field],
//               [subField]: value,
//             },
//           },
//         };
//       }
//       return {
//         ...prev,
//         content: {
//           ...prev.content,
//           [field]: value,
//         },
//       };
//     });
//   };

//   const handleArrayChange = (e, field, index) => {
//     const { value } = e.target;
//     setFormData((prev) => {
//       const newArray = [...prev.content[field]];
//       newArray[index] = value;
//       return {
//         ...prev,
//         content: {
//           ...prev.content,
//           [field]: newArray,
//         },
//       };
//     });
//   };

//   const handleArrayPreventionChange = (e, subField, index) => {
//     const { value } = e.target;
//     setFormData((prev) => {
//       const newArray = [...prev.content.prevention[subField]];
//       newArray[index] = value;
//       return {
//         ...prev,
//         content: {
//           ...prev.content,
//           prevention: {
//             ...prev.content.prevention,
//             [subField]: newArray,
//           },
//         },
//       };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       const response = await axios.post(
//         "http://localhost:5182/api/BlogPosts",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setSuccess("Blog post created successfully!");
//       setFormData({
//         title: "",
//         author: "",
//         content: {
//           introduction: "",
//           symptoms: [""],
//           prevention: {
//             vaccination: "",
//             personalHygiene: [""],
//             immunityBoost: [""],
//           },
//           whenToSeeDoctor: [""],
//         },
//         imageUrl: "",
//       });
//     } catch (error) {
//       setError(
//         error.response?.data?.message || "Faild to create blog post. Try again."
//       );
//     }
//   };

//   //Kết thúc sử lí logic cho form

//   return (
//     <div className="container mt-4">
//       <h2>Create New Blog Post</h2>
//       {error && <div className="alert alert-danger">{error}</div>}
//       {success && (
//         <div className="alert alert-success">
//           {success}
//           <Link to="/admin/blog-posts" className="btn btn-info ms-3">
//             View Blog Posts
//           </Link>
//         </div>
//       )}
//       <Link to="/admin/blog-posts" className="btn btn-secondary mb-3">
//         View Blog Posts
//       </Link>

//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label className="form-label">Title</label>
//           <input
//             type="text"
//             className="form-control"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Author</label>
//           <input
//             type="text"
//             className="form-control"
//             name="author"
//             value={formData.author}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Introduction</label>
//           <textarea
//             className="form-control"
//             name="introduction"
//             value={formData.content.introduction}
//             onChange={(e) => handleNestedChange(e, "introduction")}
//             rows="3"
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Symptoms</label>
//           <input
//             type="text"
//             className="form-control"
//             name="symptoms"
//             value={formData.content.symptoms[0]}
//             onChange={(e) => handleArrayChange(e, "symptoms", 0)}
//             placeholder="Enter symptom"
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Vaccination</label>
//           <textarea
//             className="form-control"
//             name="vaccination"
//             value={formData.content.prevention.vaccination}
//             onChange={(e) => handleNestedChange(e, "prevention", "vaccination")}
//             rows="3"
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Personal Hygiene</label>
//           <input
//             type="text"
//             className="form-control"
//             value={formData.content.prevention.personalHygiene[0]}
//             onChange={(e) =>
//               handleArrayPreventionChange(e, "personalHygiene", 0)
//             }
//             placeholder="Enter hygiene tip"
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Immunity Boost</label>
//           <input
//             type="text"
//             className="form-control"
//             value={formData.content.prevention.immunityBoost[0]}
//             onChange={(e) => handleArrayPreventionChange(e, "immunityBoost", 0)}
//             placeholder="Enter immunity boost tip"
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">When To See Doctor</label>
//           <input
//             type="text"
//             className="form-control"
//             value={formData.content.whenToSeeDoctor[0]}
//             onChange={(e) => handleArrayChange(e, "whenToSeeDoctor", 0)}
//             placeholder="Enter condition"
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Image URL</label>
//           <input
//             type="text"
//             className="form-control"
//             name="imageUrl"
//             value={formData.imageUrl}
//             onChange={handleChange}
//           />
//         </div>
//         <button type="submit" className="btn btn-primary mb-5">
//           Create Blog Post
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateBlogPost;

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
      <h2 className="d-flex justify-content-center mb-5">Create Post</h2>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Link to="/admin/createBlogPost" className="btn btn-primary me-2">
            Add Post
          </Link>
          <Link to="/admin/blog-posts" className="btn btn-primary">
            Manage Posts
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

        <div>
          <label className="form-label">ImageUrl</label>
          <input
            type="text"
            className="form-control"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Nhập URL từ API upload"
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3 mb-5">
          Save Post
        </button>
      </form>
    </div>
  );
};

export default CreateBlogPost;
