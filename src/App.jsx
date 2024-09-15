import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Header from "./Components/Header";
import React from 'react';
import ListProducts from './Components/ProductsList';
import ProductDetail from './Components/ProductDetail';
import Footer from './Components/Footer';
import HomePage from './Components/HomePage';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ListProducts />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
