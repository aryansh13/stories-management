import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import SideBar from "./SideBar";
import Filter from "./Filter";
import { useNavigate } from 'react-router-dom';

const StoriesList = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [isModalActive, setIsModalActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    category: "",
    status: "",
  });
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("http://localhost:5000/stories");
        const data = await response.json();
        setStories(data);
        setFilteredStories(data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, []);

  const applyFilters = () => {
    let result = stories;

    if (activeFilters.category) {
      result = result.filter(
        (story) => story.category?.category_name === activeFilters.category
      );
    }

    if (activeFilters.status) {
      result = result.filter(
        (story) => story.status?.status_name === activeFilters.status
      );
    }

    if (searchTerm) {
      result = result.filter(
        (story) =>
          story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStories(result);
  };

  useEffect(() => {
    applyFilters();
  }, [stories, activeFilters, searchTerm]);

  const toggleModal = () => {
    setIsModalActive(!isModalActive);
  };

  const handleFilter = (category, status) => {
    setActiveFilters({ category, status });
    toggleModal();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleReset = () => {
    setActiveFilters({ category: "", status: "" });
    setSearchTerm("");
    setFilteredStories(stories);
    toggleModal();
  };

  const handleDropdownClick = (index) => {
    setOpenDropdownIndex(index === openDropdownIndex ? null : index);
  };

  const handleEdit = (story) => {
    navigate(`/edit-story/${story.id}`);
  };

  const handleDelete = async (story) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      try {
        const response = await fetch(`http://localhost:5000/stories/${story.id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setStories(stories.filter(item => item.id !== story.id));
        } else {
          console.error("Failed to delete story");
        }
      } catch (error) {
        console.error("Error deleting story:", error);
      }
    }
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
              <h1 className="title ml-5 mt-5">Stories</h1>
              <div className="box ml-5">
                <div className="columns">
                  <div className="column is-6">
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        placeholder="Search by Writers / Title"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                      <span className="icon is-left">
                        <FontAwesomeIcon icon={faSearch} />
                      </span>
                    </div>
                  </div>
                  <div className="column is-6 has-text-right">
                    <button
                      className="button is-light is-outlined is-rounded mr-2"
                      onClick={toggleModal}
                    >
                      <FontAwesomeIcon icon={faFilter} />
                    </button>
                    <button
                      className="button is-primary"
                      onClick={() => navigate("/add-story")}
                    >
                      + Add Story
                    </button>
                  </div>
                </div>

                <table className="table is-fullwidth is-striped">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Tags</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStories.map((story, index) => (
                      <tr key={story.id}>
                        <td>{index + 1}</td>
                        <td>{story.title}</td>
                        <td>{story.author}</td>
                        <td>
                          {story.category?.category_name || "No Category"}
                        </td>
                        <td>
                          {story.tag ? (
                            <span className="tag">
                              {story.tag.tags_name}
                            </span>
                          ) : "No Tag"}
                        </td>
                        <td>
                          <span
                            className={`tag ${
                              story.status?.status_name === "Publish"
                                ? "is-success"
                                : "is-warning"
                            }`}
                          >
                            {story.status?.status_name || "No Status"}
                          </span>
                        </td>
                        <td>
                          <div
                            className={`dropdown ${
                              openDropdownIndex === index ? "is-active" : ""
                            }`}
                          >
                            <div className="dropdown-trigger">
                              <button
                                className="button is-small is-light"
                                aria-haspopup="true"
                                aria-controls="dropdown-menu"
                                onClick={() => handleDropdownClick(index)}
                              >
                                <span>...</span>
                              </button>
                            </div>
                            <div
                              className="dropdown-menu"
                              id="dropdown-menu"
                              role="menu"
                            >
                              <div className="dropdown-content">
                                <a
                                  href="#"
                                  className="dropdown-item"
                                  onClick={() => handleEdit(story)}
                                >
                                  Edit
                                </a>
                                <a
                                  href="#"
                                  className="dropdown-item"
                                  onClick={() => handleDelete(story)}
                                >
                                  Delete
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <nav
                  className="pagination is-right"
                  role="navigation"
                  aria-label="pagination"
                >
                  <button className="pagination-previous">Previous</button>
                  <button className="pagination-next">Next page</button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Filter
        isActive={isModalActive}
        toggleModal={toggleModal}
        onFilter={handleFilter}
        onReset={handleReset}
        activeFilters={activeFilters}
      />
    </div>
  );
};

export default StoriesList;
