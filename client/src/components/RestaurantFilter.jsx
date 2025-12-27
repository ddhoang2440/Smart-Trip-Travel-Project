import { IconSearch } from "@tabler/icons-react";
import React from "react";

const RestaurantFilter = ({
  searchtext,
  setSearchText,
  setFilterType,
  setSelectedTime,
}) => {
  const commonTimes = [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];
  const splitIndex = Math.ceil(commonTimes.length / 2);
  const firstColumnTimes = commonTimes.slice(0, splitIndex);
  const secondColumnTimes = commonTimes.slice(splitIndex);
  return (
    <>
      <div className="hidden lg:flex flex-col gap-4 sticky bg-transparent  py-[2vh] mt-[6vh] top-[16%] l-0 w-[30vw]  lg:w-[24vw] h-fit border-2 border-gray-400/40">
        <h1 className="text-3xl font-bold  py-2 border-b border-gray-300/60 px-8">
          Bộ Lọc
        </h1>

        <div className="px-8">
          <label className="input">
            <IconSearch />
            <input
              value={searchtext}
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
              placeholder="Tìm Kiếm"
            />
          </label>
        </div>
        <div className="flex flex-col gap-4 py-4 px-8">
          <h1 className="text-xl">Theo Giờ Đặt Bàn</h1>
          <div className="flex justify-around">
            <div className="flex flex-col gap-2">
              {firstColumnTimes.map((time) => (
                <div key={time} className="flex gap-2 items-center">
                  <input
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTime(time);
                      } else {
                        setSelectedTime("");
                      }
                    }}
                    type="checkbox"
                    className="checkbox"
                  />
                  <p className="text-gray-500">{time}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {secondColumnTimes.map((time) => (
                <div key={time} className="flex gap-2 items-center">
                  <input
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTime(time);
                      } else {
                        setSelectedTime("");
                      }
                    }}
                    type="checkbox"
                    className="checkbox"
                  />
                  <p className="text-gray-500">{time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4  py-4  px-8 ">
          <h1 className="text-xl">Theo Giá</h1>
          <div className="flex gap-2">
            <input
              onChange={(e) => {
                e.target.checked
                  ? setFilterType("lowtohigh")
                  : setFilterType("");
              }}
              type="checkbox"
              className="checkbox"
            />
            <p className="text-gray-500">Thấp Đến Cao</p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              onChange={(e) => {
                e.target.checked
                  ? setFilterType("hightolow")
                  : setFilterType("");
              }}
              type="checkbox"
              className=" checkbox"
            />
            <p className="text-gray-500">Cao Đến Thấp</p>
          </div>
        </div>
        <div className="flex flex-col gap-4  pb-4  px-8 ">
          <p className="text-xl">Theo Đánh Giá</p>
          <div className="flex gap-2 items-center">
            <input
              onChange={(e) => {
                e.target.checked
                  ? setFilterType("ratinghigh")
                  : setFilterType("");
              }}
              type="checkbox"
              className=" checkbox"
            />
            <p className="text-gray-500">Cao Đến Thấp</p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              onChange={(e) => {
                e.target.checked
                  ? setFilterType("ratinglow")
                  : setFilterType("");
              }}
              type="checkbox"
              className=" checkbox"
            />
            <p className="text-gray-500">Thấp Đến Cao</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantFilter;
