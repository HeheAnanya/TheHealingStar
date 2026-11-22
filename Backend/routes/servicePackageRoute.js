const express = require("express");
const router = express.Router();
const { publicPackages } = require("../controller/servicePackageController");
router.get("/packages", publicPackages);
module.exports = router;
