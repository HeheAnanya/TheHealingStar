import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import Navbar from "../../Home/JSX/Navbar";
import Footer from "../../Home/JSX/Footer";
import { api } from "../../../api/axios";
import productData from "../data/index";
import "../CSS/Cart.css";

const steps = ["Cart", "Checkout", "Payment", "Order Confirmed"];

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const allProducts = Object.values(productData).flat();

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Unable to load cart:", err);
      setCart({ items: [] });
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const subtotal = useMemo(() => (cart?.items || []).reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity, 0
  ), [cart]);

  const image = (name) => {
    const product = allProducts.find((p) =>
      p.name?.toLowerCase() === name?.toLowerCase() ||
      p.alt?.toLowerCase() === name?.toLowerCase()
    );
    return product?.src || "";
  };

  const updateQuantity = async (item, quantity) => {
    if (quantity < 1) return;
    setBusyId(item.product.id);
    try {
      await api.put("/cart/update", { productId: item.product.id, quantity });
      await fetchCart();
    } catch (err) {
      console.error("Unable to update quantity:", err);
    } finally {
      setBusyId(null);
    }
  };

  const removeItem = async (productId) => {
    setBusyId(productId);
    try {
      await api.delete(`/cart/remove/${productId}`);
      await fetchCart();
    } catch (err) {
      console.error("Unable to remove item:", err);
    } finally {
      setBusyId(null);
    }
  };

  const clearCart = async () => {
    for (const item of cart?.items || []) {
      await api.delete(`/cart/remove/${item.product.id}`);
    }
    await fetchCart();
  };

  return (
    <div className="shop-flow-page">
      <Navbar />
      <main className="cart-page">
        <div className="shop-stepper" aria-label="Checkout progress">
          {steps.map((step, index) => (
            <div className={`shop-step ${index === 0 ? "active" : ""}`} key={step}>
              <span className="shop-step-number">{index + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className="cart-layout">
          <section className="cart-panel">
            <div className="cart-heading">
              <div><ShoppingCart size={25} /><h1>Your Shopping Cart</h1></div>
              <span>{cart?.items?.length || 0} items</span>
            </div>

            {!cart ? (
              <p className="cart-feedback">Loading your cart…</p>
            ) : cart.items.length === 0 ? (
              <div className="cart-empty">
                <ShoppingCart size={42} />
                <h2>Your cart is waiting</h2>
                <p>Discover something meaningful for your journey.</p>
                <button className="gold-button" onClick={() => navigate("/shop/all")}>Explore the shop <ArrowRight size={17} /></button>
              </div>
            ) : (
              <>
                <div className="cart-item-list">
                  {cart.items.map((item) => (
                    <article className="cart-product" key={item.id}>
                      <div className="cart-product-image">
                        {image(item.product.productName) ? <img src={image(item.product.productName)} alt={item.product.productName} /> : <div className="cart-image-fallback">HS</div>}
                      </div>
                      <div className="cart-product-info">
                        <h3>{item.product.productName}</h3>
                        <p>Healing Star collection</p>
                        <strong>₹{Number(item.product.price).toLocaleString("en-IN")}</strong>
                      </div>
                      <div className="cart-product-actions">
                        <div className="quantity-control">
                          <button aria-label="Decrease quantity" disabled={busyId === item.product.id || item.quantity <= 1} onClick={() => updateQuantity(item, item.quantity - 1)}><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button aria-label="Increase quantity" disabled={busyId === item.product.id} onClick={() => updateQuantity(item, item.quantity + 1)}><Plus size={14} /></button>
                        </div>
                        <strong className="cart-line-total">₹{(Number(item.product.price) * item.quantity).toLocaleString("en-IN")}</strong>
                        <button className="cart-remove" disabled={busyId === item.product.id} aria-label={`Remove ${item.product.productName}`} onClick={() => removeItem(item.product.id)}><Trash2 size={17} /></button>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="cart-bottom-links">
                  <button className="text-link" onClick={() => navigate("/shop/all")}><ArrowLeft size={16} /> Continue shopping</button>
                  <button className="text-link muted-link" onClick={clearCart}>Clear cart</button>
                </div>
              </>
            )}
          </section>

          <aside className="cart-summary-panel">
            <h2>Order Summary</h2>
            <div className="summary-row"><span>Subtotal ({cart?.items?.length || 0} items)</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div>
            <div className="summary-row"><span>Shipping</span><strong>{subtotal > 0 ? "Calculated at checkout" : "—"}</strong></div>
            <div className="summary-divider" />
            <div className="summary-total"><span>Total</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div>
            <button className="gold-button checkout-cta" disabled={!cart?.items?.length} onClick={() => navigate("/checkout")}>Proceed to Checkout <ArrowRight size={18} /></button>
            <p className="secure-note"><ShieldCheck size={15} /> Secure checkout · Your details stay protected</p>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
