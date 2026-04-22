import React, { useState, useEffect } from "react";
import Navbar from "../../Home/JSX/Navbar";
import Footer from "../../Home/JSX/Footer";
import { api } from "../../../api/axios"
import { useNavigate } from 'react-router-dom'
import "../CSS/Cart.css";
import productData from "../data/index"

const Cart = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  let allProducts = Object.values(productData).flat()

  async function handleCheckout() {
    try {
      const orderRes = await api.post("/order/create")
      const { orderId } = orderRes.data
      const paymentRes = await api.post("/payment/create", { orderId })
      const razorpayOrder = paymentRes.data
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "The Healing Star",
        // description: "Crystal Products",
        order_id: razorpayOrder.id,
        config: {
    display: {
      blocks: {
        upi: {
          name: "Pay via UPI",
          instruments: [
            {
              method: "upi"
            }
          ]
        }
      },
      sequence: ["block.upi", "block.card", "block.netbanking"],
      preferences: {
        show_default_blocks: true
      }
    }
  },
        // method: {
        //   upi: true,
        //   card: true,
        //   netbanking: true,
        //   wallet: true
        // },

        handler: async function (response) {
          await api.post("/payment/verify", {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            raxorpay_sig: response.razorpay_signature,  // keep your spelling from paymentService
            orderId: orderId
          })
          alert("✅ Payment successful!")
          navigate("/order/my")
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#D4AF37"
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed")
    }
  }
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
  function image(name) {
    const src = allProducts.find((p) => p.name?.toLowerCase() === name?.toLowerCase() || p.alt?.toLowerCase() === name?.toLowerCase()
    )
    return src?.src || ""
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
              <button className="remove-btn" onClick={() => removeFromCart(item.product.id)}>Remove</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Total: ₹{totalPrice}</h3>
          <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
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