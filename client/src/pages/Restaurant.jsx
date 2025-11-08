import {
  IconBed,
  IconEggFried,
  IconHeart,
  IconMapPin,
  IconSearch,
  IconStar,
  IconStarFilled,
  IconThumbDown,
  IconThumbUp,
  IconWifi,
} from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import Title from "../components/Title";
import CardFood from "../components/CardFood";
import Footer from "../components/Footer";

import { Restaurants } from "../assets/assets";
import Menu from "../components/Menu";
const rt = Restaurants.restaurant;

const Restaurant = () => {
  const [value, setValue] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  let formatted = useRef("");

  useEffect(() => {
    formatted.current = value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }, [value]);

  return (
    <div>
      <div className=" pt-[20vh] pb-[10vh] px-[10vw] bg-indigo-50/40">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-end gap-4">
              <h1 className="font-playfair font-bold text-4xl">{rt.name}</h1>
              <p>{rt.type}</p>
              <p className="bg-orange-400 text-white px-2 py-1 rounded-xl">
                20% OFF
              </p>
            </div>
            <div className="flex gap-2">
              {Array(5)
                .fill(1)
                .map((data, idx) => {
                  return (
                    <>
                      {idx > 3 ? (
                        <IconStar color="orange" />
                      ) : (
                        <IconStarFilled color="orange" />
                      )}
                    </>
                  );
                })}
              <p>200+ reviews</p>
            </div>
            <span className="flex gap-2">
              <IconMapPin />
              <p>{rt.details.address}</p>
            </span>
            <label className="label">
              Add to Wishlist <IconHeart className="hover:cursor-pointer" />
            </label>
          </div>
          <div className="flex flex-col items-center gap-4">
            {!rt.details.opening_hours.currently_open ? (
              <>
                <p className="btn btn-wide text-white btn-success">Opened</p>
              </>
            ) : (
              <>
                <p className="btn btn-wide btn-error text-white">Closed</p>
              </>
            )}
            <p className="badge badge-accent text-white badge-xl">
              Open: {rt.details.opening_hours.from} -{" "}
              {rt.details.opening_hours.to}
            </p>
          </div>
        </div>

        <div className="flex flex-row gap-8 py-8">
          <img
            className="w-[45%] hidden lg:block rounded-2xl fade-in"
            src="/bg.jpg"
            alt=""
          />
          <div className="lg:w-[55%] grid grid-cols-2 gap-6">
            <img className="rounded-2xl p shadow-xl" src="/bg.jpg" alt="" />
            <img className="rounded-2xl p shadow-xl" src="/bg.jpg" alt="" />
            <img className="rounded-2xl p shadow-xl" src="/bg.jpg" alt="" />
            <img className="rounded-2xl p shadow-xl" src="/bg.jpg" alt="" />
          </div>
        </div>
        <div className="lg:flex justify-between  py-4 border-b border-gray-300">
          <div className="gap-4">
            <p className="text-3xl font-playfair font-semibold">
              Experience Luxury Like Never Before
            </p>
            <div className="flex flex-row py-6 items-center gap-2 flex-wrap text-sm p-child">
              <span className="flex flex-row gap-2 bg-gray-300/50 px-3 rounded-xl py-2 ">
                <IconWifi />
                <p>free wifi</p>
              </span>
              <span className="flex flex-row gap-2 bg-gray-300/50 px-3 rounded-xl py-2">
                <IconEggFried />
                <p>free breakfast</p>
              </span>
              <span className="flex flex-row gap-2  bg-gray-300/50 px-3 rounded-xl py-2">
                <IconBed />
                <p>Table Booking</p>
              </span>
            </div>
          </div>
          <p className="text-3xl font-bold p">Average 100$/ Meal</p>
        </div>
        <div className="flex lg:flex-row flex-col gap-4 lg:gap-0 justify-between bg-white rounded-xl shadow-gray px-8 py-8 my-12">
          <div className="flex lg:flex-row flex-col lg:gap-12 gap-6 justify-center lg:items-center">
            <span className="lg:border-r border-gray-400 lg:px-12">
              <p>Check-in</p>
              <input type="date" />
            </span>
            <span className="lg:border-r border-gray-400 lg:px-12">
              <p>Check-out</p>
              <input type="date" />
            </span>
            <span className="lg:px-12">
              <p>Guests</p>
              <p>guest</p>
            </span>
            <div className="lg:flex gap-2 px-6 hidden">
              <button className="text-xl border px-2 p">-</button>
              <button className="text-xl border px-2 p">+</button>
            </div>
          </div>
          <button className="btn btn-primary text-white btn-lg btn-wide">
            Check Availability
          </button>
        </div>
      </div>
      <div className="px-[10vw] py-[12vh]">
        <Title
          Title="Menu"
          Decription={"Found my restaurant food here"}
          align={"center"}
        />
        <div className="flex flex-row justify-between relative">
          <Menu data={rt.details.menu} />
          <div className="flex flex-col gap-4  py-[2vh] mt-[6vh] top-[16%] l-0  w-[16vw] rounded-lg px-[1.5vw] h-fit border">
            <h1 className="text-3xl font-bold text-accent py-2 border-b border-gray-300/60">
              Filter
            </h1>
            <label className="input input-warning">
              <IconSearch />
              <input type="text" placeholder="Search Product" />
            </label>
            <div className="flex flex-col gap-4 border-b border-gray-300/60">
              <h1 className="text-xl">Price</h1>
              <input
                type="range"
                min={0}
                max="1000000"
                value={value}
                className="range"
                step="20000"
                onChange={(e) => setValue(e.target.value)}
              />
              <p>{formatted.current}đ</p>
            </div>
            <div className="flex flex-col gap-6 py-2">
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
            <div className="flex flex-col gap-6 py-2">
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
        </div>
        <div className="flex justify-center">
          <button className="btn lg:w-[16vw] btn-warning text-white btn-lg ">
            View More
          </button>
        </div>
      </div>
      <div className="px-[12vw] pb-[8vh] pt-[4vh] flex flex-col gap-4">
        <h1 className="text-4xl font-bold font-playfair">
          View customer Commnent
        </h1>
        <p>Comment Count</p>
        <div className="flex flex-row gap-2 items-center">
          <img
            className="w-[3vw] h-[3vw] rounded-full"
            src="/pizza.jpg"
            alt=""
          />
          <input
            onFocus={() => setIsFocused(true)}
            placeholder="Add a comment ..."
            className="focus:border-black focus:border-b-2 focus:outline-0  text-lg transition-all duration-100 w-full px-4 py-2"
          ></input>
        </div>
        {isFocused && (
          <div className="flex justify-end gap-4 ">
            <button
              onClick={() => setIsFocused(false)}
              className="px-3 py-1 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button className="btn btn-primary rounded-lg p">Comment</button>
          </div>
        )}
        <div className="flex px-[2vw] flex-col gap-8 mt-[4vh]">
          {Array(3)
            .fill(1)
            .map(() => {
              return (
                <>
                  <div className="flex flex-row gap-4 ">
                    <img
                      className="w-[3vw] h-[3vw] rounded-full"
                      src="/pizza.jpg"
                      alt=""
                    />
                    <div className="flex flex-col gap-1">
                      <p className="bg-">@name</p>
                      <p
                        className={`text-gray-800 transition-all ${
                          isExpanded ? "line-clamp-none" : "line-clamp-2"
                        }`}
                      >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestias corrupti dolore modi est quidem ad, autem
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        At, velit dignissimos totam enim sint quidem ad eveniet
                        praesentium? Alias, fugit? Lorem ipsum dolor sit amet
                        consectetur adipisicing elit. Ex, temporibus?{" "}
                      </p>
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-1 flex text-gray-500 hover:underline font-medium"
                      >
                        {isExpanded ? "Thu gọn" : "Đọc thêm"}
                      </button>
                      <div className="flex gap-4 items-center">
                        <button className="flex gap-1 items-center">
                          <IconThumbUp />
                          <span> 12</span>
                        </button>
                        <button>
                          <IconThumbDown />
                        </button>
                        <button
                          onClick={() => setShowReply(!showReply)}
                          className="py-2 px-3 rounded-full hover:bg-gray-300 transition"
                        >
                          Reply
                        </button>
                      </div>
                      {showReply && (
                        <div className="mt-2 flex flex-col gap-2">
                          <div className="flex flex-row gap-2 items-center">
                            <img
                              className="w-[3vw] h-[3vw] rounded-full"
                              src="/pizza.jpg"
                              alt=""
                            />
                            <input
                              placeholder="Add a comment..."
                              className="focus:border-black focus:border-b-2 focus:outline-0 text-lg transition-all duration-100 w-full px-4 py-2"
                            />
                          </div>

                          <div className="flex justify-end gap-4">
                            <button
                              onClick={() => setShowReply(false)}
                              className="px-3 py-1 rounded-lg hover:bg-gray-200 transition"
                            >
                              Cancel
                            </button>
                            <button
                              onMouseOver={() => (this.style.color = "red")}
                              className="btn btn-primary rounded-lg p"
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Restaurant;
