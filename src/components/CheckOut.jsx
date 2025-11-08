import React from "react";
import {
  IconArrowBigLeftLinesFilled,
  IconArrowBigRightLinesFilled,
} from "@tabler/icons-react";

export const CheckOut = ({ check, setCheck }) => {
  return (
    check && (
      <div
        className="w-full h-screen fixed z-99 flex items-center justify-center bg-gray-800/40  "
        onClick={() => setCheck(false)}
      >
        <form
          className="bg-white px-14 py-10 fixed shadow-gray flex flex-col rounded-lg gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="text-4xl font-semibold">Shipping Address</h1>
          <label className="label text-lg">Name</label>
          <input type="text" className="input input-lg w-full" />
          <div className="flex flex-row gap-4">
            <div className="flex flex-col ">
              <label className="label text-lg">Email</label>
              <input
                type="email"
                className="py-3 px-4 border border-gray-600/30 rounded-box"
              />
            </div>
            <div className="flex flex-col">
              <label className="label text-lg">Phone Number</label>
              <input
                type="number"
                className="py-3 px-4 border border-gray-600/30 rounded-box"
              />
            </div>
          </div>
          <label className="label text-lg ">Address</label>
          <input type="text" className="input input-lg w-full" />
          <div className="flex justify-between gap-4">
            <button className="flex gap-2 items-center justify-center shadow-xl transition-all duration-500 py-3 px-2 bg-gray-300/40 hover:bg-black/70 p w-1/2 text-center hover:text-white">
              <IconArrowBigLeftLinesFilled /> Back To Cart
            </button>
            <button className="flex gap-2 items-center w-1/2 justify-center shadow-lg shadow-warning/40 bg-warning/70 text-black py-3 px-2 p hover:bg-warning transition-all duration-500 hover:text-white ">
              Proceed to Shipping <IconArrowBigRightLinesFilled />
            </button>
          </div>
        </form>
      </div>
    )
  );
};
