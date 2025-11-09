const express = require("express");
const { handleSelection } = require("../controllers/selectionController.js");

const router = express.Router();

router.post("/selection", handleSelection);
const test = (req, res) => {
  res.json({ message: "test successful" });
};

module.exports = router;
