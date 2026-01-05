const cart = require("../services/cartService")

async function getCart(req, res) {
    try {
        let userId = req.user.userId
        let cartPresent = await cart.getCart(userId)
        return res.status(200).json(cartPresent)
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}


async function updateProduct(req, res) {
    try {
        let userId = req.user.userId
        let { productId, quantity } = req.body

        let result = await cart.updateProduct(
            userId,
            productId,
            quantity
        )

        return res.status(200).json(result)
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}
async function addProduct(req, res) {
    try {
        let userId = req.user.userId
        let { productId, quantity } = req.body
        let result = await cart.addToCart(userId, productId, quantity)
        return res.status(200).json(result)
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}
async function removeProduct(req, res) {
    try {
        const userId = req.user.userId
        const { productId } = req.params

        const result = await cart.removeProduct(
            userId,
            productId
        )

        return res.status(200).json(result)
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}
async function getName(req,res) {
    try{
        let {name} = req.params
        let result = await cart.getName(name)
        return res.status(200).json(result)
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
    
}
module.exports = { getCart, updateProduct, addProduct, removeProduct,getName }
