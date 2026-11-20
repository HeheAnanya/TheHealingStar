const crypto = require("crypto");
const prisma = require("../prisma/client");
const { sendServiceBookingEmails } = require("../services/serviceBookingEmailService");

function verifyCalendlySignature(req) {
  const secret = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  const header = req.headers["calendly-webhook-signature"];
  if (!secret || !header || !req.rawBody) return false;

  const parts = Object.fromEntries(String(header).split(",").map((part) => {
    const index = part.indexOf("=");
    return index < 0 ? ["", ""] : [part.slice(0, index).trim(), part.slice(index + 1).trim()];
  }));
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const expected = crypto.createHmac("sha256", secret)
    .update(`${timestamp}.${req.rawBody}`)
    .digest("hex");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

async function calendlyWebhook(req, res) {
  if (!verifyCalendlySignature(req)) {
    return res.status(401).json({ message: "Invalid Calendly webhook signature" });
  }

  try {
    const eventName = req.body.event;
    const payload = req.body.payload || {};

    if (eventName === "invitee.created") {
      const inviteeUri = payload.uri;
      const scheduledEvent = payload.scheduled_event || {};
      const eventUri = scheduledEvent.uri;
      const eventTypeUri = scheduledEvent.event_type;
      const email = String(payload.email || "").trim().toLowerCase();
      if (!inviteeUri || !eventUri || !eventTypeUri || !email) {
        return res.status(200).json({ received: true, matched: false, reason: "Required invitee fields were absent" });
      }

      const alreadySaved = await prisma.appointment.findFirst({
        where: { OR: [{ calendlyInviteeUri: inviteeUri }, { calendlyEventUri: eventUri }] },
      });
      if (alreadySaved) return res.status(200).json({ received: true, duplicate: true });

      const paidOrder = await prisma.serviceOrder.findFirst({
        where: {
          payStatus: "SUCCESS",
          appointment: null,
          package: { calendlyEventTypeUri: eventTypeUri },
          user: { email: { equals: email } },
        },
        include: { package: true, user: true },
        orderBy: { createdAt: "desc" },
      });
      if (!paidOrder) {
        console.warn("Calendly invitee could not be matched to a paid service order", { email, eventTypeUri });
        return res.status(200).json({ received: true, matched: false });
      }

      const appointment = await prisma.appointment.create({
        data: {
          userId: paidOrder.userId,
          serviceOrderId: paidOrder.id,
          serviceName: paidOrder.package.name,
          durationMinutes: paidOrder.package.durationMinutes,
          calendlyEventUri: eventUri,
          calendlyInviteeUri: inviteeUri,
          scheduledAt: scheduledEvent.start_time ? new Date(scheduledEvent.start_time) : null,
          cancelUrl: payload.cancel_url || null,
          rescheduleUrl: payload.reschedule_url || null,
          status: "BOOKED",
        },
      });
      await sendServiceBookingEmails({ appointment, user: paidOrder.user, servicePackage: paidOrder.package });
      return res.status(200).json({ received: true, matched: true });
    }

    if (eventName === "invitee.canceled") {
      const inviteeUri = payload.uri;
      if (inviteeUri) {
        const existingAppointment = await prisma.appointment.findUnique({
          where: { calendlyInviteeUri: inviteeUri },
          include: { user: true, serviceOrder: { include: { package: true } } },
        });
        if (existingAppointment && existingAppointment.status !== "CANCELLED") {
          const cancelledAppointment = await prisma.appointment.update({
            where: { id: existingAppointment.id },
            data: { status: "CANCELLED" },
          });
          if (existingAppointment.serviceOrder?.package) {
            await sendServiceBookingEmails({
              appointment: cancelledAppointment,
              user: existingAppointment.user,
              servicePackage: existingAppointment.serviceOrder.package,
              cancelled: true,
            });
          }
        }
      }
      return res.status(200).json({ received: true });
    }

    return res.status(200).json({ received: true, ignored: true });
  } catch (error) {
    console.error("Calendly webhook processing error:", error);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
}

module.exports = { calendlyWebhook };
