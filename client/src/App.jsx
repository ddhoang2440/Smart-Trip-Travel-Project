import React from "react";
import { Route, Routes } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Restaurant from "./pages/Restaurant";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import ShopCart from "./pages/ShopCart";
import Products from "./pages/Products";
import AboutUs from "./pages/AboutUs";
import ChatBox from "./components/ChatBox";
import Setting from "./pages/Setting";
const App = () => {
  return (
    <div>
      <Navbar />
      <ChatBox />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="restaurant" element={<Restaurant />} />
        <Route path="login" element={<Login />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<ShopCart />} />
        <Route path="product" element={<Products />} />
        <Route path="aboutUs" element={<AboutUs />} />
        <Route path="setting" element={<Setting />} />

      </Routes>
    </div>
  );
};

export default App;
