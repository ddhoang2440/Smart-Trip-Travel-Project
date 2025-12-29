/* eslint-disable react-hooks/exhaustive-deps */
import {
  IconHeart,
  IconMapPin,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import React from "react";
import Title from "../components/Title";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getComment } from "../contexts/CommentRedux";
import { useState } from "react";
import { getRestaurantMenu } from "../contexts/MenuRedux";
import SimpleMap from "../components/simpleMap";
import { formatPrice } from "../components/ultil";
import { createBooking } from "../contexts/BookingRedux";
import { getRestaurantById,  setOpen } from "../contexts/ResRedux";
import { useParams } from "react-router-dom";

const Restaurant = () => {
  const [idx, setIdx] = useState(0);
  const { restaurant_id } = useParams()
  const { currentRestaurant } = useSelector((state) => state.restaurant);
  const { comment } = useSelector((state) => state.comment);
  const { restaurantmenu } = useSelector((state) => state.menu);
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(getRestaurantById(restaurant_id));
  }, []);

  useEffect(() => {
    dispatch(getComment({ restaurant_id: currentRestaurant?._id }));
  }, [dispatch, currentRestaurant]);
  useEffect(() => {
    dispatch(getRestaurantMenu({ restaurant_id: currentRestaurant._id }));
    console.log(restaurantmenu);
  }, []);
  useEffect(() => {
    if (currentRestaurant && currentRestaurant._id) {
      setFormData((prev) => ({
        ...prev,
        restaurant_id: currentRestaurant._id,
        slot_id: currentRestaurant.bookingslots?.[0]?._id || "",
      }));
    }
  }, [currentRestaurant]);
  useEffect(() => {
    const openState = setInterval(() => {
      const currentDate = new Date();
      const from = currentRestaurant.from.split(':');
      const to = currentRestaurant.to.split(':');
      console.log("runn");
      if ((from[0] > currentDate.getHours() && from[1] > currentDate.getMinutes()) || (to[0] < currentDate.getHours() && to[1] < currentDate.getMinutes())) {
        dispatch(setOpen({ state: false }))
      }
      else dispatch(setOpen({ state: true }))
    }, 10000);
    return () => clearInterval(openState)
  }, [])
  const [formdata, setFormData] = useState({
    booking_date: "",
    restaurant_id: currentRestaurant?._id,
    slot_id: currentRestaurant?.bookingslots?.[0]?._id || "",
    quantity: 1,
    table: 2,
  });

  const handlechange = ({ key, value }) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    console.log(formdata);
  };
  if (!currentRestaurant) {
    return <div>loading...</div>;
  }
  const today = new Date();

  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 1);

  const maxStr = maxDate.toISOString().split("T")[0];
  console.log("comment", comment);
  return (
    <div>
      <div className=" pt-[20vh] pb-[10vh] px-[10vw] bg-indigo-50/40">
        <div className="flex flex-col lg:flex-row justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-end   gap-4">
              <h1 className="font-playfair font-bold  text-2xl lg:text-4xl">
                {currentRestaurant.name}
              </h1>
              <p className="badge badge-dash">{currentRestaurant.type}</p>
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
              <p>{currentRestaurant.review}+ reviews </p>
            </div>
            <span className="flex lg:pb-0 pb-6 gap-2 lg-max-w-full lg:max-w-[40vw]">
              <IconMapPin />
              <p className="text-sm">{currentRestaurant.address}</p>
            </span>
          </div>
          <div className="flex flex-col items-center gap-4">
            {currentRestaurant.open ? (
              <>
                <p className="btn btn-wide text-white btn-success">
                  Đang Mở Cửa
                </p>
              </>
            ) : (
              <>
                <p className="btn btn-wide btn-error text-white">Đóng Cửa</p>
              </>
            )}
            <p className="badge badge-accent text-white badge-xl">
              Mở cửa từ: {currentRestaurant.from} - {currentRestaurant.to}
            </p>
          </div>
        </div>

        <div className="flex flex-row gap-8 py-8">
          <img
            className="w-[55%] max-h-[54vh] hidden lg:block rounded-2xl fade-in"
            src={currentRestaurant?.images?.[idx]}
            alt=""
          />
          <div className="lg:w-[55%]  grid grid-cols-2 lg:grid-cols-2  gap-6">
            <img
              className="rounded-2xl p shadow-xl w-full lg:w-auto h-[13vh] lg:h-[25vh]"
              src={currentRestaurant?.images?.[0]}
              alt=""
              onClick={() => setIdx(0)}
            />
            <img
              className="rounded-2xl p shadow-xl w-full h-[13vh] lg:w-auto lg:h-[25vh]"
              src={currentRestaurant?.images?.[1]}
              alt=""
              onClick={() => setIdx(1)}
            />
            <img
              className="rounded-2xl p shadow-xl w-full h-[13vh] lg:w-full  lg:h-[25vh]"
              src={currentRestaurant.images?.[2]}
              alt=""
              onClick={() => setIdx(2)}
            />
            <img
              className="rounded-2xl p shadow-xl w-full h-[13vh]  lg:h-[25vh]"
              src={currentRestaurant.images?.[3]}
              alt=""
              onClick={() => setIdx(3)}
            />
          </div>
        </div>
        <div className="lg:flex lg:flex-row flex-col justify-between  py-4 border-b border-gray-300">
          <div className="gap-4">
            <p className="text-xl lg:text-3xl font-playfair font-semibold">
              Mang Đến Những Trải Nghiệm Bất Ngờ
            </p>
          </div>
          <p className="text-xl lg:text-3xl font-bold p">
            Trung Bình: {formatPrice(currentRestaurant.medium_price)}
            đ/ Bữa Ăn
          </p>
        </div>
        <div className="flex lg:flex-row flex-col gap-4 lg:gap-0 justify-between bg-white rounded-xl shadow-gray px-8 py-8 my-12">
          <div className="flex lg:flex-row flex-col lg:gap-12 gap-6 justify-center lg:items-center">
            <span className="lg:border-r border-gray-400 lg:px-12">
              <p>Ngày Đặt Bàn</p>
              <input
                type="date"
                value={formdata.booking_date}
                min={new Date().toISOString().split("T")[0]}
                max={maxStr}
                onChange={(e) =>
                  handlechange({ key: "booking_date", value: e.target.value })
                }
              />
            </span>
            <span className="lg:border-r flex flex-row lg:gap-4 lg:justify-normal justify-between items-center border-gray-400 lg:px-12">
              <p>Giờ</p>
              <select
                onChange={(e) =>
                  handlechange({ key: "slot_id", value: e.target.value })
                }
                className="select lg:w-auto w-[40vw]"
              >
                <option>--:--</option>
                {currentRestaurant?.slot_id?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.time}
                  </option>
                ))}
              </select>
            </span>
            <span className="lg:px-4 flex flex-row items-center lg:gap-4 lg:justify-normal justify-between">
              <p className="lg:w-[6vw] w-[20vw]">Loại Bàn</p>
              <select
                onChange={(e) =>
                  handlechange({ key: "table", value: e.target.value })
                }
                className="select lg:w-auto w-[40vw]"
                name=""
                id=""
              >
                <option value={2}>2 người</option>
                <option value={4}>4 người</option>
                <option value={8}>8 người</option>
              </select>
            </span>
            <div className="lg:flex lg:px-6 flex flex-row items-center lg:gap-4 justify-between ">
              <p>Số Bàn</p>
              <input
                value={formdata.quantity}
                onChange={(e) =>
                  handlechange({ key: "quantity", value: e.target.value })
                }
                type="number"
                className="border border-gray-300 lg:w-auto w-[40vw] rounded-lg py-2 px-2 lg:max-w-[2vw]"
              />
            </div>
          </div>
          <button
            className="btn btn-primary text-white lg:w-[20vw] lg:btn-lg w-full"
            onClick={() => dispatch(createBooking(formdata))}
          >
            Kiểm Tra Đặt Bàn
          </button>
        </div>
      </div>
      <div className="px-[10vw] py-[6vh] w-full flex justify-center relative z-0">
        <SimpleMap
          center={[
            currentRestaurant?.location?.coordinates[1],
            currentRestaurant?.location?.coordinates[0],
          ]}
        />
      </div>
      <div className="lg:px-[10vw] pb-[8vh] ">
        <Title Title="Menu" Decription={""} align={"center"} />
        <Menu data={restaurantmenu} />
      </div>
      <div className="px-[12vw] pb-[8vh] pt-[4vh] flex flex-col gap-4">
        <h1 className="text-4xl font-bold font-playfair">
          Bình Luận Và Đánh Giá
        </h1>
        <div className="px-[4vw] py-[2vh] flex flex-col gap-[3vh] ">
          {comment.map((item) => (
            <div key={item._id} className="flex flex-row gap-4 ">
              <img
                className="rounded-full w-[4vw] h-[4vw]"
                src={
                  item?.user_id?.image ||
                  "https://cdn-icons-png.freepik.com/512/6858/6858504.png"
                }
                alt=""
              />
              <div className="flex flex-col gap-2 pt-4 ">
                <p>@{item?.user_id?.username}</p>
                <div className="flex gap-1">
                  {Array(5)
                    .fill(1)
                    .map((data, idx) => {
                      return (
                        <React.Fragment key={item._id + "rating" + idx}>
                          {idx > item.rating - 1 ? (
                            <IconStar size={16} color="orange" />
                          ) : (
                            <IconStarFilled size={16} color="orange" />
                          )}
                        </React.Fragment>
                      );
                    })}
                </div>
                <p>{item?.createdAt.split("T")[0]}</p>
                <p>{item?.content}</p>
                <div className="flex flex-row gap-2">
                  {item?.images.map((img) => (
                    <img
                      className="max-w-[16vw] "
                      key={"images" + item?._id}
                      src={img}
                      alt=""
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Restaurant;
