import React, { useEffect, useState } from "react";
import axios from "axios";

const VoucherDropdown = ({ totalPrice, onApply }) => {
  const [vouchers, setVouchers] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await axios.get("/voucher/get");
        if (res.data.success) {
          setVouchers(res.data.vouchers);
          console.log("Voucher: ", vouchers);
        }
      } catch (err) {
        console.error("Fetch vouchers error:", err);
      }
    };
    fetchVouchers();
  }, [vouchers]);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleApply = async (code) => {
    try {
      const res = await axios.post("/voucher/check", {
        code,
        total_price: totalPrice,
      });
      if (res.data.success) {
        onApply(code, res.data.discount_amount);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-2 mt-4">
      <div>lmao</div>
      {vouchers.map((v, idx) => (
        <div key={v._id} className="border rounded shadow-sm overflow-hidden">
          <button
            onClick={() => handleToggle(idx)}
            className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
          >
            <span>
              {v.code} -{" "}
              {v.type === "PERCENT" ? `${v.discount}%` : `${v.discount}đ`}
            </span>
            <span>{openIndex === idx ? "-" : "+"}</span>
          </button>
          {openIndex === idx && (
            <div className="px-4 py-2 bg-white border-t">
              <p>
                Giảm tối đa:{" "}
                {v.type === "PERCENT" ? `${v.discount}%` : `${v.discount}đ`}
              </p>
              <p>Đơn tối thiểu: {v.min_order_value} đ</p>
              <p>
                Hạn sử dụng: {new Date(v.start_date).toLocaleDateString()} -{" "}
                {new Date(v.end_date).toLocaleDateString()}
              </p>
              <p>Số lượng còn lại: {v.limit}</p>
              <button
                onClick={() => handleApply(v.code)}
                className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VoucherDropdown;
