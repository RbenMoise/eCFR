// src/components/QuestionCard.jsx
import React from "react";

function QuestionCard({ question, onChange }) {
  return (
    <div className="question-card">
      <p className="question-text">{question}</p>
      <select
        onChange={(e) => onChange(e.target.value)}
        className="answer-select"
      >
        <option value="">-- select --</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
        <option value="partial">Partial</option>
      </select>
    </div>
  );
}

export default QuestionCard;
