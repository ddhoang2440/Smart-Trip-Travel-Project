import { IconContract, IconCurrency, IconCurrencyDollar, IconFileDescription, IconStar, IconStarFilled, IconToolsKitchen2 } from "@tabler/icons-react";
import React from "react";
import { useDispatch } from "react-redux";
import { formatPrice } from "./ultil";

const Menu = ({ data }) => {
  const dispatch = useDispatch();
  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 py-[6vh] max-w-full  lg:max-w-[80vw] px-[2vw] gap-12">
      {data.map((items, idx) => {
        return (
            <div key={items._id + idx} className="card bg-base-100 shadow-gray max-=w-[20vw]">
              <figure className="">
                <img className="w-full h-[34vh]" src={items.image} alt="Food" />
              </figure>
            </div>
        );
      })}
    </div>
  );
};

export default Menu;
