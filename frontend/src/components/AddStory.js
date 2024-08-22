import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import Select from "react-select";

const AddStory = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    synopsis: "",
    category_id: "",
    story_cover: "",
    tags_id: [], // This will be handled by react-select
    status_id: "",
  });

  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState([]);
  const [tags, setTags] = useState([]); // For storing all tags
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [chapters, setChapters] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesAndStatus = async () => {
      try {
        const categoriesResponse = await fetch("http://localhost:5000/category");
        const statusResponse = await fetch("http://localhost:5000/status");
        const tagsResponse = await fetch("http://localhost:5000/tags"); // Fetch tags

        const categoriesData = await categoriesResponse.json();
        const statusData = await statusResponse.json();
        const tagsData = await tagsResponse.json();

        setCategories(categoriesData);
        setStatus(statusData);
        setTags(tagsData.map((tag) => ({ value: tag.id, label: tag.tags_name }))); // Format for react-select
      } catch (error) {
        console.error("Error fetching categories or status:", error);
      }
    };

    fetchCategoriesAndStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, story_cover: file.name }); // Only save the file name
  };

  const handleTagsChange = (selectedOptions) => {
    setFormData({
      ...formData,
      tags_id: selectedOptions.map((option) => option.value),
    });
  };

  const handleAddChapter = () => {
    navigate("/add-chapter");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      title: formData.title,
      author: formData.author,
      synopsis: formData.synopsis,
      category_id: selectedCategory, // Send the selected category ID
      story_cover: formData.story_cover,
      tags_id: formData.tags_id, // Send the tags as an array of IDs
      status_id: selectedStatus, // Send the selected status ID
    };

    try {
      const response = await fetch("http://localhost:5000/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Failed to create story");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Define custom styles for react-select
  const customStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black', // Change text color of options
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: 'lightgray', // Change background color of the select box
      borderColor: 'black', // Change border color of the select box
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: 'darkgray', // Change background color of selected tags
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white', // Change text color of selected tags
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'white', // Change color of remove button
      ':hover': {
        backgroundColor: 'red', // Background color of remove button on hover
        color: 'white',
      },
    }),
  };

  return (
    <div className="columns">
      <div className="column is-one-fifth">
        <SideBar />
      </div>
      <div className="column">
        <div className="container mt-5">
          <div className="columns">
            <div className="column is-full">
              <h1 className="title ml-5 mt-5">Add New Story</h1>
              <form onSubmit={handleSubmit} className="ml-5 mr-5">
                {/* General Information Section */}
                <div className="field">
                  <label className="label">Title</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Author</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Synopsis</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      name="synopsis"
                      value={formData.synopsis}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Category</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)} // Set the selected category ID
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.category_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Story Cover</label>
                  <div className="control">
                    <input
                      className="input"
                      type="file"
                      name="story_cover"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Tags/Keywords</label>
                  <div className="control">
                    <Select
                      isMulti
                      name="tags"
                      options={tags}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={handleTagsChange}
                      styles={customStyles} // Apply custom styles
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Status</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)} // Set the selected status ID
                      >
                        <option value="">Select Status</option>
                        {status.map((statusItem) => (
                          <option key={statusItem.id} value={statusItem.id}>
                            {statusItem.status_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Chapter List Section */}
                <div className="field">
                  <button
                    type="button"
                    className="button is-link is-outlined"
                    onClick={handleAddChapter}
                  >
                    + Add Chapter
                  </button>
                </div>

                <table className="table is-fullwidth">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Last Updated</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Map chapters array to display each chapter */}
                    {chapters.map((chapter, index) => (
                      <tr key={index}>
                        <td>{chapter.title}</td>
                        <td>{chapter.last_updated}</td>
                        <td>
                          <button className="button is-small is-info">
                            Edit
                          </button>
                          <button className="button is-small is-danger">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="field is-grouped mt-5">
                  <div className="control">
                    <button className="button is-link" type="submit">
                      Save
                    </button>
                  </div>
                  <div className="control">
                    <button
                      className="button is-light"
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to cancel adding the story without saving the data?"
                          )
                        ) {
                          navigate("/");
                        }
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStory;
