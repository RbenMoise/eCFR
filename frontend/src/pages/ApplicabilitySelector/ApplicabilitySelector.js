// src/components/ApplicabilitySelector.jsx
import React, { useState } from "react";
import "./ApplicabilitySelector.css";

const ApplicabilitySelector = ({ onSelection }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    {
      id: 1,
      title: "Part 191 Only",
      description:
        "Gas Reporting: If your main need is incident/annual reporting for gas/LNG/UNGSF facilities.",
      color: "#007bff", // Blue for gas reporting
    },
    {
      id: 2,
      title: "Part 192",
      description:
        "Gas Pipeline Standards: If operating natural gas transmission, distribution, or gathering lines.",
      color: "#28a745", // Green for gas standards
    },
    {
      id: 3,
      title: "Part 195",
      description:
        "Hazardous Liquids Standards: If handling crude oil, refined products, or CO2 pipelines.",
      color: "#ffc107", // Yellow/orange for liquids
    },
  ];

  const toggleSelection = (id) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((opt) => opt !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) {
      alert("Please select at least one option.");
      return;
    }
    onSelection(selectedOptions); // Pass to parent for next steps
  };

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
          Many operators deal with multiple types select more than one if
          applicable.
        </p>
      </div>

      <div className="selection-section">
        <h2>Step 1: Choose Your Applicable Regulation Part(s)</h2>
        <p>
          Reply with your selection(s) by number (e.g., "2" or "1 and 3"). We'll
          fetch and tailor the relevant sections dynamically from the eCFR.
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
          disabled={selectedOptions.length === 0}
        >
          Proceed to Step 2: Operator Profile
        </button>
      </div>

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
