/* eslint-disable no-undef */
const express = require("express")
const router = express.Router()
const {rbac} = require("../middlewares/rbaMiddle") 
const {authMiddleware} = require("../middlewares/authMiddle") 
const {admin} = require("../controller/adminController")

router.get("/test",authMiddleware,rbac(["ADMIN"]),admin)

module.exports = router