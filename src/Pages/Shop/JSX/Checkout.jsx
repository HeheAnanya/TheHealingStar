// import React from 'react'
// import productData from "../data/index"
// import Navbar from '../../Home/JSX/Navbar'
// import Footer from '../../Home/JSX/Footer'
// import { api } from "../../../api/axios"
// import { useNavigate } from 'react-router-dom'
// import "../CSS/checkout.css"




// const Checkout = () => {
//     const navigate = useNavigate()
//     let allProducts = Object.values(productData).flat()

//       async function handleCheckout() {
//         try {
//           const orderRes = await api.post("/order/create")
//           const { orderId } = orderRes.data
//           const paymentRes = await api.post("/payment/create", { orderId })
//           const razorpayOrder = paymentRes.data
//           const options = {
//             key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//             amount: razorpayOrder.amount,
//             currency: "INR",
//             name: "The Healing Star",
//             // description: "Crystal Products",
//             order_id: razorpayOrder.id,
//             config: {
//         display: {
//           blocks: {
//             upi: {
//               name: "Pay via UPI",
//               instruments: [
//                 {
//                   method: "upi"
//                 }
//               ]
//             }
//           },
//           sequence: ["block.upi", "block.card", "block.netbanking"],
//           preferences: {
//             show_default_blocks: true
//           }
//         }
//       },
    
    
//             handler: async function (response) {
//               await api.post("/payment/verify", {
//                 order_id: response.razorpay_order_id,
//                 payment_id: response.razorpay_payment_id,
//                 raxorpay_sig: response.razorpay_signature,  // keep your spelling from paymentService
//                 orderId: orderId
//               })
//               alert("✅ Payment successful!")
//               navigate("/order/my")
//             },
//             prefill: {
//               name: "",
//               email: "",
//             },
//             theme: {
//               color: "#D4AF37"
//             }
//           }
    
//           const rzp = new window.Razorpay(options)
//           rzp.open()
    
//         } catch (err) {
//           alert(err.response?.data?.message || "Checkout failed")
//         }
//       }
    

//   return (
//     <div className='checkout'>
//         <Navbar/>
//         <div className='left'>
//             {/* Address and other stuff( if required) */}
//         </div>
//         <div className='right'>
//             {/* Here I will be adding order summary ( only the item name and price ) */}
//             <button onClick={handleCheckout}>Proceed to Payment</button>
//         </div>
//         <Footer/>
//     </div>
//   )
// }

// export default Checkout


import React, { useState, useEffect } from 'react'
import { api } from "../../../api/axios"
import { useNavigate } from 'react-router-dom'
import Navbar from '../../Home/JSX/Navbar'
import Footer from '../../Home/JSX/Footer'
import "../CSS/Checkout.css"

const Checkout = () => {
    const navigate = useNavigate()
    const [cart, setCart] = useState(null)
    const [address, setAddress] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        name: "", phone: "", address: "", city: "", state: "", pincode: ""
    })

    useEffect(() => {
        api.get("/cart").then(res => setCart(res.data))
        api.get("/address").then(res => {console.log("ADDRESS DATA:", res.data) 
            setAddress(res.data)}).catch(() => setShowForm(true))
    }, [])

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSaveAddress(e) {
        e.preventDefault()
        try {
            const res = await api.post("/address", form)
            setAddress(res.data)
            setShowForm(false)
        } catch (err) {
            alert("Failed to save address")
        }
    }

    async function handleCheckout() {
        if (!address) {
            alert("Please add a delivery address first")
            return
        }
        try {
            const orderRes = await api.post("/order/create")
            const { orderId } = orderRes.data
            const paymentRes = await api.post("/payment/create", { orderId })
            const razorpayOrder = paymentRes.data
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: "INR",
                name: "The Healing Star",
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    await api.post("/payment/verify", {
                        order_id: response.razorpay_order_id,
                        payment_id: response.razorpay_payment_id,
                        raxorpay_sig: response.razorpay_signature,
                        orderId: orderId
                    })
                    alert("✅ Payment successful!")
                    navigate("/order/my")
                },
                prefill: {
                    name: address?.name || "",
                    contact: address?.phone || "",
                },
                theme: { color: "#D4AF37" }
            }
            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (err) {
            alert(err.response?.data?.message || "Checkout failed")
        }
    }

    const totalPrice = cart ? cart.items.reduce(
        (acc, item) => acc + item.product.price * item.quantity, 0
    ) : 0

    return (
        <div>
            <Navbar />
            <div className="checkout-main">
                {/* LEFT SIDE */}
                <div className="checkout-left">
                    <h2>Delivery Address</h2>
                    {address && !showForm && (
                        <div className="saved-address">
                            <p className="address-name">{address.name}</p>
                            <p>{address.address}</p>
                            <p>{address.city}, {address.state} - {address.pincode}</p>
                            <p>📞 {address.phone}</p>
                            <button className="change-btn" onClick={() => setShowForm(true)}>
                                Change Address
                            </button>
                        </div>
                    )}

                    {/* Address Form */}
                    {(!address || showForm) && (
                        <form className="address-form" onSubmit={handleSaveAddress}>
                            <input name="name" placeholder="Full Name" required value={form.name} onChange={handleChange} />
                            <input name="phone" placeholder="Phone Number" required value={form.phone} onChange={handleChange} />
                            <input name="address" placeholder="Address" required value={form.address} onChange={handleChange} />
                            <input name="city" placeholder="City" required value={form.city} onChange={handleChange} />
                            <input name="state" placeholder="State" required value={form.state} onChange={handleChange} />
                            <input name="pincode" placeholder="Pincode" required value={form.pincode} onChange={handleChange} />
                            <div className="form-btns">
                                <button type="submit" className="save-btn">Save Address</button>
                                {address && (
                                    <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>

                {/* RIGHT SIDE */}
                <div className="checkout-right">
                    <h2>Order Summary</h2>
                    <div className="order-summary">
                        {cart?.items.map((item) => (
                            <div className="summary-item" key={item.id}>
                                <p className="summary-name">{item.product.productName}</p>
                                <p className="summary-price">₹{item.product.price} × {item.quantity}</p>
                            </div>
                        ))}
                        <hr />
                        <div className="summary-total">
                            <strong>Total</strong>
                            <strong>₹{totalPrice}</strong>
                        </div>
                        <button className="pay-btn" onClick={handleCheckout}>
                            Proceed to Payment
                        </button>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}

export default Checkout