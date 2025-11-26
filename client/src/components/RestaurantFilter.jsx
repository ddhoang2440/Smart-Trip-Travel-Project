import { IconSearch } from '@tabler/icons-react';
import React from 'react'

const RestaurantFilter = ({searchtext, setSearchText, setFilterType}) => {
   

  
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
        <div className="flex flex-col gap-4 border-b py-4  px-4">
          <h1 className="text-xl">Price</h1>
          <div className="flex gap-2">
            <input onChange={(e) => {e.target.checked ? setFilterType("lowtohigh") : setFilterType("")}} type="checkbox" className="checkbox checkbox-warning" />
            <p>Low to High</p>
          </div>
          <div className="flex gap-2">
            <input onChange={(e) => {e.target.checked ? setFilterType("hightolow") : setFilterType("")}} type="checkbox" className="checkbox checkbox-warning" />
            <p>High to Low</p>
          </div>
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
          <h1 className="text-xl">Type of Food</h1>
          <div className="flex gap-2">
            <input type="checkbox" className="checkbox checkbox-warning" />
            <p>Desserts</p>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" className="checkbox checkbox-warning" />
            <p>Drink</p>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" className="checkbox checkbox-warning" />
            <p>Normal Food</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default RestaurantFilter