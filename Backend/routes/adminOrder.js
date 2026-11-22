const express = require("express")
const router = express.Router()
const {authMiddleware} = require("../middlewares/authMiddle")
const {rbac} = require("../middlewares/rbaMiddle")
const {Orders,FinalOrderStatus} = require("../controller/adminOrder")
const {serviceBookings, updateServiceBookingStatus} = require("../controller/adminServiceBooking")

router.get("/orders",authMiddleware,rbac(["ADMIN"]),Orders)
router.put("/orders/:orderId/status",authMiddleware,rbac(["ADMIN"]),FinalOrderStatus)
router.get("/service-bookings",authMiddleware,rbac(["ADMIN"]),serviceBookings)
router.put("/service-bookings/:bookingId/status",authMiddleware,rbac(["ADMIN"]),updateServiceBookingStatus)

module.exports = router
