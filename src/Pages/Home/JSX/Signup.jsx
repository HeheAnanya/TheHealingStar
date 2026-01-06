import React, { useState } from "react"
// import "../css/auth.css"
import { api } from "../../../api/axios"
import { useNavigate } from "react-router-dom"
import "../CSS/Signup.css"

const Signup = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: ""
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      await api.post("/auth/signup", form)

      alert("Account created successfully")
      navigate("/login")

    } catch (err) {
      console.error(err)

      if (err.response?.data?.Error) {
        alert(err.response.data.Error)
      } else {
        alert("Signup failed. Try again.")
      }
    }
  }

  return (
    <div className="singup">
      <div className="signCard">

        <div className="signHeader">
          <h1>Create Account</h1>
          <p>Join The Healing Star ✨</p>
        </div>

        <form className="signHorm" onSubmit={handleSubmit}>

          <div className="detail">
            <label>Name</label>
            <input
              name="name"
              placeholder="Your name"
              required
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="detail">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="detail">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="detail">
            <label>Phone</label>
            <input
              name="phoneNumber"
              placeholder="Phone number"
              required
              value={form.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="signbtn">
            Sign Up
          </button>
        </form>

        <p className="switch">
          Already have an account?
          <span onClick={() => navigate("/login")}> Login</span>
        </p>

      </div>
    </div>
  )
}

export default Signup
