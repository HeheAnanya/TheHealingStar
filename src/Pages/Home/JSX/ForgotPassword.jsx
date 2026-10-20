// import React,{useState} from 'react'
// import {api} from "../../../api/axios"
// import { useNavigate } from 'react-router-dom'
// import Navbar from './Navbar'
// import Footer from './Footer'
// import "../CSS/Password.css"

// const ForgotPassword = () => {
//     const navigate = useNavigate()
//     const [form,setForm] = useState({
//         email:"",
//         newPass:"",
//         confirmPass:""
//     })
//     function handleChange(e){
//         setForm({
//             ...form,
//             [e.target.name] : e.target.value
//         })
//     }
//     async function handleSubmit(e){
//         e.preventDefault()
//         if (form.newPass!==form.confirmPass){
//             alert("Password doesn't Match")
//             return 
//         }
//         try{
//             let pass = await api.put("/auth/forgotPassword",{
//                 email:form.email,
//                newPassword:form.newPass
//             })
//             alert("Password updated successfully")
//             navigate("/login")

//         }
//         catch(err){
//             alert (err.response?.data?.message || "Something went wrong")
//             return 
//         }
//     }
//   return (
//     <div className='login'>
//         <Navbar/>
//         <div className='loginCard'>
//             <h2>Reset Password</h2>
        
//         <form onSubmit={handleSubmit}>
//             <label>Email:</label>
//             <input type='email' required value={form.email} onChange={handleChange} name='email'/>
//             <label>New Password</label>
//             <input type='password' required value={form.newPass}onChange={handleChange} name='newPass'/>
//             <label>Confirm Password</label>
//             <input type='password' required value={form.confirmPass} onChange={handleChange} name='confirmPass'/>
//             <button type="submit">Update Password</button>
//         </form>
//     </div>
//     <Footer/>
//     </div>
//   )
// }

// export default ForgotPassword
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.put("/auth/forgotPassword", { email });
      setMessage(response.data.message || "If that email exists, a reset link has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password">
      <h2>Reset Your Password</h2>
      <p>Enter your email and we’ll send you a password reset link.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
      <Link to="/login">Back to Login</Link>
    </div>
  );
};

export default ForgotPassword;