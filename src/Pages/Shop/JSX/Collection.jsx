import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import "../CSS/Collection.css";
import ProductCard from "./ProductCard";
import productData from "../data";
import hero from "../data/hero";

const CRYSTAL_TYPES = [
  "Amethyst",
  "Rose Quartz",
  "Tiger's Eye",
  "Howlite",
  "Lapis Lazuli",
  "Red Jasper",
  "Black Obsidian",
  "Citrine",
  "Green Aventurine",
];

const getPrice = (price) => {
  const parsed = Number(String(price ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const getStock = (product) => {
  if (product.stock == null || product.stock === "") return null;
  const stock = Number(product.stock);
  return Number.isFinite(stock) ? stock : null;
};

const Collection = ({ category }) => {
  const navigate = useNavigate();
  const products = productData[category] || [];
  const data = hero[category] || {};

  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const title =
    data.title ||
    String(category || "Shop")
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const maxAvailablePrice = useMemo(
    () => Math.max(2500, ...products.map((product) => getPrice(product.price))),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const productName = product.name || product.alt || "";
      const searchableText =
        `${productName} ${product.des || ""} ${product.material || ""} ${product.origin || ""}`.toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);
      const matchesPrice = getPrice(product.price) <= maxPrice;

      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.some((type) =>
          searchableText.includes(type.toLowerCase())
        );

      const stock = getStock(product);

      const matchesAvailability =
        availability === "all" ||
        (availability === "inStock" && (stock === null || stock > 0)) ||
        (availability === "outOfStock" && stock !== null && stock <= 0);

      return (
        matchesSearch &&
        matchesPrice &&
        matchesType &&
        matchesAvailability
      );
    });

    if (sortBy === "priceLow") {
      filtered.sort((a, b) => getPrice(a.price) - getPrice(b.price));
    } else if (sortBy === "priceHigh") {
      filtered.sort((a, b) => getPrice(b.price) - getPrice(a.price));
    } else if (sortBy === "name") {
      filtered.sort((a, b) =>
        (a.name || a.alt || "").localeCompare(b.name || b.alt || "")
      );
    }

    return filtered;
  }, [products, search, selectedTypes, maxPrice, availability, sortBy]);

  const toggleType = (type) => {
    setSelectedTypes((previous) =>
      previous.includes(type)
        ? previous.filter((item) => item !== type)
        : [...previous, type]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedTypes([]);
    setMaxPrice(maxAvailablePrice);
    setAvailability("all");
    setSortBy("featured");
  };

  return (
    <main className="collection-page">
      <section className="collection-intro">
        <p className="collection-eyebrow">Healing Star</p>
        <h1>{title}</h1>
        <p className="collection-subtitle">
          {data.subtitle ||
            "Discover meaningful pieces chosen for your everyday rituals."}
        </p>
      </section>

      <section className="collection-shopping">
        <div className="collection-toolbar">
          <form
            className="collection-search"
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <Search size={19} aria-hidden="true" />
            <input
              type="search"
              aria-label="Search products"
              placeholder="Search crystals, bracelets, rings..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                className="collection-search-clear"
                aria-label="Clear search"
                onClick={() => setSearch("")}
              >
                <X size={17} />
              </button>
            )}
          </form>

          <button
            type="button"
            className="collection-mobile-filter-button"
            onClick={() => setMobileFiltersOpen((open) => !open)}
            aria-expanded={mobileFiltersOpen}
          >
            <SlidersHorizontal size={17} />
            Filters
          </button>
        </div>

        <div className="collection-breadcrumb">
          <button type="button" onClick={() => navigate("/")}>
            Home
          </button>
          <span>/</span>
          <span>{title}</span>
        </div>

        <div className="collection-layout">
          <aside
            className={`collection-filters ${
              mobileFiltersOpen ? "collection-filters-open" : ""
            }`}
            aria-label="Product filters"
          >
            <div className="collection-filter-heading">
              <h2>Filters</h2>
              <button type="button" onClick={clearFilters}>
                Clear all
              </button>
            </div>

            <div className="collection-filter-group">
              <h3>Price</h3>
              <div className="collection-price-labels">
                <span>₹0</span>
                <span>₹{maxPrice.toLocaleString("en-IN")}</span>
              </div>
              <input
                className="collection-price-range"
                type="range"
                min="0"
                max={maxAvailablePrice}
                step="50"
                value={Math.min(maxPrice, maxAvailablePrice)}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                aria-label="Maximum product price"
              />
              <label className="collection-max-price">
                Maximum price
                <input
                  type="number"
                  min="0"
                  max={maxAvailablePrice}
                  value={maxPrice}
                  onChange={(event) =>
                    setMaxPrice(
                      Math.max(
                        0,
                        Math.min(
                          maxAvailablePrice,
                          Number(event.target.value) || 0
                        )
                      )
                    )
                  }
                />
              </label>
            </div>

            <div className="collection-filter-group">
              <h3>Crystal type</h3>
              {CRYSTAL_TYPES.map((type) => (
                <label className="collection-filter-option" key={type}>
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
              <p className="collection-filter-hint">
                Crystal filters match product names and descriptions.
              </p>
            </div>

            <div className="collection-filter-group">
              <h3>Availability</h3>
              <label className="collection-filter-option">
                <input
                  type="radio"
                  name="availability"
                  checked={availability === "all"}
                  onChange={() => setAvailability("all")}
                />
                <span>All products</span>
              </label>
              <label className="collection-filter-option">
                <input
                  type="radio"
                  name="availability"
                  checked={availability === "inStock"}
                  onChange={() => setAvailability("inStock")}
                />
                <span>In stock</span>
              </label>
              <label className="collection-filter-option">
                <input
                  type="radio"
                  name="availability"
                  checked={availability === "outOfStock"}
                  onChange={() => setAvailability("outOfStock")}
                />
                <span>Out of stock</span>
              </label>
            </div>

            <button
              type="button"
              className="collection-apply-filters"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Show {filteredProducts.length} products
            </button>
          </aside>

          <div className="collection-results">
            <div className="collection-results-heading">
              <div>
                <h2>{title}</h2>
                <p>
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "product" : "products"}
                </p>
              </div>

              <label className="collection-sort">
                <span>Sort by</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </label>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="collection-main">
                {filteredProducts.map((product) => (
                  <ProductCard
                  productId={product.id}
                    key={`${category}-${product.id}`}
                    src={product.src}
                    alt={product.alt}
                    name={product.name}
                    des={product.des}
                    size={product.size}
                    price={product.price}
                    stock={product.stock}
                    onClick={() =>
                      navigate(`/products/${category}/${product.id}`)
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="collection-empty">
                <h3>No products found</h3>
                <p>
                  Try a different search or clear some filters to see more
                  products.
                </p>
                <button type="button" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Collection;