// src/layouts/MainLayout.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./MainLayout.css";

function MainLayout({ children }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Compliance Assistant</h2>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/questionnaire">Questionnaire</Link>
          <Link to="/reports">Reports</Link>
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}

export default MainLayout;
