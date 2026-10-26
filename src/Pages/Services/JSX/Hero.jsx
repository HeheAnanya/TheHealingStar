// import React from 'react';
// import {useNavigate} from 'react-router-dom'
// import Work from './Work';
// import "../CSS/Hero.css"; 
// import "../CSS/Work.css"; 
// import Tarot from "../../../../public/assets/tarrot.png"; 
// import Numerology from "../../../../public/assets/numerlogy.png"; 
// import Reiki from "../../../../public/assets/reiki.png"; 
// import Crystal from "../../../../public/assets/crystal.png"; 


// const Hero = () => { 
//     const navigate = useNavigate()
//     let work = [ 
//         {
//             id: "1",
//             src: Tarot, 
//             text: "TAROT CARD READING",
//             items: [
//                 "Love & Relationships",
//                 "Career Guidance",
//                 "Spiritual Growth",
//                 "Decision Making",
//                 "Future Insights",
//             ],
//             navi:"tarot"
//         },
//         {
//             id: "2",
//             src: Numerology, 
//             text: "NUMEROLOGY",
//             items: [
//                 "Mobile Number compatibility",
//                 "Name Number compatibility",
//                 "Marriage Match making compatibility",
//                 "Life Path Reading",
//                 "Yearly Forecasts",
//             ],
//             navi:"numerology"
//         },
//         {
//             id: "3",
//             src: Reiki, 
//             text: "REIKI HEALING",
//             items: [
//                 "Energy Balancing",
//                 "Stress Reduction",
//                 "Emotional Release",
//                 "Physical Healing",
//                 "Distance Chakra Healing",
//             ],
//             navi:"reiki"
//         },
//         {
//             id: "4",
//             src: Crystal,
//             text: "CRYSTAL PRODUCTS",
//             items: [
//                 "Bracelets",
//                 "Pendants",
//                 "Balls/Sphere",
//                 "Salt Lamp",
//                 "Rings",
//                 "Earrings",
//                 "Trees",
//                 "Evil Eye"
//             ],
//             navi:"bracelets"
//         },

//     ];

//     return (
//         <div className='main' id="services"> 
//         <div className='tagline'>
//             <h4 className='services-heading1'>WHAT WE DO</h4> 
//             <h1 className='services-heading2'>We offer a wide range of services</h1> 

//         </div>
//         <div className='container'>
//                 <div className='service-card'> 
//                 {work.map((e) => (
//                     <Work
//                         key={e.id} 
//                         src={e.src}
//                         text={e.text}
//                         items={e.items}
//                         onClick = {()=>(navigate(`/shop/${e.navi}`))}
//                     />
//                 ))}
//             </div>

//         </div>
//         </div>
//     );
// }

// export default Hero;

import React from "react";
import { useNavigate } from "react-router-dom";
import Work from "./Work";
import "../CSS/Hero.css";
import "../CSS/Work.css";

import Tarot from "../../../../public/assets/tarrot.png";
import Numerology from "../../../../public/assets/numerlogy.png";
import Reiki from "../../../../public/assets/reiki.png";
import Crystal from "../../../../public/assets/crystal.png";

const work = [
  {
    id: "1",
    src: Tarot,
    text: "TAROT CARD READING",
    subtitle: "Find clarity in the cards",
    items: [
      "Love & Relationships",
      "Career Guidance",
      "Spiritual Growth",
      "Decision Making",
      "Future Insights",
    ],
    navi: "tarot",
  },
  {
    id: "2",
    src: Numerology,
    text: "NUMEROLOGY",
    subtitle: "Discover the meaning of your numbers",
    items: [
      "Mobile Number Compatibility",
      "Name Number Compatibility",
      "Marriage Matchmaking",
      "Life Path Reading",
      "Yearly Forecasts",
    ],
    navi: "numerology",
  },
  {
    id: "3",
    src: Reiki,
    text: "REIKI HEALING",
    subtitle: "Reconnect with a sense of balance",
    items: [
      "Energy Balancing",
      "Stress Reduction",
      "Emotional Release",
      "Mindful Relaxation",
      "Distance Reiki Sessions",
    ],
    navi: "reiki",
  },
  {
    id: "4",
    src: Crystal,
    text: "CRYSTAL COLLECTION",
    subtitle: "Find meaningful pieces for your rituals",
    items: [
      "Crystal Bracelets",
      "Pendants",
      "Crystal Spheres",
      "Salt Lamps",
      "Rings & Earrings",
      "Gemstone Trees",
      "Evil Eye",
    ],
    navi: "bracelets",
  },
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="main" id="services">
      <div className="tagline">
        <span className="services-heading1">THE HEALING STAR EXPERIENCE</span>

        <h2 className="services-heading2">
          Discover Your Path to
          <span> Balance &amp; Well-being</span>
        </h2>

        <p className="services-intro">
          From spiritual guidance to meaningful crystals, explore experiences
          thoughtfully chosen for your personal journey.
        </p>
      </div>

      <div className="container">
        <div className="service-card">
          {work.map((item, index) => (
            <Work
              key={item.id}
              src={item.src}
              text={item.text}
              subtitle={item.subtitle}
              items={item.items}
              number={`0${index + 1}`}
              onClick={() => navigate(`/shop/${item.navi}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
