import {
  IconCurrencyDollar,
  IconDeviceMobile,
  IconMapPin,
  IconShoppingCartDollar,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { Restaurants } from "../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount, profile } from "../contexts/AuthRedux";
import RestaurantAdd from "../components/RestaurantAdd";
import MenuAdd from "../components/MenuAdd";
import { useEffect } from "react";
import MyRestaurant from "../components/MyRestaurant";
import { getUserMenu } from "../contexts/MenuRedux";



const Setting = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [_allergy, set_Allergy] = useState([]);
  const [_image, set_Image] = useState([]);
  
  const dispatch = useDispatch();


  const {username, email, allergy, image} = useSelector((state) => state.auth);


  useEffect(() => {
     dispatch(getUserMenu())
  },[dispatch])

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleProfile = (e) => {
      e.preventDefault();
      const ProfileForm = new FormData();
      ProfileForm.append("contact", contact);
      ProfileForm.append("username", name);
      ProfileForm.append("password", password);
      ProfileForm.append("allergy", _allergy);
      ProfileForm.append("image", _image[0]);
      dispatch(profile(ProfileForm));
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-3">
            <div className="flex gap-6 items-center">
              <img
                src={
                  selectedImage ||
                  image ||
                  "https://cdn-icons-png.freepik.com/512/6858/6858504.png"
                }
                alt=""
                className="size-[6vw] rounded-full object-cover"
              />
              <div>
                <p>Email: {email}</p>
                <p>Tên: {username}</p>
                <p>
                  {"Dị ứng: "}
                  {allergy ?  allergy.join(" , ") : "không có"}
                </p>
              </div>
              <button className="py-1 px-4 border cursor-pointer rounded-3xl hover:bg-gray-100 transition">
                Update
              </button>
              <button className="flex gap-2 cursor-pointer text-red-500 hover:text-red-700 transition">
                <IconTrash />
                Remove
              </button>
            </div>

            <form onSubmit={(e) => handleProfile(e)} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ và tên *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập họ và tên"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mật khẩu"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số liên lạc *
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Các món dị ứng *
                </label>
                <textarea
                  value={_allergy}
                  onChange={(e) => {
                    let temp = e.target.value.split(",").map((a) => a.trim());
                    set_Allergy(temp);
                  }}
                  className="w-full px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Vui lòng ghi theo dạng: món,món,món ..."
                />
                <div className="mt-4 flex flex-col gap-2">
                  <label>Change your Avatar</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      onChange={(e) => {
                        set_Image(Array.from(e.target.files));
                        handleImageChange(e);
                      }}
                      className="file-input file-input-accent "
                    />
                    <button onClick={() => setSelectedImage(null)}>
                      <IconTrash className="p" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="py-3 px-4 cursor-pointer border bg-amber-400 text-white rounded-3xl hover:bg-amber-500 transition"
                  >
                    Cập nhật
                  </button>
                  <button
                    type="button"
                    className="py-3 px-4 cursor-pointer border rounded-3xl hover:bg-gray-100 transition"
                  >
                    Hủy
                  </button>
                </div>
                <button
                  type="button"
                  className="bg-red-500 cursor-pointer text-white rounded-3xl hover:bg-red-600 px-4 py-3 transition"
                  onClick={() => dispatch(deleteAccount())}
                >
                  Xóa tài khoản
                </button>
              </div>
            </form>
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
                className="border cursor-pointer border-gray-300 px-3 py-2 rounded-md focus:ring-2"
              >
                <option value="light"> Sáng</option>
                <option value="dark"> Tối</option>
                <option value="system"> Theo hệ thống</option>
              </select>
            </div>

            <button
              className="py-3 px-4 cursor-pointer border bg-amber-400 text-white rounded-3xl hover:bg-amber-500 transition"
            >
              Lưu thay đổi
            </button>
          </div>
        );
      case "restaurant":
        return(
          <MyRestaurant />
        )
      case "business":
        return (
            <RestaurantAdd />
        );
      case "menu":
        return(
          <MenuAdd />
        )
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
            { key: "business", title: "Trở Thành Chủ Nhà Hàng" },
            { key: "restaurant", title: "Nhà hàng của tôi" },
            { key: "menu", title: "Menu Nhà Hàng" },
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
