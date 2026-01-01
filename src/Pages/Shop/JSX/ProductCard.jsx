import React from 'react'
import "../CSS/ProductCard.css"

const ProductCard = (prop) => {
  return (
    <div className='product-card' onClick={prop.onClick}>
        <img src={prop.src} alt={prop.alt}/>
        <h5 className='name'>{prop.alt}</h5>
        <p className='des'>{prop.des}</p>
        <p className='size'>{prop.size}</p>
        <p className='price'>{prop.price}</p>
    </div>
  )
}

export default ProductCard