import React from 'react'
import Card from './Card'
import "../CSS/testimonial.css"
import TeenageGirl1 from "../../../../public/assets/tg1.jpeg"
import BuisnessWomen from "../../../../public/assets/bw1.jpeg"
import TeenageBoy1 from "../../../../public/assets/tb2.jpeg"
import OldMan from "../../../../public/assets/om.jpeg"
import OldLady from "../../../../public/assets/ow.jpeg"
import Doctor from "../../../../public/assets/bw2.jpeg"


const Testimonial = () => {
    let card_detail=[
        {
            id:"1",
            src:OldMan,
            alt:"old man",
            text:"At this stage of life, I have seen and owned everything, yet nothing brought me inner calm like the energized bracelet I purchased here. It feels like a legacy piece—both elegant and healing.",
            name:"Mr. Rajan Kapoor",
            des:"Industrialist",
            star:""
        },
        {
            id:"2",
            src:OldLady,
            alt:"old lady",
            text:"The tarot sessions were transformative. The guidance was not only accurate but also presented with grace and empathy. It felt like a luxury spa for my soul.",
            name:"Mrs. Sunita Mehra",
            des:"Philanthropist",
            star:""
        },        
        {
            id:"3",
            src:TeenageGirl1,
            alt:"teenage girl",
            text:"I bought a crystal pendant for exams. Honestly, I didn't know if it would work—but I feel calmer, more focused, and my confidence has grown. It's like carrying a secret friend.",
            name:"Anjali",
            des:"Student",
            star:""
        },        
        {
            id:"4",
            src:TeenageBoy1,
            alt:"teenage boy",
            text:"Money has always been tight, but the numerology reading gave me hope and a clear path. I feel like I finally have direction, and I'm grateful for the kindness shown to me.",
            name:"Ravi",
            des:"Student",
            star:""
        },        
        {
            id:"5",
            src:BuisnessWomen,
            alt:"Business Woman",
            text:"Running a company means endless stress. The reiki healing sessions gave me unmatched mental clarity. It was professional, yet deeply personal—exactly what I needed to balance work and life.",
            name:"Priya",
            des:"Entrepreneur",
            star:""
        },        
        {
            id:"6",
            src:Doctor,
            alt:"Doctor",
            text:"I deal with science daily, yet I must admit—there is something profound about crystal energy. Wearing my bracelet during shifts helps me remain calm even in the most intense cases.",
            name:"Dr. Neha Verma",
            des:"Doctor",
            star:""
        }    ]
  return (
    <div className='test-main'>
        {card_detail.map((e)=>{
            return ( <Card 
                src={e.src} 
                alt={e.alt}
                text={e.text}
                name={e.name}
                des={e.des}
                star={e.star}
            />
)

        })}
    </div>
  )
}

export default Testimonial