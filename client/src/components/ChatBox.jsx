import {
  IconMessage,
  IconRobot,
  IconUser,
  IconX,
  IconSend,
  IconCalendar,
  IconClock,
  IconUsers,
  IconCheck,
  IconChartBarPopular,
  IconLiveView,
  IconUserPin,
} from "@tabler/icons-react";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserMessage,
  sendMessageToAI,
  clearChat,
} from "../contexts/ChatRedux";
import RestaurantCardChat from "./RestaurantCardChat";
import { transformRestaurants } from "../utils/mongoFormatter.js";
import { useNavigate } from "react-router-dom";
import { FoodCardChat, FoodListChat } from "./FoodCardChat.jsx";
import { getBookingSlotById } from "../contexts/BookingSlotRedux.jsx";

const ChatBox = () => {
  const [chat, setChat] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  const { messages, loading, error } = useSelector((state) => state.chat);
  const { restaurantsById } = useSelector((state) => state.restaurant);
  const { bookingslotsById } = useSelector((state) => state.bookingslots);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    dispatch(getBookingSlotById());
  }, [dispatch]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    dispatch(addUserMessage(userMessage));

    await dispatch(sendMessageToAI(userMessage));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatBookingDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleBookingSelect = (suggestion) => {
    dispatch(
      addUserMessage(`Chọn gợi ý ${suggestion.id.replace("SUGG_", "")}`)
    );
    console.log("Đã chọn gợi ý booking:", suggestion);
    // api xác nhận booking
  };

  const renderBookingSuggestions = (msg, index) => {
    const { bookings = [], text = "" } = msg;
    const time = formatTime(msg.timestamp);

    return (
      <div key={index} className="mb-6">
        <div className="flex items-start gap-3 mb-4 w-full">
          <div className="w-8 h-8 rounded-full bg-linear-to-r from-green-500 to-teal-500 flex items-center justify-center">
            <IconCalendar className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-700">Trợ lý đặt bàn</div>
            <div className="text-gray-900 mt-1">{text}</div>
            <div className="text-xs text-gray-500 mt-1">
              Có {bookings.length} gợi ý đặt bàn
            </div>
          </div>
          <div className="text-xs text-gray-500">{time}</div>
        </div>

        <div className="ml-11 mt-4 space-y-4">
          {bookings.map((booking, idx) => (
            <div
              key={booking.id || idx}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {booking.restaurant || "Nhà hàng"}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <IconCalendar className="w-4 h-4" />
                      <span>{formatBookingDate(booking.booking_date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IconClock className="w-4 h-4" />
                      <span>
                        {booking.booking_time?.from || "Không xác định"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IconUsers className="w-4 h-4" />
                      <span>{booking.table || booking.quantity} người</span>
                    </div>
                  </div>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {booking.id}
                </span>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-sm">
                  <span className="text-gray-500">Ví dụ: </span>
                  <span className="text-purple-600 font-medium">
                    chọn gợi ý {idx + 1}
                  </span>
                </div>
                <button
                  onClick={() => handleBookingSelect(booking)}
                  className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-500 to-teal-500 text-white rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  <IconCheck className="w-4 h-4" />
                  Chọn gợi ý này
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBookingPreview = (msg, index) => {
    const { booking, text = "" } = msg;
    const time = formatTime(msg.timestamp);

    return (
      <div key={index} className="mb-6">
        <div className="flex items-start gap-3 mb-4 w-full">
          <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
            <IconCalendar className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-700">Xác nhận đặt bàn</div>
            <div className="text-gray-900 mt-1">{text}</div>
          </div>
          <div className="text-xs text-gray-500">{time}</div>
        </div>

        {booking && (
          <div className="ml-11 mt-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
            <h4 className="font-bold text-lg text-gray-900 mb-4">
              Thông tin đặt bàn
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IconCalendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày đặt</p>
                    <p className="font-medium text-gray-900">
                      {formatBookingDate(booking.booking_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IconClock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Giờ đặt</p>
                    <p className="font-medium text-gray-900">
                      {booking.booking_time?.from || "Không xác định"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IconUsers className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số lượng</p>
                    <p className="font-medium text-gray-900">
                      {booking.quantity} người
                    </p>
                  </div>
                </div>
                {booking.restaurant && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconCheck className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nhà hàng</p>
                      <p className="font-medium text-gray-900">
                        {booking.restaurant}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 px-4 py-2.5 bg-linear-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium">
                Xác nhận đặt bàn
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  const renderMessage = (msg, index) => {
    const isUser = msg.sender === "user";
    const time = formatTime(msg.timestamp);

    if (msg.type === "suggest-booking") {
      return renderBookingSuggestions(msg, index);
    }
    if (msg.type === "booking-preview") {
      return renderBookingPreview(msg, index);
    }
    if (msg.type === "booking-confirmed") {
      return (
        <div key={index} className="mb-6">
          <div className="flex items-start gap-3 mb-4 w-full">
            <div className="w-8 h-8 rounded-full bg-linear-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <IconCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-700">
                Đặt bàn thành công
              </div>
              {/* <div className="text-gray-900 mt-1">{msg.text}</div> */}
            </div>
            <div className="text-xs text-gray-500">{time}</div>
          </div>

          {msg.booking && (
            <div className="ml-11 mt-4">
              <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-lg text-gray-900">
                    Thông tin đặt bàn
                  </h4>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                    Đã xác nhận
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Nhà hàng:</span>
                    <span className="font-medium">
                      {restaurantsById[msg.booking?.restaurant_id]?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Ngày:</span>
                    <span className="font-medium">
                      {formatBookingDate(msg.booking?.booking_date)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Giờ:</span>
                    <span className="font-medium">
                      {bookingslotsById[msg.booking?.slot_id]?.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Số người:</span>
                    <span className="font-medium">{msg.booking?.quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    if (msg.type === "restaurant-list" && msg.data) {
      const restaurants = transformRestaurants(msg.data);
      return (
        <div key={index} className="mb-6">
          <div className="flex items-start gap-3 mb-3 w-full">
            <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <IconRobot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-700">Trợ lý ẩm thực</div>
              <div className="text-gray-900 mt-1">{msg.text}</div>
              <div className="text-xs text-gray-500 mt-1">
                Hiển thị {restaurants.length} kết quả
              </div>
            </div>
            <div className="text-xs text-gray-500">{time}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-11 mt-3">
            {msg.data.map((restaurant, idx) => (
              <RestaurantCardChat
                key={idx}
                data={restaurant}
                loading={false}
                onBookTable={() => handleBookTable(restaurant)}
                onViewDetails={() => handleViewDetails(restaurant)}
              />
            ))}
          </div>
        </div>
      );
    }
    if (msg.type === "food-list" && msg.data) {
      const foodData = Array.isArray(msg.data) ? msg.data : [];
      const foodCount = foodData.length;
      console.log("=== FOOD LIST DEBUG ===");
      console.log("Food data:", foodData);
      console.log("Food count:", foodCount);
      console.log("Grouped data:", msg.groupedData);
      console.log("Type of FoodListChat:", typeof FoodListChat);

      // Kiểm tra các trường cần thiết cho FoodListChat
      const groupedData = msg.groupedData || [];
      const stats = msg.stats || {};
      const metadata = msg.metadata || {};
      console.log("grouped Data: ", groupedData);
      return (
        <div key={index} className="mb-6">
          <div className="flex items-start gap-3 mb-3 w-full">
            <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <IconRobot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-700">Trợ lý ẩm thực</div>

              <div className="text-xs text-gray-500 mt-1">
                {foodCount < 0 && "Không tìm thấy kết quả nào"}
              </div>
            </div>
            {time && (
              <div className="text-xs text-gray-500 whitespace-nowrap">
                {time}
              </div>
            )}
          </div>

          {foodCount > 0 ? (
            <div className="ml-11 mt-3">
              <FoodListChat
                message={msg.text || msg.message || "Món ăn phù hợp"}
                data={foodData}
                groupedData={groupedData}
                stats={stats}
                metadata={metadata}
                onFoodSelect={() => {}}
                onAddToCart={() => {}}
              />
            </div>
          ) : (
            <div className="ml-11 mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                Không tìm thấy món ăn nào phù hợp với yêu cầu của bạn.
              </p>
            </div>
          )}
        </div>
      );
    }
    if (msg.type === "error") {
      return (
        <div key={index} className="flex justify-start mb-4">
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <IconRobot className="w-5 h-5 text-red-600" />
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              <p className="text-red-700">{msg.text}</p>
              <p className="text-xs text-red-500 mt-1">{time}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`flex max-w-[85%] ${
            isUser ? "flex-row-reverse" : "flex-row"
          } gap-3`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              isUser
                ? "bg-linear-to-r from-blue-500 to-cyan-500"
                : "bg-linear-to-r from-purple-500 to-pink-500"
            }`}
          >
            {isUser ? (
              <IconUser className="w-5 h-5 text-white" />
            ) : (
              <IconRobot className="w-5 h-5 text-white" />
            )}
          </div>
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <p className="whitespace-pre-wrap wrap-break-word">{msg.text}</p>
            <p
              className={`text-xs mt-2 ${
                isUser ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {time}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const handleBookTable = (restaurant) => {
    dispatch(addUserMessage(`Đặt bàn tại ${restaurant.name}`));
    console.log("Đặt bàn:", restaurant);
  };

  const navigate = useNavigate();
  const handleViewDetails = (restaurant) => {
    navigate(`/restaurant/${restaurant.id}`);
  };

  const quickActions = [
    { label: "Nhà hàng gần đây", icon: <IconUserPin /> },
    { label: "Nhà hàng phổ biến", icon: <IconChartBarPopular /> },
    { label: "Nhà hàng quận 3 ", icon: <IconLiveView /> },
  ];

  return (
    <>
      <div
        className="fixed right-6 bottom-6 z-50 shadow-xl hover:scale-110 transition-all duration-500 p-4 bg-linear-to-r from-purple-600 to-pink-600 rounded-full cursor-pointer group"
        onClick={() => setChat(!chat)}
      >
        <div className="relative">
          <IconMessage className="text-white w-6 h-6" />
          {messages.length > 1 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {messages.length - 1}
            </span>
          )}
        </div>
        <div className="absolute right-16 bottom-1/2 translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat với trợ lý ẩm thực
        </div>
      </div>

      {chat && (
        <div className="fixed right-6 bottom-24 z-50 w-[95vw] sm:w-[700px] h-[70vh] max-h-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200">
          <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <IconRobot size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Trợ lý ẩm thực</h2>
                  <p className="text-sm opacity-90">Sẵn sàng hỗ trợ bạn</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(clearChat())}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition"
                  title="Xóa trò chuyện"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setChat(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition"
                >
                  <IconX size={24} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputMessage(action.label);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="text-xs px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full transition flex items-center gap-1"
                >
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, index) => renderMessage(msg, index))}

            {loading && (
              <div className="flex justify-start mb-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <IconRobot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex space-x-2">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="text-center text-red-500 text-sm py-2">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập câu hỏi về nhà hàng, món ăn, đặt bàn..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                  disabled={loading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !inputMessage.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-linear-to-r from-purple-600 to-pink-600 text-white p-2 rounded-full hover:opacity-90 disabled:opacity-50 transition disabled:cursor-not-allowed"
                >
                  <IconSend className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center mt-2">
              Trợ lý AI có thể đưa ra gợi ý không chính xác. Vui lòng kiểm tra
              lại thông tin.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
