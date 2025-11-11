import React from "react";
import { Restaurants } from "../assets/assets";
import { IconCurrency, IconCurrencyDollar, IconEyeDollar, IconHome, IconMapPin, IconStar, IconStarFilled } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const RestaurantCard = ({ number }) => {
    const navigate = useNavigate();
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8  py-[4vh] lg:py-[6vh] lg:max-w-[64vw] px-[1vw] lg:px-[2vw]">
      {Array(number)
        .fill(1)
        .map(() => {
          return (
            <>
              <div className="card lg:card-side bg-base-100 shadow-gray">
                <figure className="lg:w-[30vw] w-full">
                  <img src="/bg2.jpg" alt="Food" />
                </figure>
                <div className="card-body gap-1 lg:gap-2">
                  <h2 className="card-title items-center flex lg text-sm">
                    <IconHome />
                    {Restaurants.restaurant.name}
                  </h2>
                  <div className="flex flex-row gap-1 items-center">
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
                    </div>
                    <b>4.2 star</b>
                  </div>
                  <p className="flex gap-1"><IconCurrencyDollar />Avergate Price: 300$/ meal</p>
                  <div
                    className=" tooltip"
                    data-tip={Restaurants.restaurant.details.address}
                  >
                    <p className="flex flex-row gap-2 px-1 items-center">
                      <IconMapPin className="lg:size-[2vw] size-auto" />
                      {Restaurants.restaurant.details.address}
                    </p>
                  </div>
                  <div className="card-actions justify-end">
                    <button className="btn btn-accent text-white lg:px-8" onClick={() => navigate("/restaurant") }>
                      View More
                    </button>
                  </div>
                </div>
              </div>
            </>
          );
        })}
    </div>
  );
};

export default RestaurantCard;  
