import React, { useEffect, useState } from "react"
import Navbar from "../../Home/JSX/Navbar"
import Footer from "../../Home/JSX/Footer"
import { api } from "../../../api/axios"
import "../CSS/MyOrder.css"
// import { order } from "../../../../Backend/prisma/client"

const MyOrder = () => {
    const [orders, setOrder] = useState([])
    const [loading, setLoading] = useState(true)
    async function fetchOrder() {
        try {
            let res = await api.get("/order/my")
             
             console.log("MY ORDERS RESPONSE 👉", res.data)

            setOrder(res.data.found || [])
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false)
        }

    }
    async function deleteOrder(orderId) {
        try{
            await api.delete(`/order/${orderId}`)
            setOrder(prev => prev.filter(o => o.id !== orderId))
        }
        catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        fetchOrder()
    }, [])
    
    return (
        <div>
            <Navbar />
            <div className="orders">
                <h2>My Orders</h2>
                {loading ? <p className="loading">Loading.....</p> : orders.length === 0 ? (<p className="empty-orders">📦 No orders placed yet</p>) : (
                    orders.map((item) => (
                        
                        <div className="orderCard" key={item.id}>
                            <div className="orderHeader">
                                {/* <p>{item.id}</p> */}
                                {/* <p>{}</p> */}
                                <p>
                                    <strong>Date:</strong>{" "}
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </p>
                                <p onClick={()=>{console.log("clicked", item.id)
                                    deleteOrder(item.id)}} style={{cursor:"pointer"}}>X</p>
                            </div>
                            <div className="orderStatus">
                                <span className={"status"}>
                                    {item.status}
                                </span>
                                <span className={'paymentStatus'}>
                                    {item.payStatus}
                                </span>
                            </div>
                            <div className="orderProduct">
                                {item.items.map((i, idx) => {
                                    return (
                                        <div className="orderItem" key={idx}>
                                            <p className="productNames">{i.productName}</p>
                                            {i.quantity>1 ? <p className="productQuantity">1*{i.quantity}</p> :"1"}
                                            
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="orderTotal">
                                <strong>Total:</strong> ₹{item.totalPrice}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Footer />
        </div>
    )
}

export default MyOrder