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
// import a from "./Pages/S"


const App = () => {
  return (
    <BrowserRouter>
    <Scroll/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/shop/:category" element={<Shop />} />
        {/* <Route path="/shop/bracelets" element={<Crystal/>} /> */}
        <Route path="/products/:category/:id" element={<ProductDetail />} />
       <Route path="/about" element={<AboutPage />} />
       <Route path="/contact" element={<ContactPage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;