import {
  IconContract,
  IconCurrency,
  IconCurrencyDollar,
  IconFileDescription,
  IconStar,
  IconStarFilled,
  IconToolsKitchen2,
} from "@tabler/icons-react";
import React from "react";
import { addToCart } from "../contexts/CartRedux";
import { useDispatch } from "react-redux";
import { formatPrice } from "./ultil";

const Menu = ({ data }) => {
  const dispatch = useDispatch();
  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 py-[6vh] max-w-full  lg:max-w-[60vw] px-[2vw] gap-6">
      {data.map((items, idx) => {
        return (
          <div
            key={items._id + idx}
            className="card bg-base-100 shadow-gray max-=w-[20vw]"
          >
            <figure className="">
              <img className="w-full h-[24vh]" src={items.image} alt="Food" />
            </figure>
            <div className="card-body gap-1 lg:gap-2">
              <div className="flex gap-1 items-center">
                <IconToolsKitchen2 />
                <h2 className="font-bold text-lg truncate">
                  Dish: {items.name}
                </h2>
              </div>
              <div className="flex gap-1 items-center">
                <IconCurrencyDollar />
                <p className="text-sm">Price: {formatPrice(items.price)}đ</p>
              </div>

              <div
                className="flex gap-1 items-center tooltip"
                data-tip={items.igredient?.join(" , ")}
              >
                <IconContract className="shrink-0" />
                <p className=" truncate">
                  Igredients: {items.igredient?.join(" , ")}.
                </p>
              </div>
              <div
                className="flex gap-1 items-center tooltip"
                data-tip={items.description}
              >
                <IconFileDescription className="shrink-0" />
                <p className="truncate">Description: {items.description}</p>
              </div>
              <div className="card-actions justify-end items-center gap-1">
                <button
                  onClick={() => dispatch(addToCart({ ...items, quantity: 1 }))}
                  className="btn bg-black/80 border-2 border-black hover:bg-black btn-neutral btn-soft text-white lg:px-8"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Menu;
