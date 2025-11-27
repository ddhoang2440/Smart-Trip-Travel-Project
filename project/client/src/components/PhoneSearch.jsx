import { IconChefHat, IconCurrencyDollar, IconMapPin, IconMichelinStar, IconSearch } from '@tabler/icons-react';
import React from 'react'

const PhoneSearch = () => {
  return (
    <div className="bg-white lg:hidden relative z-100 flex flex-col items-center w-[80vw] py-8  rounded-2xl lg:gap-14 gap-8 mt-[6vh]">
      <div className="flex flex-row justify-between w-[50vw]">
        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
            <IconMichelinStar />
            Type
          </div>

          <select className="select">
            <option className="" selected disabled>
              Choose Type
            </option>
            <option className="">Normal</option>
            <option className="">Luxury</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
            <IconChefHat />
            Food
          </div>
          <select className="select">
            <option selected disabled>
              Food Region
            </option>
            <option>Eastern</option>
            <option>Western</option>
          </select>
        </div>
      </div>
      <div className="flex flex-row gap-4 justify-between w-[50vw]">
        <div className="flex gap-2 flex-col">
          <div className="flex gap-1">
            <IconMapPin />
            City
          </div>
          <div>
            <select className="select">
              <option value="" selected disabled>
                Your City
              </option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-1">
            <IconCurrencyDollar />
            <p>PriceRange</p>
          </div>
          <div>
            <div className="flex gap-2">
              <input
                type="range"
                min={0}
                max="100"
                value="0"
                className="range"
                step="1"
              />
              <p>$</p>
            </div>
          </div>
        </div>
      </div>
      <button className="flex btn btn-neutral btn-lg">
        <IconSearch />
        Search
      </button>
    </div>
  );
}

export default PhoneSearch