import { IconStar, IconStarFilled } from "@tabler/icons-react";
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
                <h2 className="font-bold text-lg overflow-hidden text-ellipsis whitespace-nowrap">
                  Dish: {items.food_name}
                </h2>
                <p className="text-sm">Price: {items.price}</p>

                <p>Allergy: {items.allergy_info}</p>
                <div className="card-actions justify-between items-center gap-1">
                  <div className="flex gap-1">
                    {Array(5)
                      .fill(1)
                      .map((data, idx) => {
                        return (
                          <>
                            {idx > 3 ? (
                              <IconStar color="orange" />
                            ) : (
                              <IconStarFilled color="orange" />
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
