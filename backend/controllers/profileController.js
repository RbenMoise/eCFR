// controllers/profileController.js
const { handleSelection } = require("./selectionController"); // Reuse fetch if needed

// Simple rule-based applicability engine (expand with AI later)
// Maps profile to filtered sections from fetched data
function getApplicableSections(selectedParts, profile) {
  const applicable = [];

  selectedParts.forEach((part) => {
    // Simulate filtering based on profile
    // In prod: Use NLP or rules to match (e.g., if transmission && diameter >6" → §192.917)
    let sections = [];
    switch (part) {
      case "191":
        sections = [
          {
            id: "191.5",
            heading: "Definitions",
            applicability: "All gas reporters",
          },
        ];
        break;
      case "192":
        if (profile.pipelineType === "Transmission") {
          sections.push({
            id: "192.917",
            heading: "Integrity Management",
            applicability: "Transmission lines in HCA",
          });
        }
        if (profile.locationClass && profile.locationClass !== "N/A") {
          sections.push({
            id: "192.5",
            heading: "Class Locations",
            applicability: `Class ${profile.locationClass}`,
          });
        }
        break;
      case "195":
        if (profile.productType === "Crude Oil") {
          sections.push({
            id: "195.402",
            heading: "Procedural Manual",
            applicability: "Hazardous liquids",
          });
        }
        break;
      default:
        break;
    }
    applicable.push({ part, sections });
  });

  return applicable;
}

// Main controller
const handleProfile = async (req, res) => {
  try {
    const { selectedParts, profile } = req.body;
    console.log("Profile data:", profile);

    if (!selectedParts || selectedParts.length === 0) {
      return res.status(400).json({ error: "Selected parts required." });
    }

    if (!profile || Object.keys(profile).length < 5) {
      // Basic validation
      return res.status(400).json({ error: "Incomplete profile." });
    }

    // Get applicable sections (rule-based for MVP)
    const applicableSections = getApplicableSections(selectedParts, profile);

    // Optional: Re-fetch full summaries if needed, but use cached logic
    // For now, return filtered

    res.status(200).json({
      message: "Profile processed - Applicable regulations filtered.",
      profileSummary: profile,
      selectedParts,
      applicableSections,
      nextStep: "Dynamic questionnaire based on gaps",
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Error processing profile." });
  }
};

module.exports = { handleProfile };
