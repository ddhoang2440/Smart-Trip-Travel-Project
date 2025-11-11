import {
  IconBox,
  IconCheckbox,
  IconCurrency,
  IconCurrencyDollar,
  IconHome,
  IconMap,
  IconMapPin,
  IconMinus,
  IconNumber,
  IconPlus,
  IconStar,
  IconStarFilled,
  IconToolsKitchen2,
  IconTrash,
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
      <div className="py-[18vh] px-[6vw] lg:px-[10vw]">
        <h1 className="font-bold font-playfair text-5xl">Shopping Cart</h1>
        <p className="text-gray-600/80 py-4 lg:max-w-[30vw]">
          Easily manage your past, current, and upcoming hotel reservations in
          one place. Plan your trips seamlessly with just a few clicks
        </p>
        <div className="flex flex-col gap-4 lg:px-[4vw] mt-[4vh]">
          {Array(5)
            .fill(1)
            .map((data, idx) => {
              return (
                <>
                  {idx === 0 && (
                    <div className="lg:grid hidden grid-cols-[1fr_auto_auto_auto_auto] gap-4 w-full border-b border-gray-600/70 px-4 py-2 items-center">
                      <h1 className="text-left flex gap-2 items-center"><IconToolsKitchen2 />Product</h1>
                      <h1 className="flex w-[10vw] items-center justify-center"><IconCurrencyDollar />Price</h1>
                      <h1 className="flex w-[10vw] items-center justify-center gap-1"><IconBox />Quantity</h1>
                      <h1 className="flex w-[10vw] items-center justify-center"><IconCurrencyDollar />Total</h1>
                      <h1 className="flex w-[8vw] items-center justify-center gap-1"><IconTrash />Remove</h1>
                    </div>
                  )}
                  <div className="lg:grid grid-cols-3 lg:grid-cols-[1fr_auto_auto_auto_auto] gap-4 w-full border-b border-gray-500/40 py-4 px-2 items-center">
                    <div className="flex gap-4 items-center min-w-0">
                      {" "}
                      <img
                        className="lg:w-[10vw] lg:h-[7vw] size-[30vw] object-cover rounded-lg shrink-0"
                        src="/pizza.jpg"
                        alt=""
                      />
                      <div className="flex flex-col gap-1 py-2 lg:min-w-[5vw] min-w-[50vw] flex-1">
                        <p className="text-lg font-semibold truncate flex gap-1">
                          <IconToolsKitchen2 />
                          {rt.details.menu[0].food_name}
                        </p>
                        <div className="flex items-center gap-1">
                          <IconMap size={24} />
                          <p className="text-sm text-gray-600 truncate">
                            {rt.details.address}
                          </p>
                        </div>
                        <div className="flex gap-1 items-center">
                          <IconHome size={16} className="shrink-0" />
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
                    <div className="lg:block hidden text-lg text-center w-[10vw]">
                      $35.00
                    </div>
                    <div className="lg:flex hidden justify-center w-[10vw]">
                      <div className="bg-gray-300/40 flex items-center gap-4 py-2 px-4 rounded-full">
                        <IconMinus className="cursor-pointer" size={16} />
                        <p className="border-x-2 border-gray-300 px-3">1</p>
                        <IconPlus className="cursor-pointer" size={16} />
                      </div>
                    </div>

                    <div className="text-lg lg:block hidden text-center w-[10vw]">
                      $240.00
                    </div>
                    <div className=" justify-center w-[8vw] lg:flex hidden">
                      <IconX className="cursor-pointer" />
                    </div>

                    {/* */}
                    <div className="lg:hidden flex flex-row justify-between lg:w-auto py-[2vh] items-center">
                      <div className="flex flex-col gap-2 items-center">
                        <p className="flex flex-row text-sm items-center">
                          <IconCurrencyDollar /> Price
                        </p>
                        <div className="lg:text-lg font-semibold text-center w-[10vw]">
                          $35.00
                        </div>
                      </div>
                      <div className="flex justify-center w-[10vw]">
                        <div className="flex text-sm flex-col items-center gap-2">
                          <p className="flex items-center"><IconBox /> Quantity</p>
                          <div className="bg-gray-300/40 flex items-center gap-3 py-1 px-2 rounded-full">
                            <IconMinus className="cursor-pointer" size={10} />
                            <p className=" px-1">1</p>
                            <IconPlus className="cursor-pointer" size={10} />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-center">
                        <p className="flex flex-row text-sm items-center">
                          <IconCurrencyDollar /> Total
                        </p>
                        <div className="lg:text-lg font-semibold text-center w-[10vw]">
                          $35.00
                        </div>
                      </div>
                      <div className="flex   text-sm flex-col items-center gap-2">
                        <p className="flex flex-row text-sm items-center"><IconTrash />Remove</p>
                        <IconX />
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
        </div>
        <div className="flex flex-col  lg:flex-row gap-16 lg:gap-4 justify-between mt-[8vh] ">
          <div className="space-y-8 w-[90vw]  lg:w-[45%]  ">
            <h1 className="text-4xl font-semibold">Coupon Code</h1>
            <div className="bg-white shadow-gray px-6 py-5 flex flex-col gap-6 h-[20vh] ">
              <p className="lg:max-w-[30vw] text-gray-900/70">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
                
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
          <div className="lg:w-[50%] space-y-8">
            <h1 className="text-4xl font-semibold ">Total Bill</h1>
            <div className="bg-white shadow-gray flex flex-col justify-between gap-2 px-6 py-3 h-[20vh]">
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
