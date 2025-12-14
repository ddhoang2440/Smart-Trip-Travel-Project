import React from "react";
import {
  IconArrowBigLeftLinesFilled,
  IconArrowBigRightLinesFilled,
} from "@tabler/icons-react";

export const CheckOut = ({ check, setCheck, setEmail, setUser, setAddress, setContact, user, email, address, contact, handle }) => {
  return (
    check && (
      <div
        className="w-full h-screen fixed z-99 flex items-center justify-center bg-gray-800/40  "
        onClick={() => setCheck(false)}
      >
        <form
          className="bg-white lg:w-[30vw] w-[90vw] px-14 py-10 fixed shadow-gray flex flex-col rounded-lg gap-4"
          onClick={(e) => e.stopPropagation()}
          onSubmit={(e) => handle(e)}
        >
          <h1 className="text-4xl font-semibold">Shipping Address</h1>
          <label className="label text-lg">Name</label>
          <input type="text" required value={user} minLength={1} onChange={(e) => setUser(e.target.value)} className="input input-lg w-full" />
          <div className="flex flex-col lg:flex-row lg:gap-13 gap-2">
            <div className="flex flex-col lg:w-4/9 ">
              <label className="label text-lg ">Email</label>
              <input
              required
              minLength={5}
              value={email} onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="py-3 px-4 border border-gray-600/30 rounded-box"
              />
            </div>
            <div className="flex flex-col lg:w-4/9">
              <label className="label text-lg">Phone Number</label>
              <input
              required
                type="text"
                minLength={10}
                maxLength={10}
                value={contact} onChange={(e) => setContact(e.target.value)}
                className="py-3 px-4 border border-gray-600/30 rounded-box"
              />
            </div>
          </div>
          <label className="label text-lg ">Address</label>
          <input required type="text" className="input input-lg w-full" minLength={8} value={address} onChange={(e) => setAddress(e.target.value)} />
          <div className="flex lg:flex-row flex-col justify-between gap-4">
            <button type="button" onClick={() => setCheck(false)} className="flex gap-2 items-center justify-center shadow-xl transition-all duration-500 py-3 px-2 bg-gray-300/40 hover:bg-black/70 p w-full lg:w-1/2 text-center hover:text-white">
              <IconArrowBigLeftLinesFilled /> Back To Cart
            </button>
            <button type="submit" className="flex gap-2 items-center w-full lg:w-1/2 justify-center shadow-lg shadow-warning/40 bg-warning/70 text-black py-3 px-2 p hover:bg-warning transition-all duration-500 hover:text-white ">
              Proceed to Shipping <IconArrowBigRightLinesFilled />
            </button>
          </div>
        </form>
      </div>
    )
  );
};
