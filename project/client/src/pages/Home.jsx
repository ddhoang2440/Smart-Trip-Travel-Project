import {
  Icon12Hours,
  IconArrowRight,
  IconArrowRightBar,
  IconBellFilled,
  IconChartDonutFilled,
  IconChefHat,
  IconCurrencyDollar,
  IconMapPin,
  IconMapPinFilled,
  IconMichelinStar,
  IconPlayCard1Filled,
  IconSearch,
} from "@tabler/icons-react";
import React from "react";
import Title from "../components/Title";
import Cards from "../components/Cards";
import CardFood from "../components/RestaurantCard";
import Footer from "../components/Footer";
import AvatarCard from "../components/AvatarCard";
import PhoneSearch from "../components/PhoneSearch";
import RestaurantCard from "../components/RestaurantCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate();
  const {popularRestaurant} = useSelector((state) => state.restaurant);
  return (
    <>
      <div className="absolute w-full h-screen bg-linear-to-r from-black/40 to-black/0"></div>
      <div
        className={`bg-cover w-full h-screen bg-[url(/bg2.jpg)] flex flex-col gap-4 bg-linear-to-b from-black/90 to-black/40`}
      >
        <div className="lg:pt-[22vh] pt-[18vh] pb-[16vh] pl-[12vw] mt-[4vh] ">
          <p className="text-[2vh] relative z-30 text-white bg-blue-400/40 rounded-xl px-4 w-fit p-2">
            The Ultimate Restaurants Experience !
          </p>
          <h1 className="label relative z-30 font-ro font-playfair lg:text-[8vh] text-6xl max-w-[70vw] text-white lg:max-w-[50vw] text-wrap">
            Discover Your Perfect Restaurants and Foods
          </h1> 
          <p className="text-[2vh] relative z-30 text-white mt-[2vh] ml-2">
            Nhanh chóng, tiện lợi - khám phá các món ăn gần bạn chỉ trong vài
            giây
          </p>
          <div className="bg-white  relative z-30 lg:flex hidden flex-row items-center w-fit py-5 px-12 rounded-2xl lg:gap-14 gap-8 mt-[4vh]">
            <div className="flex flex-col gap-2">
              <div className="flex gap-1">
                <IconMichelinStar />
                Type
              </div>

              <select defaultValue={"Choose Type"} className="select">
                <option value={"Choose Type"} disabled>
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
              <select defaultChecked="Food Region" className="select">
                <option value={"Food Region"} disabled>
                  Food Region
                </option>
                <option>Eastern</option>
                <option>Western</option>
              </select>
            </div>
            <div className="flex gap-2 flex-col">
              <div className="flex gap-1">
                <IconMapPin />
                City
              </div>
              <div>
                <select defaultValue="Your City" className="select">
                  <option value="Your City" disabled>
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
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    className="input w-[6vw]"
                    step="1"
                  />
                  <p>$</p>
                </div>
              </div>
            </div>
            <button onClick={() => navigate("/restaurant")} className="flex btn btn-neutral btn-lg">
              <IconSearch />
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="">
        <div className="bg-white lg:px-[14vw] px-[6vw] py-[10vh] lg:py-[16vh]">
          <Title
            Title="Featured Restaurant!"
            align="center"
            Decription="Discover one of the city's most talked-about restaurants — where every dish tells a story and every visit feels like a celebration. Known for its vibrant atmosphere and top-tier cuisine"
          />
          <div className="flex justify-center">
            <RestaurantCard data={popularRestaurant} />
          </div>
          <div className="flex justify-center mt-[4vh]">
            <button className="btn btn-wide btn-error text-white btn-lg">
              View All
            </button>
          </div>
        </div>
        <div className="bg-yellow-700/10 lg:px-[14vw] px-[6vw] py-[10vh] lg:py-[16vh]">
          <Title
            Title="Popular Food"
            Decription="Dive into the delicious world of Popular Food! From sizzling street snacks to iconic global dishes, discover what people around the world crave most"
            align="center"
          />
          <div className="flex justify-center">
            <CardFood data={popularRestaurant} />
          </div>
          <div className="flex justify-center mt-[4vh]">
            <button className="btn btn-wide btn-neutral text-white btn-lg">
              View All
            </button>
          </div>
        </div>
        <div className=" lg:px-[14vw] lg:py-[12vh] bg-purple-200/10 py-[6vh] px-[2vh]">
          <div className="flex flex-row justify-between items-center ">
            <Title
              Title="Search By Food Type"
              Decription="Discover delicious dishes by selecting your favorite food type."
              align="left"
            />
            <button className="lg:flex hidden btn btn-lg btn-warning text-white mr-[2vw] ">
              View All <IconArrowRight />
            </button>
          </div>
          <AvatarCard />
        <div className="flex justify-center">
            <button className="btn btn-wide lg:hidden flex btn-neutral text-white btn-lg">
              View All
            </button>
        </div>
        </div>
        <div className="px-[14vw] py-[16vh] bg-linear-to-b from-white to-warning flex flex-col items-center justify-center gap-[8vh]">
          <h1 className="text-warning lg:text-6xl text-4xl font-bold ">
            How does it work ?
          </h1>
          <div className="lg:flex grid grid-cols-2 flex-row gap-24">
            <div className="flex flex-col gap-4 items-center">
              <IconMapPinFilled size={108} color="orange" />
              <b className="text-lg lg:text-2xl text-center">Select Location</b>
              <p className="lg:max-w-[12vw] max-w-[30vw] text-center text-white text-sm lg:text-xl">
                Choose the Location where your food will be delivered
              </p>
            </div>
            <div className="flex flex-col gap-4 items-center">
              <IconBellFilled size={108} color="orange" />
              <b className="lg:text-2xl text-lg text-center  max-w-[20vw] lg:max-w-[100vw]">Choose Order</b>
              <p className="max-w-[30vw] lg:max-w-[12vw] text-center text-white text-sm lg:text-xl">
                Check over hundreds of menus to pick your favourite food
              </p>
            </div>
            <div className="flex flex-col gap-4 items-center">
              <IconPlayCard1Filled size={108} color="orange" />
              <b className="text-lg lg:text-2xl text-center">Pay Advanceed</b>
              <p className="max-w-[30vw] lg:max-w-[12vw] text-center text-white text-sm lg:text-xl">
                It's quick safe and simple. Select several methods of payment
              </p>
            </div>
            <div className="flex flex-col gap-4 items-center">
              <IconChartDonutFilled size={108} color="orange" />
              <b className="text-lg lg:text-2xl max-w-[20vw] lg:max-w-[100vw]  text-center">Enjoys Meal</b>
              <p className="max-w-[30vw] lg:max-w-[12vw] text-center text-white text-sm lg:text-xl">
                Food is made and delivery directly to your home
              </p>
            </div>
          </div>
        </div>
        <div className="lg:px-[14vw] px-[4vw] bg-yellow-700/10 py-[8vh] lg:py-[16vh] ">
          <div className="bg-white shadow-gray rounded-box w-full flex flex-col lg:flex-row mb-[10vh] max-h-[60vh]">
            <div className="lg:flex hidden flex-col justify-between lg:px-16 px-4 py-8 lg:gap-0 gap-2 lg:w-2/5 w-full  items-center">
              <div className="flex flex-col gap-5 lg:mt-16">
                <p className="text-xl lg:text-5xl font-bold">
                  Món Tây:
                  <span className="text-warning"> Crispy Sanwiches</span>{" "}
                </p>
                <p className="text-sm lg:text-xl text-neutral-400">
                  Thưởng thức sandwich cỡ lớn, những lát cắt hoàn hảo cho từng
                  chiếc bánh
                </p>
              </div>
              <button className="btn lg:btn-wide btn-sm btn-warning lg:btn-lg text-white">
                PROCESS TO ORDER <IconArrowRightBar color="white" />
              </button>
            </div>
            <img className="lg:w-3/5 w-full rounded-box" src="/sandwitch.jpg" alt="" />
          </div>
          <div className="bg-white shadow-gray rounded-box w-full max-h-[60vh] flex flex-row mb-[10vh]">
            <img
              className="w-full lg:w-3/5 rounded-box"
              src="https://cdn.pixabay.com/photo/2020/09/26/02/08/banh-xeo-5602960_960_720.jpg"
              alt=""
            />

            <div className="hidden lg:flex flex-col justify-between lg:px-16 px-4 py-8  lg:gap-0 gap-2 w-2/5 items-center">
              <div className="flex flex-col gap-5 lg:mt-16">
                <p className="text-xl lg:text-5xl font-bold">
                  {" "}
                  Đặc Biệt{" "}
                  <span className="text-warning">Bánh Xèo Giòn Rụm</span>{" "}
                </p>
                <p className="text-sm lg:text-xl text-neutral-400">
                  Thưởng thức bánh xèo cỡ lớn, giòn tan từng miếng. Hoàn hảo từ
                  lớp vỏ đến nhân đầy đặn – món ăn khiến bạn phải xuýt xoa từng
                  lần cắn!
                </p>
              </div>
              <button className="btn lg:btn-wide btn-sm btn-warning lg:btn-lg text-white">
                PROCESS TO ORDER <IconArrowRightBar color="white" />
              </button>
            </div>
          </div>
          <div className="bg-white shadow-gray rounded-box w-full max-h-[60vh] flex flex-row mb-[2vh] lg:mb-[10vh]">
            <div className="hidden lg:flex flex-col justify-between lg:px-16 px-4 py-8 lg:gap-0 gap-2 w-2/5 items-center">
              <div className="flex flex-col gap-5 lg:mt-16">
                <p className="text-xl lg:text-5xl font-bold">
                  {" "}
                  Miền Tây{" "}
                  <span className="text-warning">
                    Bún Nước Lèo – Trọn Vị Miền Tây
                  </span>{" "}
                </p>
                <p className="text-sm lg:text-xl text-neutral-400">
                  Tô bún nóng hổi, đậm đà hương vị đặc trưng. Sợi bún mềm mại
                  hòa quyện cùng nước lèo thơm ngon – một trải nghiệm ẩm thực
                  không thể bỏ qua!
                </p>
              </div>
              <button className="btn lg:btn-wide btn-sm btn-warning lg:btn-lg text-white">
                PROCESS TO ORDER <IconArrowRightBar color="white" />
              </button>
            </div>
            <img
              className="w-full lg:w-3/5 rounded-box"
              src="https://mia.vn/media/uploads/blog-du-lich/bun-nuoc-leo-soc-trang-dam-da-huong-vi-am-thuc-tay-nam-bo-01-1664031706.jpeg"
              alt=""
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
