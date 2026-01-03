const order = require("../services/orderervices")

async function orderCreate(req,res){
    let userId = req.user.userId
    try{
        let orderItems = await order.orderCreate(userId)
        return res.status(201).json(orderItems)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({"Error":"Internal Server Error"})
    }
}

async function totalOrder(req,res) {
    try{
        const userId = req.user.userId
        const orders = await order.totalOrder(userId)
        return res.status(200).json(orders)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({"Error":"Internal Server Error"})

    }
    
}
async function myOrder(req,res) {
        let userId = req.user.userId
        try{
            let orders = await order.myOrder(userId)
            return res.status(200).json(orders)
    
        }
        catch(err){
            console.log(err)
            return res.status(500).json({"Error":err.message})
        }
        
    
}

module.exports = {orderCreate,totalOrder,myOrder}