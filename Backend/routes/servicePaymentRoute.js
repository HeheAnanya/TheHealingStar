const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddle");
const {
  createServicePayment,
  verifyServicePayment,
} = require("../controller/servicePaymentController");

router.post("/create", authMiddleware, createServicePayment);
router.post("/verify", authMiddleware, verifyServicePayment);

module.exports = router;
