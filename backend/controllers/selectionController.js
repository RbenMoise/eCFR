// controllers/selectionController.js
const axios = require("axios");
const cheerio = require("cheerio");

// Helper function to fetch and extract basic summary from eCFR page
async function fetchPartSummary(partNumber) {
  const baseUrl = `https://www.ecfr.gov/current/title-49/subtitle-B/chapter-I/subchapter-D/part-${partNumber}`;

  try {
    const response = await axios.get(baseUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 10000, // 10s timeout
    });

    const $ = cheerio.load(response.data);
    const title = $("h1").first().text().trim() || `Part ${partNumber}`;

    // Improved: Target § headings (h2-h4), extract id & sibling <p> content
    // In fetchPartSummary, replace the sections extraction block with:
    const sections = [];
    $("h2, h3, h4")
      .filter(function () {
        return $(this).text().trim().includes("§");
      })
      .slice(0, 10)
      .each((i, elem) => {
        // Scan first 10 potential headings
        const id = $(elem).attr("id") || `section-${i + 1}`;
        const heading = $(elem).text().trim();

        // Extract content: Next <p>s until next heading (up to 500 chars)
        let content = "";
        let next = $(elem).next();
        while (next.length && !next.is("h2, h3, h4") && content.length < 500) {
          if (next.is("p")) {
            content += next.text().trim() + " ";
          }
          next = next.next();
        }
        content =
          content.trim().substring(0, 500) +
          (content.length >= 500 ? "..." : "");

        if (heading && content) {
          sections.push({ id, heading, content });
        }
      });

    // Rest unchanged...

    // Dynamic summary
    const summary =
      sections.length > 0
        ? `Overview for ${title}: Key sections include ${sections
            .slice(0, 3)
            .map((s) => s.heading)
            .join(", ")}.`
        : `Fetched Part ${partNumber} - Full content available at ${baseUrl}`;

    return {
      part: partNumber,
      title,
      summary,
      sections: sections.slice(0, 5),
      fullUrl: baseUrl,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching Part ${partNumber}:`, error.message);
    return {
      part: partNumber,
      error: `Failed to fetch: ${error.message}`,
      fallbackUrl: baseUrl,
    };
  }
}

// Main controller function
const handleSelection = async (req, res) => {
  try {
    const { selectedOptions } = req.body;
    console.log("Selected options:", selectedOptions);

    if (
      !selectedOptions ||
      !Array.isArray(selectedOptions) ||
      selectedOptions.length === 0
    ) {
      return res.status(400).json({
        error: "Selected options are required (array of 1, 2, or 3).",
      });
    }

    const validOptions = selectedOptions.filter((opt) =>
      [1, 2, 3].includes(Number(opt))
    );
    if (validOptions.length === 0) {
      return res.status(400).json({
        error:
          "Invalid selection. Choose from 1 (Part 191), 2 (Part 192), or 3 (Part 195).",
      });
    }

    const partNumbers = validOptions.map((id) => {
      const mapping = { 1: "191", 2: "192", 3: "195" };
      return mapping[id];
    });

    const fetchPromises = partNumbers.map((part) => fetchPartSummary(part));
    const summaries = await Promise.all(fetchPromises);

    res.status(200).json({
      message: `Fetched summaries for Parts: ${partNumbers.join(", ")}`,
      selectedParts: partNumbers,
      data: summaries,
      totalSections: summaries.reduce(
        (acc, s) => acc + (s.sections ? s.sections.length : 0),
        0
      ),
    });
  } catch (error) {
    console.error("Controller error:", error);
    res
      .status(500)
      .json({ error: "Internal server error while fetching regulations." });
  }
};

module.exports = { handleSelection };
