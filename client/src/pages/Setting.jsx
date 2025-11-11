import {
  IconCurrencyDollar,
  IconDeviceMobile,
  IconMapPin,
  IconMinus,
  IconPlus,
  IconShoppingCartDollar,
  IconStar,
  IconStarFilled,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { Restaurants } from "../assets/assets";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "Nguyễn Gia Khánh",
    email: "gia.khanh@example.com",
    password: "lmao",
    allergy: "Tôm, cá, đậu phộng",
    notifications: true,
    theme: "light",
  });
  const rt = Restaurants.restaurant;
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Đã submit ảnh!");
  };
  const handleUpdate = () => {
    alert("Cập nhật thành công");
  };

  const handleCancel = () => {
    alert("Hủy thay đổi");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-3">
            <div className="flex gap-6 items-center">
              <img
                src="./pizza.jpg"
                alt=""
                className="size-[6vw] rounded-full object-cover"
              />
              <button className="py-1 px-4 border cursor-pointer rounded-3xl hover:bg-gray-100 transition">
                Update
              </button>
              <button className="flex gap-2 cursor-pointer text-red-500 hover:text-red-700 transition">
                <IconTrash />
                Remove
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ và tên *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mật khẩu"
                />
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Các món dị ứng
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.allergy}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Giới thiệu về bản thân..."
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <div className="flex gap-4">
                  <button
                    onClick={handleUpdate}
                    className="py-3 px-4 cursor-pointer border bg-amber-400 text-white rounded-3xl hover:bg-amber-500 transition"
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={handleCancel}
                    className="py-3 px-4 cursor-pointer border rounded-3xl hover:bg-gray-100 transition"
                  >
                    Hủy
                  </button>
                </div>
                <button className="bg-red-500 cursor-pointer text-white rounded-3xl hover:bg-red-600 px-4 py-3 transition">
                  Xóa tài khoản
                </button>
              </div>
            </div>
          </div>
        );
      case "history":
        return (
          <div>
            <h2 className="text-lg font-semibold mb-4">Lịch sử đơn hàng</h2>
            <ul className="divide-y divide-gray-200">
              {[
                {
                  id: "001",
                  date: "10/11/2025",
                  items: "Pizza",
                  total: "100.000đ",
                },
                {
                  id: "002",
                  date: "28/10/2025",
                  items: "Pho",
                  total: "35.000đ",
                },
                {
                  id: "003",
                  date: "20/10/2025",
                  items: "Cuc",
                  total: "10.000đ",
                },
              ].map((order) => (
                <li key={order.id} className="py-3 flex justify-between">
                  <div>
                    <p className="font-medium">{order.items}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{order.total}</p>
                    <p className="text-xs text-gray-500">{order.id}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      case "home":
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Cài đặt hệ thống</h2>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={formData.notifications}
                onChange={handleChange}
                className="size-5"
              />
              <label className="text-sm text-gray-700">
                Nhận thông báo qua email
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giao diện hiển thị
              </label>
              <select
                value={formData.theme}
                onChange={handleChange}
                className="border cursor-pointer border-gray-300 px-3 py-2 rounded-md focus:ring-2"
              >
                <option value="light"> Sáng</option>
                <option value="dark"> Tối</option>
                <option value="system"> Theo hệ thống</option>
              </select>
            </div>

            <button
              onClick={handleUpdate}
              className="py-3 px-4 cursor-pointer border bg-amber-400 text-white rounded-3xl hover:bg-amber-500 transition"
            >
              Lưu thay đổi
            </button>
          </div>
        );
      case "business":
        return (
          <div>
            <form className="w-full px-10 space-y-3">
              <h3 className="text-black text-5xl pt-6 pb-3 font-playfair">
                Input Form
              </h3>
              <div className="flex flex-col gap-3 pb-1">
                <label className="label text-black font-serif"> Name</label>
                <input
                  type="text"
                  placeholder="Restaurant Name"
                  className="input w-full text-gray-800/30 outline-0"
                />
              </div>
              <div className="flex flex-col gap-3  pb-1">
                <label className="label text-black font-serif"> Owner</label>

                <div className="flex gap-2 ">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="input w-full text-gray-800/30 outline-0"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3  pb-1">
                <label className="label text-black font-serif">
                  <IconDeviceMobile />
                  Phone Number
                </label>
                <input
                  type="number"
                  placeholder="Name"
                  className="input w-full text-black outline-0"
                />
              </div>

              <div className="flex flex-col gap-3  pb-1">
                <label className="label text-black font-serif">
                  <IconShoppingCartDollar />
                  Average Price
                </label>
                <input
                  type="number"
                  placeholder="Name"
                  className="input w-full text-black outline-0"
                />
              </div>
              <div className="flex flex-col gap-3  pb-1">
                <div className="flex justify-between">
                  <label className="label w-full text-black font-serif">
                    Opening Time
                  </label>
                  <label className="label w-full text-black font-serif">
                    Closing Time
                  </label>
                </div>
                <div className="flex gap-3 w-full justify-between">
                  <input type="time" className="w-full input text-black outline-0 " />
                  <input type="time" className="input w-full text-black outline-0" />
                </div>
              </div>
              <div className="flex flex-col gap-3  pb-1">
                <label className="label text-black font-serif">
                  <IconMapPin />
                  Location
                </label>
                <select className="input w-full text-black outline-0">
                  <option value="">135B Tran Hung Dao</option>
                  <option value="">lmao</option>
                  <option value="">hmu</option>
                </select>
              </div>
              <div className="flex flex-col gap pb-1">
                <label className="label text-black font-serif">
                  Description
                </label>
                <textarea
                  type="text"
                  placeholder="Description"
                  className="textarea w-full text-gray-800/30 outline-0"
                />
              </div>

              <div className="py-4">
                <div className="flex gap-4 justify-between">
                  <h3 className="text-3xl font-playfair ">Menu</h3>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-3 py-2 bg-warning rounded-3xl cursor-pointer"
                    type="button"
                  >
                    Thêm món ăn
                  </button>
                </div>
                {isOpen && (
                  <div>
                    <form className="">
                      <div className="flex flex-col">
                        <label className="">Tên món ăn</label>
                        <input
                          type="text"
                          placeholder="Nhập tên món ăn"
                          className="input text-gray-700/30"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="">Mô tả</label>
                        <textarea
                          type="text"
                          rows={3}
                          placeholder="Nhập mô tả chi tiết món ăn"
                          className="input text-gray-700/30"
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-1">
                          <IconCurrencyDollar />
                          <p>PriceRange</p>
                        </div>
                        <div>
                          <div className="flex gap-2">
                            <input
                              type="range"
                              min={0}
                              max="100"
                              value="0"
                              className="range"
                              step="1"
                            />
                            <p>$</p>
                          </div>
                        </div>
                      </div>
                      <form onSubmit={handleSubmit} className="w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4 text-left">
                          Upload Ảnh
                        </h2>

                        {selectedImage && (
                          <div className="mb-4">
                            <img
                              src={selectedImage}
                              alt="Preview"
                              className="w-full h-64 object-cover rounded-md"
                            />
                          </div>
                        )}

                        <div className="mb-4">
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Chọn ảnh
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100
                       cursor-pointer"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-[30%] bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                        >
                          Upload
                        </button>
                      </form>{" "}
                    </form>
                  </div>
                )}
                {Array(5)
                  .fill(1)
                  .map(() => {
                    return (
                      <>
                        <div>
                          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] w-full border-b border-gray-500/40 py-4 px-4 items-center">
                            <div className="flex gap-4 items-center min-w-0">
                              {" "}
                              <img
                                className="size-[3vw] rounded-ful object-cover rounded-full"
                                src="/pizza.jpg"
                                alt=""
                              />
                              <div className="flex flex-col gap-1 py-2 min-w-0 w-[20vw]">
                                <p className="text-lg font-semibold truncate">
                                  {rt.details.menu[0].food_name}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                  {rt.details.address}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                  {rt.name}
                                </p>
                              </div>
                              <div className="text-lg text-center flex-1 ">
                                $35.00
                              </div>
                            </div>

                            <div className="flex justify-center w-[3vw]">
                              <IconX className="cursor-pointer" />
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
              <div className="flex gap-4">
                <button
                  // onClick={() => setIsOpen(false)}
                  className="p-2 bg-black hover:bg-gray-600 text-warning transition-all duration-300 rounded-3xl cursor-pointer w-full"
                >
                  Close
                </button>
                <button
                  // onClick={() => setIsOpen(false)}
                  className="p-2 bg-black hover:bg-warning transition-all duration-300 rounded-3xl cursor-pointer w-full"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pt-[15vh] w-[80vw] mx-auto">
      <div className="flex">
        <div className="w-[30%] flex flex-col border-r border-gray-500">
          <h1 className="text-3xl py-[4vh] border-b border-gray-200 font-semibold">
            Account Settings
          </h1>
          {[
            { key: "profile", title: "Thông tin cá nhân" },
            { key: "history", title: "Lịch sử mua hàng" },
            { key: "home", title: "Cài đặt hệ thống" },
            { key: "business", title: "Nhà hàng của tôi" },
          ].map(({ key, title }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-3 text-base hover:scale-95 cursor-pointer font-medium text-left transition-all ${
                activeTab === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {title}
            </button>
          ))}
        </div>
        <div className="flex-1 bg-white px-8 py-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Setting;
