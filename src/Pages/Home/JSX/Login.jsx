import React, { useState } from 'react'
import { api } from "../../../api/axios"
import { useNavigate } from 'react-router-dom'
import "../CSS/Login.css"

const Login = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })

    }
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", {
                email: form.email,
                password: form.password
            });
            const { token } = res.data

            localStorage.setItem("token", JSON.stringify(token))

            alert("✅ Login successful")

            navigate("/");
        } catch (err) {
            console.error(err)

            if (err.response?.data?.Error) {
                alert(err.response.data.Error)
            } else {
                alert("Something went wrong. Please try again.")
            }
        }
    }
    return(
    <div className="login">
        <div className="loginCard">

            <div className="loginHeader">
                <h1>Welcome Back</h1>
                <p>Login to continue shopping</p>
            </div>

            <form className="loginForm" onSubmit={handleSubmit}>
                <div className="detail">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="detail">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                        value={form.password}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="loginBtn">
                    Login
                </button>
            </form>

            <p className="switch">
                Don’t have an account?
                <span onClick={() => navigate("/signup")}> Sign Up</span>
            </p>

            <p className="forgot" onClick={() => navigate("/forgotPassword")}>
                Forgot Password?
            </p>

        </div>
    </div>
    )
}

export default Login