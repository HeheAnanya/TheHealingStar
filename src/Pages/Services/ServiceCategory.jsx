import React from "react";
import { Navigate, useParams } from "react-router-dom";
import Navbar from "../Home/JSX/Navbar";
import Footer from "../Home/JSX/Footer";
import ServicePackages from "./ServicePackages";
import Tarot from "../../../public/assets/tarrot.png";
import Numerology from "../../../public/assets/numerlogy.png";
import Reiki from "../../../public/assets/reiki.png";

const serviceCategories = {
  tarot: { key: "TAROT", title: "Tarot Card Reading", image: Tarot },
  reiki: { key: "REIKI", title: "Reiki Healing", image: Reiki },
  numerology: { key: "NUMEROLOGY", title: "Numerology", image: Numerology },
};

const ServiceCategory = () => {
  const { category } = useParams();
  const selected = serviceCategories[category?.toLowerCase()];

  if (!selected) return <Navigate to="/services" replace />;

  return (
    <div className="service-category-page">
      <Navbar />
      <ServicePackages categoryFilter={selected.key} categoryTitle={selected.title} categoryImage={selected.image} />
      <Footer />
    </div>
  );
};

export default ServiceCategory;
