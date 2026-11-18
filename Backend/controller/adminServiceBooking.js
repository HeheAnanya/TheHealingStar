const prisma = require("../prisma/client");

async function serviceBookings(req, res) {
  try {
    const bookings = await prisma.appointment.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        orderItem: {
          include: {
            order: { select: { id: true, payStatus: true, createdAt: true } },
          },
        },
        slot: true,
      },
      orderBy: { bookedAt: "desc" },
    });
    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Admin service bookings error:", error);
    return res.status(500).json({ message: "Unable to load service bookings" });
  }
}

async function updateServiceBookingStatus(req, res) {
  try {
    const id = Number(req.params.bookingId);
    const { status } = req.body;
    const allowed = ["BOOKED", "CANCELLED", "COMPLETED"];
    if (!Number.isInteger(id) || id < 1 || !allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid booking ID or status" });
    }
    const booking = await prisma.appointment.update({
      where: { id },
      data: { status },
    });
    return res.status(200).json(booking);
  } catch (error) {
    console.error("Admin service booking update error:", error);
    return res.status(500).json({ message: "Unable to update service booking" });
  }
}

module.exports = { serviceBookings, updateServiceBookingStatus };
