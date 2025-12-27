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
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import SimpleMap from "../components/simpleMap";
import { formatPrice } from "../components/ultil";
import { createBooking } from "../contexts/BookingRedux";
import { setCurrent } from "../contexts/ResRedux";

const Restaurant = () => {
  const [idx, setIdx] = useState(0);

  const { currentRestaurant } = useSelector((state) => state.restaurant);
  const { comment } = useSelector((state) => state.comment);
  const { restaurantmenu } = useSelector((state) => state.menu);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentRestaurant.length > 0 && currentRestaurant) {
      const data = JSON.parse(localStorage.getItem("currentRestaurant"));
      dispatch(setCurrent(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getComment({ restaurant_id: currentRestaurant?._id }));
  }, [dispatch, currentRestaurant]);
  useEffect(() => {
    dispatch(getRestaurantMenu({ restaurant_id: currentRestaurant._id }));
    console.log(restaurantmenu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              <p className="hidden lg:block bg-orange-400 text-white px-2 py-1 rounded-xl">
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
          <div className="lg:w-[55%]  grid grid-cols-1 lg:grid-cols-2  gap-6">
            <img
              className="rounded-2xl p shadow-xl h-[25vh]"
              src={currentRestaurant?.images?.[0]}
              alt=""
              onClick={() => setIdx(0)}
            />
            <img
              className="rounded-2xl p shadow-xl h-[25vh]"
              src={currentRestaurant?.images?.[1]}
              alt=""
              onClick={() => setIdx(1)}
            />
            <img
              className="rounded-2xl p shadow-xl h-[25vh] w-full"
              src={currentRestaurant.images?.[2]}
              alt=""
              onClick={() => setIdx(2)}
            />
            <img
              className="rounded-2xl p shadow-xl h-[25vh] w-full"
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
          <p className="text-2xl lg:text-3xl font-bold p">
            Trung Bình: <br></br>{" "}
            {formatPrice(
              Number(
                restaurantmenu.reduce((a, b) => {
                  return a + (b.price || 0);
                }, 0) / restaurantmenu.length
              ).toFixed(0)
            )}
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
                {currentRestaurant?.bookingslots?.map((item) => (
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
            className="btn btn-primary text-white btn-lg btn-wide"
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
