// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/DashBoad";
import Questionnaire from "./pages/Questionnaire";
import Reports from "./pages/Reports";
import "./styles/main.css";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
