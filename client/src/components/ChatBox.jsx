// // import { IconAi, IconMailAi, IconMessage, IconRobot } from '@tabler/icons-react'
// // import React, { useState } from 'react'

// // const ChatBox = () => {
// //     const [chat, setChat] = useState(false);
// //     const [question, setQuestion] = ([]);
// //   return (
// //     <>
// //       <div
// //         className="fixed right-2 bottom-13 z-50 shadow-xl animate-bounce hover:scale-110 transition-all duration-500 p bg-[#FF637D] p-4 rounded-full"
// //         onClick={() =>  {chat === true ? setChat(false): setChat(true)}}
// //       >
// //         <IconMessage color="white" />
// //       </div>
// //       {chat && (
// //         <>
// //           <div className="w-[90vw] lg:w-[20vw] h-[60vh] z-50 flex flex-col border border-gray-500/50   fixed bottom-32 right-4 lg:right-6 bg-slate-100 py-4 px-4 rounded-xl">
// //             <h1 className="text-lg flex gap-4 items-center font-semibold">
// //               Ask Something <IconRobot />
// //             </h1>
// //             <div className="h-[40vh] bg-white overflow-y-scroll shadow-xl  py-4 px-2 my-8">
// //               {Array(5)
// //                 .fill(1)
// //                 .map((data, key) => {
// //                   return (
// //                     <React.Fragment key={key}>
// //                       {" "}
// //                       <div className="flex-row flex gap-4 max-w-full mb-[2vh] ">
// //                         <IconRobot />
// //                         <div className="bg-[#FEEEB7] max-w-[74%] rounded-2xl py-2 px-4">
// //                           <p className="font-bold pb-1">Bot</p>
// //                           <p selectable className="max-w-full wrap-break-word">
// //                             Lorem ipsum dolor sit amet ccte weqwek
// //                           </p>
// //                           <p className="text-right text-sm">10:38AM</p>
// //                         </div>
// //                       </div>
// //                       <div className="flex flex-row justify-end mb-[2vh]  ">
// //                         <div className="bg-[#FFDCC4] flex flex-col p-4 rounded-2xl">
// //                           <p className="pr-[2vw]">Hellu bro!</p>
// //                           <div className="flex justify-end">
// //                             <p className="text-sm">10:38AM</p>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </React.Fragment>
// //                   );
// //                 })}
// //             </div>
// //             <div className="h-[6vh]">
// //               <label className="input outline-0 w-full input-lg">
// //                 <span className="label">Ask me !</span>
// //                 <input type="text" />
// //               </label>
// //             </div>
// //           </div>
// //         </>
// //       )}
// //     </>
// //   );
// // }

// // export default ChatBox
// import { IconMessage, IconRobot, IconUser } from "@tabler/icons-react";
// import React, { useState, useRef, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addUserMessage, sendMessageToAI } from "../contexts/ChatRedux";
// import RestaurantCard from "./RestaurantCard";

// const ChatBox = () => {
//   const [chat, setChat] = useState(false);
//   const [inputMessage, setInputMessage] = useState("");
//   const messagesEndRef = useRef(null);
//   const dispatch = useDispatch();

//   // Lấy dữ liệu từ Redux store
//   const { messages, loading } = useSelector((state) => state.chat);

//   // Tự động cuộn xuống khi có tin nhắn mới
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;
//     dispatch(addUserMessage(inputMessage));
//     await dispatch(sendMessageToAI(inputMessage));

//     setInputMessage("");
//   };
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };
//   const renderMessage = (msg, index) => {
//     if (msg.type === "restaurant-list") {
//       return (
//         <div key={index} className="mb-4">
//           <div className="flex items-start gap-3 mb-2">
//             <IconRobot className="w-6 h-6 mt-1 text-blue-500" />
//             <span className="font-medium">Bot</span>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-9">
//             {msg.data?.map((restaurant, idx) => (
//               <RestaurantCard
//                 key={idx}
//                 data={restaurant}
//                 loading={false}
//                 className="shadow-md hover:shadow-lg transition-shadow"
//               />
//             ))}
//           </div>
//         </div>
//       );
//     }
//     return (
//       <div
//         key={index}
//         className={`flex ${
//           msg.sender === "user" ? "justify-end" : "justify-start"
//         } mb-4`}
//       >
//         <div
//           className={`flex max-w-[85%] ${
//             msg.sender === "user" ? "flex-row-reverse" : "flex-row"
//           } gap-2`}
//         >
//           <div
//             className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
//               msg.sender === "user" ? "bg-blue-100" : "bg-gray-100"
//             }`}
//           >
//             {msg.sender === "user" ? (
//               <IconUser className="w-5 h-5 text-blue-600" />
//             ) : (
//               <IconRobot className="w-5 h-5 text-gray-600" />
//             )}
//           </div>
//           <div
//             className={`rounded-2xl px-4 py-2 ${
//               msg.sender === "user"
//                 ? "bg-blue-500 text-white"
//                 : "bg-gray-100 text-gray-800"
//             }`}
//           >
//             <p className="text-sm">{msg.text}</p>
//             <p
//               className={`text-xs mt-1 ${
//                 msg.sender === "user" ? "text-blue-200" : "text-gray-500"
//               } text-right`}
//             >
//               {new Date().toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <div
//         className="fixed right-4 bottom-4 z-50 shadow-xl hover:scale-110 transition-all duration-500 p-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full cursor-pointer"
//         onClick={() => setChat(!chat)}
//       >
//         <IconMessage color="white" size={24} />
//       </div>
//       {chat && (
//         <div className="fixed right-4 bottom-20 z-50 w-[90vw] sm:w-[400px] md:w-[450px] lg:w-[500px] h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
//           <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
//                   <IconRobot size={24} />
//                 </div>
//                 <div>
//                   <h2 className="font-bold text-lg">Restaurant Assistant</h2>
//                   <p className="text-sm opacity-90">
//                     Tôi có thể giúp bạn tìm nhà hàng
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setChat(false)}
//                 className="text-white hover:bg-white/20 p-2 rounded-full transition"
//               >
//                 ✕
//               </button>
//             </div>
//           </div>
//           <div className="flex-1 overflow-y-auto p-4 bg-gray-50 h-[400px]">
//             {messages.map((msg, index) => renderMessage(msg, index))}

//             {loading && (
//               <div className="flex justify-start mb-4">
//                 <div className="flex gap-2">
//                   <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
//                     <IconRobot className="w-5 h-5 text-gray-600" />
//                   </div>
//                   <div className="bg-gray-100 rounded-2xl px-4 py-2">
//                     <div className="flex space-x-1">
//                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
//                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>
//           <div className="mt-3 flex flex-wrap gap-2">
//             {[
//               "Nhà hàng gần đây",
//               "Ẩm thực Ý",
//               "Quán ăn ngon",
//               "Đặt bàn trước",
//             ].map((text, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setInputMessage(text)}
//                 className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition"
//               >
//                 {text}
//               </button>
//             ))}
//           </div>
//           <div className="p-4 border-t border-gray-200 bg-white">
//             <div className="flex gap-2">
//               <div className="flex-1 relative">
//                 <input
//                   type="text"
//                   value={inputMessage}
//                   onChange={(e) => setInputMessage(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Nhập câu hỏi về nhà hàng..."
//                   className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//                   disabled={loading}
//                 />
//                 <button
//                   onClick={handleSendMessage}
//                   disabled={loading || !inputMessage.trim()}
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white p-2 rounded-full hover:opacity-90 disabled:opacity-50 transition"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ChatBox;
import {
  IconMessage,
  IconRobot,
  IconUser,
  IconX,
  IconSend,
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

const ChatBox = () => {
  const [chat, setChat] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  const { messages, loading, error } = useSelector((state) => state.chat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const renderMessage = (msg, index) => {
    const isUser = msg.sender === "user";
    const time = formatTime(msg.timestamp);
    if (msg.type === "restaurant-list" && msg.data) {
      const restaurants = transformRestaurants(msg.data);
      return (
        <div key={index} className="mb-6">
          <div className="flex items-start gap-3 mb-3 w-full">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-11 mt-3 w-full">
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
    if (msg.type === "error") {
      return (
        <div key={index} className="flex justify-start mb-4">
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
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
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              isUser
                ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                : "bg-gradient-to-r from-purple-500 to-pink-500"
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
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{msg.text}</p>
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
    { label: "Nhà hàng gần đây", icon: "📍" },
    { label: "Ẩm thực Việt", icon: "🇻🇳" },
    { label: "Quán cafe", icon: "☕" },
    { label: "Đồ ăn nhanh", icon: "🍔" },
    { label: "Nhà hàng sang trọng", icon: "⭐" },
    { label: "Đặt bàn trước", icon: "📅" },
  ];

  return (
    <>
      <div
        className="fixed right-6 bottom-6 z-50 shadow-xl hover:scale-110 transition-all duration-500 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full cursor-pointer group"
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
        <div className="fixed right-6 bottom-24 z-50 w-[95vw] sm:w-[600px] h-[70vh] max-h-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
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
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
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
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-full hover:opacity-90 disabled:opacity-50 transition disabled:cursor-not-allowed"
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
