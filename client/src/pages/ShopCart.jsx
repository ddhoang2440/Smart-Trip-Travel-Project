import {
  IconBox,
  IconChairDirector,
  IconCheckbox,
  IconCurrency,
  IconCurrencyDollar,
  IconHome,
  IconImageInPicture,
  IconMap,
  IconMapPin,
  IconMinus,
  IconNumber,
  IconPhoto,
  IconPlus,
  IconStar,
  IconStarFilled,
  IconTable,
  IconToolsKitchen2,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { Restaurants } from "../assets/assets";
import Footer from "../components/Footer";
import { CheckOut } from "../components/CheckOut";
import { useDispatch, useSelector } from "react-redux";
import { getBooking } from "../contexts/BookingRedux";
import { Virtuoso } from "react-virtuoso";
import { createComment } from "../contexts/CommentRedux";

const ShopCart = () => {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.booking);
  const { email, image } = useSelector((state) => state.auth);

  const [comment, setComment] = useState(false);
  const [rating, setRating] = useState(1);
  const [content, setContent] = useState("");
  const [images, setImages] = useState(null);
  const [restaurant_id, setRestaurant_id] = useState("");

  const handleComment = (e) => {
    e.preventDefault();
    const formdata = new FormData();

    formdata.append("rating", rating);
    formdata.append("restaurant_id", restaurant_id);
    formdata.append("content", content);
    if (images && images.length > 0) {
      images.forEach((item) => {
        formdata.append("images", item);
      });
    }

    dispatch(createComment(formdata));
  };

  useEffect(() => {
    dispatch(getBooking());
    console.log(bookings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);
  const BookingItemCard = ({ card, onCommentClick, setRestaurant_id }) => {
    return (
      <>
        <div
          key={card._id}
          className="hidden lg:flex flex-row py-[3vh] border-b border-gray-400/50 "
        >
          <div className="flex flex-row w-[30vw] items-center gap-6">
            <img
              src={card?.restaurant_id?.images[0]}
              alt=""
              className="w-[10vw]"
            />
            <div className="flex flex-col gap-1">
              <h1 className="font-playfair text-xl font-bold">
                {card?.restaurant_id?.name}
              </h1>
              <div className="flex flex-row gap-1  items-center text-gray-700">
                <IconMapPin size={16} />
                <p>{card?.restaurant_id?.address}</p>
              </div>
              <div className="flex flex-row gap-1 items-center text-gray-700">
                <IconChairDirector size={16} />
                <p>bàn {card?.table} chỗ</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center w-[17vw] ">
            {card?.booking_date?.split("T")?.[0]}
          </div>
          <div className="flex items-center justify-center w-[17vw] ">
            {card?.quantity}
          </div>
          {card?.status === "confirmed" ? (
            <div className="text-blue-700 flex items-center justify-center w-[16vw]">
              Đặt bàn đã được duyệt
            </div>
          ) : card?.status === "pending" ? (
            <div className="text-orange-500 flex flex-col items-center justify-center w-[16vw] gap-4 relative ">
              Đơn Đặt Đang Được Xử Lý
            </div>
          ) : card?.status === "cancelled" ? (
            <div className="text-red-500 flex flex-col items-center justify-center w-[16vw] gap-4 relative ">
              Đơn Đặt Đã Bị Hủy
            </div>
          ) : (
            <div className="text-green-500 flex flex-col items-center justify-center w-[16vw] gap-4 relative ">
              Đơn Đặt Đã Hoàn Thành !
              <button
                onClick={() => {
                  setRestaurant_id(card?.restaurant_id?._id);
                  onCommentClick(true);
                }}
                className="py-2 px-4 rounded-full hover:cursor-pointer hover:bg-black/90 transition-all duration-200 bg-gray-600/50 text-white"
              >
                Để Lại Đánh Giá
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 lg:hidden">
          <div className="flex gap-2 items-center">
            <img
              className="w-[40vw]"
              src={card.restaurant_id?.images[0]}
              alt=""
            />
            <div className="flex flex-col gap-1 ">
              <p>{card?.restaurant_id?.name}</p>
              <p className="flex flex-row gap-2">
                <IconChairDirector /> Bàn {card.table} chỗ !
              </p>
              <button
                onClick={() => {
                  setRestaurant_id(card?.restaurant_id?._id);
                  onCommentClick(true);
                }}
                className="py-1 px-2 rounded-full hover:cursor-pointer hover:bg-black/90 transition-all duration-200 bg-gray-600/50 text-white"
              >
                Để Lại Đánh Giá
              </button>
            </div>
          </div>
          <div className="flex gap-2 justify-between">
            <div className="flex flex-col items-center">
              <p>Ngày Hẹn</p>
              <p>{card?.booking_date?.split("T")?.[0]}</p>
            </div>
            <div className="flex flex-col items-center">
              <p>Số Bàn</p>
              <p>{card.table}</p>
            </div>
            <div className="flex flex-col items-center">
              <p>Giờ</p>
              <p>{card?.slot_id?.time}</p>
            </div>
            <div className="text-green-700 flex flex-col items-center justify-center w-[16vw] gap-4 relative ">
              Hoàn Thành !
            </div>
          </div>
        </div>
      </>
    );
  };
  const CartCard = (idx, card) => {
    return (
      <BookingItemCard
        key={card._id}
        card={card}
        onCommentClick={setComment}
        setRestaurant_id={setRestaurant_id}
      />
    );
  };
  return (
    <>
      {comment && (
        <div
          className="flex w-full items-center h-full absolute z-10 justify-center"
          onClick={() => {
            if (comment) setComment(false);
          }}
        >
          <div
            className="flex  gap-3 text-sm  h-[30vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white flex flex-col w-[24vw] justify-between shadow-xl focus-within:border-indigo-500 transition border border-gray-500/30 rounded-md">
              <div className="flex py-2 px-2">
                <img
                  className="w-9 h-9 rounded-full"
                  src={
                    image ||
                    "https://cdn-icons-png.freepik.com/512/6858/6858504.png"
                  }
                  alt="userImage1"
                />
                <textarea
                  className="rounded-md rounded-b-none p-2.5 text-xl pb-0 w-80 h-28 outline-none resize-none"
                  placeholder="Để Lại Bình Luận Nếu Thích..."
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </div>
              <div className="flex items-center justify-between px-2.5 pb-2">
                <div className="flex gap-4">
                  <label className="hover:cursor-pointer">
                    <IconPhoto />
                    <input
                      name="file"
                      type="file"
                      className="hidden"
                      onChange={(e) => setImages(Array.from(e.target.files))}
                    />
                  </label>
                  <div className="rating">
                    <input
                      type="radio"
                      name="rating-2"
                      value={1}
                      onChange={(e) => setRating(e.target.value)}
                      className="mask mask-star-2 bg-orange-400"
                      aria-label="1 star"
                    />
                    <input
                      type="radio"
                      name="rating-2"
                      value={2}
                      onChange={(e) => setRating(e.target.value)}
                      className="mask mask-star-2 bg-orange-400"
                      aria-label="2 star"
                    />
                    <input
                      type="radio"
                      name="rating-2"
                      value={3}
                      onChange={(e) => setRating(e.target.value)}
                      className="mask mask-star-2 bg-orange-400"
                      aria-label="3 star"
                    />
                    <input
                      type="radio"
                      name="rating-2"
                      value={4}
                      onChange={(e) => setRating(e.target.value)}
                      className="mask mask-star-2 bg-orange-400"
                      aria-label="4 star"
                    />
                    <input
                      type="radio"
                      name="rating-2"
                      value={5}
                      onChange={(e) => setRating(e.target.value)}
                      className="mask mask-star-2 bg-orange-400"
                      aria-label="5 star"
                    />
                  </div>
                </div>
                <button
                  onClick={(e) => handleComment(e)}
                  className="bg-indigo-500 hover:cursor-pointer hover:bg-indigo-600 active:scale-95 transition-all text-white font-medium px-5 py-2 rounded"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="py-[18vh] px-[10vw] bg-indigo-50/40">
        <h1 className="font-bold font-playfair text-5xl">Lịch Sử Đặt Bàn</h1>
        <p className="text-gray-600/80 py-4 lg:max-w-[30vw] text-lg">
          Dễ dàng quản lý các đặt chỗ nhà hàng trước đây, hiện tại và sắp tới
          của bạn tại đây
        </p>
        <div className="flex flex-col gap-4 mt-[2vh] pb-[2vh] h-full ">
          <div className="flex flex-row gap-4 lg:text-lg text-sm  border-b border-gray-400 pb-[2vh]">
            <p className="lg:w-[36vw]">Nhà Hàng</p>
            <p className="lg:w-[20vw]  flex items-center justify-center">
              Ngày Hẹn
            </p>
            <p className="lg:w-[20vw]  flex items-center justify-center">
              Số Lượng Bàn
            </p>
            <p className="lg:w-[20vw]  flex items-center justify-center">
              Trạng Thái
            </p>
          </div>
          <Virtuoso
            className=""
            style={{ height: "55vh", width: "100%" }}
            data={bookings}
            itemContent={CartCard}
            overscan={200}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShopCart;
