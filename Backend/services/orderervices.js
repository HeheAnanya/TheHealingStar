/* eslint-disable no-undef */
const prisma = require("../prisma/client")

async function orderCreate(userId) {
    userId = Number(userId)
    try {
        let cart = await prisma.cart.findUnique({
            where: {
                userId: userId
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })
        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty")
        }
        let totalPrice = 0
        for (let i of cart.items) {
            if (i.product.stock < i.quantity) {
                throw new Error("Item Out of Stock")
            }
            totalPrice += (i.product.price * i.quantity)
        }
        let order = await prisma.order.create({
            data: {
                userId: userId,
                totalPrice: totalPrice,
                payStatus: "FAILED"

            }
        })
        for (let i of cart.items) {
            await prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: i.product.id,
                    productName: i.product.productName,
                    productPrice: i.product.price,
                    quantity: i.quantity
                }
            })
            await prisma.product.update({
                where: { id: i.product.id },
                data: {
                    stock: {
                        decrement: i.quantity
                    }
                }
            })

        }
        await prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id
            }
        })
        return {
            message: "Order placed successfully",
            orderId: order.id,
            totalPrice
        }
    }
    catch (err) {
        throw new Error(err.message)
    }


}
async function myOrder(userId) {
    userId = Number(userId)
    try {
        let found = await prisma.order.findMany({
            where: {
                userId: userId,
                payStatus:"SUCCESS"
            },
            include: {
        items: true  
    }
        })
        if (found) {
            return { found }
        }
        else {
            return { message: "Your Order List is empty" }
        }
    }
    catch (err) {
        throw new Error(err.message)
    }

}
async function deleteOrderHistory(userId,orderId) {
        userId = Number(userId)
        orderId= Number(orderId)
    try {
        let found = await prisma.order.findUnique({
            where: {
                id: orderId,
                userId: userId
            }
        })
        if (found) {
            await prisma.orderItem.deleteMany({ where: { orderId: orderId } })
            await prisma.payment.deleteMany({ where: { orderId: orderId } })
            await prisma.order.delete({
                where:{
                    id:orderId,
                    
                }
            }
            )
            return { message: "Order deleted" }
        }
        else {
            return { message: "Your Order List is empty" }
        }
    }
    catch (err) {
        throw new Error(err.message)
    }


    
}

module.exports = { orderCreate, myOrder,deleteOrderHistory }