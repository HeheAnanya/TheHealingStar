
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "../CSS/Work.css";

const Work = ({ src, text, description, items, to }) => (
  <Link to={to} className="work-card" aria-label={`Learn more about ${text}`}>

    <div className="work-card-image">
      <img src={src} alt={text} loading="lazy" />
    </div>

    <div className="work-card-content">
      <h2 className="work-title">{text}</h2>

      <p className="work-description">{description}</p>

      <ul className="work-items">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <span className="work-card-cta">
        Learn More <ArrowRight size={16} />
      </span>
    </div>

  </Link>
);

export default Work;
