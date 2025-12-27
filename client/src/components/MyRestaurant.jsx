/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  IconAdjustments,
  IconStar,
  IconStarFilled,
  IconThumbDown,
  IconThumbUp,
  IconX,
  IconCalendar,
  IconClock,
  IconUsers,
  IconReceipt,
  IconChartBar,
  IconBell,
  IconEdit,
  IconTrash,
  IconCheck,
  IconBan,
  IconLayoutGrid,
  IconCalendarEvent,
  IconChartPie,
  IconMessage,
  IconSettings,
  IconPlus,
  IconInfoCircle,
  IconChairDirector,
  IconMail,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { getUserRestaurant } from "../contexts/ResRedux";
import {
  filterRestaurantMenu,
  getUserMenu,
  removeMenu,
} from "../contexts/MenuRedux";
import { formatPrice } from "./ultil";
import {
  createBookingSlot,
  deleteBookingSlot,
  getBookingSlot,
  getBookingSlotById,
  updateBookingSlot,
} from "../contexts/BookingSlotRedux";
import toast from "react-hot-toast";
import { getComment } from "../contexts/CommentRedux";
import { getBookingById, updateBookingStatus } from "../contexts/BookingRedux";

const MyRestaurant = ({ activeTab, setActiveTab, handleEditMenu }) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [editingTable, setEditingTable] = useState(null);
  const [isAddTable, setIsAddTable] = useState(false);
  const initalSlotState = {
    restaurant_id: null,
    time: "00:00",
    max_slot_2: 0,
    max_slot_4: 0,
    max_slot_8: 0,
  };
  const [formSlot, setFormSlot] = useState(initalSlotState);
  const { comment } = useSelector((state) => state.comment);
  const { userRestaurant } = useSelector((state) => state.restaurant);
  const { usermenu } = useSelector((state) => state.menu);
  const { bookingslots } = useSelector((state) => state.bookingslots);
  const { bookingById } = useSelector((state) => state.booking);
  const { bookingslotsById } = useSelector((state) => state.bookingslots);
  const dispatch = useDispatch();

  useEffect(() => {
    if (activeTab === "restaurant") {
      dispatch(getUserMenu());
      dispatch(getUserRestaurant());
    }
  }, [activeTab, dispatch]);
  useEffect(() => {
    if (
      activeTab === "restaurant" &&
      userRestaurant &&
      userRestaurant[0]?._id
    ) {
      console.log(
        "Lấy booking slots cho restaurant ID:",
        userRestaurant[0]._id
      );
      const restaurantId = userRestaurant[0]._id;
      dispatch(getBookingSlot(restaurantId));
      dispatch(getBookingById(restaurantId));
      dispatch(getComment({ restaurant_id: restaurantId }));
    }
  }, []);

  useEffect(() => {
    if (bookingById && bookingById.length > 0) {
      const newBookingSlotIds = bookingById
        .map((item) => item.slot_id)
        .filter((slotId) => slotId && !bookingslotsById[slotId]);
      newBookingSlotIds.forEach((slotId) => {
        dispatch(getBookingSlotById(slotId));
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormSlot((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTable((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTable = (e) => {
    e.preventDefault();
    if (!formSlot.time || !userRestaurant[0]?._id) {
      toast.error("Please fill all fields");
      return;
    }
    const newTable = {
      restaurant_id: userRestaurant[0]?._id,
      time: formSlot.time,
      max_slot_2: formSlot.max_slot_2,
      max_slot_4: formSlot.max_slot_4,
      max_slot_8: formSlot.max_slot_8,
    };
    dispatch(createBookingSlot(newTable));
    // .then((result) => {
    // if (result.meta.requestStatus === "fulfilled") {
    //   setFormSlot({
    //     time: "",
    //     max_slot_2: "",
    //     max_slot_4: "",
    //     max_slot_8: "",
    //   });
    //   setIsAddTable(false);
    //   dispatch(getBookingSlot(userRestaurant[0]?._id));
    //   // }
    // });
  };
  const handleRemoveMenu = (id) => {
    dispatch(removeMenu(id));
    dispatch(filterRestaurantMenu(id));
  };

  const handleUpdateTable = (e) => {
    e.preventDefault();
    if (!formSlot.time || !userRestaurant[0]?._id) {
      toast.error("Please fill all fields");
      return;
    }
    const newTable = {
      id: editingTable._id,
      updateData: {
        time: editingTable.time,
        max_slot_2: editingTable.max_slot_2,
        max_slot_4: editingTable.max_slot_4,
        max_slot_8: editingTable.max_slot_8,
      },
    };
    dispatch(updateBookingSlot(newTable)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        setFormSlot({
          time: "",
          max_slot_2: "",
          max_slot_4: "",
          max_slot_8: "",
        });
        setEditingTable(null);
        dispatch(getBookingSlot(userRestaurant[0]?._id));
      }
    });
  };
  console.log(bookingById);
  const handleDeleteTable = async (id) => {
    dispatch(deleteBookingSlot(id));
    dispatch(getBookingSlot(userRestaurant[0]?._id));
  };
  const handleUpdateStatus = (bookingId, nextStatus) => {
    dispatch(updateBookingStatus({ bookingId, status: nextStatus }));
  };

  const renderStatusAction = (item) => {
    switch (item.status) {
      case "confirmed":
        return (
          <div className="flex flex-col gap-2">
            <p className="text-blue-600 font-medium">Đã xác nhận</p>

            <button
              onClick={() => handleUpdateStatus(item._id, "completed")}
              className="btn btn-soft btn-neutral rounded-full"
            >
              Hoàn thành đơn hàng
            </button>
          </div>
        );
      case "cancelled":
        return <p className="text-red-600 font-medium">Đã hủy</p>;
      case "completed":
        return <p className="text-green-500 font-medium">Hoàn thành</p>;

      default:
        return (
          <div className="flex flex-col gap-2">
            <p className="text-orange-400 font-medium">Đang xử lý</p>

            <div className="flex gap-2 items-center justify-center">
              <button
                onClick={() => handleUpdateStatus(item._id, "confirmed")}
                className="btn btn-soft btn-neutral rounded-full"
              >
                Xác nhận
              </button>
              <button
                onClick={() => handleUpdateStatus(item._id, "cancelled")}
                className="btn btn-soft btn-neutral rounded-full"
              >
                Hủy đơn
              </button>
            </div>
          </div>
        );
    }
  };

  const slotStats = {};

  bookingById.forEach((booking) => {
    const slotId = booking.slot_id._id;

    if (!slotStats[slotId]) {
      slotStats[slotId] = {
        slot: booking.slot_id,
        totalBooked: 0,
      };
    }

    slotStats[slotId].totalBooked += booking.quantity;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Đơn đặt bàn</p>
              <h3 className="text-3xl font-bold mt-2">{bookingById.length}</h3>
            </div>
            <IconCalendar className="text-blue-500" size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Đánh giá trung bình</p>
              <h3 className="text-3xl font-bold mt-2">
                {" "}
                {comment.length > 0
                  ? (
                      comment.reduce(
                        (sum, review) => sum + (review.rating || 0),
                        0
                      ) / comment.length
                    ).toFixed(1)
                  : "0.0"}
              </h3>
            </div>
            <IconStarFilled className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4">Tỷ lệ bàn theo giờ cao điểm</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.values(slotStats).map((item, idx) => {
            const { slot, totalBooked } = item;

            const totalCapacity =
              slot.max_slot_2 + slot.max_slot_4 + slot.max_slot_8;

            const percent = Math.min((totalBooked / totalCapacity) * 100, 100);

            return (
              <div key={slot._id + idx} className="p-4 border rounded-lg mb-4">
                <p className="font-semibold mb-2">{slot.time}</p>

                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex justify-between mt-2 text-sm">
                  <span>Bàn đã đặt: {totalBooked}</span>
                  <span>Bàn trống: {totalCapacity - totalBooked}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderTables = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Quản lý giờ</h3>
        <button
          onClick={() => setIsAddTable(!isAddTable)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
        >
          <IconPlus size={20} />
          Thêm bàn
        </button>
      </div>
      {isAddTable && (
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-br from-blue-50/30 to-purple-50/30 rounded-2xl -z-10" />
          <div className="bg-white/95 rounded-2xl shadow-2xl border border-gray-200/80 p-2 mb-8">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg">
                    <IconClock className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Thiết lập khung giờ
                    </h3>
                    <p className="text-gray-500 mt-1">
                      Cài đặt số lượng bàn theo từng khung giờ phục vụ
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsAddTable(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:rotate-90"
                title="Đóng"
              >
                <IconX
                  size={24}
                  className="text-gray-400 hover:text-gray-600"
                />
              </button>
            </div>

            <form onSubmit={handleAddTable}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                  <div className=" bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconClock size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-800">
                          Khung giờ
                        </label>
                      </div>
                    </div>
                    <input
                      type="time"
                      name="time"
                      value={formSlot.time}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg text-center font-semibold text-gray-800"
                    />
                    <div className="mt-4 pt-4 border-t border-blue-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Ví dụ:</span>
                        <span className="font-medium text-blue-600">18:00</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-full bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            2
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">
                              Bàn 2 người
                            </h4>
                          </div>
                        </div>
                        <IconUsers size={20} className="text-blue-400" />
                      </div>
                      <input
                        type="number"
                        name="max_slot_2"
                        value={formSlot.max_slot_2}
                        onChange={handleChange}
                        min="0"
                        placeholder="Nhập số lượng"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-center text-gray-800 font-medium"
                      />
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Đề xuất:</span>
                          <span className="font-medium text-blue-600">
                            4-6 bàn
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-linear-to-br from-green-50 to-emerald-100 rounded-xl p-5 border border-green-200 hover:border-green-300 transition">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                            4
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">
                              Bàn 4 người
                            </h4>
                          </div>
                        </div>
                        <IconUsers size={20} className="text-green-400" />
                      </div>
                      <input
                        type="number"
                        name="max_slot_4"
                        value={formSlot.max_slot_4}
                        onChange={handleChange}
                        min="0"
                        placeholder="Nhập số lượng"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-center text-gray-800 font-medium"
                      />
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Đề xuất:</span>
                          <span className="font-medium text-green-600">
                            6-8 bàn
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-linear-to-br from-purple-50 to-violet-100 rounded-xl p-5 border border-purple-200 hover:border-purple-300 transition">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                            8
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">
                              Bàn 8 người
                            </h4>
                          </div>
                        </div>
                        <IconUsers size={20} className="text-purple-400" />
                      </div>
                      <input
                        type="number"
                        name="max_slot_8"
                        value={formSlot.max_slot_8}
                        onChange={handleChange}
                        min="0"
                        placeholder="Nhập số lượng"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-center text-gray-800 font-medium"
                      />
                      <div className="mt-4 pt-4 border-t border-purple-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Đề xuất:</span>
                          <span className="font-medium text-purple-600">
                            2-4 bàn
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10 pt-8 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <IconInfoCircle size={16} />
                    <span>
                      Tổng số bàn:{" "}
                      <span className="font-semibold text-gray-700">
                        {(Number(formSlot.max_slot_2) || 0) +
                          (Number(formSlot.max_slot_4) || 0) +
                          (Number(formSlot.max_slot_8) || 0)}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddTable(false)}
                    className="lg:px-8 lg:py-3 py-2 px-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition font-semibold flex items-center gap-2"
                  >
                    <IconX size={18} />
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="lg:px-8 lg:py-3 py-2 px-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <IconCheck size={18} />
                    Xác nhận thêm
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      <div>
        <h4 className="text-lg font-bold mb-4">Sơ đồ bàn</h4>
        {!bookingslots || bookingslots.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có dữ liệu bàn. Hãy thêm bàn mới!
          </div>
        ) : (
          <>
            {bookingslots && bookingslots.length > 0 ? (
              <div className="space-y-6">
                {bookingslots.map((slot) => (
                  <div
                    key={slot._id}
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                  >
                    <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-2 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center justify-between gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <IconClock size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="lg:text-xl text-sm font-bold text-gray-800">
                              Khung giờ: {slot.time}
                            </h3>
                            <p className="lg:text-sm hidden text-gray-500">
                              ID: {slot._id?.slice(-8)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-center gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            Tổng:{" "}
                            {(slot.max_slot_2 || 0) +
                              (slot.max_slot_4 || 0) +
                              (slot.max_slot_8 || 0)}{" "}
                            bàn
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-4 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {slot.max_slot_2 > 0 && (
                          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                                  2
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800">
                                    Bàn 2 người
                                  </h4>
                                </div>
                              </div>
                              <IconUsers size={20} className="text-blue-500" />
                            </div>
                            <div className="text-center py-3">
                              <div className="text-3xl font-bold text-blue-600">
                                {slot.max_slot_2}
                              </div>
                              <div className="text-sm text-gray-600">
                                bàn có sẵn
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-blue-200">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Trạng thái:
                                </span>
                                <span className="font-medium text-green-600">
                                  Sẵn sàng
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        {slot.max_slot_4 > 0 && (
                          <div className="bg-linear-to-br from-green-50 to-emerald-100 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-linear-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                                  4
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800">
                                    Bàn 4 người
                                  </h4>
                                </div>
                              </div>
                              <IconUsers size={20} className="text-green-500" />
                            </div>
                            <div className="text-center py-3">
                              <div className="text-3xl font-bold text-green-600">
                                {slot.max_slot_4}
                              </div>
                              <div className="text-sm text-gray-600">
                                bàn có sẵn
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-green-200">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Trạng thái:
                                </span>
                                <span className="font-medium text-green-600">
                                  Sẵn sàng
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        {slot.max_slot_8 > 0 && (
                          <div className="bg-linear-to-br from-purple-50 to-violet-100 rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                  8
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800">
                                    Bàn 8 người
                                  </h4>
                                </div>
                              </div>
                              <IconUsers
                                size={20}
                                className="text-purple-500"
                              />
                            </div>
                            <div className="text-center py-3">
                              <div className="text-3xl font-bold text-purple-600">
                                {slot.max_slot_8}
                              </div>
                              <div className="text-sm text-gray-600">
                                bàn có sẵn
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-purple-200">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Trạng thái:
                                </span>
                                <span className="font-medium text-green-600">
                                  Sẵn sàng
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {slot.max_slot_2 === 0 &&
                        slot.max_slot_4 === 0 &&
                        slot.max_slot_8 === 0 && (
                          <div className="text-center py-8">
                            <div className="inline-block p-4 bg-gray-100 rounded-full mb-3">
                              <IconAlertCircle
                                size={32}
                                className="text-gray-400"
                              />
                            </div>
                            <p className="text-gray-500">
                              Chưa có bàn nào được thiết lập cho khung giờ này
                            </p>
                          </div>
                        )}
                      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => setEditingTable(slot)}
                          className="px-5 py-2 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-medium flex items-center gap-2"
                        >
                          <IconEdit size={16} />
                          Chỉnh sửa
                        </button>
                        <button
                          onClick={() => handleDeleteTable(slot._id)}
                          className="px-5 py-2 bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition font-medium flex items-center gap-2"
                        >
                          <IconTrash size={16} />
                          Xóa khung giờ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl">
                <div className="inline-block p-4 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full mb-4">
                  <IconCalendar size={48} className="text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  Chưa có khung giờ nào
                </h3>
                <p className="text-gray-500 mb-6">
                  Thêm khung giờ đầu tiên để quản lý bàn của bạn
                </p>
                <button
                  onClick={() => setIsAddTable(true)}
                  className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition font-medium flex items-center gap-2 mx-auto"
                >
                  <IconPlus size={18} />
                  Thêm khung giờ đầu tiên
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {editingTable && (
        <div className="grid grid-cols-1 gap-4">
          <h4 className="text-lg font-bold mb-4">Chỉnh sửa bàn</h4>

          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-blue-50/30 to-purple-50/30 rounded-2xl -z-10" />
            <div className="bg-white/95 rounded-2xl shadow-2xl border border-gray-200/80 p-2 mb-8">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg">
                      <IconClock className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Thiết lập khung giờ
                      </h3>
                      <p className="text-gray-500 mt-1">
                        Cài đặt số lượng bàn theo từng khung giờ phục vụ
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddTable(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:rotate-90"
                  title="Đóng"
                >
                  <IconX
                    size={24}
                    className="text-gray-400 hover:text-gray-600"
                  />
                </button>
              </div>

              <form onSubmit={handleUpdateTable}>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-1">
                    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-5  border border-gray-200 hover:border-blue-300 transition">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconClock size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-800">
                            Khung giờ
                          </label>
                        </div>
                      </div>
                      <input
                        type="time"
                        name="time"
                        value={editingTable.time}
                        onChange={handleEditChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg text-center font-semibold text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                              2
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800">
                                Bàn 2 người
                              </h4>
                            </div>
                          </div>
                        </div>
                        <input
                          type="number"
                          name="max_slot_2"
                          value={editingTable.max_slot_2}
                          onChange={handleEditChange}
                          min="0"
                          placeholder="Nhập số lượng"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-center text-gray-800 font-medium"
                        />
                      </div>
                      <div className="bg-linear-to-br from-green-50 to-emerald-100 rounded-xl p-5 border border-green-200 hover:border-green-300 transition">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                              4
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800">
                                Bàn 4 người
                              </h4>
                            </div>
                          </div>
                        </div>
                        <input
                          type="number"
                          name="max_slot_4"
                          value={editingTable.max_slot_4}
                          onChange={handleEditChange}
                          min="0"
                          placeholder="Nhập số lượng"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-center text-gray-800 font-medium"
                        />
                      </div>
                      <div className="bg-linear-to-br from-purple-50 to-violet-100 rounded-xl p-5 border border-purple-200 hover:border-purple-300 transition">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                              8
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800">
                                Bàn 8 người
                              </h4>
                            </div>
                          </div>
                        </div>
                        <input
                          type="number"
                          name="max_slot_8"
                          value={editingTable.max_slot_8}
                          onChange={handleEditChange}
                          min="0"
                          placeholder="Nhập số lượng"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-center text-gray-800 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10 pt-8 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <IconInfoCircle size={16} />
                      <span>
                        Tổng số bàn:{" "}
                        <span className="font-semibold text-gray-700">
                          {(Number(editingTable.max_slot_2) || 0) +
                            (Number(editingTable.max_slot_4) || 0) +
                            (Number(editingTable.max_slot_8) || 0)}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingTable(null)}
                      className="lg:px-8 lg:py-3 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition font-semibold flex items-center gap-2"
                    >
                      <IconX size={18} />
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="lg:px-8 lg:py-3 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      <IconCheck size={18} />
                      Cập nhật
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMenu = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-2xl font-bold">Quản lý Menu</h3>
        <button
          onClick={() => setActiveTab("menu")}
          className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
        >
          <IconPlus size={20} />
          Thêm món
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {usermenu.map((item, idx) => (
          <div
            key={item._id + idx}
            className="bg-white p-4 rounded-xl shadow border border-gray-100 flex gap-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-900 truncate">
                  {item.name}
                </h4>
                <span className="text-green-600 font-bold text-sm">
                  {formatPrice(item.price)}đ
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-600">
                  {item.type || "Chưa phân loại"}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEditMenu(item)}
                  className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded hover:bg-blue-100"
                >
                  Sửa
                </button>
                <button className="flex-1 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded hover:bg-red-100">
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          {" "}
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left whitespace-nowrap">
                  Món ăn
                </th>
                <th className="px-6 py-3 text-center whitespace-nowrap">Ảnh</th>
                <th className="px-6 py-3 text-center whitespace-nowrap">Giá</th>
                <th className="px-6 py-3 text-center whitespace-nowrap">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-center  whitespace-nowrap">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usermenu.map((item, idx) => (
                <tr
                  key={item._id + idx}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="max-w-[200px]">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 ">
                    <div className="flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded border border-gray-200"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap flex items-center justify-center">
                    {formatPrice(item.price)}đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap ">
                    <span className="px-2 py-1 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                      {item.type || "Chưa phân loại"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center justify-center">
                    <div className="flex gap-2 ">
                      <button
                        onClick={() => handleEditMenu(item)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleRemoveMenu(item._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  const renderReviews = () => {
    const averageRating =
      comment.length > 0
        ? comment.reduce((sum, review) => sum + (review.rating || 0), 0) /
          comment.length
        : 0;
    return (
      <div className="space-y-6">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b md:border-b-0 pb-4 md:pb-0 border-gray-100">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                Đánh giá của khách hàng
              </h3>
              <p className="text-gray-500 text-sm md:text-base">
                {comment.length} đánh giá
              </p>
            </div>

            <div className="flex items-center gap-4 md:block text-left md:text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <IconStarFilled
                    key={i}
                    size={20}
                    className={
                      i <= Math.round(averageRating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            {comment.map((review) => {
              return (
                <div
                  key={review._id}
                  className="p-4 md:p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        <img
                          className=" md:w-12 md:h-12 size-[6vh] bg-gray-200 rounded-full object-cover"
                          src={
                            review.user_id.image ||
                            "https://cdn-icons-png.freepik.com/512/6858/6858504.png"
                          }
                          alt="User Avatar"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review?.user_id.username || "Người dùng ẩn danh"}
                        </p>
                        <p className="text-gray-500 text-xs md:text-sm">
                          {review.createdAt
                            ? review.createdAt.slice(0, 10)
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex pl-13 sm:pl-0">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <IconStarFilled
                          key={i}
                          size={16}
                          className={`${
                            i <= review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          } md:w-5 md:h-5`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm md:text-base mb-4 leading-relaxed">
                    {review.content}
                  </p>
                  <div className="flex flex-row gap-1 rounded-xl">
                    {review?.images?.map((item, idx) => (
                      <img
                        src={item}
                        className="w-[22vw] h-[14vw]"
                        alt=""
                        key={review._id + idx}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-playfair">
          {userRestaurant[0]?.name || "Nhà hàng của tôi"}
        </h1>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-3xl text-white flex items-center gap-2">
            <IconCheck size={20} />
            Đang mở
          </button>
        </div>
      </div>
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 border-b">
          {[
            { id: "dashboard", label: "Tổng quan", icon: IconLayoutGrid },
            { id: "reservations", label: "Đặt bàn", icon: IconCalendar },
            { id: "tables", label: "Quản lý", icon: IconUsers },
            { id: "menu", label: "Menu", icon: IconReceipt },
            { id: "reviews", label: "Đánh giá", icon: IconStar },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-lg hover:cursor-pointer transition ${
                activeSection === item.id
                  ? "bg-white border-t border-x text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        {activeSection === "dashboard" && renderDashboard()}
        {activeSection === "reservations" && (
          <div className="py-[2vh] px-[1vw] flex flex-col gap-4">
            <h1 className="text-4xl font-semibold pb-[4vh]">Đơn Đặt Bàn</h1>
            <div className="flex flex-col gap-10">
              <div className="hidden lg:flex flex-row ">
                <p className="w-[18vw]">Người Đặt</p>
                <p className="w-[12vw] text-center">Ngày Đặt Bàn</p>
                <p className="w-[10vw] text-center">Số Lượng Bàn</p>
                <p className="w-[12vw] text-center">Trạng Thái</p>
              </div>
              {bookingById.map((item, idx) => (
                <React.Fragment key={item._id + idx}>
                  <div className="flex flex-row  items-center">
                    <div className="flex gap-4 items-center w-[56vw] lg:w-[18vw]">
                      <img
                        src={
                          item.user_id.image ||
                          "https://cdn-icons-png.freepik.com/512/6858/6858504.png"
                        }
                        alt=""
                        className="rounded-full size-[6vh]"
                      />
                      <div className="flex flex-col gap-1">
                        <p>@{item.user_id.username}</p>
                        <p className="flex gap-1">
                          <IconMail />
                          {item.user_id.email}
                        </p>
                        <p className="flex gap-1">
                          <IconChairDirector />
                          <p>
                            Bàn {item.table} người{" "}
                            <span>- {item.quantity} bàn</span>
                          </p>
                        </p>
                      </div>
                    </div>
                    <div className=" w-[20vw] lg:w-[12vw] text-center">
                      {item.booking_date.split("T")[0]}
                    </div>
                    <div className="w-[10vw] hidden lg:block text-center">
                      {item.quantity}
                    </div>
                    <div className="hidden lg:block w-[12vw] text-center font-semibold text-green-700">
                      {/* {item.status === "Confirmed" ? (
                        <div className="flex flex-col gap-2">
                          <p>Đã Xác Nhận</p>
                          <button
                            onClick={handleUpdateStatus}
                            className="btn btn-soft btn-neutral rounded-full"
                          >
                            Hoàn Thành Đơn Hàng
                          </button>
                        </div>
                      ) : item.status === "Finished" ? (
                        <p>Hoàn Thành</p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <p className="text-orange-400">Đang xử lý</p>
                          <button
                            onClick={handleUpdateStatus}
                            className="btn btn-soft btn-neutral rounded-full"
                          >
                            Xác nhận đơn hàng
                          </button>
                        </div>
                      )} */}
                      {renderStatusAction(item)}
                    </div>
                  </div>
                  <div className="flex lg:hidden flex-row gap-4 ">
                    {item.status === "Confirmed" ? (
                      <div className="flex flex-col w-full gap-2 items-center justify-center text-green-700">
                        <p>Đã Xác Nhận</p>
                        <button className="btn btn-soft btn-neutral rounded-full btn-wide">
                          Hoàn Thành Đơn Hàng
                        </button>
                      </div>
                    ) : (
                      <p>Hoàn Thành</p>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
        {activeSection === "tables" && renderTables()}
        {activeSection === "menu" && renderMenu()}
        {activeSection === "reviews" && renderReviews()}
      </div>
    </div>
  );
};

export default MyRestaurant;
