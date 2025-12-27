import { IconContract, IconCurrency, IconCurrencyDollar, IconFileDescription, IconStar, IconStarFilled, IconToolsKitchen2 } from "@tabler/icons-react";
import React from "react";


const Menu = ({ data }) => {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="grid lg:grid-cols-3 grid-cols-1 py-[6vh]  max-w-full  lg:max-w-[74vw] px-[2vw] gap-26">
        {data.map((items, idx) => {
          return (
            <div
              key={items._id + idx}
              className="card bg-base-100  relative"
            >
              <div className="p-1 border rounded-full">
                <figure className="">
                  <img
                    className="size-[28vh] rounded-full border-2 border-gray-600 
                  outline-offset-2"
                    src={items.image}
                    alt="Food"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[6vh] border flex justify-center items-center bg-[#EEB557] rounded-tr-4xl rounded-br-4xl">
                    <p className="text-xl text-gray-700 font-bold">{items.name}</p>
                  </div>
                </figure>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Menu;
