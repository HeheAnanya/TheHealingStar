import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import "../CSS/Work.css";

const Work = ({ src, text, subtitle, items, number, to }) => (
  <Link className="work-card" to={to} aria-label={`Explore ${text}`}>
    <div className="work-card-topline">
      <span className="work-card-number">{number}</span>
      <span className="work-card-arrow" aria-hidden="true">
        <ArrowUpRight size={19} strokeWidth={1.5} />
      </span>
    </div>

    <div className="work-card-image-wrap">
      <img src={src} alt="" className="work-icon" loading="lazy" />
    </div>

    <div className="work-card-content">
      <h3 className="work-title">{text}</h3>
      {subtitle && <p className="work-subtitle">{subtitle}</p>}
      {items?.length > 0 && (
        <ul className="work-items">
          {items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )}
      <span className="work-card-cta">
        Explore service <ArrowUpRight size={15} />
      </span>
    </div>
  </Link>
);

export default Work;
