const Razorpay = require("razorpay");
const crypto = require("crypto");
const prisma = require("../prisma/client");

function razorpayClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    const error = new Error("Razorpay keys are not configured on the server");
    error.status = 503;
    throw error;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

async function createServicePayment({ userId, packageId }) {
  const numericUserId = Number(userId);
  const numericPackageId = Number(packageId);
  if (!Number.isInteger(numericUserId) || numericUserId < 1 ||
      !Number.isInteger(numericPackageId) || numericPackageId < 1) {
    const error = new Error("A valid service package is required");
    error.status = 400;
    throw error;
  }

  const servicePackage = await prisma.servicePackage.findFirst({
    where: { id: numericPackageId, isActive: true },
  });
  if (!servicePackage) {
    const error = new Error("This service package is not available");
    error.status = 404;
    throw error;
  }
  if (!servicePackage.schedulingUrl || !servicePackage.calendlyEventTypeUri) {
    const error = new Error("This package is not connected to a Calendly Event Type yet");
    error.status = 409;
    throw error;
  }
  if (!Number.isInteger(servicePackage.price) || servicePackage.price < 1) {
    const error = new Error("The package price is not configured correctly");
    error.status = 409;
    throw error;
  }

  const serviceOrder = await prisma.serviceOrder.create({
    data: {
      userId: numericUserId,
      packageId: servicePackage.id,
      amount: servicePackage.price,
      payStatus: "FAILED",
    },
  });

  try {
    const razorpayOrder = await razorpayClient().orders.create({
      amount: servicePackage.price * 100,
      currency: "INR",
      receipt: `service_${serviceOrder.id}`,
      notes: {
        serviceOrderId: String(serviceOrder.id),
        packageId: String(servicePackage.id),
        userId: String(numericUserId),
      },
    });

    await prisma.serviceOrder.update({
      where: { id: serviceOrder.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return {
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrder,
      serviceOrderId: serviceOrder.id,
      package: {
        id: servicePackage.id,
        name: servicePackage.name,
        category: servicePackage.category,
        durationMinutes: servicePackage.durationMinutes,
        amount: servicePackage.price,
        currency: "INR",
      },
    };
  } catch (error) {
    await prisma.serviceOrder.delete({ where: { id: serviceOrder.id } }).catch(() => {});
    throw error;
  }
}

async function verifyServicePayment({ userId, serviceOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  if (!serviceOrderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    const error = new Error("Missing Razorpay payment verification details");
    error.status = 400;
    throw error;
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    const error = new Error("Razorpay is not configured");
    error.status = 503;
    throw error;
  }
  const expected = crypto.createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  const suppliedBuffer = Buffer.from(String(razorpay_signature));
  const expectedBuffer = Buffer.from(expected);
  if (suppliedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)) {
    const error = new Error("Payment signature verification failed");
    error.status = 400;
    throw error;
  }

  const order = await prisma.serviceOrder.findFirst({
    where: { id: Number(serviceOrderId), userId: Number(userId), razorpayOrderId: razorpay_order_id },
    include: { package: true },
  });
  if (!order) {
    const error = new Error("Service payment order was not found");
    error.status = 404;
    throw error;
  }

  if (order.payStatus === "SUCCESS") {
    if (order.razorpayPaymentId !== razorpay_payment_id) {
      const error = new Error("A different payment has already been recorded for this booking");
      error.status = 409;
      throw error;
    }
    return {
      message: "Payment already verified",
      schedulingUrl: order.package.schedulingUrl,
      serviceOrderId: order.id,
    };
  }

  const razorpayPayment = await razorpayClient().payments.fetch(razorpay_payment_id);
  if (razorpayPayment.order_id !== razorpay_order_id ||
      Number(razorpayPayment.amount) !== order.amount * 100 ||
      razorpayPayment.currency !== "INR") {
    const error = new Error("Payment details do not match this service order");
    error.status = 400;
    throw error;
  }
  if (razorpayPayment.status !== "captured") {
    const error = new Error("Payment is not captured yet. Please retry after payment confirmation.");
    error.status = 409;
    throw error;
  }

  await prisma.serviceOrder.update({
    where: { id: order.id },
    data: { payStatus: "SUCCESS", razorpayPaymentId: razorpay_payment_id },
  });

  return {
    message: "Payment verified successfully",
    schedulingUrl: order.package.schedulingUrl,
    serviceOrderId: order.id,
  };
}

module.exports = { createServicePayment, verifyServicePayment };
