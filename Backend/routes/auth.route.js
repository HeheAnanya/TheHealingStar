/* eslint-disable no-undef */
const express = require("express")
const router = express.Router() 

const {signup,login,forgotPassword,refreshTokenHandler} = require("../controller/auth.controller")

router.post("/signup",signup)
router.post("/login",login)
router.put("/forgotPassword",forgotPassword)
router.post("/refresh", refreshTokenHandler)

module.exports = router
