import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../src/Pages/Home/Home';
import Services from '../src/Pages/Services/Services';
import Shop from "../src/Pages/Shop/Shop"
import ProductDetail from "../src/Pages/Shop/JSX/ProductDetail";
import AboutPage from "../src/Pages/About/About"
import ContactPage from "../src/Pages/Contact/Contact"
import Scroll from './Scroll';


const App = () => {
  return (
    <BrowserRouter>
    <Scroll/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/shop" element={<Shop/>} />
        <Route path="/products/:id" element={<ProductDetail />} />
       <Route path="/about" element={<AboutPage />} />
       <Route path="/contact" element={<ContactPage />} />

        {/* You can add more routes here for "Shop" and "Contact" */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;