import {
  IconBox,
  IconCheckbox,
  IconCurrency,
  IconCurrencyDollar,
  IconHome,
  IconMap,
  IconMapPin,
  IconMinus,
  IconNumber,
  IconPlus,
  IconStar,
  IconStarFilled,
  IconToolsKitchen2,
  IconTrash,
  IconX,
  IconArrowBigRightLinesFilled
} from "@tabler/icons-react";
import React, { useState, useEffect } from "react";
import { Restaurants } from "../assets/assets";
import Footer from "../components/Footer";
import { CheckOut } from "../components/CheckOut";
import { useDispatch, useSelector } from "react-redux";
import { changeQuantity, createOrder, decreaseQuantity, increaseQuantity, removeProduct } from "../contexts/CartRedux";
import { formatPrice } from "../components/ultil";
import axios from "axios";
import toast from "react-hot-toast";
const ShopCart = () => {
  const dispatch = useDispatch();

  const [check, setCheck] = useState(false);
  const { usercart } = useSelector((state) => state.cart);
  const { username, email, contact} = useSelector((state) => state.auth )

  const [address, setAddress] = useState("");
  const [_user, set_User] = useState(username);
  const [_email, set_Email] = useState(email);
  const [_contact, set_Contact] = useState(contact);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  
  const subTotal = usercart.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);

  useEffect(() => {
    if (appliedVoucher) {
        let discount = 0;
        if (appliedVoucher.type === "PERCENT") {
          discount = subTotal * (appliedVoucher.discount / 100);
        } else {
          discount = appliedVoucher.discount;
        }
        // Không giảm quá tổng tiền
        if (discount > subTotal) discount = subTotal;
        
        setDiscountAmount(discount);
    } else {
        // Nếu không có voucher (ví dụ bị xóa hoặc chưa áp dụng), reset về 0
        setDiscountAmount(0);
    }
  }, [usercart, subTotal, appliedVoucher]);

  const handleShipping = async() => {
    let total_price = 0;
    const _cart = usercart.map((item) => {
      const newItem = {
        menu: item._id,
        restaurant: item.restaurant._id,
        quantity: item.quantity,
        price: item.price,
      }
      total_price += item.price * item.quantity || 0;
      return newItem;
    })
    const ship = {
      items: _cart,
      user: _user,
      email: _email,
      contact: _contact,
      address: address,
      total_price,
      voucher_code: voucherCode
    }
      try {
        const resultAction = await dispatch(createOrder(ship));
        
        if (createOrder.fulfilled.match(resultAction)) {
            // Thành công
            toast.success("Order successful!");
            setCheck(false); // <-- Đóng Popup
            // Có thể thêm lệnh xóa giỏ hàng ở đây nếu muốn
        } else {
            // Thất bại
            toast.error(resultAction.payload || "Order failed");
        }
    } catch (err) {
        console.error(err);
    }
  }

  
  const handleApplyVoucher = async () => {
    if (!voucherCode) return toast.error("Please enter the code!");

    try {
      const res = await axios.post("http://localhost:3000/voucher/check", { code: voucherCode });
      
      if (res.data.success) {
        const voucher = res.data.voucher;
        setAppliedVoucher(voucher); // Lưu voucher lại
        
        // TÍNH TIỀN GIẢM
        let discount = 0;
        if (voucher.type === "PERCENT") {
          discount = subTotal * (voucher.discount / 100);
        } else {
          discount = voucher.discount;
        }
        
        // Không giảm quá tổng tiền
        if (discount > subTotal) discount = subTotal;
        
        setDiscountAmount(discount);
        toast.success("Code applied successfully!");
      } else {
        // Reset nếu mã sai
        setAppliedVoucher(null);
        setDiscountAmount(0);
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Code check error");
    }
  };


  
  return (
    <>
      <CheckOut check={check} setCheck={setCheck} email={_email} user={_user} address={address} contact={_contact} setAddress={setAddress}
      setContact={set_Contact} setEmail={set_Email} setUser={set_User} handleShipping={handleShipping}/>
      <div className="py-[18vh] px-[6vw] lg:px-[10vw]">
        <h1 className="font-bold font-playfair text-5xl">Shopping Cart</h1>
        <p className="text-gray-600/80 py-4 lg:max-w-[30vw]">
          Easily manage your past, current, and upcoming hotel reservations in
          one place. Plan your trips seamlessly with just a few clicks
        </p>
        <div className="flex flex-col gap-4 lg:px-[4vw] mt-[4vh]">
          {usercart.map((data, idx) => {
            return (
              <React.Fragment key={data._id}>
                {idx === 0 && (
                  <div className="lg:grid hidden grid-cols-[1fr_auto_auto_auto_auto] gap-4 w-full border-b border-gray-600/70 px-4 py-2 items-center">
                    <h1 className="text-left flex gap-2 items-center">
                      <IconToolsKitchen2 />
                      Product
                    </h1>
                    <h1 className="flex w-[10vw] items-center justify-center">
                      <IconCurrencyDollar />
                      Price
                    </h1>
                    <h1 className="flex w-[10vw] items-center justify-center gap-1">
                      <IconBox />
                      Quantity
                    </h1>
                    <h1 className="flex w-[10vw] items-center justify-center">
                      <IconCurrencyDollar />
                      Total
                    </h1>
                    <h1 className="flex w-[8vw] items-center justify-center gap-1">
                      <IconTrash />
                      Remove
                    </h1>
                  </div>
                )}
                <div className="lg:grid grid-cols-3 lg:grid-cols-[1fr_auto_auto_auto_auto] gap-4 w-full border-b border-gray-500/40 py-4 px-2 items-center">
                  <div className="flex gap-4 items-center min-w-0">
                    {" "}
                    <img
                      className="lg:w-[10vw] lg:h-[7vw] size-[30vw] object-cover rounded-lg shrink-0"
                      src={data.image}
                      alt=""
                    />
                    <div className="flex flex-col gap-1 py-2 lg:min-w-[5vw] min-w-[50vw] flex-1">
                      <p className="text-lg font-semibold truncate flex gap-1">
                        <IconToolsKitchen2 className="shrink-0" />
                        {data.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <IconMap className="shrink-0" />
                        <p className="text-sm text-gray-600 truncate">
                          {data.restaurant.address}
                        </p>
                      </div>
                      <div className="flex gap-1 items-center">
                        <IconHome className="shrink-0" />
                        <p className="text-sm text-gray-600 truncate">
                          {data.restaurant.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="lg:block hidden text-lg text-center w-[10vw]">
                    {formatPrice(data.price)}đ
                  </div>
                  <div className="lg:flex hidden justify-center w-[10vw]">
                    <div className="bg-gray-300/40 flex items-center gap-4 py-2 px-4 rounded-full">
                      <IconMinus
                        onClick={() => dispatch(decreaseQuantity(idx))}
                        className="cursor-pointer"
                        size={16}
                      />
                      <input
                        type="number"
                        className="border-x-2 border-gray-300 appearance-none w-[2vw] text-center"
                        onChange={(e) =>
                          dispatch(
                            changeQuantity({
                              idx,
                              value: parseInt(e.target.value),
                            })
                          )
                        }
                        value={data.quantity}
                      />
                      <IconPlus
                        onClick={() => dispatch(increaseQuantity(idx))}
                        className="cursor-pointer"
                        size={16}
                      />
                    </div>
                  </div>

                  <div className="text-lg lg:block hidden text-center w-[10vw]">
                    {formatPrice(data.price * data.quantity)}đ
                  </div>
                  <div
                    className=" justify-center w-[8vw] lg:flex hidden"
                    onClick={() => dispatch(removeProduct(idx))}
                  >
                    <IconX className="cursor-pointer" />
                  </div>

                  {/* */}
                  <div className="lg:hidden flex flex-row justify-between lg:w-auto py-[2vh] items-center">
                    <div className="flex flex-col gap-2 items-center">
                      <p className="flex flex-row text-sm items-center">
                        <IconCurrencyDollar /> Price
                      </p>
                      <div className="lg:text-lg font-semibold text-center w-[10vw]">
                        {formatPrice(data.price)}đ
                      </div>
                    </div>
                    <div className="flex justify-center w-[10vw]">
                      <div className="flex text-sm flex-col items-center gap-2">
                        <p className="flex items-center">
                          <IconBox /> Quantity
                        </p>
                        <div className="bg-gray-300/40 flex items-center gap-3 py-1 px-2 rounded-full">
                          <IconMinus className="cursor-pointer" size={10} />
                          <input
                            type="number"
                            className="border-x-2 border-gray-300 appearance-none w-[4vw] text-center"
                            onChange={(e) =>
                              dispatch(
                                changeQuantity({
                                  idx,
                                  value: parseInt(e.target.value),
                                })
                              )
                            }
                            value={data.quantity}
                          />
                          <IconPlus className="cursor-pointer" size={10} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                      <p className="flex flex-row text-sm items-center">
                        <IconCurrencyDollar /> Total
                      </p>
                      <div className="lg:text-lg font-semibold text-center w-[10vw]">
                        {formatPrice(data.price * data.quantity)}đ
                      </div>
                    </div>
                    <div className="flex   text-sm flex-col items-center gap-2">
                      <p className="flex flex-row text-sm items-center">
                        <IconTrash />
                        Remove
                      </p>
                      <IconX onClick={() => dispatch(removeProduct(idx))} />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div className="flex flex-col  lg:flex-row gap-16 lg:gap-4 justify-between mt-[8vh] ">
          <div className="space-y-8 w-[90vw]  lg:w-[45%]  ">
            <h1 className="text-4xl font-semibold">Coupon Code</h1>
            <div className="bg-white shadow-gray px-6 py-5 flex flex-col gap-6 h-[20vh] ">
              <p className="lg:max-w-[30vw] text-gray-900/70">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
              </p>
              <div className="flex ">
                <input
                  type="text"
                  className="input input-lg w-full"
                  placeholder="Enter Here Code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={handleApplyVoucher} 
                  className="label bg-warning px-4 text-white cursor-pointer hover:bg-warning/80 transition-all"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
          <div className="lg:w-[50%] space-y-8">
            <h1 className="text-4xl font-semibold ">Total Bill</h1>
              <div className="bg-white shadow-gray flex flex-col justify-between gap-2 px-6 py-3 h-auto pb-6">
                <div className="flex flex-row justify-between border-b-2 border-gray-500/20 pb-4">
                  <div className="flex flex-col gap-4">
                    <b className="text-lg">Cart Subtotal</b>
                    <p>Discount</p>
                  </div>
                  
                  <div className="flex flex-col gap-4 text-right">
                    <b>{formatPrice(subTotal)}đ</b>
                    <p className="text-green-600">-{formatPrice(discountAmount)}đ</p>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <b className="text-2xl">Total Amount</b>
                  <b className="text-2xl">{formatPrice(subTotal - discountAmount)}đ</b>
                </div>
              </div>
          </div>
        </div>
        <button
          onClick={() => setCheck(true)}
          className="btn w-full bg-linear-to-r from-warning/30 to-warning/80 text-white mt-[6vh] btn-lg"
        >
          Process to Checkout <IconCheckbox />
        </button>
      </div>
      <Footer />
    </>
  );
};

export default ShopCart;
