const express = require("express");
const { handleSelection } = require("../controllers/selectionController.js");
const handleProfile =
  require("../controllers/profileController.js").handleProfile;

const router = express.Router();

router.post("/selection", handleSelection);
router.post("/profile", handleProfile);

const test = (req, res) => {
  res.json({ message: "test successful" });
};

module.exports = router;
