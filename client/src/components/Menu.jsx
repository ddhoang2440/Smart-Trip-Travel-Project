import { IconContract, IconCurrency, IconCurrencyDollar, IconStar, IconStarFilled, IconToolsKitchen2 } from "@tabler/icons-react";
import React from "react";

const Menu = ({ data }) => {
  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 py-[6vh]  max-w-[60vw] px-[2vw] gap-6">
      {data.map((items, idx) => {
        return (
          <React.Fragment key={idx + items.food_name}>
            <div className="card bg-base-100 shadow-gray max-=w-[20vw]">
              <figure className="">
                <img src="/food2.jpg" alt="Food" />
              </figure>
              <div className="card-body gap-1 lg:gap-2">
                <div className="flex gap-1 items-center">
                  <IconToolsKitchen2 />
                  <h2 className="font-bold text-lg truncate">
                    Dish: {items.food_name}
                  </h2>
                </div>
               <div className="flex gap-1 items-center">
                <IconCurrencyDollar />
                 <p className="text-sm">Price: {items.price}</p>
               </div>

               <div className="flex gap-1 items-center">
                <IconContract />
                 <p>Igredients: {items.allergy_info}</p>
               </div>
                <div className="card-actions justify-between items-center gap-1">
                  <div className="flex items-center gap-1">
                    <p className="pr-2 font-semibold">4.2 star</p>
                    {Array(5)
                      .fill(1)
                      .map((data, idx) => {
                        return (
                          <>
                            {idx > 3 ? (
                              <IconStar color="orange" size={18}/>
                            ) : (
                              <IconStarFilled color="orange" size={18} />
                            )}
                          </>
                        );
                      })}
                  </div>{" "}
                  <button className="btn btn-accent text-white lg:px-8">
                    Watch
                  </button>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Menu;
