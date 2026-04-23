/* eslint-disable no-undef */
const express = require("express")
const router = express.Router()
const {authMiddleware} = require("../middlewares/authMiddle") 
const {orderCreate,myOrder,deleteOrder} = require("../controller/orderController")

router.post("/create",authMiddleware,orderCreate)
router.get("/my",authMiddleware,myOrder)
router.delete("/:orderId", authMiddleware, deleteOrder);
module.exports = router