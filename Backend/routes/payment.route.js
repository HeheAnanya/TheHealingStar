/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddle");
const { createPayment, verifyPayment } = require("../controller/paymentController");

router.post("/create", authMiddleware, createPayment);
router.post("/verify", authMiddleware, verifyPayment);

module.exports = router;
