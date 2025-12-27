import {
  Icon12Hours,
  IconArrowRight,
  IconArrowRightBar,
  IconBellFilled,
  IconChartDonutFilled,
  IconMapPinFilled,
  IconMichelinStar,
  IconPlayCard1Filled,
  IconPoint,
  IconPointFilled,
  IconSearch,
  IconSquareDot,
} from "@tabler/icons-react";
import React, { useState } from "react";
import Title from "../components/Title";
import Footer from "../components/Footer";
import AvatarCard from "../components/AvatarCard";
import HoverCard from "../components/HoverCard";
import {useDispatch, useSelector} from 'react-redux'
import { Activity } from "react";
import { useNavigate } from "react-router-dom";
import { setCurrent } from "../contexts/ResRedux";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { popularRestaurant, restaurants } = useSelector((state) => state.restaurant)


  
  const [searchtext, setSearchText] = useState("")
  const [searchitem, setSearchItem] = useState(false)

   const filterRestaurant = restaurants.filter((item) => {
     const keyword = searchtext.toLowerCase();
     return item.name?.toLowerCase().includes(keyword) || item.address?.toLowerCase().includes(keyword);
   });
  
    const handleCurrent = (_res) => {
      dispatch(setCurrent(_res));
      navigate("/restaurant");
  };
  
      return (
        <>
          <div className={`w-full h-screen flex flex-col gap-4 shadow-2xl `}>
            <div className="rethink relative bg-indigo-50/20 flex flex-col h-full items-center justify-center mt-[12vh] text-sm px-4 md:px-16 lg:px-24 xl:px-40 text-gray-800">
              <h1 className="text-4xl md:text-5xl font-semibold max-w-lg md:max-w-2xl text-center mt-4 leading-tight md:leading-tight">
                Tìm Kiếm{" "}
                <span className="relative bg-linear-to-r from-purple-700 to-[#764de1] bg-clip-text text-transparent">
                  Nhà Hàng{" "}
                  <div className="z-10 absolute bottom-0 left-0 w-full scale-120">
                    <img
                      src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gradient_arc.svg"
                      alt="gradient"
                    />
                  </div>
                </span>
                <p>
                  Tốt Nhất{" "}
                  <span className="relative bg-linear-to-r from-[#764de1] to-indigo-600 bg-clip-text text-transparent">
                    {" "}
                    Với{" "}
                  </span>
                  Golden<span className="text-yellow-500">Plate</span>
                </p>
              </h1>
              <p className="max-w-xl text-center text-base my-4">
                Khám phá những nhà hàng có đánh giá cao, Xem những món ngon, Và
                đặt bàn, đưa trải nghiệm của bản lên tầm cao mới
              </p>
              <div className="w-full flex justify-center group relative ">
                <label className="border bg-white border-gray-400 lg:w-[30vw] w-[80vw] rounded-md py-3 px-4 p-1 flex items-center ">
                  <IconSearch />
                  <input
                    type="text"
                    placeholder="Tìm nhà hàng nếu bạn biết tên..."
                    className="pl-2 flex-1  outline-none text-xl"
                    value={searchtext}
                    onChange={(e) => setSearchText(e.target.value)}
                    onFocus={() => setSearchItem(true)}
                    onBlur={() => setSearchItem(false)}
                  />
                </label>
                <Activity mode={searchitem ? "visible" : "hidden"}>
                  <div className="absolute flex flex-col overflow-y-scroll max-h-[40vh] top-16 z-100 lg:w-[30vw] w-[80vw] rounded-lg bg-white shadow-lg">
                    {filterRestaurant.slice(0, 10).map((item) => (
                      <div
                        key={"filter" + item._id}
                        className="px-4 hover:cursor-pointer justify-between hover:bg-slate-100 py-2 flex flex-row items-center font-semibold gap-2"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleCurrent(item)}
                      >
                        <div className="flex flex-row lg:w-[20vw] gap-2 items-center">
                          <img
                            src={item.images[0]}
                            alt=""
                            className="lg:w-[3vw] lg:h-[3vw] w-[12vw] h-[12vw]"
                          />
                          <div className="flex flex-col gap-1">
                            <p className="font-semibold text-sm">{item.name}</p>
                            <p className="font-normal ">{item.address}</p>
                          </div>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                          <p className="text-[#20BB5B] lg:flex hidden">
                            đang mở cửa
                          </p>
                          <IconPointFilled color="#20BB5B" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Activity>
              </div>
            </div>
            <HoverCard data={popularRestaurant} />
          </div>
          <div>

            <div className="px-[14vw] py-[16vh] bg-linear-to-b from-white to-warning flex flex-col items-center justify-center gap-[8vh]">
              <h1 className="text-warning lg:text-6xl text-4xl font-bold text-center">
                Sử Dụng Như Thế Nào ?
              </h1>
              <div className="lg:flex grid grid-cols-2 flex-row gap-24">
                <div className="flex flex-col gap-4 items-center">
                  <IconMapPinFilled size={108} color="orange" />
                  <b className="text-lg lg:text-2xl text-center">Vị Trí</b>
                  <p className="lg:max-w-[12vw] max-w-[30vw] text-center text-white text-sm lg:text-xl">
                    Chọn vị trí của bạn để được giao hàng tận nơi
                  </p>
                </div>
                <div className="flex flex-col gap-4 items-center">
                  <IconBellFilled size={108} color="orange" />
                  <b className="lg:text-2xl text-lg text-center  max-w-[20vw] lg:max-w-[100vw]">
                    Thực Đơn
                  </b>
                  <p className="max-w-[30vw] lg:max-w-[12vw] text-center text-white text-sm lg:text-xl">
                    Hàng trăm món ăn đang đợi bạn khám phá
                  </p>
                </div>
                <div className="flex flex-col gap-4 items-center">
                  <IconPlayCard1Filled size={108} color="orange" />
                  <b className="text-lg lg:text-2xl text-center">Trả Phí</b>
                  <p className="max-w-[30vw] lg:max-w-[12vw] text-center text-white text-sm lg:text-xl">
                    Nhanh và gọn. Có Nhiều phương thức khác nhau
                  </p>
                </div>
                <div className="flex flex-col gap-4 items-center">
                  <IconChartDonutFilled size={108} color="orange" />
                  <b className="text-lg lg:text-2xl max-w-[20vw] lg:max-w-[100vw]  text-center">
                    Tiện Lợi
                  </b>
                  <p className="max-w-[30vw] lg:max-w-[12vw] text-center text-white text-sm lg:text-xl">
                    Được ship tận nơi nếu không muốn đến trực tiếp
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:px-[14vw] px-[4vw] bg-yellow-700/10 py-[8vh] lg:py-[16vh] ">
              <div className="bg-white shadow-gray rounded-box w-full flex flex-col lg:flex-row mb-[10vh] max-h-[60vh]">
                <div className="lg:flex hidden flex-col justify-between lg:px-16 px-4 py-8 lg:gap-0 gap-2 lg:w-2/5 w-full  items-center">
                  <div className="flex flex-col gap-5 lg:mt-16">
                    <p className="text-xl lg:text-5xl font-bold">
                      Món Tây:{" "}
                      <span className="text-warning">Sanwiches Giòn Rụm</span>{" "}
                    </p>
                    <p className="text-sm lg:text-xl text-neutral-400">
                      Thưởng thức sandwich cỡ lớn, những lát cắt hoàn hảo cho
                      từng chiếc bánh
                    </p>
                  </div>
                  <button className="btn lg:btn-wide btn-sm btn-warning lg:btn-lg text-white">
                    Tiếp tục khám phá <IconArrowRightBar color="white" />
                  </button>
                </div>
                <img
                  className="lg:w-3/5 w-full rounded-box"
                  src="/sandwitch.jpg"
                  alt=""
                />
              </div>
              <div className="bg-white shadow-gray rounded-box w-full max-h-[60vh] flex flex-row mb-[10vh]">
                <img
                  className="w-full lg:w-3/5 rounded-box"
                  src="https://cdn.pixabay.com/photo/2020/09/26/02/08/banh-xeo-5602960_960_720.jpg"
                  alt=""
                />

                <div className="hidden lg:flex flex-col justify-between lg:px-16 px-4 py-8  lg:gap-0 gap-2 w-2/5 items-center">
                  <div className="flex flex-col gap-5 lg:mt-16">
                    <p className="text-xl lg:text-5xl font-bold">
                      {" "}
                      Đặc Biệt{" "}
                      <span className="text-warning">
                        Bánh Xèo Giòn Rụm
                      </span>{" "}
                    </p>
                    <p className="text-sm lg:text-xl text-neutral-400">
                      Thưởng thức bánh xèo cỡ lớn, giòn tan từng miếng. Hoàn hảo
                      từ lớp vỏ đến nhân đầy đặn – món ăn khiến bạn phải xuýt
                      xoa từng lần cắn!
                    </p>
                  </div>
                  <button className="btn lg:btn-wide btn-sm btn-warning lg:btn-lg text-white">
                    Tiếp tục khám phá
                    <IconArrowRightBar color="white" />
                  </button>
                </div>
              </div>
              <div className="bg-white shadow-gray rounded-box w-full max-h-[60vh] flex flex-row mb-[2vh] lg:mb-[10vh]">
                <div className="hidden lg:flex flex-col justify-between lg:px-16 px-4 py-8 lg:gap-0 gap-2 w-2/5 items-center">
                  <div className="flex flex-col gap-5 lg:mt-16">
                    <p className="text-xl lg:text-5xl font-bold">
                      {" "}
                      Miền Tây{" "}
                      <span className="text-warning">
                        Bún Nước Lèo – Trọn Vị Miền Tây
                      </span>{" "}
                    </p>
                    <p className="text-sm lg:text-xl text-neutral-400">
                      Tô bún nóng hổi, đậm đà hương vị đặc trưng. Sợi bún mềm
                      mại hòa quyện cùng nước lèo thơm ngon – một trải nghiệm ẩm
                      thực không thể bỏ qua!
                    </p>
                  </div>
                  <button className="btn lg:btn-wide btn-sm btn-warning lg:btn-lg text-white">
                    Tiếp tục khám phá <IconArrowRightBar color="white" />
                  </button>
                </div>
                <img
                  className="w-full lg:w-3/5 rounded-box"
                  src="https://mia.vn/media/uploads/blog-du-lich/bun-nuoc-leo-soc-trang-dam-da-huong-vi-am-thuc-tay-nam-bo-01-1664031706.jpeg"
                  alt=""
                />
              </div>
            </div>
          </div>
          <Footer />
        </>
      );
};

export default Home;
