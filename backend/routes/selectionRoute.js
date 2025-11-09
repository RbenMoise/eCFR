const express = require("express");
const { handleSelection } = require("../controllers/selectionController.js");

const router = express.Router();

router.post("/selection", handleSelection);

module.exports = router;
