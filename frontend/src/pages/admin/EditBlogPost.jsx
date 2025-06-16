import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditBlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: {
      introduction: "",
      symptoms: [""],
      prevention: {
        vaccination: "",
        personalHygiene: [""],
        immunityBoost: [""],
      },
      whenToSeeDoctor: [""],
    },
    imageUrl: "",
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
      setFormData(response.data);
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

  const handleNestedChange = (e, field, subField = null) => {
    const { value } = e.target;
    setFormData((prev) => {
      if (subField) {
        return {
          ...prev,
          content: {
            ...prev.content,
            [field]: {
              ...prev.content[field],
              [subField]: value,
            },
          },
        };
      }
      return {
        ...prev,
        content: {
          ...prev.content,
          [field]: value,
        },
      };
    });
  };

  const handleArrayChange = (e, field, index) => {
    const { value } = e.target;
    setFormData((prev) => {
      const newArray = [...prev.content[field]];
      newArray[index] = value;
      return {
        ...prev,
        content: {
          ...prev.content,
          [field]: newArray,
        },
      };
    });
  };

  const handleArrayPreventionChange = (e, subField, index) => {
    const { value } = e.target;
    setFormData((prev) => {
      const newArray = [...prev.content.prevention[subField]];
      newArray[index] = value;
      return {
        ...prev,
        content: {
          ...prev.content,
          prevention: {
            ...prev.content.prevention,
            [subField]: newArray,
          },
        },
      };
    });
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: [...prev.content[field], ""],
      },
    }));
  };

  const addPreventionArrayItem = (subField) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        prevention: {
          ...prev.content.prevention,
          [subField]: [...prev.content.prevention[subField], ""],
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanedData = {
      ...formData,
      content: {
        ...formData.content,
        symptoms: formData.content.symptoms.filter((s) => s.trim() != ""),
        prevention: {
          ...formData.content.prevention,
          personalHygiene: formData.content.prevention.personalHygiene.filter(
            (p) => p.trim() !== ""
          ),
          immunityBoost: formData.content.prevention.immunityBoost.filter(
            (i) => i.trim() !== ""
          ),
        },
        whenToSeeDoctor: formData.content.whenToSeeDoctor.filter(
          (w) => w.trim() !== ""
        ),
      },
    };
    try {
      await axios.patch(
        `http://localhost:5182/api/BlogPosts/${id}`,
        cleanedData,
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

  return (
    <div className="container mt-4">
      <h2>Edit Blog Post</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <Link to="/admin/blog-posts" className="btn btn-info ms-3">
        Return Blog Post List
      </Link>

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
          <label className="form-label">Introduction</label>
          <textarea
            className="form-control"
            name="introduction"
            value={formData.content.introduction}
            onChange={(e) => handleNestedChange(e, "introduction")}
            rows="3"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Symptoms</label>
          <input
            type="text"
            className="form-control"
            name="symptoms"
            value={formData.content.symptoms[0]}
            onChange={(e) => handleArrayChange(e, "symptoms", 0)}
            placeholder="Enter symptom"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Vaccination</label>
          <textarea
            className="form-control"
            name="vaccination"
            value={formData.content.prevention.vaccination}
            onChange={(e) => handleNestedChange(e, "prevention", "vaccination")}
            rows="3"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Personal Hygiene</label>
          {formData.content.prevention.personalHygiene.map((item, index) => (
            <div key={index} className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                value={item}
                onChange={(e) =>
                  handleArrayPreventionChange(e, "personalHygiene", index)
                }
                placeholder="Enter hygiene tip"
              />
              {index ===
                formData.content.prevention.personalHygiene.length - 1 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => addPreventionArrayItem("personalHygiene")}
                >
                  Add
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label className="form-label">Immunity Boost</label>
          {formData.content.prevention.immunityBoost.map((item, index) => (
            <div key={index} className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                value={item}
                onChange={(e) =>
                  handleArrayPreventionChange(e, "immunityBoost", index)
                }
                placeholder="Enter immunity boost tip"
              />
              {index ===
                formData.content.prevention.immunityBoost.length - 1 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => addPreventionArrayItem("immunityBoost")}
                >
                  Add
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label className="form-label">When To See Doctor</label>
          {formData.content.whenToSeeDoctor.map((item, index) => (
            <div key={index} className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                value={item}
                onChange={(e) => handleArrayChange(e, "whenToSeeDoctor", index)}
                placeholder="Enter condition"
              />
              {index === formData.content.whenToSeeDoctor.length - 1 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => addArrayItem("whenToSeeDoctor")}
                >
                  Add
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary mb-5">
          Update Blog Post
        </button>
      </form>
    </div>
  );
};

export default EditBlogPost;
