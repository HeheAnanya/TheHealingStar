import React, { useEffect, useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { api } from "../../../api/axios";
import productData from "../data/index";
import "../CSS/CartDrawer.css";

const CartDrawer = ({
  onClose,
  onLogin,
  onContinueShopping,
  onViewCart,
}) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyItems, setBusyItems] = useState([]);
  const [error, setError] = useState("");

  const allProducts = Object.values(productData).flat();
  const items = cart?.items || [];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const fetchCart = async () => {
    try {
      setError("");
      const response = await api.get("/cart");
      setCart(response.data);
    } catch (err) {
      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setError("login-required");
      } else {
        setError("Unable to load your cart. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const getImage = (productName) => {
    const product = allProducts.find(
      (item) =>
        item.name?.toLowerCase() === productName?.toLowerCase() ||
        item.alt?.toLowerCase() === productName?.toLowerCase()
    );

    return product?.src || "";
  };

  const updateQuantity = async (item, quantity) => {
    if (quantity < 1) {
      await removeItem(item.product.id);
      return;
    }

    const productId = item.product.id;

    setBusyItems((previous) => [...previous, productId]);
    setError("");

    try {
      await api.put("/cart/update", {
        productId,
        quantity,
      });

      await fetchCart();
      window.dispatchEvent(new Event("cart-changed"));
    } catch (err) {
      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setError("login-required");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to update quantity. Please try again."
        );
      }
    } finally {
      setBusyItems((previous) =>
        previous.filter((id) => id !== productId)
      );
    }
  };

  const removeItem = async (productId) => {
    setBusyItems((previous) => [...previous, productId]);
    setError("");

    try {
      await api.delete(`/cart/remove/${productId}`);

      await fetchCart();
      window.dispatchEvent(new Event("cart-changed"));
    } catch (err) {
      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setError("login-required");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to remove this item. Please try again."
        );
      }
    } finally {
      setBusyItems((previous) =>
        previous.filter((id) => id !== productId)
      );
    }
  };

  const totalPrice = items.reduce(
    (total, item) =>
      total + Number(item.product.price || 0) * item.quantity,
    0
  );

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div
      className="cart-drawer-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Your shopping cart"
      >
        <header className="cart-drawer-header">
          <div>
            <span className="cart-drawer-eyebrow">
              Healing Star
            </span>
            <h2>Your Bag ({totalQuantity})</h2>
          </div>

          <button
            type="button"
            className="cart-drawer-close"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X size={23} />
          </button>
        </header>

        {loading ? (
          <div className="cart-drawer-state">
            <ShoppingBag size={32} />
            <p>Loading your bag...</p>
          </div>
        ) : error && !cart ? (
          <div className="cart-drawer-state">
            <ShoppingBag size={32} />

            <p>
              {error === "login-required"
                ? "Please sign in to view your shopping bag."
                : error}
            </p>

            {error === "login-required" ? (
              <button
                type="button"
                onClick={onLogin}
              >
                Login to Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  fetchCart();
                }}
              >
                Try Again
              </button>
            )}
          </div>
        ) : items.length === 0 ? (
          <div className="cart-drawer-empty">
            <div className="cart-drawer-empty-icon">
              <ShoppingBag size={34} />
            </div>

            <h3>Your bag is waiting</h3>

            <p>
              Discover meaningful pieces to bring a little more
              balance and beauty into your everyday life.
            </p>

            <button
              type="button"
              className="cart-drawer-primary"
              onClick={onContinueShopping}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-drawer-items">
              {items.map((item) => {
                const productId = item.product.id;
                const productName =
                  item.product.productName || item.product.name;
                const busy = busyItems.includes(productId);
                const productImage = getImage(productName);

                return (
                  <article
                    className="cart-drawer-item"
                    key={item.id}
                  >
                    <div className="cart-drawer-image-wrap">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={productName}
                          className="cart-drawer-image"
                        />
                      ) : (
                        <div className="cart-drawer-image-placeholder">
                          <ShoppingBag size={24} />
                        </div>
                      )}
                    </div>

                    <div className="cart-drawer-item-details">
                      <h3>{productName}</h3>

                      <p className="cart-drawer-item-price">
                        ₹
                        {Number(
                          item.product.price || 0
                        ).toLocaleString("en-IN")}
                      </p>

                      <div className="cart-drawer-item-actions">
                        <div className="cart-quantity-control">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            disabled={busy}
                            onClick={() =>
                              updateQuantity(
                                item,
                                item.quantity - 1
                              )
                            }
                          >
                            <Minus size={14} />
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            type="button"
                            aria-label="Increase quantity"
                            disabled={busy}
                            onClick={() =>
                              updateQuantity(
                                item,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="cart-drawer-remove"
                          disabled={busy}
                          onClick={() => removeItem(productId)}
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>

                    <strong className="cart-drawer-line-total">
                      ₹
                      {(
                        Number(item.product.price || 0) *
                        item.quantity
                      ).toLocaleString("en-IN")}
                    </strong>
                  </article>
                );
              })}
            </div>

            <div className="cart-drawer-footer">
              {error && (
                <div className="cart-drawer-error" role="alert">
                  <p>
                    {error === "login-required"
                      ? "Your session has expired. Please sign in again."
                      : error}
                  </p>

                  {error === "login-required" && (
                    <button type="button" onClick={onLogin}>
                      Login to Continue
                    </button>
                  )}
                </div>
              )}

              <div className="cart-drawer-subtotal">
                <span>Subtotal</span>
                <strong>
                  ₹{totalPrice.toLocaleString("en-IN")}
                </strong>
              </div>

              <p className="cart-drawer-note">
                Shipping and final charges are calculated at checkout.
              </p>

              <button
                type="button"
                className="cart-drawer-primary"
                onClick={onViewCart}
              >
                View Cart &amp; Continue
              </button>

              <button
                type="button"
                className="cart-drawer-secondary"
                onClick={onContinueShopping}
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
