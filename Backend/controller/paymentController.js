const paymentServices = require("../services/paymentService")
async function createPayment(req,res) {
    try{
        let {orderId} = req.body
        let payment = await paymentServices.paymentGateway(orderId)
        return res.status(200).json(payment)
    }
    catch(err){
        return res.status(400).json({message:err.message})

    }
    
}
async function verifyPayment(req,res) {
    try{
        const result = await paymentServices.verifyPayment(req.body)
        return res.status(200).json(result)
    }
    catch(err){
        return res.status(400).json({message:err.message})

    }    
}
module.exports={createPayment,verifyPayment}