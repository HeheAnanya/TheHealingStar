import React from "react";
import { Navigate, useParams } from "react-router-dom";
import Navbar from "../Home/JSX/Navbar";
import Footer from "../Home/JSX/Footer";
import ServicePackages from "./ServicePackages";

const serviceCategories = {
  tarot: { key: "TAROT", title: "Tarot Card Reading" },
  reiki: { key: "REIKI", title: "Reiki Healing" },
  numerology: { key: "NUMEROLOGY", title: "Numerology" },
};

const ServiceCategory = () => {
  const { category } = useParams();
  const selected = serviceCategories[category?.toLowerCase()];

  if (!selected) return <Navigate to="/services" replace />;

  return (
    <div className="service-category-page">
      <Navbar />
      <ServicePackages categoryFilter={selected.key} />
      <Footer />
    </div>
  );
};

export default ServiceCategory;
