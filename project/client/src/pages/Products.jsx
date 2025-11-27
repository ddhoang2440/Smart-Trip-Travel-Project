import React, { useState } from "react";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import { Restaurants } from "../assets/assets";
import FoodFilter from "../components/FoodFilter";
import RestaurantCard from "../components/RestaurantCard";
import RestaurantFilter from "../components/RestaurantFilter";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Products = () => {
  const { menu } = useSelector((state) => state.menu);
  const { restaurants } = useSelector((state) => state.restaurant);
  const [seachtext, setSearchText] = useState("");
  const [filtertype, setFilterType] = useState("");
  const [seachmenu, setSearchMenu] = useState("");
  const [filtermenu, setFilterMenu] = useState("");
  const [stage, setStage] = useState(false);

  const filterRestaurant = restaurants.filter((item) => {
    const keyword = seachtext.toLowerCase();
    return item.name?.toLowerCase().includes(keyword);
  });
  const finalRestaurant = [...filterRestaurant].sort((a, b) => {
    switch (filtertype) {
      case "lowtohigh":
        return (a.medium_price || 0) - (b.medium_price || 0);
      case "hightolow":
        return (b.medium_price || 0) - (a.medium_price || 0);
      default:
        return 1;
    }
  });
  const filterMenu = menu.filter((item) => {
    const keyword = seachmenu.toLowerCase();
    return item.name?.toLowerCase().includes(keyword);
  });
  const finalMenu = [...filterMenu].sort((a, b) => {
    switch (filtermenu) {
      case "lowtohigh":
        return (a.price || 0) - (b.price || 0);
      case "hightolow":
        return (b.price || 0) - (a.price || 0);
      default:
        return 1;
    }
  });

  return (
    <>
      <div className="lg:px-[10vw] px-[5vw] pt-[20vh] pb-[10vh]">
        <h1 className="text-6xl font-bold font-playfair">Products</h1>
        <p className="text-xl text-gray-800/60">
          Find all luxury restaurant and food here
        </p>
        <div className="flex flex-row justify-between w-screen lg:w-[80vw] gap-4 ">
          <div className="flex flex-col gap-4 lg:w-[60vw] w-[90vw] py-[4vh]">
            <div className="flex-row flex ">
              <button
                className=" py-3 lg:w-full w-[50vw] px-6 p transition-all duration-300 hover:bg-warning border-r border-gray-800/40 rounded-l-xl bg-gray-400/20"
                onClick={() => setStage(false)}
              >
                Restaurants
              </button>
              <button
                className=" py-3 lg:w-full  w-[50vw] px-6 p transition-all duration-300 hover:bg-warning bg-gray-400/20 rounded-r-xl "
                onClick={() => setStage(true)}
              >
                Foods
              </button>
            </div>
            {!stage ? (
              <div className="flex justify-between lg:w-[80vw] w-[90vw] gap-[4vw] lg:gap-0">
                <RestaurantCard data={finalRestaurant} />
                <RestaurantFilter
                  setFilterType={setFilterType}
                  setSearchText={setSearchText}
                  seachtext={seachtext}
                />
              </div>
            ) : (
              <div className="flex lg:gap-0 gap-9 justify-between lg:w-[80vw] w-[90vw]">
                <Menu data={finalMenu} />
                <FoodFilter
                  setFilterMenu={setFilterMenu}
                  setSearchMenu={setSearchMenu}
                  seachmenu={seachmenu}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Products;
