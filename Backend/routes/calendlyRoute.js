const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddle");
const { rbac } = require("../middlewares/rbaMiddle");
const {
  calendlyConnection,
  listCalendlyEventTypes,
} = require("../controller/calendlyController");

// Admin-only: never expose Calendly account details to public visitors.
router.get("/connection", authMiddleware, rbac(["ADMIN"]), calendlyConnection);
router.get("/event-types", authMiddleware, rbac(["ADMIN"]), listCalendlyEventTypes);

module.exports = router;
