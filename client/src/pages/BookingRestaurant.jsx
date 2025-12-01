import React, { useState, useEffect } from "react";

const BookingRestaurant = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [restaurants, setRestaurants] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    restaurant_id: "",
    num_people: 2,
    date_time: "",
    payment_method: "CASH",
    special_requests: "",
    promotion_code: "",
  });

  useEffect(() => {
    fetchRestaurants();
    fetchBookings();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/restaurant/search?page=1&limit=50", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setRestaurants(result.restaurants);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/booking/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setBookings(result.bookings || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        showMessage("success", "Đặt bàn thành công!");
        setFormData({
          restaurant_id: "",
          num_people: 2,
          date_time: "",
          payment_method: "CASH",
          special_requests: "",
          promotion_code: "",
        });
        fetchBookings();
        setActiveTab("history");
      } else {
        showMessage("error", result.message || "Đặt bàn thất bại!");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      showMessage("error", "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Bạn có chắc muốn hủy đơn đặt bàn này?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/booking/${bookingId}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        showMessage("success", "Hủy đơn thành công!");
        fetchBookings();
      } else {
        showMessage("error", result.message || "Hủy đơn thất bại!");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      showMessage("error", "Có lỗi xảy ra!");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "COMPLETED":
        return "Đã hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đặt Bàn Nhà Hàng
          </h1>
          <p className="text-gray-600">Đặt bàn dễ dàng và nhanh chóng</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("create")}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === "create"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Đặt Bàn Mới
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === "history"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Lịch Sử Đặt Bàn
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Create Booking Form */}
            {activeTab === "create" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Restaurant Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn Nhà Hàng *
                    </label>
                    <select
                      required
                      value={formData.restaurant_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          restaurant_id: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn nhà hàng</option>
                      {restaurants.map((restaurant) => (
                        <option key={restaurant._id} value={restaurant._id}>
                          {restaurant.name} - {restaurant.address}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Number of People */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số Người *
                    </label>
                    <select
                      required
                      value={formData.num_people}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          num_people: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} người
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date and Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày & Giờ *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.date_time}
                      onChange={(e) =>
                        setFormData({ ...formData, date_time: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phương Thức Thanh Toán
                    </label>
                    <select
                      value={formData.payment_method}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_method: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="CASH">Tiền mặt</option>
                      <option value="BANKING">Chuyển khoản</option>
                      <option value="MOMO">Ví MoMo</option>
                    </select>
                  </div>

                  {/* Promotion Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã Khuyến Mãi
                    </label>
                    <input
                      type="text"
                      value={formData.promotion_code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          promotion_code: e.target.value,
                        })
                      }
                      placeholder="Nhập mã khuyến mãi (nếu có)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yêu Cầu Đặc Biệt
                  </label>
                  <textarea
                    value={formData.special_requests}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        special_requests: e.target.value,
                      })
                    }
                    placeholder="Ví dụ: Bàn gần cửa sổ, không gian yên tĩnh..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? "Đang xử lý..." : "Đặt Bàn Ngay"}
                  </button>
                </div>
              </form>
            )}

            {/* Booking History */}
            {activeTab === "history" && (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có đơn đặt bàn nào
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {booking.restaurant?.name || "Nhà hàng"}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {booking.restaurant?.address}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusText(booking.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Số người:</span>
                          <p className="font-medium">
                            {booking.num_people} người
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Thời gian:</span>
                          <p className="font-medium">
                            {formatDateTime(booking.date_time)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Thanh toán:</span>
                          <p className="font-medium">
                            {booking.payment_method === "CASH"
                              ? "Tiền mặt"
                              : booking.payment_method === "BANKING"
                              ? "Chuyển khoản"
                              : "Ví MoMo"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Phí đặt bàn:</span>
                          <p className="font-medium">
                            {booking.feeBooking.toLocaleString()} VND
                          </p>
                        </div>
                      </div>

                      {booking.special_requests && (
                        <div className="mt-3">
                          <span className="text-gray-500 text-sm">
                            Yêu cầu đặc biệt:
                          </span>
                          <p className="text-sm mt-1">
                            {booking.special_requests}
                          </p>
                        </div>
                      )}

                      {booking.status === "PENDING" && (
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Hủy Đơn
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingRestaurant;
