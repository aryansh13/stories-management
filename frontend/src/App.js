import React from "react";
import AddStory from "./components/AddStory";
import StoriesList from "./components/StoriesList";
import EditStory from "./components/EditStory";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StoriesList />} />
        <Route path="/add-story" element={<AddStory />} />
        <Route path="/edit-story/:id" element={<EditStory />} />
      </Routes>
    </Router>
  );
}

export default App;
