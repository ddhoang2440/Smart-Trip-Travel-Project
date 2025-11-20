import React, { useEffect } from "react";
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
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { authCheck } from "./contexts/AuthRedux";
import { getAllRestaurant, getUserRestaurant } from "./contexts/ResRedux";
import { getMenu } from "./contexts/MenuRedux";
import ScrollTop from "./components/ScrollTop";


const App = () => {
  const {email} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(authCheck());
  },[dispatch]);

  useEffect(() => {
    dispatch(getAllRestaurant());
  },[dispatch]);

    useEffect(() => {
    dispatch(getUserRestaurant());
  },[dispatch,email]);

  useEffect(() => {
    dispatch(getMenu());
  },[dispatch])
  

  return (
    <div>
      <Navbar />
      <ChatBox />
      <Toaster />
      <ScrollTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<ShopCart />} />
        <Route path="/product" element={<Products />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </div>
  );
};

export default App;
