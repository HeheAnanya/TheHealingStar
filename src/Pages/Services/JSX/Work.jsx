import React from "react";
import { Link } from "react-router-dom";
import "../CSS/Work.css";

const Work = ({ src, text, subtitle, items, to }) => (
  <Link className="work-card" to={to} aria-label={`Explore ${text}`}>
    <img src={src} alt={text} className="work-icon" loading="lazy" />
    <h2 className="work-title">{text}</h2>
    {subtitle && <p className="work-subtitle">{subtitle}</p>}
    {items?.length > 0 && (
      <ul className="work-items">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    )}
    <span className="work-card-cta">Explore {text.toLowerCase()}</span>
  </Link>
);

export default Work;
