import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "./SideBar";
import Select from "react-select";

const EditStory = () => {
  const { id: storyId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    synopsis: "",
    category_id: "",
    story_cover: "",
    tags_id: [],
    status_id: "",
  });
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [chapters, setChapters] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesAndStatus = async () => {
      try {
        const categoriesResponse = await fetch("http://localhost:5000/category");
        const statusResponse = await fetch("http://localhost:5000/status");
        const tagsResponse = await fetch("http://localhost:5000/tags");
  
        if (!categoriesResponse.ok || !statusResponse.ok || !tagsResponse.ok) {
          throw new Error('One or more fetch requests failed');
        }
  
        const categoriesData = await categoriesResponse.json();
        const statusData = await statusResponse.json();
        const tagsData = await tagsResponse.json();
  
        setCategories(categoriesData);
        setStatus(statusData);
        setTags(tagsData.map((tag) => ({ value: tag.id, label: tag.tags_name })));
      } catch (error) {
        console.error("Error fetching categories or status:", error);
      }
    };
  
    const fetchStory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/stories/${storyId}`);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const story = await response.json();
        setFormData({
          title: story.title,
          author: story.author,
          synopsis: story.synopsis,
          category_id: story.category_id,
          story_cover: story.story_cover,
          tags_id: story.tags.map(tag => tag.id),
          status_id: story.status_id,
        });
        setSelectedCategory(story.category_id);
        setSelectedStatus(story.status_id);
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };
  
    fetchCategoriesAndStatus();
    fetchStory();
  }, [storyId]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, story_cover: file.name });
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
      category_id: selectedCategory,
      story_cover: formData.story_cover,
      tags_id: formData.tags_id,
      status_id: selectedStatus,
    };

    try {
      const response = await fetch(`http://localhost:5000/stories/ ${storyId}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Failed to update story");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const customStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: 'lightgray',
      borderColor: 'black',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: 'darkgray',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'white',
      ':hover': {
        backgroundColor: 'red',
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
              <h1 className="title ml-5 mt-5">Edit Story</h1>
              <form onSubmit={handleSubmit} className="ml-5 mr-5">
                {/* Form Fields */}
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
                        onChange={(e) => setSelectedCategory(e.target.value)}
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
                      styles={customStyles}
                      value={tags.filter(tag => formData.tags_id.includes(tag.value))}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Status</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
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

export default EditStory;
