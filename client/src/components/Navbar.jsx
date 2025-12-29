import {
  IconBell,
  IconBowlChopsticks,
  IconChevronCompactRight,
  IconHourglassLow,
  IconLogout,
  IconMenu3,
  IconPlanet,
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
  const [mobile, setMobile] = useState(false);

  const dispatch = useDispatch();
  const { islogin, username, image } = useSelector((state) => state.auth);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== "/") {
        setScroll(true);
        return;
      }
      setScroll(window.scrollY > -1);
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
          <IconPlanet color="orange" size={56} />
          <p className="text-xl">
            Golden<span className="text-warning">Plate</span>
          </p>
        </div>

        <div className="lg:flex hidden gap-8 p-child">
          <span onClick={() => navigate("/")}>Trang Chủ</span>
          <span onClick={() => navigate("/product")}>Nhà Hàng</span>
          <span onClick={() => navigate("/aboutUs")}>Giới Thiệu</span>
          <span onClick={() => navigate("/contact")}>Liên Hệ</span>
        </div>

        <div className="flex flex-row gap-6 items-center">
          <IconShoppingBag
            onClick={() => navigate("/cart")}
            className="hidden lg:block p"
            color="white"
          />
          {/* <IconSearch
            className="p hidden lg:block"
            onClick={() => setSearch(true)}
          /> */}
          {!islogin ? (
            <button className="btn w-32" onClick={() => navigate("/login")}>
              <IconUser color="black" />
              Login
            </button>
          ) : (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                className={` lg:w-[10vw] text-sm w-[40vw] flex items-center gap-2 bg-transparent p-2 active:scale-95 cursor-pointer transition-all
    ${showDropdown ? "rounded-t-2xl border-gray-500 border-b" : "rounded-2xl"}`}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img
                  src={
                    image ||
                    "https://cdn-icons-png.freepik.com/512/6858/6858504.png"
                  }
                  alt="Avatar"
                  className="lg:size-[2.25vw] size-[3vh] rounded-full"
                />
                <span className=" flex-1 text-xl truncate">{username}</span>
                <span>▼</span>
              </button>
              <Dropdown
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                logout={() => dispatch(signout())}
              />
            </div>
          )}
          <div className="relative">
            <IconMenu3
              className="lg:hidden block"
              onClick={() => {
                if (mobile) {
                  setMobile(false);
                } else setMobile(true);
              }}
            />
            {!mobile && (
              <div className="lg:hidden w-[30vw] flex flex-col gap-2 border fade-in text-black py-2  bg-white absolute top-14 -left-20 z-100">
                <span className="py-2 px-4 border-b " onClick={() => navigate("/")}>
                  Trang Chủ
                </span>
                <span className="py-2 px-4 border-b" onClick={() => navigate("/product")}>
                  Nhà Hàng
                </span>
                <span className="py-2 px-4 border-b" onClick={() => navigate("/aboutUs")}>
                  Giới Thiệu
                </span>
                <span className="py-2 px-4 border-b" onClick={() => navigate("/contact")}>
                  Liên Hệ
                </span>
                <span className="py-2 px-4 " onClick={() => navigate("/cart")}>
                  Lịch Sử
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
