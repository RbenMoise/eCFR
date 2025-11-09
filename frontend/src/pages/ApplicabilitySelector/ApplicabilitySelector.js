// src/components/ApplicabilitySelector.jsx
import React, { useState } from "react";
import axios from "axios";
import "./ApplicabilitySelector.css";

const ApplicabilitySelector = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedParts, setSelectedParts] = useState([]); // Store fetched selected parts data

  const options = [
    {
      id: 1,
      title: "Part 191 Only",
      description:
        "Gas Reporting: If your main need is incident/annual reporting for gas/LNG/UNGSF facilities.",
      color: "#007bff",
    },
    {
      id: 2,
      title: "Part 192",
      description:
        "Gas Pipeline Standards: If operating natural gas transmission, distribution, or gathering lines.",
      color: "#28a745",
    },
    {
      id: 3,
      title: "Part 195",
      description:
        "Hazardous Liquids Standards: If handling crude oil, refined products, or CO2 pipelines.",
      color: "#ffc107",
    },
  ];

  const toggleSelection = (id) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((opt) => opt !== id) : [...prev, id]
    );
    // Clear previous results on re-selection
    setSelectedParts([]);
  };

  const handleSubmit = async () => {
    if (selectedOptions.length === 0) {
      alert("Please select at least one option.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/selection", {
        selectedOptions,
      });

      console.log("Backend response:", response.data);

      // Store fetched data for display (data array from response)
      setSelectedParts(response.data.data || []);

      alert(`Success! Fetched data for selected parts.`);
    } catch (error) {
      console.error("API Error:", error);
      alert(
        `Failed to connect: ${error.response?.data?.error || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper to get local option by ID
  const getOptionById = (id) => options.find((opt) => opt.id === id);

  return (
    <div className="applicability-container">
      <div className="header-section">
        <h1>PHMSA Compliance Assistant</h1>
        <p>Step 1: Initial Applicability Selection</p>
        <p>
          Thank you for using this early step. Select the primary regulation
          part(s) for your pipeline operations.
        </p>
      </div>

      <div className="background-info">
        <h2>Quick Background</h2>
        <ul>
          <li>
            <strong>Part 191</strong>: Focuses on reporting requirements for
            natural gas pipelines.
          </li>
          <li>
            <strong>Part 192</strong>: Minimum safety standards for transporting
            natural gas by pipeline.
          </li>
          <li>
            <strong>Part 195</strong>: Minimum safety standards for transporting
            hazardous liquids by pipeline.
          </li>
        </ul>
        <p>
          Many operators deal with multiple types—select more than one if
          applicable.
        </p>
      </div>

      <div className="selection-section">
        <h2>Step 1: Choose Your Applicable Regulation Part(s)</h2>
        <p>
          We'll fetch and tailor the relevant sections dynamically from the
          eCFR.
        </p>
        <div className="options-grid">
          {options.map((option) => (
            <div
              key={option.id}
              className={`option-card ${
                selectedOptions.includes(option.id) ? "selected" : ""
              }`}
              style={{ borderColor: option.color }}
              onClick={() => toggleSelection(option.id)}
            >
              <div
                className="option-number"
                style={{ backgroundColor: option.color }}
              >
                {option.id}
              </div>
              <h3>{option.title}</h3>
              <p>{option.description}</p>
            </div>
          ))}
        </div>
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={selectedOptions.length === 0 || loading}
        >
          {loading
            ? "Fetching Regulations..."
            : "Proceed to Step 2: Operator Profile"}
        </button>
      </div>

      {/* Display selected parts summary */}
      {selectedParts.length > 0 && (
        <div className="response-summary">
          <h3>Selected Parts Overview</h3>
          <div className="selected-list">
            {selectedParts.map((part) => {
              const localOption = getOptionById(
                part.part === "191" ? 1 : part.part === "192" ? 2 : 3
              );
              return (
                <div key={part.part} className="selected-item">
                  <h4>{part.title || localOption?.title}</h4>
                  <p className="local-desc">{localOption?.description}</p>
                  <p className="fetched-summary">
                    <strong>Fetched Summary:</strong> {part.summary}
                  </p>
                  <p className="section-count">
                    Sections Fetched: {part.sections?.length || 0}
                  </p>
                  {part.error && (
                    <p className="error">
                      <strong>Error:</strong> {part.error}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <p>Ready for Step 2 questionnaire using these parts!</p>
        </div>
      )}

      <div className="footer">
        <p>
          Once selected, we'll move to a 5-7 question questionnaire on your
          pipeline segment.
        </p>
        <p>What's your choice? Let's accelerate your compliance!</p>
      </div>
    </div>
  );
};

export default ApplicabilitySelector;
