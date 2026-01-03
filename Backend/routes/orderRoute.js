const express = require("express")
const router = express.Router()
const {authMiddleware} = require("../middlewares/authMiddle") 
const {orderCreate,myOrder} = require("../controller/orderController")

router.post("/create",authMiddleware,orderCreate)
router.get("/my",authMiddleware,myOrder)
module.exports = router