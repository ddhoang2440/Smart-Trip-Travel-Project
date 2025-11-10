import { IconTrash } from "@tabler/icons-react";
import React, { useState } from "react";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "Nguyễn Gia Khánh",
    email: "gia.khanh@example.com",
    password: "lmao",
    bio: "Mình là siêu nhân",
    notifications: true,
    theme: "light",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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
          <div className="space-y-6">
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
                  Giới thiệu bản thân
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
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

      default:
        return null;
    }
  };

  return (
    <div className="pt-[15vh] w-[70vw] mx-auto">
      <h1 className="text-2xl border-b border-gray-200 py-[4vh] font-semibold">
        Account Settings
      </h1>

      <div className="flex">
        <div className="w-[30%] flex flex-col border-r border-gray-200">
          {[
            { key: "profile", title: "Thông tin cá nhân" },
            { key: "history", title: "Lịch sử mua hàng" },
            { key: "home", title: "Cài đặt hệ thống" },
          ].map(({ key, title }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-3 text-sm hover:scale-95 cursor-pointer font-medium text-left transition-all ${
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
