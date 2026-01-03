import React, { useState } from 'react'
import productData from '../data';
import Navbar from '../../Home/JSX/Navbar';
import { useParams } from "react-router-dom";
import "../CSS/ProductDetail.css"
import Footer  from '../../Home/JSX/Footer';
import {api} from "../../../api/axios"
import { useNavigate } from 'react-router-dom';
const ProductDetail = () => {
    const navigate = useNavigate()
    let [count, setCount] = useState(1)
    function increment() {
        setCount(prev => prev + 1)
    }
    function decrement() {
        if (count > 1) {
            setCount(prev => prev - 1)
        }
    }
        const { category,id } = useParams();

    const products = productData[category] || []
    const product = products.find(p =>p.id === id );
    if (!product) {
        alert("Out of Stock! Check Back Later🥺")
        return null
    }
    async function addToCart(){
        try{
            await api.post("/cart/add",{
                productId:product.id,
                quantity:count
            })
             alert("✅ Added to cart")
        }
        catch(err){
            console.log(err)
            alert(err.response?.data?.message || "Add to cart failed");
        }
    }
    async function buyNow(){
        try{
            await api.post("/cart/add",{
        productId: product.id,
        quantity: count
      });
      navigate("/cart")
        }
        catch(err){
            console.log(err)
            alert(err.response?.data?.message || "Buy Now failed");
        }
    }

    return (
        <div>
            <Navbar />
            
        <div className='productDetail'>
            
            {product &&
                <div className='product-main'>
                    <div className='pro-img'>
                        <img src={product.src} alt={product.name} />
                    </div>
                    <div className='product'>
                        <p className='pname'>{product.name}</p>
                        <p className='pprice'><strong>MRP: </strong>{product.price}</p>
                        <p className='pdes'><strong>Description: </strong>{product.description}</p>
                        <p className='psize'><strong>Size: </strong>{product.size}</p>
                        <p className='pmaterial'><strong>Material: </strong>{product.material}</p>
                        <p className='porigin'><strong>Origin: </strong>{product.origin}</p>
                        <div className='checkout'>
                            <div className='quantity'>
                                <button onClick={decrement}>-</button>
                                <span>{count}</span>
                                <button onClick={increment}>+</button>
                            </div>
                            <div className='buttons'>
                                <button className='cart' onClick={addToCart}>Add to Cart</button>
                                <button className='buy' onClick={buyNow}>Buy Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
        <Footer/>
        </div>
    )
}

export default ProductDetail