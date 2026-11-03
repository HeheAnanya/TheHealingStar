/* eslint-disable no-undef */
const RazorPay = require("razorpay")
const crypto = require("crypto")
const prisma = require('../prisma/client')

const payment = new RazorPay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

async function paymentGateway(orderId) {
    const order = await prisma.order.findUnique({
        where: { id: Number(orderId) }
    })
    if (!order) throw new Error("Order Not Found")

    const razorpay = await payment.orders.create({
        amount: order.totalPrice * 100,
        currency: "INR",
        receipt: `order_${order.id}`
    })
    return razorpay
}

async function verifyPayment(data) {
    const { order_id, payment_id, raxorpay_sig, orderId } = data
    const body = order_id + "|" + payment_id
    const expectedSig = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex")

    if (expectedSig !== raxorpay_sig) {
        throw new Error("Payment Verification Failed")
    }

    const paymentDetails = await payment.payments.fetch(payment_id)
    const methodMap = {
        card: "CARD",
        upi: "UPI",
        netbanking: "NETBANKING",
        wallet: "WALLET",
        emi: "EMI",
        paylater: "PAYLATER"
    }

    await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
            where: { id: Number(orderId) },
            include: { items: true }
        })
        if (!order) throw new Error("Order Not Found")

        // Avoid clearing the cart or decrementing stock twice if Razorpay
        // sends the verification request more than once.
        if (order.payStatus === "SUCCESS") return

        for (const item of order.items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } }
            })
        }

        await tx.payment.create({
            data: {
                orderId: Number(orderId),
                payStatus: "SUCCESS",
                payMethod: methodMap[paymentDetails.method] || "CARD"
            }
        })

        await tx.order.update({
            where: { id: Number(orderId) },
            data: { payStatus: "SUCCESS" }
        })

        const cart = await tx.cart.findUnique({
            where: { userId: order.userId }
        })

        if (cart) {
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id }
            })
        }
    })

    return { message: "Payment Successful" }
}

module.exports = { verifyPayment, paymentGateway }
