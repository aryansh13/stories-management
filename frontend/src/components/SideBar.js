// src/components/Sidebar.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faThLarge, faFeatherAlt } from "@fortawesome/free-solid-svg-icons";

const SideBar = () => {
  return (
    <aside className="menu sidebar is-shadowless">
      <div className="menu-label logo">
        <h1 className="title is-4 mt-6 ml-6">
          <FontAwesomeIcon icon={faFeatherAlt} className="mr-2" />
          STORYKU
        </h1>
      </div>
      <ul className="menu-list">
        <li>
          <a href="#dashboard" className="ml-5">
            <FontAwesomeIcon icon={faThLarge} /> Dashboard
          </a>
        </li>
        <li>
          <a href="#story-management" className="is-active ml-5">
            <FontAwesomeIcon icon={faBook} /> Story Management
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default SideBar;
