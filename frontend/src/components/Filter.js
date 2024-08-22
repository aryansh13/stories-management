// src/components/Filter.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Filter = ({
  isActive,
  toggleModal,
  onFilter,
  onReset,
  activeFilters,
}) => {
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    activeFilters.category
  );
  const [selectedStatus, setSelectedStatus] = useState(activeFilters.status);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/category");
        setCategories(response.data);
      } catch (error) {
        console.error("There was an error fetching the categories!", error);
      }
    };

    const fetchStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/status");
        setStatus(response.data);
      } catch (error) {
        console.error("There was an error fetching the status!", error);
      }
    };

    fetchCategories();
    fetchStatus();
  }, []);

  useEffect(() => {
    setSelectedCategory(activeFilters.category);
    setSelectedStatus(activeFilters.status);
  }, [activeFilters]);

  const handleReset = () => {
    setSelectedCategory("");
    setSelectedStatus("");
    onReset();
    toggleModal();
  };

  const handleFilter = () => {
    const selectedCategoryName = categories.find(
      (category) => category.id.toString() === selectedCategory
    )?.category_name;
    const selectedStatusName = status.find(
      (statusItem) => statusItem.id.toString() === selectedStatus
    )?.status_name;

    onFilter(selectedCategoryName, selectedStatusName);
  };

  return (
    <div className={`modal ${isActive ? "is-active" : ""}`}>
      <div className="modal-background" onClick={toggleModal}></div>
      <div className="modal-content">
        <div className="box">
          <h2 className="title">Filter Options</h2>
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
          <div className="field is-grouped is-justify-content-space-between">
            <div className="field is-grouped">
              <button
                onClick={handleReset}
                className="button is-primary mt-2 is-outlined is-rounded"
              >
                Reset
              </button>
            </div>
            <div className="field is-grouped">
              <button
                onClick={toggleModal}
                aria-label="close"
                className="button is-primary is-rounded is-outlined mt-2"
              >
                Cancel
              </button>
              <button
                onClick={handleFilter}
                className="button is-primary is-rounded mt-2"
              >
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={toggleModal}
      ></button>
    </div>
  );
};

export default Filter;
