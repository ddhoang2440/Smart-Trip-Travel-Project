import { IconBowlChopsticks, IconMenu3, IconSearch, IconShoppingBag, IconUser } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import SearchBar from './SearchBar';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {

  const navigate = useNavigate();
  const [search, setSearch] = useState(false);
  const [scroll, setScroll] = useState(false);


    const location = useLocation();

    useEffect(() => {
      const handleScroll = () => {
        if (location.pathname !== "/") {
          setScroll(true);
          return;
        }
        if (window.scrollY > 900) {
          setScroll(true);
        } else setScroll(false);
      };
      handleScroll();
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);


  return (
    <>
      <SearchBar search={search} setSearch={setSearch} />
      <div
        className={`flex items-center fixed z-50 flex-row lg:w-full w-screen text-white lg:justify-around justify-between px-6 lg:px-0 py-6 
      ${scroll ? "bg-neutral-800" : "bg-transparent"}`}
      >
        <div className="flex items-center gap-4">
          <IconBowlChopsticks color="orange" size={56} />
          <p className="text-xl">
            Food<span className="text-warning">Tuck</span>
          </p>
        </div>
        <div className="lg:flex hidden gap-8 p-child">
          <span onClick={() => navigate("/")}>Home</span>
          <span>Blog</span>
          <span onClick={() => navigate('/product')}>Restaurants</span>
          <span>About</span>
          <span onClick={() => navigate("/contact")}>Contact</span>
        </div>
        <div className="flex flex-row gap-6 items-center">
          <IconShoppingBag
            onClick={() => navigate("/cart")}
            className="hidden lg:block p"
            color="white"
          />
          <IconSearch
            className="p hidden lg:block"
            onClick={() => setSearch(true)}
          />
          <button className="btn w-32" onClick={() => navigate("/login")}>
            {" "}
            <IconUser color="black" />
            Login
          </button>
          <span className="lg:hidden">
            <IconMenu3 />
          </span>
        </div>
      </div>
    </>
  );
}

export default Navbar