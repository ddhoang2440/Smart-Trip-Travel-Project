import React, { useState } from 'react'
import Footer from '../components/Footer'
import CardFood from '../components/CardFood'
import Menu from '../components/Menu'
import { Restaurants } from '../assets/assets'

const Products = () => {

    const [stage, setStage] = useState(false)

  return (
    <>
      <div className="px-[10vw] pt-[20vh] pb-[10vh]">
        <h1 className="text-6xl font-bold font-playfair">Products</h1>
        <p className="text-xl text-gray-800/60">
          Find all luxury restaurant and food here
        </p>
        <div className="flex flex-row justify-between max-w-[80vw] w-[80vw] gap-4">
          <div className="flex flex-col gap-4 w-[60vw] py-[4vh]">
            <div className="flex-row flex ">
              <button className=" py-3 w-[20%] px-6 p transition-all duration-300 hover:bg-warning border-r border-gray-800/40 rounded-l-xl bg-gray-400/20" onClick={() => setStage(false)}>
                Restaurants
              </button>
              <button className=" py-3 w-[20%] px-6 p transition-all duration-300 hover:bg-warning bg-gray-400/20 rounded-r-xl "
              onClick={() => setStage(true)}>
                Foods
              </button>
            </div>
            { !stage ? <CardFood number={12} /> : <Menu data={Restaurants.restaurant.details.menu} />}
          </div>

          <div></div>
        </div>
      </div>
    </>
  );
}

export default Products