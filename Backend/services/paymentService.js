/* eslint-disable no-undef */
const RazorPay = require("razorpay")
const crypto = require("crypto")
const prisma = require('../prisma/client')

const payment = new RazorPay({

    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})
async function paymentGateway(orderId) {
    const order = await prisma.order.findUnique({
        where:{
            id:Number(orderId)
        }
    })
    if (!order){
        throw new Error("Order Not Found")
    }
    const razorpay =  await payment.orders.create({
        amount:order.totalPrice*100,
        currency:"INR",
        receipt:`order_${order.id}`
    })
    return razorpay
    
}
async function verifyPayment(data) {
    let { order_id, payment_id, raxorpay_sig } = data
    let body = order_id + "|" + payment_id
    const expectedSig = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex")

    if (expectedSig != raxorpay_sig) {
        throw new Error("Payment Verification Failed")
    }
    const paymentDetails = await payment.payments.fetch(payment_id)

    await prisma.payment.create(
        {
            data:{
                orderId:Number(orderId),
                payStatus:"SUCCESS",
                payMethod:paymentDetails.method.toUpperCase()
            }
        }
    )
    await prisma.order.update({
        where:
        {id:
            Number(orderId)
        },
        data:{payStatus:"SUCCESS"}
    })
    return {message:"Payment Successful"}
    
}

module.exports = {verifyPayment,paymentGateway}