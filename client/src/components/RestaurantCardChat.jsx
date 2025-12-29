import React from "react";
import {
  IconStar,
  IconMapPin,
  IconPhone,
  IconClock,
  IconCheck,
  IconX,
  IconDiscount2,
} from "@tabler/icons-react";
import { formatPrice } from "../utils/mongoFormatter";

const RestaurantCard = ({
  data,
  loading,
  onBookTable,
  onViewDetails,
  className = "",
}) => {
  if (loading || !data) {
    return (
      <div
        className={`bg-white rounded-xl shadow-md p-4 animate-pulse ${className}`}
      >
        <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }
  const restaurant = data;

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 ${className}`}
    >
      <div className="relative h-48 overflow-hidden group">
        <img
          src={restaurant.images}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop";
          }}
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* {restaurant.hasDiscount && (
            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <IconDiscount2 size={14} />
              <span>Giảm {restaurant.discount}%</span>
            </div>
          )} */}

          <div
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
              restaurant.open
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {restaurant.open ? (
              <>
                <IconCheck size={14} />
                <span>Đang mở</span>
              </>
            ) : (
              <>
                <IconX size={14} />
                <span>Đã đóng</span>
              </>
            )}
          </div>
        </div>

        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-2xl flex flex-col items-center">
          <div className="flex items-center">
            <IconStar size={16} className="fill-amber-400 text-amber-400" />
            <span className="font-bold text-lg">{restaurant.rating}</span>
          </div>
          <span className="text-xs opacity-80">
            {restaurant.review} reviews
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-black/50 to-transparent" />
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">
            {restaurant.name}
          </h3>
          {/* <div className="flex flex-wrap gap-1">
            {restaurant.type.map((tpe, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                {type}
              </span>
            ))}
          </div> */}
        </div>
        <div className="flex items-start gap-2 mb-3">
          <IconMapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
          <p className="text-sm text-gray-600 line-clamp-2 flex-1">
            {restaurant.address}
          </p>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <IconClock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Open: {restaurant.open_hour}
          </span>
          <span className="text-sm text-gray-600">
            Close: {restaurant.close_hour}
          </span>
        </div>
        {restaurant.description && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
            {restaurant.description}
          </p>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Giá trung bình</span>
            <span className="font-bold text-lg text-gray-800">
              {formatPrice(restaurant.medium_price)}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onViewDetails}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Chi tiết
            </button>

            {restaurant.bookingAvailable && (
              <button
                onClick={onBookTable}
                className="px-4 py-2 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition"
              >
                Đặt bàn
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
