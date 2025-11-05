// src/pages/Questionnaire.jsx
import React, { useState, useMemo } from "react";
import QuestionCard from "../components/QuestionCards";

const PIPELINE_TYPES = [
  { value: "gas", label: "Natural Gas" },
  { value: "liquid", label: "Hazardous Liquid" },
  { value: "co2", label: "CO₂" },
];

const CONCERNS = ["Leak detection", "Valve inspections", "Corrosion control"];

const SAMPLE_TEMPLATES = {
  liquid: {
    "Leak detection": [
      "Do you use leak detection technologies suitable for hazardous liquids?",
      "Are leak detection alarms tested and logged regularly?",
    ],
  },
};

function Questionnaire() {
  const [pipelineType, setPipelineType] = useState("liquid");
  const [concern, setConcern] = useState("Leak detection");
  const [answers, setAnswers] = useState({});

  const generatedQuestions = useMemo(() => {
    const templates = SAMPLE_TEMPLATES[pipelineType] || {};
    return templates[concern] || [];
  }, [pipelineType, concern]);

  function handleAnswerChange(index, value) {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  }

  return (
    <div>
      <h1>Questionnaire</h1>
      <div className="selectors">
        <select
          value={pipelineType}
          onChange={(e) => setPipelineType(e.target.value)}
        >
          {PIPELINE_TYPES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <select value={concern} onChange={(e) => setConcern(e.target.value)}>
          {CONCERNS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="questions-list">
        {generatedQuestions.map((q, i) => (
          <QuestionCard
            key={i}
            question={q}
            onChange={(v) => handleAnswerChange(i, v)}
          />
        ))}
      </div>
    </div>
  );
}

export default Questionnaire;
