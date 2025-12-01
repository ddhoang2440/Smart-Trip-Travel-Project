import React from "react";

import {
  IconChefHat,
  IconCurrencyDollar,
  IconFileDescription,
  IconHome,
  IconMapPin,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { setCurrent } from "../contexts/ResRedux";
import { useDispatch } from "react-redux";
import { formatPrice } from "./ultil";

const RestaurantCard = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleRestaurantClick = (restaurant) => {
    dispatch(setCurrent(restaurant));
    navigate(`/restaurant/${restaurant._id}`);
  };
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8  py-[4vh] lg:py-[6vh] w-full lg:max-w-[64vw] px-[1vw] lg:px-[2vw]">
      {data &&
        data.map((dat, idx) => {
          const hasMatchedMenus = dat.matched_menus?.length > 0;
          return (
            <React.Fragment key={dat._id + idx}>
              <div className="flex flex-col lg:w-[30vw] lg:max-w-[32vw]">
                <div className="card lg:card-side bg-base-100 shadow-gray lg:max-w-[32vw]  lg:w-[30vw] lg:h-[25vh]">
                  <figure className="lg:w-[16vw] w-full cursor-pointer">
                    <img
                      onClick={() => handleRestaurantClick(dat)}
                      src="https://cdn.pixabay.com/photo/2016/11/21/16/02/outdoor-dining-1846137_640.jpg"
                      alt="Food"
                    />
                  </figure>
                  <div className="card-body gap-1 lg:gap-2 w-full lg:w-[14vw]">
                    <h2
                      className="card-title items-center flex lg text-sm cursor-pointer"
                      onClick={() => handleRestaurantClick(dat)}
                    >
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
                        onClick={() => handleRestaurantClick(dat)}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
                {hasMatchedMenus && (
                  <div className="collapse collapse-arrow rounded-xl border border-base-300 bg-base-200 w-full">
                    <input type="checkbox" />
                    <div className="collapse-title flex items-center gap-3 text-lg font-semibold">
                      <IconChefHat className="h-6 w-6" />
                      {dat.matched_menus.length} món ăn phù hợp
                    </div>
                    <div className="collapse-content space-y-5 pt-4">
                      {dat.matched_menus.map((item, i) => (
                        <a
                          href=""
                          onClick={(e) => (
                            e.preventDefault(), handleRestaurantClick(dat)
                          )}
                        >
                          <div
                            key={i}
                            className="flex gap-4 rounded-xl bg-base-100 p-5 shadow-sm"
                          >
                            <img
                              src={item.image || "/placeholder.jpg"}
                              alt={item.name}
                              className="h-20 w-20 shrink-0 rounded-full border-4 border-accent object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <h3 className="text-xl font-bold">
                                  {item.name}
                                </h3>
                                <span className="badge badge-success badge-lg">
                                  {formatPrice(item.price)}đ
                                </span>
                              </div>
                              {item.ingredient && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">
                                    Nguyên liệu:
                                  </span>
                                  {item.ingredient.join(", ")}
                                </p>
                              )}
                              {item.description && (
                                <p className="mt-1 text-sm italic text-gray-700">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default RestaurantCard;
