import {
  IconCurrencyDollar,
  IconDeviceMobile,
  IconMapPin,
  IconShoppingCartDollar,
  IconTrash,
  IconX,
  IconMenu2,
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
  const [_image, set_Image] = useState([]);
  const [menuToEdit, setMenuToEdit] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const { username, email, image } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUserMenu());
  }, [dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };
  const handleEditMenu = (menuData) => {
    setMenuToEdit(menuData);
    setActiveTab("menu");
    setIsMobileMenuOpen(false);
  };
  const handleProfile = (e) => {
    e.preventDefault();
    const ProfileForm = new FormData();
    ProfileForm.append("contact", contact);
    ProfileForm.append("username", name);
    ProfileForm.append("password", password);
    ProfileForm.append("image", _image[0]);
    dispatch(profile(ProfileForm));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-3 md:space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
              <img
                src={
                  selectedImage ||
                  image ||
                  "https://cdn-icons-png.freepik.com/512/6858/6858504.png"
                }
                alt="Profile"
                className="size-24 sm:size-28 md:size-[6vw] max-w-[120px] rounded-full object-cover"
              />
              <div className="text-center sm:text-left">
                <p className="text-sm sm:text-base">Email: {email}</p>
                <p className="text-sm sm:text-base">Tên: {username}</p>
              </div>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Nhập mật khẩu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số liên lạc *
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <div className="mt-4 flex flex-col gap-2">
                  <label className="text-sm sm:text-base">
                    Change your Avatar
                  </label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <input
                      type="file"
                      onChange={(e) => {
                        set_Image(Array.from(e.target.files));
                        handleImageChange(e);
                      }}
                      className="file-input file-input-bordered file-input-sm sm:file-input-md w-full max-w-xs"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="p-1 sm:p-2 hover:bg-gray-100 rounded-full"
                    >
                      <IconTrash className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                  <button
                    type="submit"
                    className="py-2 sm:py-3 px-4 cursor-pointer border bg-amber-400 text-white rounded-3xl hover:bg-amber-500 transition text-sm sm:text-base w-full sm:w-auto"
                  >
                    Cập nhật
                  </button>
                  <button
                    type="button"
                    className="py-2 sm:py-3 px-4 cursor-pointer border rounded-3xl hover:bg-gray-100 transition text-sm sm:text-base w-full sm:w-auto"
                  >
                    Hủy
                  </button>
                </div>
                <button
                  type="button"
                  className="bg-red-500 cursor-pointer text-white rounded-3xl hover:bg-red-600 px-4 py-2 sm:py-3 transition text-sm sm:text-base w-full sm:w-auto"
                  onClick={() => dispatch(deleteAccount())}
                >
                  Xóa tài khoản
                </button>
              </div>
            </form>
          </div>
        );
      case "restaurant":
        return (
          <MyRestaurant
            activeTab="restaurant"
            setActiveTab={setActiveTab}
            handleEditMenu={handleEditMenu}
          />
        );
      case "business":
        return <RestaurantAdd />;
      case "menu":
        return (
          <MenuAdd
            menuToEdit={menuToEdit}
            onCancelEdit={() => setMenuToEdit(null)}
          />
        );
      default:
        return null;
    }
  };

  const tabs = [
    { key: "profile", title: "Thông tin cá nhân" },
    { key: "business", title: "Trở Thành Chủ Nhà Hàng" },
    { key: "menu", title: "Menu Nhà Hàng" },
    { key: "restaurant", title: "Nhà hàng của tôi" },
  ];

  return (
    <div className="pt-28 sm:pt-20 md:pt-[15vh] w-full px-4 sm:px-6 md:w-[90vw] lg:w-[80vw] mx-auto min-h-screen">
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          <IconMenu2 className="h-5 w-5" />
          <span>Menu Cài Đặt</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
        <div
          className={`
                    ${isMobileMenuOpen ? "block" : "hidden"} 
                    lg:block lg:w-[30%] xl:w-[25%] 
                    border-r border-gray-200
                    fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto
                    bg-white lg:bg-transparent
                    overflow-y-auto lg:overflow-y-visible
                `}
        >
          <div className="p-4 lg:p-0">
            <div className="flex justify-between items-center lg:hidden mb-4">
              <h1 className="text-xl font-semibold">Account Settings</h1>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <IconX className="h-6 w-6" />
              </button>
            </div>

            <h1 className="text-xl lg:text-2xl xl:text-3xl py-4 lg:py-[4vh] border-b border-gray-200 font-semibold px-4 lg:px-6">
              Account Settings
            </h1>
            {tabs.map(({ key, title }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                                    w-full px-4 py-3 lg:py-4 
                                    text-sm lg:text-base 
                                    font-medium text-left 
                                    transition-all
                                    border-b border-gray-100 lg:border-none
                                    ${
                                      activeTab === key
                                        ? "bg-blue-600 text-white"
                                        : "bg-white lg:bg-gray-50 text-gray-700 hover:bg-gray-100"
                                    }
                                `}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-8">
          <div className="lg:hidden mb-6">
            <h1 className="text-xl font-semibold text-gray-800">
              {tabs.find((tab) => tab.key === activeTab)?.title}
            </h1>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Setting;
