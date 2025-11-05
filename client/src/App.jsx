import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/navbar'
import Restaurant from './pages/Restaurant'
import Login from './pages/Login'
import Contact from './pages/Contact'
import ShopCart from './pages/ShopCart'
import Products from './pages/Products'
const App = () => {
  return (
    <div>
      <Navbar />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='restaurant' element={<Restaurant />} />
      <Route path='login' element={<Login />} />
      <Route path='contact' element={<Contact />} />
      <Route path='cart' element={<ShopCart /> } />
      <Route path='product' element={<Products /> } />
    </Routes>
    </div>
  )
}

export default App