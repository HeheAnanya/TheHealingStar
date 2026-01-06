import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../src/Pages/Home/Home';
import Services from '../src/Pages/Services/Services';
import Shop from "./Pages/Shop/Shop"
import ProductDetail from "../src/Pages/Shop/JSX/ProductDetail";
import AboutPage from "../src/Pages/About/About"
import ContactPage from "../src/Pages/Contact/Contact"
import Scroll from './Scroll';
import Crystal from './Pages/Shop/Crystal';
import Login from './Pages/Home/JSX/Login';
import Signup from './Pages/Home/JSX/Signup';
import Cart from './Pages/Shop/JSX/Cart';
import MyOrder from './Pages/Shop/JSX/MyOrder';
import ForgotPassword from './Pages/Home/JSX/ForgotPassword';

// import a from "./Pages/S"


const App = () => {
  return (
    <BrowserRouter>
    <Scroll/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element = {<Signup/>}/>
        <Route path='/forgotPassword' element={<ForgotPassword/>}/>
        
        <Route path="/services" element={<Services />} />
        <Route path="/shop/:category" element={<Shop />} />
        <Route path="/products/:category/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order/my" element={<MyOrder />} />
       <Route path="/about" element={<AboutPage />} />
       <Route path="/contact" element={<ContactPage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;