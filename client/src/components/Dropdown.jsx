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

const Dropdown = ({ logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <>
      {/* SlideBar (nếu có) */}
      <SlideBar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Overlay — đặt ngoài relative để không che nút */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40 bg-gray-800/30"
          onClick={() => setShowDropdown(false)}
        />
      )}

      {/* Container chính */}
      <div className="relative z-50">
        {/* Nút dropdown */}
        <button
          className={`w-[13vw] flex items-center gap-2 bg-neutral-700 p-2 active:scale-95 cursor-pointer transition-all
          ${
            showDropdown
              ? "rounded-t-2xl border-gray-500 border-b"
              : "rounded-2xl"
          }`}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img
            src={"/pizza.jpg"}
            alt="Avatar"
            className="size-[2.25vw] rounded-full"
          />
          <span className="flex-1">{"Lmao"}</span>
          <span>▼</span>
        </button>

        {/* Menu dropdown */}
        {showDropdown && (
          <div className="absolute right-0 z-50">
            <div className="dropdown-menu bg-neutral-700 rounded-b-xl px-4 pb-4 w-[13vw] flex flex-col gap-2 transition-all">
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
                <a href="/settings" className="flex gap-2">
                  <IconSettings />
                  <span className="text-sm flex-1">Settings</span>
                  <span className="text-xs text-gray-500 group-hover:text-white">
                    <IconChevronCompactRight />
                  </span>
                </a>
              </div>

              <div
                className="dropdown-item border-gray-500 border-b py-2 hover:scale-95 group"
                onClick={() => setShowDropdown(false)}
              >
                <a href="#!" className="flex items-center">
                  <IconBell />
                  <span className="text-sm px-1 flex-1">Notifications</span>
                  <span className="text-xs text-gray-500 group-hover:text-white">
                    Allow
                  </span>
                </a>
              </div>

              <div
                className="dropdown-item border-gray-500 border-b py-2 hover:scale-95 group"
                onClick={() => {
                  setShowDropdown(false);
                  setIsOpen(!isOpen);
                }}
              >
                <button className="flex items-center w-full cursor-pointer ">
                  <IconHomeDollar />
                  <span className="text-sm flex-1 px-1 ">My Business</span>
                  <span className="text-xs text-gray-500 group-hover:text-white">
                    <IconChevronCompactRight />
                  </span>
                </button>
              </div>

              <div className="dropdown-item hover:scale-95">
                <button
                  onClick={handleLogout}
                  className="logout-btn flex gap-2 text-sm cursor-pointer"
                >
                  <IconLogout />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dropdown;
