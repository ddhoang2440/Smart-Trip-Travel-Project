import axios from "axios";
import { useState, useEffect, useCallback } from "react";

export default function OrderTable({ orderItems: initialItems, restaurantId }) {
  const [items, setItems] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  useEffect(() => {
    if (initialItems) {
      const sorted = [...initialItems].sort((a) =>
        a.status === "PENDING" ? -1 : 1
      );
      setItems(sorted);
    }
  }, [initialItems]);

  const refetchOrders = useCallback(async () => {
    try {
      const { data } = await axios.get(`/order/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data.success) {
        const sorted = [...data.items].sort((a) =>
          a.status === "PENDING" ? -1 : 1
        );
        setItems(sorted);
      }
    } catch (err) {
      console.error("Refetch failed:", err);
    }
  }, [restaurantId]);

  const handleComplete = async (id) => {
    setLoadingId(id);

    try {
      const { data } = await axios.put(
        `/order/update-status/${id}`,
        { new_status: "COMPLETED" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        await refetchOrders();
      } else {
        alert(data.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại. Vui lòng thử lại!");
    } finally {
      setLoadingId(null);
    }
  };
  const handleCanceled = async (id) => {
    setLoadingId(id);

    try {
      const { data } = await axios.put(
        `/order/update-status/${id}`,
        { new_status: "CANCELED" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        await refetchOrders();
      } else {
        alert(data.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại. Vui lòng thử lại!");
    } finally {
      setLoadingId(null);
    }
  };

  const delivered = items.filter((i) => i.status === "COMPLETED").length;
  const processing = items.filter((i) => i.status === "PENDING").length;
  const canceled = items.filter((i) => i.status === "CANCELED").length;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-green-100 p-4 rounded-lg text-center shadow">
          <h2 className="text-2xl font-bold text-green-600">{delivered}</h2>
          <p>Đã giao</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center shadow">
          <h2 className="text-2xl font-bold text-yellow-600">{processing}</h2>
          <p>Đang xử lý</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg text-center shadow">
          <h2 className="text-2xl font-bold text-red-600">{canceled}</h2>
          <p>Đã hủy</p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-3 text-left">Tên món</th>
              <th className="px-4 py-3 text-left">Số lượng</th>
              <th className="px-4 py-3 text-left">Giá</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className={`border-b hover:bg-gray-50 transition-all ${
                  item.status === "COMPLETED" ? "bg-gray-50 opacity-80" : ""
                }`}
              >
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3">{item.price.toLocaleString()}đ</td>

                <td className="px-4 py-3">
                  {item.status === "PENDING" && (
                    <span className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 text-sm font-medium">
                      Đang xử lý
                    </span>
                  )}
                  {item.status === "COMPLETED" && (
                    <span className="px-3 py-1 rounded bg-green-100 text-green-700 text-sm font-medium">
                      Đã giao
                    </span>
                  )}
                  {item.status === "CANCELED" && (
                    <span className="px-3 py-1 rounded bg-red-100 text-red-700 text-sm font-medium">
                      Đã hủy
                    </span>
                  )}
                </td>

                <td className="px-4 py-3">
                  {item.status === "PENDING" ? (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleComplete(item.id)}
                        disabled={loadingId === item.id}
                        className={`px-5 py-2 rounded font-medium transition ${
                          loadingId === item.id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        {loadingId === item.id ? "Đang xử lý..." : "Hoàn thành"}
                      </button>
                      <button
                        onClick={() => handleCanceled(item.id)}
                        disabled={loadingId === item.id}
                        className={`px-5 py-2 rounded font-medium transition ${
                          loadingId === item.id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                      >
                        {loadingId === item.id ? "Đang xử lý..." : "Hủy bỏ"}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      {item.status === "COMPLETED" && (
                        <span className="text-green-600 text-sm font-medium">
                          Hoàn thành
                        </span>
                      )}
                      {item.status === "CANCELED" && (
                        <span className="text-red-600 text-sm font-medium">
                          Hủy bỏ
                        </span>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Chưa có đơn hàng nào
          </div>
        )}
      </div>
    </div>
  );
}
