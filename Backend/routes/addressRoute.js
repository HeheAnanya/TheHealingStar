/* eslint-disable no-undef */
// GET /address, POST /address, DELETE /address/:id

const express = require("express")
const router = express.Router()
const {authMiddleware} = require("../middlewares/authMiddle")
const {getAddresses,deleteAddress,addAddress} = require("../controller/addressController")

router.get("/",authMiddleware,getAddresses)
router.post("/",authMiddleware,addAddress)
router.delete("/:id",authMiddleware,deleteAddress)
module.exports = router