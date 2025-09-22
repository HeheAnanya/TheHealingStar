import React from 'react';
import "../CSS/Work.css";

const Work = (prop) => {
  return (
    <div className='work-card'>
        <img src={prop.src} alt={prop.text} className="work-icon"/>
        <h2 className="work-title">{prop.text}</h2> 
        <ul className="work-items"> 
          {prop.items && prop.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
    </div>
  );
}

export default Work;