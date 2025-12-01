import { IconSearch } from "@tabler/icons-react";
import React from "react";

const RestaurantFilter = ({
  searchtext,
  setSearchText,
  selectedTypes,
  onChange,
}) => {
  return (
    <>
      <div className="hidden lg:flex flex-col gap-4 sticky  py-[2vh] mt-[6vh] top-[16%] l-0 w-[30vw]  lg:w-[14vw] h-fit border">
        <h1 className="text-3xl font-bold text-accent py-2 border-b border-gray-300/60 px-4">
          Filter
        </h1>
        <div className="px-4">
          <label className="input input-warning">
            <IconSearch />
            <input
              value={searchtext}
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
              placeholder="Search"
            />
          </label>
        </div>
        <div className="flex flex-col gap-6 py-4 border-b px-4 ">
          <h1 className="text-xl">Category</h1>
          <div className="flex gap-2">
            <input type="checkbox" className="checkbox checkbox-warning" />
            <p>Salty Dishes</p>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" className="checkbox checkbox-warning" />
            <p>Vegetarian Dishes</p>
          </div>
        </div>
        <div className="flex flex-col gap-6 py-4 px-4">
          <h1 className="text-xl">Type of Restaurant</h1>
          <div className="flex gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-warning"
              value="Quán ăn"
              checked={selectedTypes.includes("Quán ăn")}
              onClick={(e) => onChange(e.target.value, e.target.checked)}
            />
            <p>Quán ăn</p>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-warning"
              value="Ăn vặt"
              checked={selectedTypes.includes("Ăn vặt")}
              onClick={(e) => onChange(e.target.value, e.target.checked)}
            />
            <p>Ăn vặt</p>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-warning"
              value="Caffe"
              checked={selectedTypes.includes("Caffe")}
              onClick={(e) => onChange(e.target.value, e.target.checked)}
            />
            <p>Caffe</p>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-warning"
              value="Nhà hàng"
              checked={selectedTypes.includes("Nhà hàng")}
              onClick={(e) => onChange(e.target.value, e.target.checked)}
            />
            <p>Nhà hàng</p>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-warning"
              value="Quán Chay"
              checked={selectedTypes.includes("Quán Chay")}
              onClick={(e) => onChange(e.target.value, e.target.checked)}
            />
            <p>Quán chay</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantFilter;
