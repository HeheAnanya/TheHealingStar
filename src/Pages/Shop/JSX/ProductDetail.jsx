import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, ChevronRight, Minus, Plus, ShieldCheck, ShoppingBag, Truck,} from "lucide-react";
import productData from "../data";
import Navbar from "../../Home/JSX/Navbar";
import Footer from "../../Home/JSX/Footer";
import { api } from "../../../api/axios";

import "../CSS/ProductDetail.css";

const ProductDetail = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();

  const [count, setCount] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [loadingAction, setLoadingAction] = useState("");

  const products = productData[category] || [];

  const product = products.find(
    (item) => String(item.id) === String(id)
  );

  const relatedProducts = useMemo(() => {
    return products
      .filter((item) => String(item.id) !== String(id))
      .slice(0, 4);
  }, [products, id]);

  const productName = product?.name || product?.alt || "Product";

  const productPrice = product
    ? Number(String(product.price).replace(/[^\d.]/g, "")) || 0
    : 0;

  const productImages = product
    ? [...new Set([product.src, ...(product.images || [])].filter(Boolean))]
    : [];

  const selectedImage = activeImage || productImages[0];

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const handleAddToCart = async () => {
    if (!product || loadingAction) return;

    setLoadingAction("cart");

    try {
      await api.post("/cart/add", {
        productId: product.id,
        quantity: count,
      });

      window.dispatchEvent(new Event("cart-changed"));
      window.alert("Added to your bag successfully!");
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Unable to add this product."
      );
    } finally {
      setLoadingAction("");
    }
  };

  const handleBuyNow = async () => {
    if (!product || loadingAction) return;

    setLoadingAction("buy");

    try {
      await api.post("/cart/add", {
        productId: product.id,
        quantity: count,
      });

      window.dispatchEvent(new Event("cart-changed"));
      navigate("/cart");
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Unable to proceed with this product."
      );
    } finally {
      setLoadingAction("");
    }
  };

  if (!product) {
    return (
      <div className="product-page">
        <Navbar />

        <main className="product-not-found">
          <ShoppingBag size={42} strokeWidth={1.4} />

          <h2>We couldn't find this product</h2>

          <p>
            This product may have moved. Explore our collection to find
            something meaningful for you.
          </p>

          <button
            type="button"
            className="product-primary-btn"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="product-page">
      <Navbar />

      <main className="product-page-main">
        <nav className="product-breadcrumb" aria-label="Breadcrumb">
          <button type="button" onClick={() => navigate("/")}>
            Home
          </button>

          <ChevronRight size={15} />

          <span>{category.replace(/-/g, " ")}</span>

          <ChevronRight size={15} />

          <span className="product-breadcrumb-current">
            {productName}
          </span>
        </nav>

        <section className="product-detail-layout">
          <div className="product-gallery">
            <div className="product-main-image">
              <img src={selectedImage} alt={productName} />
              <span className="product-image-caption">
                Healing Star
              </span>
            </div>

            {productImages.length > 1 && (
              <div className="product-thumbnail-list">
                {productImages.map((image, index) => (
                  <button
                    type="button"
                    key={image}
                    className={`product-thumbnail ${
                      selectedImage === image ? "is-selected" : ""
                    }`}
                    onClick={() => setActiveImage(image)}
                    aria-label={`View product image ${index + 1}`}
                  >
                    <img src={image} alt={`${productName} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}

            <div className="product-gallery-note">
              <ShieldCheck size={17} />
              <span>Thoughtfully selected for your everyday rituals</span>
            </div>
          </div>

          <div className="product-information">
            <p className="product-eyebrow">MINDFUL LIVING · MEANINGFUL FINDS</p>

            <h1>{productName}</h1>

            <p className="product-short-description">
              A thoughtful addition to your personal collection, chosen
              to bring beauty and intention to your everyday rituals.
            </p>

            <div className="product-price-block">
              <span className="product-price-label">Price</span>
              <strong>{formatPrice(productPrice)}</strong>
              <span className="product-inclusive-note">
                Inclusive of applicable taxes
              </span>
            </div>

            <div className="product-divider" />

            <div className="product-description-block">
              <h2>About this piece</h2>
              <p>{product.des || "A thoughtfully selected piece from our collection."}</p>
            </div>

            <div className="product-highlights">
              <div className="product-highlight">
                <span className="product-highlight-icon">
                  <Check size={17}  style={{color:"#A67C45"}}/>
                </span>
                <span>Thoughtfully curated collection</span>
              </div>

              <div className="product-highlight">
                <span className="product-highlight-icon">
                  <Check size={17} style={{color:"#A67C45"}}/>
                </span>
                <span>A meaningful gift for yourself or someone special</span>
              </div>
            </div>

            {(product.size || product.material || product.origin) && (
              <div className="product-specifications">
                <h2>Product details</h2>

                {product.size && (
                  <div className="product-spec-row">
                    <span>Size</span>
                    <strong>{product.size}</strong>
                  </div>
                )}

                {product.material && (
                  <div className="product-spec-row">
                    <span>Material</span>
                    <strong>{product.material}</strong>
                  </div>
                )}

                {product.origin && (
                  <div className="product-spec-row">
                    <span>Origin</span>
                    <strong>{product.origin}</strong>
                  </div>
                )}
              </div>
            )}

            <div className="product-purchase">
              <label htmlFor="product-quantity">Quantity</label>

              <div className="product-purchase-controls">
                <div className="product-quantity-control">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={count <= 1 || Boolean(loadingAction)}
                    onClick={() =>
                      setCount((previous) => Math.max(1, previous - 1))
                    }
                  >
                    <Minus size={16} />
                  </button>

                  <span id="product-quantity">{count}</span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={Boolean(loadingAction)}
                    onClick={() => setCount((previous) => previous + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <span className="product-total-price">
                  Total: {formatPrice(productPrice * count)}
                </span>
              </div>

              <button
                type="button"
                className="product-primary-btn product-add-btn"
                disabled={Boolean(loadingAction)}
                onClick={handleAddToCart}
              >
                <ShoppingBag size={19} />

                {loadingAction === "cart"
                  ? "Adding to Bag..."
                  : "Add to Cart"}
              </button>

              <button
                type="button"
                className="product-secondary-btn product-buy-btn"
                disabled={Boolean(loadingAction)}
                onClick={handleBuyNow}
              >
                {loadingAction === "buy" ? "Please wait..." : "Buy Now"}
              </button>
            </div>

            <div className="product-service-details">
              <div className="product-service-row">
                <Truck size={20} />

                <div>
                  <strong>Delivery information</strong>
                  <p>Delivery options and charges are confirmed at checkout.</p>
                </div>
              </div>

              <div className="product-service-row">
                <ShieldCheck size={20} />

                <div>
                  <strong>Shop with confidence</strong>
                  <p>Review available payment and return details at checkout.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="product-story-section">
          <div className="product-story-heading">
            <span>Healing Star</span>
            <h2>A little more meaning in everyday life.</h2>
            <p>
              Explore thoughtfully selected pieces that make your rituals,
              spaces and gifting moments feel personal.
            </p>
          </div>

          <div className="product-story-values">
            <div>
              <span>01</span>
              <h3>Choose with intention</h3>
              <p>Find a piece that feels right for your personal journey.</p>
            </div>

            <div>
              <span>02</span>
              <h3>Make it personal</h3>
              <p>Discover thoughtful pieces for yourself and loved ones.</p>
            </div>

            <div>
              <span>03</span>
              <h3>Create your ritual</h3>
              <p>Bring a moment of calm and meaning into your routine.</p>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="related-products-section">
            <div className="related-products-heading">
              <div>
                <span>EXPLORE MORE</span>
                <h2>You may also like</h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(`/shop/${category}`)
                }
              >
                Explore collection <ArrowLeft size={16} />
              </button>
            </div>

            <div className="related-products-grid">
              {relatedProducts.map((item) => {
                const itemPrice =
                  Number(String(item.price).replace(/[^\d.]/g, "")) || 0;

                return (
                  <button
                    type="button"
                    className="related-product-card"
                    key={item.id}
                    onClick={() =>
                      navigate(`/product/${category}/${item.id}`)
                    }
                  >
                    <div className="related-product-image">
                      <img src={item.src} alt={item.name} />
                    </div>

                    <div className="related-product-info">
                      <h3>{item.name}</h3>
                      <strong>{formatPrice(itemPrice)}</strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
