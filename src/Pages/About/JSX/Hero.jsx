import React from 'react'
import "../CSS/About.css"
// import founder from ".    assets/founder.png"
import founder from "../../../../public/assets/founder.png"
import authenticity from "../../../../public/assets/authenticity.png"
import compassionate from "../../../../public/assets/compassionate.png"
import sustainable from "../../../../public/assets/sustainable.png"
import excellence from "../../../../public/assets/excellence.png"
import showroom from "../../../../public/assets/showroom.png"


const Hero = () => {
    let values = [
        {
            id: 1,
            src: authenticity,
            alt: "authenticity",
            head: "Authenticity",
            value: "Staying true to our roots."
        },
        {
            id: 2,
            src: compassionate,
            alt: "compassion",
            head: "Compassion",
            value: "Caring for every soul."
        },
        {
            id: 3,
            src: sustainable,
            alt: "sustainability",
            head: "Sustainability",
            value: "Respect for nature."
        },
        {
            id: 4,
            src: excellence,
            alt: "excellence",
            head: "Excellence",
            value: "High quality in every service."
        },
    ];

    return (
        <div className='about-main'>
            <div className='tagline'>
                <h2>Our Journey to inner harmony</h2>
                <p>Guiding you towards inner peace and sprituality</p>
            </div>
            <hr></hr>
            <div className='story'>
                <img src={showroom} alt="Our Showroom" />
                <div className='text-container'>
                    <h3>Our Story</h3>
                    <h2>The Story behind healing</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi nostrum, neque reiciendis inventore suscipit architecto aliquid itaque quibusdam tempore amet eligendi aperiam voluptates. Laudantium laborum at explicabo, perferendis eum odio!</p>
                </div>
            </div>            <br></br>
            <div className='actual'>
                <div className='founder'>
                    <h3>Meet our Founder</h3>
                    <img src={founder} alt='founder' />
                    <h3>XYZ</h3>
                    <h4>Visionary</h4>
                </div>
                <div className='core'>
                    <h3>Our Core values</h3>
                    <div className='values'>
                        {values.map((e) => {
                            return (<div className='value-card'>
                                <img src={e.src} />
                                <h3>{e.head}</h3>
                                <h5>{e.value}</h5>
                            </div>)
                        })}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Hero
