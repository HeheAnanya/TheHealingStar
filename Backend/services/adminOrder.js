const prisma = require("../prisma/client")


async function allOrder() {

    let all_order = await prisma.order.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true
                }

            },
            items: true,
            payment: true,
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return all_order

}

async function orderStatus(orderId, status) {
    orderId = Number(orderId)
    let all_status = [
        "DELIVERED",
        "ON_THE_WAY",
        "CANCELLED"
    ]
     if (!all_status.includes(status)) {
        throw new Error("Invalid order status")
    }
    let order = await prisma.order.findUnique({
        where:{
            id:orderId
        }
    })
    if (!order){
        throw new Error(
        "Order Not Found"
        )
    }
    let new_staus = await prisma.order.update({
        where:{
            id:orderId
        },
        data:{
            status:status
        }
    })
    return new_staus

}

module.exports = { allOrder, orderStatus }