import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import Navbar from "../Home/JSX/Navbar";
import Footer from "../Home/JSX/Footer";

import "../CSS/Cart.css";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    
    <div>
      <Navbar />

      <div className="cart-container">
        <h2>Your Shopping Cart</h2>

        {cart.length === 0 ? (
          <p className="empty-cart">🛒 Your Cart is Empty</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.images} alt={item.name} />
                  <div className="cart-details">
                    <p className="cart-name">{item.name}</p>
                    <p className="cart-price">
                      ₹{item.price} × {item.quantity}
                    </p>
                    <p className="cart-total">
                      Subtotal: ₹{item.price * item.quantity}
                    </p>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Total: ₹{totalPrice}</h3>
              <button className="checkout-btn">Proceed to Checkout</button>
              <button className="clear-btn" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;