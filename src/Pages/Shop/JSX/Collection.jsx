import React from 'react'
import { useNavigate } from 'react-router'
import "../CSS/Collection.css"
import ProductCard from './ProductCard'
import br1 from '../../../assets/bracelet1.png'
import br2 from '../../../assets/bracelet2.png'
import br3 from '../../../assets/bracelet3.png'
import br4 from '../../../assets/bracelet4.png'
import br5 from '../../../assets/bracelet5.png'
import br6 from '../../../assets/bracelet6.png'
import br7 from '../../../assets/bracelet7.png'
import br8 from '../../../assets/bracelet8.png'


const Collection = () => {
    let navigate = useNavigate()
    let products=[
        {
            id:"1",
            src:br1,
            alt:"Lapis Lazuli crystal Bracelet",
            size:"6mm",
            price:"\u20B9500",
            des:"Lapis Lazuli Crystal Bracelet for Emotional Healing and Spritual Growth"
        },
        {
            id:"2",
            src:br2,
            alt:"bracelet2",
            size:"6mm",
            price:"\u20B9500",
            des:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            id:"3",
            src:br3,
            alt:"bracelet3",
            size:"6mm",
            price:"\u20B9500",
            des:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            id:"4",
            src:br4,
            alt:"bracelet4",
            size:"6mm",
            price:"\u20B9500",
            des:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            id:"5",
            src:br5,
            alt:"bracelet5",
            size:"8mm",
            price:"\u20B9500",
            des:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            id:"6",
            src:br6,
            alt:"bracelet6",
            size:"8mm",
            price:"\u20B9500",
            des:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            id:"7",
            src:br7,
            alt:"bracelet7",
            size:"8mm",
            price:"\u20B9500",
            des:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            id:"8",
            src:br8,
            alt:"bracelet8",
            size:"8mm",
            price:"\u20B9500",
            des:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
    ]
  return (
    <>
     <div className="shop-hero">
  <div className="shop-hero-content">
    <h1>Discover the Healing Power of Crystals</h1>
    <p>Luxury crystal bracelets for balance, energy & style.</p>
    <button onClick={() => window.scrollTo(0, 600)}>Explore Collection</button>
  </div>
</div>

    <div className='collection-main'>
       
        {products.map((e)=>( 
            <ProductCard 
            src={e.src} 
            alt={e.alt} 
            des={e.des} 
            price={e.price} 
            size={e.size}
            onClick={()=>(navigate(`/products/${e.id}`))}/>
))}
    </div>
    </>
  )
}

export default Collection