import {
  IconHeart,
  IconMapPin,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import React from "react";
import Title from "../components/Title";
import Footer from "../components/Footer";

import { Restaurants } from "../assets/assets";
import Menu from "../components/Menu";
import { useDispatch, useSelector } from "react-redux";
import FoodFilter from "../components/FoodFilter";
import { useEffect } from "react";
import { createComment, getComment } from "../contexts/CommentRedux";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { getRestaurantMenu } from "../contexts/MenuRedux";
import { useParams } from "react-router-dom";
const Restaurant = () => {
  const { restaurantId } = useParams();
  const [content, setContent] = useState("");
  const { currentRestaurant } = useSelector((state) => state.restaurant);
  const { comment } = useSelector((state) => state.comment);
  const { image } = useSelector((state) => state.auth);
  const { restaurantmenu } = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const checkIsOpen = (from, to) => {
    if (!from || !to) return false;
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
    // Chuyển giờ "08:00" thành số phút (8*60 + 0 = 480)
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
  
    const start = parseTime(from);
    const end = parseTime(to);
  
    // Xử lý trường hợp quán mở qua đêm (VD: 22:00 - 02:00)
    if (end < start) {
      return currentMinutes >= start || currentMinutes <= end;
    }
    
    return currentMinutes >= start && currentMinutes <= end;
  };
  
  const isOpenNow = checkIsOpen(currentRestaurant.from, currentRestaurant.to);
  useEffect(() => {
    console.log("Current Restaurant ID:", restaurantId);
    console.log("Sending request with restaurant_id:", {
      restaurant_id: restaurantId,
    });
    dispatch(getComment(restaurantId));
  }, [dispatch, currentRestaurant, restaurantId]);
  useEffect(() => {
    console.log("Current Restaurant ID:", restaurantId);
    console.log("Sending request with restaurant_id:", {
      restaurant_id: restaurantId,
    });
    dispatch(getRestaurantMenu(restaurantId));
    console.log(restaurantmenu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentRestaurant, restaurantId]);

  return (
    <div>
      <div className=" pt-[20vh] pb-[10vh] px-[10vw] bg-indigo-50/40">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-end gap-4">
              <h1 className="font-playfair font-bold  text-2xl lg:text-4xl">
                {currentRestaurant.name}
              </h1>
              <p>{currentRestaurant.type}</p>
              <p className="bg-orange-400 text-white px-2 py-1 rounded-xl">
                20% OFF
              </p>
            </div>
            <div className="flex gap-2">
              {Array(5)
                .fill(1)
                .map((data, idx) => {
                  return (
                    <React.Fragment
                      key={currentRestaurant.name + "rating" + idx}
                    >
                      {idx > currentRestaurant.rating - 1 ? (
                        <IconStar color="orange" />
                      ) : (
                        <IconStarFilled color="orange" />
                      )}
                    </React.Fragment>
                  );
                })}
              <p>{currentRestaurant.review}+ reviews</p>
            </div>
            <span className="flex gap-2 lg-max-w-full max-w-[40vw]">
              <IconMapPin />
              <p>{currentRestaurant.address}</p>
            </span>
            <label className="label">
              Add to Wishlist <IconHeart className="hover:cursor-pointer" />
            </label>
          </div>
          <div className="flex flex-col items-center gap-4">
            {isOpenNow ? (
              <>
                <p className="btn btn-wide text-white btn-success">Opened</p>
              </>
            ) : (
              <>
                <p className="btn btn-wide btn-error text-white">Closed</p>
              </>
            )}
            <p className="badge badge-accent text-white badge-xl">
              Open: {currentRestaurant.from} - {currentRestaurant.to}
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
            <img className="rounded-2xl p shadow-xl" src={"bg.jpg"} alt="" />
            <img className="rounded-2xl p shadow-xl" src={"bg.jpg"} alt="" />
            <img className="rounded-2xl p shadow-xl" src="/bg.jpg" alt="" />
            <img className="rounded-2xl p shadow-xl" src="/bg.jpg" alt="" />
          </div>
        </div>
        <div className="lg:flex justify-between  py-4 border-b border-gray-300">
          <div className="gap-4">
            <p className="text-3xl font-playfair font-semibold">
              Experience Luxury Like Never Before
            </p>
          </div>
          <p className="text-3xl font-bold p">
            Average {currentRestaurant.medium_price}$/ Meal
          </p>
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
      <div className="lg:px-[10vw] px-[4vw] py-[12vh]">
        <Title
          Title="Menu"
          Decription={"Found my restaurant food here"}
          align={"center"}
        />
        <div className="flex flex-row justify-between relative">
          <Menu data={restaurantmenu || []} />
          <FoodFilter />
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
            src={image || null}
            alt=""
          />
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment ..."
            className="focus:border-black border-b border-gray-300 focus:border-b-2 focus:outline-0  text-lg transition-all duration-100 w-full px-4 py-2"
          ></input>
        </div>
        <div className="flex justify-end gap-4 ">
          <button
            onClick={async () => {
              await dispatch(
                createComment({ restaurant_id: currentRestaurant._id, content })
              ).unwrap();
              dispatch(getComment(currentRestaurant._id));
              setContent("");
            }}
            className="btn btn-primary rounded-lg p"
          >
            Comment
          </button>
        </div>
        <div className="flex px-[2vw] flex-col gap-8 mt-[1vh]">
          {comment.map((cmt, idx) => {
            return (
              <div
                key={cmt._id + idx}
                className="flex flex-row gap-4 items-center"
              >
                <img
                  className="w-[3vw] h-[3vw] rounded-full"
                  src={image || null}
                  alt=""
                />
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2">
                    <h1 className="font-bold">@{cmt.user_id.username}</h1>
                    <p>
                      {formatDistanceToNow(new Date(cmt.createdAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>
                  </div>
                  <p className="text-xl border-b-2 border-dotted">
                    {cmt.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Restaurant;
