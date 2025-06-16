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

const CreateBlogPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    topic: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBodyChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      body: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Giả lập gửi dữ liệu (không gọi API, để backend lo)
    console.log("Form Data Submitted:", formData);
    setSuccess("Blog post created successfully! (Simulated)");
    setTimeout(() => {
      setSuccess("");
      navigate("/admin/blog-posts"); // Chuyển về trang danh sách sau 2s
    }, 2000);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Link to="/admin/createBlogPost" className="btn btn-primary me-2">
            Add Post
          </Link>
          <Link to="/admin/blog-posts" className="btn btn-primary">
            Manage Posts
          </Link>
        </div>
        <h2 className="m-0">Create Post</h2>
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
          <label className="form-label">Body</label>
          <ReactQuill
            value={formData.body}
            onChange={handleBodyChange}
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
          <label className="form-label">Topic</label>
          <select
            className="form-select"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
          >
            <option value="Preventive Health Care">
              Preventive Health Care
            </option>
            <option value="Mental Health Awareness">
              Mental Health Awareness
            </option>
            <option value="Nutrition and Physical Activity">
              Nutrition and Physical Activity
            </option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Save Post
        </button>
      </form>
    </div>
  );
};

export default CreateBlogPost;
