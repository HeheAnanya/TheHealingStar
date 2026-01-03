const express = require("express")
const router = express.Router()
const {authMiddleware} = require("../middlewares/authMiddle")
const {rbac} = require("../middlewares/rbaMiddle")
const {Orders,FinalOrderStatus} = require("../controller/adminOrder")

router.get("/orders",authMiddleware,rbac(["ADMIN"]),Orders)
router.put( "/orders/:orderId/status", authMiddleware,rbac(["ADMIN"]),FinalOrderStatus)
module.exports = router