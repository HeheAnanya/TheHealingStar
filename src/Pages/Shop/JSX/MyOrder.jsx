import React, { useEffect, useMemo, useState } from "react"
import Navbar from "../../Home/JSX/Navbar"
import Footer from "../../Home/JSX/Footer"
import { api } from "../../../api/axios"
import "../CSS/MyOrder.css"

const statusLabel = (status = "") => {
    const labels = {
        ON_THE_WAY: "On the Way",
        DELIVERED: "Delivered",
        CANCELLED: "Cancelled"
    }
    return labels[status] || status.replaceAll("_", " ")
}

const statusClass = (status = "") => status.toLowerCase().replaceAll("_", "-")

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`

const MyOrder = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("ALL")
    const [search, setSearch] = useState("")
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [deleting, setDeleting] = useState(false)

    async function fetchOrders() {
        try {
            const res = await api.get("/order/my")
            setOrders(res.data.found || [])
        } catch (err) {
            console.error("Unable to fetch orders:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    useEffect(() => {
        if (!selectedOrder) return
        const handleKeyDown = (event) => {
            if (event.key === "Escape") setSelectedOrder(null)
        }
        document.addEventListener("keydown", handleKeyDown)
        document.body.style.overflow = "hidden"
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            document.body.style.overflow = ""
        }
    }, [selectedOrder])

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const status = order.status || ""
            const matchesTab =
                activeTab === "ALL" ||
                (activeTab === "PENDING" && status === "ON_THE_WAY") ||
                (activeTab === "COMPLETED" && status === "DELIVERED") ||
                (activeTab === "CANCELLED" && status === "CANCELLED")
            const query = search.trim().toLowerCase()
            const matchesSearch = !query ||
                String(order.id).includes(query) ||
                (order.items || []).some((item) => item.productName?.toLowerCase().includes(query))
            return matchesTab && matchesSearch
        })
    }, [orders, activeTab, search])

    async function deleteOrder(orderId) {
        const confirmed = window.confirm("Remove this order from your order history?")
        if (!confirmed) return
        setDeleting(true)
        try {
            await api.delete(`/order/${orderId}`)
            setOrders((current) => current.filter((order) => order.id !== orderId))
            setSelectedOrder(null)
        } catch (err) {
            console.error("Unable to remove order:", err)
            window.alert(err.response?.data?.Error || "Unable to remove this order right now.")
        } finally {
            setDeleting(false)
        }
    }

    const tabs = [
        { id: "ALL", label: "All Orders" },
        { id: "PENDING", label: "In Progress" },
        { id: "COMPLETED", label: "Completed" },
        { id: "CANCELLED", label: "Cancelled" }
    ]

    const placedDate = (date) => date
        ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
        : "Date unavailable"

    const progressSteps = [
        { label: "Order Placed", icon: "▣" },
        { label: "Confirmed", icon: "✓" },
        { label: "On the Way", icon: "↗" },
        { label: "Delivered", icon: "▦" }
    ]

    const progressIndex = selectedOrder?.status === "DELIVERED"
        ? 3
        : selectedOrder?.status === "CANCELLED" ? -1 : 2

    return (
        <div className="my-orders-page">
            <Navbar />
            <main className="orders-shell">
                <div className="orders-breadcrumb">Home <span>/</span> My Orders</div>
                <header className="orders-heading">
                    <div>
                        <p className="orders-eyebrow">YOUR ACCOUNT</p>
                        <h1>My Orders</h1>
                        <p className="orders-subtitle">View and track all your orders in one place.</p>
                    </div>
                    <div className="orders-count">
                        <strong>{orders.length}</strong>
                        <span>{orders.length === 1 ? "Order" : "Orders"}</span>
                    </div>
                </header>

                <section className="orders-panel" aria-label="Order history">
                    <div className="orders-toolbar">
                        <div className="orders-tabs" role="tablist" aria-label="Filter orders">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === tab.id}
                                    className={activeTab === tab.id ? "orders-tab active" : "orders-tab"}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                    <span>{tab.id === "ALL" ? orders.length : orders.filter((order) =>
                                        tab.id === "PENDING" ? order.status === "ON_THE_WAY" :
                                        tab.id === "COMPLETED" ? order.status === "DELIVERED" :
                                        order.status === "CANCELLED"
                                    ).length}</span>
                                </button>
                            ))}
                        </div>
                        <label className="orders-search">
                            <span aria-hidden="true">⌕</span>
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search by order ID or product"
                                aria-label="Search orders"
                            />
                        </label>
                    </div>

                    <div className="orders-table-head">
                        <span>Order details</span>
                        <span>Status</span>
                        <span>Order total</span>
                        <span> </span>
                    </div>

                    {loading ? (
                        <div className="orders-message">Loading your orders...</div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="orders-message">
                            <span className="orders-empty-mark">✧</span>
                            <h3>{orders.length ? "No matching orders" : "No orders yet"}</h3>
                            <p>{orders.length ? "Try another search or select a different status." : "Your placed orders will appear here."}</p>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {filteredOrders.map((order) => {
                                const firstItem = order.items?.[0]
                                const itemCount = order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0
                                return (
                                    <article className="orders-row" key={order.id}>
                                        <div className="orders-item-cell">
                                            <div className="orders-product-mark" aria-hidden="true">✧</div>
                                            <div className="orders-item-copy">
                                                <strong>Order #HS{String(order.id).padStart(6, "0")}</strong>
                                                <span>{placedDate(order.createdAt)} <i>·</i> {itemCount} {itemCount === 1 ? "item" : "items"}</span>
                                                <small>{firstItem?.productName || "Order details"}</small>
                                            </div>
                                        </div>
                                        <div className="orders-status-cell">
                                            <span className={`orders-status ${statusClass(order.status)}`}>
                                                {statusLabel(order.status)}
                                            </span>
                                            <small>Payment {order.payStatus === "SUCCESS" ? "successful" : statusLabel(order.payStatus)}</small>
                                        </div>
                                        <strong className="orders-total">{money(order.totalPrice)}</strong>
                                        <div className="orders-action-cell">
                                            <button type="button" className="orders-view-btn" onClick={() => setSelectedOrder(order)}>
                                                View order <span>→</span>
                                            </button>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    )}
                </section>
            </main>
            <Footer />

            {selectedOrder && (
                <div className="order-modal-backdrop" onMouseDown={(event) => {
                    if (event.target === event.currentTarget) setSelectedOrder(null)
                }}>
                    <section className="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-modal-title">
                        <div className="order-modal-header">
                            <div>
                                <p className="orders-eyebrow">ORDER INFORMATION</p>
                                <h2 id="order-modal-title">Order Details</h2>
                                <p className="order-modal-meta">
                                    Order ID: #HS{String(selectedOrder.id).padStart(6, "0")}
                                    <span>·</span>
                                    Placed on {placedDate(selectedOrder.createdAt)}
                                </p>
                            </div>
                            <button type="button" className="order-modal-close" onClick={() => setSelectedOrder(null)} aria-label="Close order details">×</button>
                        </div>

                        <div className="order-tracking-box">
                            <div className="order-section-heading">
                                <h3>Track Your Order</h3>
                                <span className={`orders-status ${statusClass(selectedOrder.status)}`}>{statusLabel(selectedOrder.status)}</span>
                            </div>
                            {selectedOrder.status === "CANCELLED" ? (
                                <p className="order-cancelled-note">This order has been cancelled.</p>
                            ) : (
                                <div className={`order-timeline ${selectedOrder.status === "DELIVERED" ? "is-delivered" : ""}`}>
                                    {progressSteps.map((step, index) => (
                                        <div className={`order-timeline-step ${index <= progressIndex ? "complete" : ""}`} key={step.label}>
                                            <div className="order-timeline-icon">{step.icon}</div>
                                            <strong>{step.label}</strong>
                                            <span>{index === 0 ? placedDate(selectedOrder.createdAt) : index <= progressIndex ? "Updated" : "Pending"}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="order-tracking-disclaimer">Tracking milestones are shown according to the latest order status available.</p>
                        </div>

                        <div className="order-modal-columns">
                            <div className="order-modal-items">
                                <div className="order-section-title">Ordered Items ({selectedOrder.items?.length || 0})</div>
                                {selectedOrder.items?.map((item) => (
                                    <div className="order-modal-item" key={item.id}>
                                        <div className="orders-product-mark small" aria-hidden="true">✧</div>
                                        <div className="order-modal-item-copy">
                                            <strong>{item.productName}</strong>
                                            <span>Quantity: {item.quantity}</span>
                                        </div>
                                        <strong>{money(item.productPrice * item.quantity)}</strong>
                                    </div>
                                ))}
                            </div>

                            <aside className="order-modal-summary">
                                <div className="order-section-title">Order Summary</div>
                                <div className="order-summary-line"><span>Subtotal</span><strong>{money(selectedOrder.totalPrice)}</strong></div>
                                <div className="order-summary-line"><span>Shipping</span><strong>To be confirmed</strong></div>
                                <div className="order-summary-total"><span>Order Total</span><strong>{money(selectedOrder.totalPrice)}</strong></div>
                                <div className="order-payment-info">
                                    <span>Payment status</span>
                                    <strong>{statusLabel(selectedOrder.payStatus)}</strong>
                                </div>
                            </aside>
                        </div>

                        <div className="order-modal-footer">
                            <span>Need help with this order?</span>
                            <button type="button" className="order-close-text" onClick={() => setSelectedOrder(null)}>Close details</button>
                            {selectedOrder.status === "CANCELLED" && (
                                <button type="button" className="order-remove-btn" disabled={deleting} onClick={() => deleteOrder(selectedOrder.id)}>
                                    {deleting ? "Removing..." : "Remove from history"}
                                </button>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </div>
    )
}

export default MyOrder
