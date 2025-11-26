import {
  IconBell,
  IconBowlChopsticks,
  IconChevronCompactRight,
  IconLogout,
  IconMenu3,
  IconSearch,
  IconSettings,
  IconShoppingBag,
  IconUser,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../contexts/AuthRedux";


const Navbar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dispatch = useDispatch();
   const { islogin, username, image} = useSelector((state) => state.auth);

  const location = useLocation();


  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== "/") {
        setScroll(true);
        return;
      }
      setScroll(window.scrollY > 100);
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
          <span onClick={() => navigate("/product")}>Restaurants</span>
          <span onClick={() => navigate("/aboutUs")}>About</span>
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
          {!islogin ? (
            <button className="btn w-32" onClick={() => navigate("/login")}>
              <IconUser color="black" />
              Login
            </button>
          ) : (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                className={` lg:w-[8vw] w-[30vw] flex items-center gap-2 bg-transparent p-2 active:scale-95 cursor-pointer transition-all
    ${showDropdown ? "rounded-t-2xl border-gray-500 border-b" : "rounded-2xl"}`}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img
                  src={ image || "https://cdn-icons-png.freepik.com/512/6858/6858504.png" }
                  alt="Avatar"
                  className="lg:size-[2.25vw] size-[3vh] rounded-full"
                />
                <span className=" flex-1">{username}</span>
                <span>▼</span>
              </button>
              <Dropdown
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                logout={() => dispatch(signout())}
              />
            </div>
          )}
          <IconMenu3 className="lg:hidden block" />
        </div>
      </div>
    </>
  );
};

export default Navbar;
