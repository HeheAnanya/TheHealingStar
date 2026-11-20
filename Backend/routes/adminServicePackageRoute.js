const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddle");
const { rbac } = require("../middlewares/rbaMiddle");
const {
  adminPackages,
  createPackage,
  updatePackage,
  setPackageActive,
} = require("../controller/servicePackageController");

router.use(authMiddleware, rbac(["ADMIN"]));
router.get("/", adminPackages);
router.post("/", createPackage);
router.put("/:packageId", updatePackage);
router.patch("/:packageId/active", setPackageActive);

module.exports = router;
