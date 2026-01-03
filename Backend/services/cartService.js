// Add item to cart
const prisma = require("../prisma/client")
async function addToCart(userId, productId, quantity) {
    quantity = Number(quantity)

  if (!productId || quantity <= 0) {
    throw new Error("Invalid product or quantity")
  }

  const product = await prisma.product.findUnique({
    where: { id: Number(productId) }
  })

  if (!product) throw new Error("Product not found")

  if (product.stock < quantity) {
    throw new Error("Insufficient stock")
  }

  let cart = await prisma.cart.findUnique({
    where: { userId }
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId }
    })
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: product.id
    }
  })

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity
      }
    })
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: product.id,
      quantity
    }
  })    
}
async function getCart(userId) {
let order_list =  await prisma.cart.findUnique({
    where:{
        userId:Number(userId)
    },
    include:{
        items:{
            include:{
                product:true
            }
        }
    }
})
return order_list
}
async function updateProduct(userId, productId, quantity) {
  quantity = Number(quantity)
  userId = Number(userId)
  productId = Number(productId)
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero")
  }

  const cart = await prisma.cart.findUnique({
    where: { userId }
  })

  if (!cart) throw new Error("Cart not found")

  return prisma.cartItem.updateMany({
    where: {
      cartId: cart.id,
      productId: Number(productId)
    },
    data: { quantity }
  })
}

async function removeProduct(userId, productId) {
  const cart = await prisma.cart.findUnique({
    where: { userId }
  })

  if (!cart) throw new Error("Cart not found")

  return prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
      productId: Number(productId)
    }
  })
}


module.exports = {addToCart,getCart,updateProduct,removeProduct}