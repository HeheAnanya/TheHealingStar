import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { api } from "../../../api/axios";
import "../CSS/ProductCard.css";

const ProductCard = ({
  productId,
  src,
  alt,
  name,
  des,
  size,
  price,
  stock,
  onClick,
}) => {
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (event) => {
    event.stopPropagation();
    if (adding) return;

    setAdding(true);

    try {
      await api.post("/cart/add", {
        productId,
        quantity: 1,
      });

      window.dispatchEvent(new Event("cart-changed"));
      window.alert("Added to cart successfully!");
    } catch (error) {
      window.alert(
        error.response?.data?.message || "Add to cart failed"
      );
    } finally {
      setAdding(false);
    }
  };

  const isOutOfStock = stock != null && Number(stock) <= 0;

  return (
    <article className="product-card">
      <button
        type="button"
        className="product-card-image"
        onClick={onClick}
        aria-label={`View ${name || alt}`}
      >
        <img
          src={src}
          alt={alt || name || "Product"}
          loading="lazy"
        />
      </button>

      <div className="product-card-content">
        <button
          type="button"
          className="product-card-name"
          onClick={onClick}
        >
          {name || alt}
        </button>

        {des && <p className="product-card-description">{des}</p>}
        {size && <p className="product-card-size">{size}</p>}

        <p className="product-card-price">{price}</p>

        <button
          type="button"
          className="product-card-add-button"
          onClick={handleAddToCart}
          disabled={adding || isOutOfStock}
        >
          <ShoppingBag size={16} />
          {adding
            ? "Adding..."
            : isOutOfStock
              ? "Out of Stock"
              : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;