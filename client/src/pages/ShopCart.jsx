import {
  IconCheckbox,
  IconHome,
  IconMapPin,
  IconMinus,
  IconPlus,
  IconStar,
  IconStarFilled,
  IconToolsKitchen2,
  IconX,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { Restaurants } from "../assets/assets";
import Footer from "../components/Footer";
import { CheckOut } from "../components/CheckOut";

const ShopCart = () => {
  const rt = Restaurants.restaurant;

  const [check, setCheck] = useState(false);

  return (
    <>
      <CheckOut check={check} setCheck={setCheck} />
      <div className="py-[18vh] px-[10vw]">
        <h1 className="font-bold font-playfair text-5xl">Shopping Cart</h1>
        <p className="text-gray-600/80 max-w-[30vw]">
          Easily manage your past, current, and upcoming hotel reservations in
          one place. Plan your trips seamlessly with just a few clicks
        </p>
        <div className="flex flex-col gap-4 px-[4vw] mt-[4vh]">
          {Array(5)
            .fill(1)
            .map((data, idx) => {
              return (
                <>
                  {/* {idx === 0 && (
                    <div className="flex gap-2 items-center w-full border-b border-gray-600/70 px-4">
                      <h1 className="w-[24vw] text-left">Product</h1>
                      <h1 className="w-[12vw] text-center">Price</h1>
                      <h1 className="w-[12vw]  text-center">Quantity</h1>
                      <h1 className="w-[12vw] text-center">Total</h1>
                      <h1 className="w-[8vw] text-center">Remove</h1>
                    </div>
                  )}
                  <div className="flex gap-2  w-full border-b border-gray-500/40 py-4 px-4">
                    <div className="w-[24vw] flex gap-4 items-center">
                      <img
                        className="w-[10vw] h-[7vw]"
                        src="/pizza.jpg"
                        alt=""
                      />
                      <div className="flex flex-col gap-1 py-2">
                        <p className="text-lg font-semibold">
                          {rt.details.menu[0].food_name}
                        </p>
                        <p>{rt.details.address}</p>
                        <p>{rt.name}</p>
                        <div className="flex gap-1">
                          {Array(5)
                            .fill(1)
                            .map((data, idx) => {
                              return (
                                <React.Fragment key={"cart" + idx}>
                                  {idx > 3 ? (
                                    <IconStar color="orange" />
                                  ) : (
                                    <IconStarFilled color="orange" />
                                  )}
                                </React.Fragment>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    <div className="flex w-[12vw] text-lg justify-center items-center">
                      $35.00
                    </div>
                    <div className="flex gap-1 w-[12vw] justify-center items-center rounded-lg">
                      <div className="bg-gray-300/40 flex flex-row items-center gap-4 py-2 px-4 rounded-full">
                        <IconMinus className="p" size={16} />
                        <p className="border-x-2 border-gray-300 px-3">1</p>
                        <IconPlus className="p" size={16} />
                      </div>
                    </div>
                    <div className="flex justify-center w-[12vw] items-center text-lg">
                      $240.00
                    </div>
                    <div className="flex items-center w-[8vw] justify-center ">
                      <IconX className="p" />
                    </div>
                  </div> */}
                  {idx === 0 && (
                    <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 w-full border-b border-gray-600/70 px-4 py-2 items-center">
                      <h1 className="text-left">Product</h1>
                      <h1 className="text-center w-[10vw]">Price</h1>
                      <h1 className="text-center w-[10vw]">Quantity</h1>
                      <h1 className="text-center w-[10vw]">Total</h1>
                      <h1 className="text-center w-[8vw]">Remove</h1>
                    </div>
                  )}
                  <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 w-full border-b border-gray-500/40 py-4 px-4 items-center">
                    <div className="flex gap-4 items-center min-w-0">
                      {" "}
                      <img
                        className="w-[10vw] h-[7vw] object-cover rounded-lg shrink-0"
                        src="/pizza.jpg"
                        alt=""
                      />
                      <div className="flex flex-col gap-1 py-2 min-w-0 flex-1">
                        <p className="text-lg font-semibold truncate flex gap-1">
                          <IconToolsKitchen2 />
                          {rt.details.menu[0].food_name}
                        </p>
                        <div className="flex items-center gap-1">
                          <IconMapPin />
                          <p className="text-sm text-gray-600 truncate">
                            {rt.details.address}
                          </p>
                        </div>
                        <div className="flex gap-1 items-center">
                          <IconHome size={18} />
                          <p className="text-sm text-gray-600 truncate">
                            {rt.name}
                          </p>
                        </div>
                        <div className="flex gap-1 items-center">
                          <p>4.2 star</p>
                          {Array(5)
                            .fill(1)
                            .map((data, idx) => (
                              <React.Fragment key={"cart" + idx}>
                                {idx > 3 ? (
                                  <IconStar color="orange" size={16} />
                                ) : (
                                  <IconStarFilled color="orange" size={16} />
                                )}
                              </React.Fragment>
                            ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-lg text-center w-[10vw]">$35.00</div>
                    <div className="flex justify-center w-[10vw]">
                      <div className="bg-gray-300/40 flex items-center gap-4 py-2 px-4 rounded-full">
                        <IconMinus className="cursor-pointer" size={16} />
                        <p className="border-x-2 border-gray-300 px-3">1</p>
                        <IconPlus className="cursor-pointer" size={16} />
                      </div>
                    </div>
                    <div className="text-lg text-center w-[10vw]">$240.00</div>
                    <div className="flex justify-center w-[8vw]">
                      <IconX className="cursor-pointer" />
                    </div>
                  </div>
                </>
              );
            })}
        </div>
        <div className="flex flex-row gap-4 justify-between mt-[8vh] ">
          <div className="space-y-8 ">
            <h1 className="text-4xl font-semibold">Coupon Code</h1>
            <div className="bg-white shadow-gray px-6 py-5 flex flex-col gap-6 h-[25vh] ">
              <p className="max-w-[30vw] text-gray-900/70">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
                porro sit vitae in minima sequi dolorum esse nostrum iusto culpa
                incidunt?
              </p>
              <div className="flex ">
                <input
                  type="text"
                  className="input input-lg w-full"
                  placeholder="Enter Here Code"
                />
                <label className="label bg-warning px-4 text-white">
                  Apply
                </label>
              </div>
            </div>
          </div>
          <div className="w-[50%] space-y-8">
            <h1 className="text-4xl font-semibold ">Total Bill</h1>
            <div className="bg-white shadow-gray flex flex-col justify-between gap-2 px-6 py-3 h-[25vh]">
              <div className="flex flex-row justify-between border-b-2 border-gray-500/20 pb-4">
                <div className="flex flex-col gap-4">
                  <b className="text-lg">Cart Subtotal</b>
                  <p>Shipping Charge</p>
                </div>
                <div className="flex flex-col gap-4">
                  <b>$120.00</b>
                  <p>$00.00</p>
                </div>
              </div>
              <div className="flex justify-between">
                <b className="text-2xl">Total Amount</b>
                <b className="text-2xl">$205.00</b>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setCheck(true)}
          className="btn w-full bg-linear-to-r from-warning/30 to-warning/80 text-white mt-[6vh] btn-lg"
        >
          Process to Checkout <IconCheckbox />
        </button>
      </div>
      <Footer />
    </>
  );
};

export default ShopCart;
