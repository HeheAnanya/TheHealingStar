import React, { useEffect, useState } from "react"
import Navbar from "../../Home/JSX/Navbar"
import Footer from "../../Home/JSX/Footer"
import { api } from "../../../api/axios"

const MyOrder = () => {
    const [orders, setOrder] = useState([])
    const [loading, setLoading] = useState(true)
    async function fetchOrder() {
        try {
            let res = await api.get("/order/my", {
                headers: {
                    "Cache-Control": "no-cache"
                }
            })
             
             console.log("MY ORDERS RESPONSE 👉", res.data)

            setOrder(res.data || [])
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false)
        }

    }
    useEffect(() => {
        fetchOrder();
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
                                <p><strong>Order ID:</strong> #{item.id}</p>
                                <p>
                                    <strong>Date:</strong>{" "}
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </p>
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
                                            <p className="productNames">{i.product.productName}</p>
                                            <p className="productQuantity">₹{i.product.price} *{i.quantity}</p>
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