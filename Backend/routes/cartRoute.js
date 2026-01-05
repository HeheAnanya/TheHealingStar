const express = require ("express")
const {authMiddleware} = require("../middlewares/authMiddle") 
const {getCart,updateProduct,addProduct,removeProduct,getName} = require("../controller/cartController") 

const router = express.Router()

router.get("/",authMiddleware,getCart)
router.get("/:name",authMiddleware,getName)
router.post("/add",authMiddleware,addProduct)
router.put("/update",authMiddleware,updateProduct)
router.delete("/remove/:productId",authMiddleware,removeProduct)


module.exports = router
