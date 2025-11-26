import {
  IconChevronCompactDown,
  IconDeviceMobile,
  IconMapPin,
  IconShoppingCartDollar,
} from "@tabler/icons-react";
import React from "react";

const SlideBar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* {isOpen && ( */}
      <div
        className={`
        fixed inset-0 bg-gray-800/30 z-50 flex justify-start
        transition-opacity duration-300 ease-in-out
        ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`
          bg-white shadow-xl/30
          transition-transform duration-500 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
          onClick={(e) => e.stopPropagation()}
        >
          <form className="w-[30vw] px-10  ">
            <h3 className="text-black text-5xl pt-6 pb-3 font-playfair">
              Input Form
            </h3>
            <div className="flex flex-col gap  pb-1">
              <label className="label text-black font-serif"> Name</label>
              <input
                type="text"
                placeholder="Restaurant Name"
                className="input w-full text-gray-800/30 outline-0 shadow-xl"
              />
            </div>
            <div className="flex flex-col gap  pb-1">
              <label className="label text-black font-serif"> Owner</label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="First Name"
                  className="input text-gray-800/30 outline-0 shadow-xl"
                />
                <input
                  type="text"
                  placeholder="Second Name"
                  className="input text-gray-800/30 outline-0 shadow-xl"
                />
              </div>
            </div>
            <div className="flex flex-col gap  pb-1">
              <label className="label text-black font-serif">
                <IconDeviceMobile />
                Phone Number
              </label>
              <input
                type="number"
                placeholder="Name"
                className="input w-full text-black outline-0 shadow-xl"
              />
            </div>

            <div className="flex flex-col gap  pb-1">
              <label className="label text-black font-serif">
                <IconShoppingCartDollar />
                Average Price
              </label>
              <input
                type="number"
                placeholder="Name"
                className="input w-full text-black outline-0 shadow-xl"
              />
            </div>
            <div className="flex flex-col gap  pb-1">
              <div className="flex">
                <label className="label w-full text-black font-serif">
                  Opening Time
                </label>
                <label className="label w-full text-black font-serif">
                  Closing Time
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="time"
                  className="input text-black outline-0 shadow-xl"
                />
                <input
                  type="time"
                  className="input text-black outline-0 shadow-xl"
                />
              </div>
            </div>
            <div className="flex flex-col gap  pb-1">
              <label className="label text-black font-serif">
                <IconMapPin />
                Location
              </label>
              <select className="input w-full text-black outline-0 shadow-xl">
                <option value="">135B Tran Hung Dao</option>
                <option value="">lmao</option>
                <option value="">hmu</option>
              </select>
            </div>
            <div className="flex flex-col gap pb-1">
              <label className="label text-black font-serif">Description</label>
              <textarea
                type="text"
                placeholder="Description"
                className="textarea w-full text-gray-800/30 outline-0 shadow-xl"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-black hover:bg-gray-600 transition-all duration-300 rounded-3xl cursor-pointer w-full"
              >
                Close
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-black hover:bg-warning transition-all duration-300 rounded-3xl cursor-pointer w-full"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* )} */}
    </>
  );
};

export default SlideBar;
