const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const selectionRoutes = require("./routes/selectionRoute.js");
const { test } = require("./controllers/selectionController.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/test", test);
app.use("/api", selectionRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅Server running on port ${PORT}`));
