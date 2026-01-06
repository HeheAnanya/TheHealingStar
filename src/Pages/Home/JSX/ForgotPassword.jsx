import React,{useState} from 'react'
import {api} from "../../../api/axios"
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import "../CSS/Password.css"

const ForgotPassword = () => {
    const navigate = useNavigate()
    const [form,setForm] = useState({
        email:"",
        newPass:"",
        confirmPass:""
    })
    function handleChange(e){
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }
    async function handleSubmit(e){
        e.preventDefault()
        if (form.newPass!==form.confirmPass){
            alert("Password doesn't Match")
            return 
        }
        try{
            let pass = await api.put("/auth/forgotPassword",{
                email:form.email,
               newPassword:form.newPass
            })
            alert("Password updated successfully")
            navigate("/login")

        }
        catch(err){
            alert (err.response?.data?.message || "Something went wrong")
            return 
        }
    }
  return (
    <div className='login'>
        <Navbar/>
        <div className='loginCard'>
            <h2>Reset Password</h2>
        
        <form onSubmit={handleSubmit}>
            <label>Email:</label>
            <input type='email' required value={form.email} onChange={handleChange} name='email'/>
            <label>New Password</label>
            <input type='password' required value={form.newPass}onChange={handleChange} name='newPass'/>
            <label>Confirm Password</label>
            <input type='password' required value={form.confirmPass} onChange={handleChange} name='confirmPass'/>
            <button type="submit">Update Password</button>
        </form>
    </div>
    <Footer/>
    </div>
  )
}

export default ForgotPassword