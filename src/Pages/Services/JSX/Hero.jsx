import React from 'react';
import {useNavigate} from 'react-router-dom'
import Work from './Work';
import "../CSS/Hero.css"; 
import "../CSS/Work.css"; 
import Tarot from "../../../../public/assets/tarrot.png"; 
import Numerology from "../../../../public/assets/numerlogy.png"; 
import Reiki from "../../../../public/assets/reiki.png"; 
import Crystal from "../../../../public/assets/crystal.png"; 


const Hero = () => { 
    const navigate = useNavigate()
    let work = [ 
        {
            id: "1",
            src: Tarot, 
            text: "TAROT CARD READING",
            items: [
                "Love & Relationships",
                "Career Guidance",
                "Spiritual Growth",
                "Decision Making",
                "Future Insights",
            ],
            navi:"tarrot"
        },
        {
            id: "2",
            src: Numerology, 
            text: "NUMEROLOGY",
            items: [
                "Life Path Reading",
                "Destiny Number",
                "Soul Urge Number",
                "Personality Number",
                "Yearly Forecasts",
            ],
            navi:"numerology"
        },
        {
            id: "3",
            src: Reiki, 
            text: "REIKI HEALING",
            items: [
                "Energy Balancing",
                "Stress Reduction",
                "Emotional Release",
                "Physical Healing",
                "Chakra Alignment",
            ],
            navi:"reiki"
        },
        {
            id: "4",
            src: Crystal,
            text: "CRYSTAL HEALING",
            items: [
                "Aura Cleansing",
                "Chakra Balancing",
                "Energy Amplification",
                "Emotional Support",
                "Spiritual Connection",
            ],
            navi:"crystal"
        },

    ];

    return (
        <div className='main' id="services"> 
        <div className='tagline'>
            <h4 className='services-heading1'>WHAT WE DO</h4> 
            <h1 className='services-heading2'>We offer a wide range of services</h1> 

        </div>
        <div className='container'>
                <div className='service-card'> 
                {work.map((e) => (
                    <Work
                        key={e.id} 
                        src={e.src}
                        text={e.text}
                        items={e.items}
                        onClick = {()=>(navigate(`${e.navi}`))}
                    />
                ))}
            </div>

        </div>
        </div>
    );
}

export default Hero;