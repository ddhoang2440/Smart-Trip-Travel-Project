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
  const { restaurants } = useSelector((state) => state.restaurant);
  const [seachtext, setSearchText] = useState("");
  const [filtertype, setFilterType] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  console.log("restaurant ", restaurants);
  const filterRestaurant = restaurants.filter((item) => {
    const keyword = seachtext.toLowerCase();
    const matchesSearch =
      item.name?.toLowerCase().includes(keyword) ||
      item.address?.toLowerCase().includes(keyword);
    let matchesTime = true;
    if (selectedTime) {
      matchesTime =
        item.bookingslots?.some((slot) => slot.time === selectedTime) || false;
    }

    return matchesSearch && matchesTime;
  });
  const finalRestaurant = [...filterRestaurant].sort((a, b) => {
    switch (filtertype) {
      case "lowtohigh":
        return (a.medium_price || 0) - (b.medium_price || 0);
      case "hightolow":
        return (b.medium_price || 0) - (a.medium_price || 0);
      case "ratinglow":
        return (a.rating || 0) - (b.rating || 0);
      case "ratinghigh":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 1;
    }
  });

  return (
    <>
      <div className="lg:px-[10vw] px-[4vw] pt-[14vh] pb-[20vh] bg-indigo-50/10">
        <h1 className="text-6xl font-bold font-playfair">Nhà Hàng</h1>
        <p className="text-xl text-gray-800/60">
          Tìm Kiếm Những Nhà Hàng Tuyệt Đẹp Và Đặt Bàn Trải Nghiệm
        </p>
        <div className="flex flex-row justify-between w-screen lg:w-[80vw] gap-4 ">
          <div className="flex flex-col gap-4 lg:w-[60vw] w-[90vw] py-[2vh]">
            <div className="flex justify-between lg:w-[80vw] w-[90vw] h-full gap-[4vw] lg:gap-[2vw]">
              <RestaurantCard data={finalRestaurant} />
              <RestaurantFilter
                setFilterType={setFilterType}
                setSearchText={setSearchText}
                setSelectedTime={setSelectedTime}
                seachtext={seachtext}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Products;
