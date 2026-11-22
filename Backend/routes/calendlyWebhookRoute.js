const express = require("express");
const router = express.Router();
const { calendlyWebhook } = require("../controller/calendlyWebhookController");
router.post("/webhook", calendlyWebhook);
module.exports = router;
