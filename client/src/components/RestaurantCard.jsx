import React from "react";

import { IconCurrencyDollar,IconFileDescription, IconHome, IconMapPin, IconStar, IconStarFilled } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { setCurrent } from "../contexts/ResRedux";
import { useDispatch } from "react-redux";
import { formatPrice } from "./ultil";

const RestaurantCard = ({ data }) => {


    const navigate = useNavigate();
    const dispatch = useDispatch();
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8  py-[4vh] lg:py-[6vh] w-full lg:max-w-[64vw] px-[1vw] lg:px-[2vw]">
      {data  && data
        .map((dat,idx) => {
          return (
            <React.Fragment key={dat._id + idx}>
              <div className="card lg:card-side bg-base-100 shadow-gray lg:max-w-[32vw]  lg:w-[30vw] lg:h-[25vh]">
                <figure className="lg:w-[16vw] w-full">
                  <img
                    src="https://cdn.pixabay.com/photo/2016/11/21/16/02/outdoor-dining-1846137_640.jpg"
                    alt="Food"
                  />
                </figure>
                <div className="card-body gap-1 lg:gap-2 w-full lg:w-[14vw]">
                  <h2 className="card-title items-center flex lg text-sm">
                    <IconHome className="shrink-0" />
                    {dat.name}
                  </h2>
                  <div className="flex flex-row gap-1 items-center">
                    <div className="flex gap-1">
                      {Array(5)
                        .fill(1)
                        .map((d, idex) => {
                          return (
                            <React.Fragment key={dat._id + idex}>
                              {idex > dat.rating - 1 ? (
                                <IconStar color="orange" />
                              ) : (
                                <IconStarFilled color="orange" />
                              )}
                            </React.Fragment>
                          );
                        })}
                    </div>
                    <b>{dat.rating} star</b>
                  </div>
                  <p className="flex gap-1 items-center">
                    <IconCurrencyDollar className="shrink-0" />
                    Avergate: {formatPrice(dat.medium_price)}đ/ meal
                  </p>
                  <div className="flex gap-1 tooltip" data-tip={dat.address}>
                    <IconMapPin className="shrink-0" />
                    <p className="flex flex-row gap-2 items-center truncate ">
                      {dat.address}
                    </p>
                  </div>
                  <div
                    className="tooltip flex  gap-1"
                    data-tip={dat.description}
                  >
                    <IconFileDescription className="shrink-0" />
                    <p className="flex gap-2 items-center truncate">
                      {dat.description}
                    </p>
                  </div>

                  <div className="card-actions justify-end">
                    <button
                      className="btn btn-accent  text-white"
                      onClick={() => {
                        dispatch(setCurrent(dat));
                        navigate("/restaurant");
                      }}
                    >
                      View More
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

export default RestaurantCard;  
