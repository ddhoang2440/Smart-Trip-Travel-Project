// import axios from "axios";
// import { useState, useEffect, useCallback } from "react";

// export default function OrderTable({ orders: initialItems, restaurantId }) {
//   const [items, setItems] = useState([]);
//   const [loadingId, setLoadingId] = useState(null);
//   useEffect(() => {
//     if (initialItems) {
//       const sorted = [...initialItems].sort((a) =>
//         a.status === "PENDING" ? -1 : 1
//       );
//       setItems(sorted);
//     }
//   }, [initialItems]);

//   const refetchOrders = useCallback(async () => {
//     try {
//       const { data } = await axios.get(`/order/${restaurantId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (data.success) {
//         const sorted = [...data.items].sort((a) =>
//           a.status === "PENDING" ? -1 : 1
//         );
//         setItems(sorted);
//       }
//     } catch (err) {
//       console.error("Refetch failed:", err);
//     }
//   }, [restaurantId]);

//   const handleComplete = async (id) => {
//     setLoadingId(id);

//     try {
//       const { data } = await axios.put(
//         `/order/update-status/${id}`,
//         { new_status: "COMPLETED" },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (data.success) {
//         await refetchOrders();
//       } else {
//         alert(data.message || "Cập nhật thất bại");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Cập nhật thất bại. Vui lòng thử lại!");
//     } finally {
//       setLoadingId(null);
//     }
//   };
//   const handleCanceled = async (id) => {
//     setLoadingId(id);

//     try {
//       const { data } = await axios.put(
//         `/order/update-status/${id}`,
//         { new_status: "CANCELED" },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (data.success) {
//         await refetchOrders();
//       } else {
//         alert(data.message || "Cập nhật thất bại");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Cập nhật thất bại. Vui lòng thử lại!");
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const delivered = items.filter((i) => i.status === "COMPLETED").length;
//   const processing = items.filter((i) => i.status === "PENDING").length;
//   const canceled = items.filter((i) => i.status === "CANCELED").length;

//   return (
//     <div>
//       <div className="grid grid-cols-3 gap-4 mt-4">
//         <div className="bg-green-100 p-4 rounded-lg text-center shadow">
//           <h2 className="text-2xl font-bold text-green-600">{delivered}</h2>
//           <p>Đã giao</p>
//         </div>
//         <div className="bg-yellow-100 p-4 rounded-lg text-center shadow">
//           <h2 className="text-2xl font-bold text-yellow-600">{processing}</h2>
//           <p>Đang xử lý</p>
//         </div>
//         <div className="bg-red-100 p-4 rounded-lg text-center shadow">
//           <h2 className="text-2xl font-bold text-red-600">{canceled}</h2>
//           <p>Đã hủy</p>
//         </div>
//       </div>

//       <div className="mt-8 overflow-x-auto">
//         <table className="min-w-full bg-white shadow rounded-lg">
//           <thead>
//             <tr className="bg-gray-100 border-b">
//               <th className="px-4 py-3 text-left">Tên món</th>
//               <th className="px-4 py-3 text-left">Số lượng</th>
//               <th className="px-4 py-3 text-left">Giá</th>
//               <th className="px-4 py-3 text-left">Trạng thái</th>
//               <th className="px-4 py-3 text-center">Hành động</th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((item) => (
//               <tr
//                 key={item.id}
//                 className={`border-b hover:bg-gray-50 transition-all ${
//                   item.status === "COMPLETED" ? "bg-gray-50 opacity-80" : ""
//                 }`}
//               >
//                 <td className="px-4 py-3 font-medium">{item.name}</td>
//                 <td className="px-4 py-3">{item.quantity}</td>
//                 <td className="px-4 py-3">{item.price.toLocaleString()}đ</td>

//                 <td className="px-4 py-3">
//                   {item.status === "PENDING" && (
//                     <span className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 text-sm font-medium">
//                       Đang xử lý
//                     </span>
//                   )}
//                   {item.status === "COMPLETED" && (
//                     <span className="px-3 py-1 rounded bg-green-100 text-green-700 text-sm font-medium">
//                       Đã giao
//                     </span>
//                   )}
//                   {item.status === "CANCELED" && (
//                     <span className="px-3 py-1 rounded bg-red-100 text-red-700 text-sm font-medium">
//                       Đã hủy
//                     </span>
//                   )}
//                 </td>

//                 <td className="px-4 py-3">
//                   {item.status === "PENDING" ? (
//                     <div className="flex gap-2 justify-center">
//                       <button
//                         onClick={() => handleComplete(item.id)}
//                         disabled={loadingId === item.id}
//                         className={`px-5 py-2 rounded font-medium transition ${
//                           loadingId === item.id
//                             ? "bg-gray-400 cursor-not-allowed"
//                             : "bg-green-600 hover:bg-green-700 text-white"
//                         }`}
//                       >
//                         {loadingId === item.id ? "Đang xử lý..." : "Hoàn thành"}
//                       </button>
//                       <button
//                         onClick={() => handleCanceled(item.id)}
//                         disabled={loadingId === item.id}
//                         className={`px-5 py-2 rounded font-medium transition ${
//                           loadingId === item.id
//                             ? "bg-gray-400 cursor-not-allowed"
//                             : "bg-red-600 hover:bg-red-700 text-white"
//                         }`}
//                       >
//                         {loadingId === item.id ? "Đang xử lý..." : "Hủy bỏ"}
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="text-center">
//                       {item.status === "COMPLETED" && (
//                         <span className="text-green-600 text-sm font-medium">
//                           Hoàn thành
//                         </span>
//                       )}
//                       {item.status === "CANCELED" && (
//                         <span className="text-red-600 text-sm font-medium">
//                           Hủy bỏ
//                         </span>
//                       )}
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {items.length === 0 && (
//           <div className="text-center py-12 text-gray-500">
//             Chưa có đơn hàng nào
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import axios from "axios";
import { useState, useEffect, useCallback } from "react";

export default function OrderTable({ orders: initialOrders, restaurantId }) {
  const [orders, setOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    if (initialOrders) {
      setOrders([...initialOrders]);
    }
  }, [initialOrders]);

  const refetchOrders = useCallback(async () => {
    try {
      const { data } = await axios.get(`/order/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data.success) {
        setOrders([...data.orders]);
      }
    } catch (err) {
      console.error("Refetch failed:", err);
    }
  }, [restaurantId]);

  const updateOrderStatus = async (orderId, status) => {
    setLoadingId(orderId);
    try {
      const { data } = await axios.put(
        `/order/update-status/${orderId}`,
        { new_status: status },
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

  const delivered = orders.filter((o) => o.status === "COMPLETED").length;
  const processing = orders.filter((o) => o.status === "PENDING").length;
  const canceled = orders.filter((o) => o.status === "CANCELED").length;

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
      <div className="mt-8 overflow-x-auto space-y-6">
        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Chưa có đơn hàng nào
          </div>
        )}

        {orders.map((order) => (
          <div key={order._id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Order ID: {order._id}</h3>
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${
                  order.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "COMPLETED"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.status === "PENDING"
                  ? "Đang xử lý"
                  : order.status === "COMPLETED"
                  ? "Đã giao"
                  : "Đã hủy"}
              </span>
            </div>

            <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-2 text-left">Tên món</th>
                  <th className="px-4 py-2 text-left">Số lượng</th>
                  <th className="px-4 py-2 text-left">Giá</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.item_id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">
                      {item.price.toLocaleString()}đ
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <td></td>
                <td></td>
                <td></td>
                <td className="text-right flex flex-col mt-2 gap-2">
                  <span className="text-2xl">Tổng tiền</span>
                  <span className="text-xl">
                    {order.total_price.toLocaleString()}
                  </span>
                </td>
              </tfoot>
            </table>
            {order.status === "PENDING" && (
              <div className="flex gap-2 justify-end mt-3">
                <button
                  onClick={() => updateOrderStatus(order._id, "COMPLETED")}
                  disabled={loadingId === order._id}
                  className={`px-5 py-2 rounded font-medium transition ${
                    loadingId === order._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {loadingId === order._id ? "Đang xử lý..." : "Hoàn thành"}
                </button>
                <button
                  onClick={() => updateOrderStatus(order._id, "CANCELED")}
                  disabled={loadingId === order._id}
                  className={`px-5 py-2 rounded font-medium transition ${
                    loadingId === order._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {loadingId === order._id ? "Đang xử lý..." : "Hủy bỏ"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
