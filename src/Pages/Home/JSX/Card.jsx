import React from 'react'
import "../CSS/card.css"

const Card = (prop) => {
  return (
    <div className='card-main'>
        <img src={prop.src} alt={prop.alt}/>
        <p>{prop.text}</p>
        <p>{prop.name}</p>
        <p>{prop.des}</p>
        <p>{prop.star}</p>


    </div>
  )
}

export default Card