import React, { useState } from "react";
import { Restaurants } from "../assets/assets";
import { formatPrice } from "./ultil";
import {
  IconAdjustments,
  IconBuildingWarehouse,
  IconClipboard,
  IconClockDown,
  IconClockUp,
  IconCurrencyDollar,
  IconDeviceMobile,
  IconMapPin,
  IconShoppingCartDollar,
  IconStar,
  IconStarFilled,
  IconThumbDown,
  IconThumbUp,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { useSelector } from "react-redux";

const MyRestaurant = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReply, setShowReply] = useState(false);

  const { userRestaurant } = useSelector((state) => state.restaurant)
  
  const { usermenu } = useSelector((state) => state.menu);
  const { username } = useSelector((state) => state.auth)

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between">
          <h1 className="text-4xl font-playfair">{userRestaurant[0]?.name}</h1>
          <button className="px-3 py-2 bg-green-600 hover:bg-green-600/80 rounded-3xl text-white">
            Đang mở
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-green-100 p-4 rounded-lg text-center shadow">
            <h2 className="text-2xl font-bold text-green-600">100</h2>
            <p>Đơn đã giao</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg text-center shadow">
            <h2 className="text-2xl font-bold text-yellow-600">20</h2>
            <p>Đơn đang xử lý</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg text-center shadow">
            <h2 className="text-2xl font-bold text-red-600">10</h2>
            <p>Đơn đã hủy</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between">
            <h2 className="text-3xl font-playfair">Thông tin</h2>
            <button className="px-3 py-2 rounded-3xl bg-warning hover:bg-warning/80 active:scale-95">
              Chỉnh sửa
            </button>
          </div>
          <div className="flex flex-col gap-3 pb-1">
            <label className="label text-black font-serif">
              <IconBuildingWarehouse /> Tên Nhà Hàng
            </label>
            <input
              value={userRestaurant[0]?.name}
              type="text"
              placeholder="Restaurant Name"
              className="input w-full text-gray-800/80 outline-0"
            />
          </div>
          <div className="flex flex-col gap-3  pb-1">
            <label className="label text-black font-serif">
              <IconUser /> Owner
            </label>

            <div className="flex gap-2 ">
              <input
                value={username}
                type="text"
                placeholder="First Name"
                className="input w-full text-gray-800/80 outline-0"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3  pb-1">
            <label className="label text-black font-serif">
              <IconDeviceMobile />
              Phone Number
            </label>
            <input
              type="text"
              placeholder="Phone Number"
              className="input w-full text-black outline-0"
            />
          </div>

          <div className="flex flex-col gap-3  pb-1">
            <label className="label text-black font-serif">
              <IconShoppingCartDollar />
              Average Price
            </label>
            <input
              value={userRestaurant[0]?.medium_price}
              type="number"
              placeholder="Name"
              className="input w-full text-black outline-0"
            />
          </div>
          <div className="flex flex-col gap-3  pb-1">
            <div className="flex justify-between">
              <label className="label w-full text-black font-serif">
                <IconClockUp />
                Opening Time
              </label>
              <label className="label w-full text-black font-serif">
                <IconClockDown />
                Closing Time
              </label>
            </div>
            <div className="flex gap-3 w-full justify-between">
              <input
                value={userRestaurant[0]?.from}
                type="time"
                className="w-full input text-black outline-0 "
              />
              <input
                value={userRestaurant[0]?.to}
                type="time"
                className="input w-full text-black outline-0"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3  pb-1">
            <label className="label text-black font-serif">
              <IconMapPin />
              Location
            </label>
            <input
              value={userRestaurant[0]?.address}
              type="text"
              className="input w-full text-black outline-0"
            />
          </div>
          <div className="flex flex-col gap pb-1">
            <label className="label text-black font-serif">
              <IconClipboard />
              Description
            </label>
            <textarea
              value={userRestaurant[0]?.description}
              type="text"
              placeholder="Description"
              className="textarea w-full text-gray-800/80 outline-0"
            />
          </div>
        </div>
        <div className="py-4">
          <div className="flex gap-4 justify-between">
            <h3 className="text-4xl font-playfair ">Menu</h3>
            </div>
          {usermenu
            .map((data,idx) => {
              return (
                <React.Fragment key={data._id + idx}>
                  <div>
                    <div className="grid grid-cols-[1fr_auto_auto_auto_auto] w-full border-b border-gray-500/40 py-4 px-4 items-center">
                      <div className="flex gap-4 items-center min-w-0">
                        <img
                          className="size-[3vw]  rounded-ful object-cover rounded-full"
                          src={data.image}
                          alt=""
                        />
                        <p className="w-[10vw] text-lg font-semibold truncate">
                          {data.name}
                        </p>
                        <div className="text-lg text-center w-[20vw]">
                          {formatPrice(data.price)}đ
                        </div>
                        <div className=" py-1 text-center text-sm bg-gray-600/30 rounded-3xl flex-1">
                          còn hàng
                        </div>
                        <div className="flex justify-center w-[5vw] gap-4">
                          <div className="p-2 bg-blue-600/30 rounded-3xl">
                            <IconAdjustments className="cursor-pointer" />
                          </div>

                          <div className="p-2 bg-red-600/30 rounded-3xl">
                            <IconX className="cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
        </div>

        <div>
          <div className="pt-[4vh] flex flex-col gap-4 ">
            <h1 className="text-4xl font-bold font-playfair">
              View customer Commnent
            </h1>
            <p>Comment Count</p>
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
                          <div className="flex gap-2">
                            <p className="bg-">@name</p>
                            <div className="flex gap-1">
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
                            </div>
                          </div>
                          <p
                            className={`text-gray-800 transition-all ${
                              isExpanded ? "line-clamp-none" : "line-clamp-2"
                            }`}
                          >
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Molestias corrupti dolore modi est quidem ad,
                            autem Lorem ipsum dolor sit amet consectetur
                            adipisicing elit. At, velit dignissimos totam enim
                            sint quidem ad eveniet praesentium? Alias, fugit?
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Ex, temporibus?{" "}
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
        </div>
      </div>
    </>
  );
};

export default MyRestaurant;
