// src/components/OperatorProfile.jsx
import React, { useState } from "react";
import axios from "axios";
import "./OperatorProfile.css";

const OperatorProfile = ({ selectedParts, onComplete }) => {
  const [formData, setFormData] = useState({
    // Core questions - dynamic based on parts, but start with basics
    pipelineType: "", // e.g., transmission, distribution, gathering, hazardous liquids
    diameter: "", // inches
    locationClass: "", // 1-4 for gas, or N/A
    maopMop: "", // psi
    lastAssessmentDate: "", // YYYY-MM-DD
    impStatus: "", // Implemented, Delayed, Not Started
    segmentLength: "", // miles
    onshoreOffshore: "onshore", // default
    // Add more as needed, e.g., for 195: productType (crude, refined, CO2)
    productType: "", // For Part 195
  });
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  // Dynamic questions based on selectedParts (191=reporting, 192=gas, 195=liquids)
  const getQuestions = () => {
    const questions = [
      {
        key: "pipelineType",
        label: "Pipeline Type",
        type: "select",
        options: [
          "Transmission",
          "Distribution",
          "Gathering",
          "Hazardous Liquids",
        ],
      },
      { key: "diameter", label: "Nominal Diameter (inches)", type: "number" },
      {
        key: "locationClass",
        label: "Location Class (1-4 for gas; N/A for liquids)",
        type: "select",
        options: ["1", "2", "3", "4", "N/A"],
      },
      { key: "maopMop", label: "MAOP/MOP (psi)", type: "number" },
      {
        key: "lastAssessmentDate",
        label: "Last Integrity Assessment Date (YYYY-MM-DD)",
        type: "date",
      },
      {
        key: "impStatus",
        label: "Integrity Management Program Status",
        type: "select",
        options: ["Fully Implemented", "Delayed", "Not Started", "N/A"],
      },
      { key: "segmentLength", label: "Segment Length (miles)", type: "number" },
      {
        key: "onshoreOffshore",
        label: "Location",
        type: "select",
        options: ["Onshore", "Offshore"],
      },
    ];

    // Add part-specific
    if (selectedParts.includes("195")) {
      questions.push({
        key: "productType",
        label: "Product Type",
        type: "select",
        options: ["Crude Oil", "Refined Products", "CO2", "Other"],
      });
    }
    if (selectedParts.includes("191")) {
      questions.push({
        key: "reportFrequency",
        label: "Reporting Frequency",
        type: "select",
        options: ["Annual", "Semi-Annual", "As Needed"],
      });
    }

    return questions;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedParts || selectedParts.length === 0) {
      alert("No parts selected. Please go back to Step 1.");
      return;
    }

    setLoading(true);
    try {
      // POST to new backend endpoint for profile processing
      const response = await axios.post("http://localhost:5000/api/profile", {
        selectedParts,
        profile: formData,
      });

      console.log("Profile response:", response.data);
      setResponseData(response.data);

      if (onComplete) {
        onComplete(response.data); // Pass applicable regs to next step
      }

      alert(
        `Profile submitted! Applicable sections filtered: ${
          response.data.applicableSections?.length || 0
        }`
      );
    } catch (error) {
      console.error("API Error:", error);
      alert(`Failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const questions = getQuestions();

  return (
    <div className="profile-container">
      <div className="header-section">
        <h1>Step 2: Operator Profile Questionnaire</h1>
        <p>
          Provide details about your pipeline segment to customize the audit for{" "}
          {selectedParts.join(", ")}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="questionnaire-form">
        {questions.map((q) => (
          <div key={q.key} className="question-group">
            <label htmlFor={q.key}>{q.label}:</label>
            {q.type === "select" ? (
              <select
                name={q.key}
                id={q.key}
                value={formData[q.key]}
                onChange={handleChange}
                required
              >
                <option value="">Select...</option>
                {q.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : q.type === "number" ? (
              <input
                type="number"
                name={q.key}
                id={q.key}
                value={formData[q.key]}
                onChange={handleChange}
                required
              />
            ) : q.type === "date" ? (
              <input
                type="date"
                name={q.key}
                id={q.key}
                value={formData[q.key]}
                onChange={handleChange}
                required
              />
            ) : null}
          </div>
        ))}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading
            ? "Processing Profile..."
            : "Generate Applicable Regulations"}
        </button>
      </form>

      {responseData && (
        <div className="response-summary">
          <h3>Applicable Regulations:</h3>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
          <p>Ready for Step 3: Dynamic Questions!</p>
        </div>
      )}

      <div className="footer">
        <p>
          This will filter regulations (e.g., for gas transmission: §192.917
          IMP).
        </p>
      </div>
    </div>
  );
};

export default OperatorProfile;
