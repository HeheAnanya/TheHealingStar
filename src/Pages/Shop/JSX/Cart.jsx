import React, { useState, useEffect } from "react";
import Navbar from "../../Home/JSX/Navbar";
import Footer from "../../Home/JSX/Footer";
import { api } from "../../../api/axios"
import "../CSS/Cart.css";
import productData from  "../data/index"

const Cart = () => {
  const [cart, setCart] = useState(null)
  let allProducts = Object.values(productData).flat()

  async function fetchCart() {
    try {
      const res = await api.get("/cart")
      setCart(res.data)
    }
    catch (err) {
      console.log(err)
    }

  }
  async function removeFromCart(productId) {
    await api.delete(`/cart/remove/${productId}`)
    fetchCart()

  }

  async function clearCart() {
    for (let i of cart.items) {
      await api.delete(`/cart/remove/${i.product.id}`)
    }
    fetchCart()

  }
  useEffect(() => {
    fetchCart()
  }, [])
  const totalPrice = cart ? cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  ) : 0
  if (!cart) {
    return (
      <>
        <Navbar />
        <div className="cart-container">
          <p className="empty-cart">Loading cart...</p>
        </div>
        <Footer />
      </>
    )
  }
  function image(name){
    const src = allProducts.find((p) => p.name?.toLowerCase() === name?.toLowerCase() || p.alt?.toLowerCase() === name?.toLowerCase()
  )
    return src.src|| ""
  }
  return (

    <div>
      <Navbar />
      <div className="cart-container">
        <h2>Your Shopping Cart</h2>
        <div className="cart-items">
          {cart.items.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={image(item.product.productName)} alt={item.product.productName} />
              <div className="cart-details">
                <p className="cart-name">{item.product.productName}</p>
                <p className="cart-price">
                  ₹{item.product.price} * {item.quantity}
                </p>
                <p className="cart-total">
                  Subtotal: ₹{item.product.price * item.quantity}
                </p>
              </div>
              <button className="remove-btn"onClick={() => removeFromCart(item.product.id)}>Remove</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Total: ₹{totalPrice}</h3>
          <button className="checkout-btn" onClick={() => api.post("/order/create")}>Proceed to Checkout</button>
          <button className="clear-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;