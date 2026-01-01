import React from 'react'
import { useNavigate } from 'react-router'
import "../CSS/Collection.css"
import ProductCard from './ProductCard'
import productData from '../data'
import hero  from '../data/hero'


const Collection = ({category}) => {
    let navigate = useNavigate()
    const products= productData[category] || []
    const data = hero[category] || []
  return (
    <>
     <div className="shop-hero" style={{background: `url(${data.bgImage}) center/cover no-repeat`}}>
  <div className="shop-hero-content">
    {/* <h1>{data.title}</h1>
    <p>{data.subtitle}</p> */}
    <button onClick={() => window.scrollTo({top:data.scrollTo,behavior:'smooth'})}>Explore Collection</button>
  </div>
</div>

    <div className='collection-main'>
       
        {products.map((e)=>( 
            <ProductCard 
            src={e.src} 
            alt={e.alt} 
            des={e.des} 
            price={e.price} 
            onClick={()=>(navigate(`/products/${category}/${e.id}`))}/>
))}
    </div>
    </>
  )
}

export default Collection