const servicePayment = require("../services/servicePaymentService");

async function createServicePayment(req, res) {
  try {
    const result = await servicePayment.createServicePayment({
      userId: req.user.userId,
      packageId: req.body.packageId,
    });
    return res.status(201).json(result);
  } catch (error) {
    console.error("Service payment creation error:", error);
    return res.status(error.status || 400).json({ message: error.message || "Unable to start service payment" });
  }
}

async function verifyServicePayment(req, res) {
  try {
    const result = await servicePayment.verifyServicePayment({
      ...req.body,
      userId: req.user.userId,
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Service payment verification error:", error);
    return res.status(error.status || 400).json({ message: error.message || "Unable to verify service payment" });
  }
}

module.exports = { createServicePayment, verifyServicePayment };
