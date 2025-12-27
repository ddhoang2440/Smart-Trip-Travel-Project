import React from "react";
import {
  IconCurrencyDollar,
  IconCurrencyEuro,
  IconMapPin,
  IconMoneybag,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrent } from "../contexts/ResRedux";
import { formatPrice } from "./ultil";
import { Virtuoso } from "react-virtuoso";

const RestaurantCard = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (item) => {
    dispatch(setCurrent(item));
    navigate("/restaurant");
  };

  const renderItem = (index, dat) => {
    return (
      <div className="flex lg:justify-center w-full px-[1vw] lg:px-0 py-[3vh] border-b-2 max-w-[98vw] border-gray-200">
        <div className="flex flex-col lg:flex-row items-center gap-4  bg-transparent border-gray-300  lg:max-w-[64vw]  lg:w-[56vw]">
          <figure
            className="lg:w-[20vw] w-[90vw] hover:cursor-pointer shrink-0 rounded-lg"
            onClick={() => handleClick(dat)}
          >
            <img
              className="rounded-lg lg:w-[20vw] lg:h-[13vw] w-full  object-cover"
              src={dat.images ? dat.images[0] : ""}
              alt="Food"
            />
          </figure>

          <div className="h-full py-[2vh] lg:w-[26vw] lg:px-0  w-full">
            <div className="flex flex-col lg:justify-between justify-start h-full py-[1vh] px-[1vw] text-sm gap-1 lg:gap-2 w-full">
              <div className="flex flex-col gap-4">
                <h2 className="font-bold font-playfair text-2xl items-center flex">
                  {dat.name}
                </h2>

                <div className="flex flex-row gap-1 items-center">
                  <div className="flex gap-1">
                    {Array(5)
                      .fill(1)
                      .map((d, idex) => (
                        <React.Fragment key={(dat._id || index) + idex}>
                          {idex > dat.rating - 1 ? (
                            <IconStar size={20} color="#f8701b" />
                          ) : (
                            <IconStarFilled size={20} color="#f8701b" />
                          )}
                        </React.Fragment>
                      ))}
                  </div>
                  <b>{dat.review}+ reviews</b>
                </div>

                <div className="flex gap-1 items-center">
                  <IconMapPin size={18} className="shrink-0" />
                  <p className="flex flex-row max-w-[80vw] gap-2 items-center text-gray-600 ">
                    {dat.address}
                  </p>
                </div>

                <div className="flex flex-row gap-3 flex-wrap">
                  {dat.bookingslots.map((item, tIdx) => (
                    <div
                      key={tIdx}
                      className="bg-error py-2 px-4 rounded-lg hover:cursor-pointer"
                    >
                      <p className="text-white font-semibold">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="flex gap-1 items-center font-semibold text-xl mt-2 ">
                <IconMoneybag />
                {formatPrice(dat.medium_price)}đ/ bữa ăn
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-[85vh] lg:max-w-[64vw] ">
      <Virtuoso
        className="scrollbar-hide"
        style={{ height: "100%", width: "100%" }}
        data={data || []}
        itemContent={renderItem}
        overscan={200}
      />
    </div>
  );
};

export default RestaurantCard;
