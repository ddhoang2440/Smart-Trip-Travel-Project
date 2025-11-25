import React, { useState } from "react";
import {
  IconBell,
  IconChevronCompactRight,
  IconHomeDollar,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import SlideBar from "./SlideBar";
import { useNavigate } from "react-router-dom";

const Dropdown = ({ showDropdown, setShowDropdown, logout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };
  const navigate = useNavigate();

  return (
    <>
      <SlideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 z-50">
            <div className="dropdown-menu bg-neutral-700 rounded-b-xl px-4 pb-4 w-[30vw] lg:w-[10vw] flex flex-col gap-2 transition-all">
              <div
                className="dropdown-item border-gray-500 border-b pb-2 pt-3 active:scale-95 hover:scale-95 group"
                onClick={() => setShowDropdown(false)}
              >
                <a href="/profile" className="flex gap-2">
                  <IconUser />
                  <span className="text-sm flex-1">Profile</span>
                  <span className="text-xs text-gray-500 group-hover:text-white">
                    <IconChevronCompactRight />
                  </span>
                </a>
              </div>
              <div
                className="dropdown-item border-gray-500 border-b py-2 hover:scale-95 group"
                onClick={() => setShowDropdown(false)}
              >
                <div onClick={() => navigate("setting")} className="flex gap-2 p">
                  <IconSettings />
                  <span className="text-sm flex-1">Settings</span>
                  <span className="text-xs text-gray-500 group-hover:text-white">
                    <IconChevronCompactRight />
                  </span>
                </div>
              </div>
              <div
                className="dropdown-item border-gray-500 border-b py-2 hover:scale-95 group"
                onClick={() => setShowDropdown(false)}
              >
                <a href="#!" className="flex items-center flex-1 ">
                  <IconBell />
                  <span className="text-sm px-1 flex-1">Notifications</span>
                  <span className="text-xs text-gray-500 group-hover:text-white">
                    Allow
                  </span>
                </a>
              </div>
              <div
                className="dropdown-item border-gray-500 border-b py-2 hover:scale-95 group "
                onClick={() => {
                  setShowDropdown(false);
                  setIsOpen(!isOpen);
                }}
              >
                <button className="flex items-center flex-1 cursor-pointer">
                  <IconHomeDollar />
                 <div className="flex flex-row justify-between items-center">
                   <span className="text-sm px-1 flex-1">My Business</span>
                   <span className="text-xs text-gray-500 group-hover:text-white">
                     <IconChevronCompactRight />
                   </span>
                 </div>
                </button>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item hover:scale-95">
                <button
                  onClick={handleLogout}
                  className="logout-btn flex gap-2 text-sm cursor-pointer "
                >
                  <IconLogout />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dropdown;
