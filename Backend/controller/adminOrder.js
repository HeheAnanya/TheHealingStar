const adminOrder = require("../services/adminOrder")

async function Orders(req,res) {
    try{
        let orders = await adminOrder.allOrder()
        return res.status(200).json(orders)
    }
    catch(err){
        console.log(err)
        return res.status(400).json({"Error":err.message})
    }
    
}
async function FinalOrderStatus(req,res) {
    try{
        let {orderId} = req.params
        let {status} = req.body

        let orders = await adminOrder.orderStatus(orderId,status)
        return res.status(200).json(orders)
    }
    catch(err){
        console.log(err)
        return res.status(400).json({"Error":err.message})
    }
    
}
module.exports = {Orders,FinalOrderStatus}