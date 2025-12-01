import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import { Restaurants } from "../assets/assets";
import FoodFilter from "../components/FoodFilter";
import RestaurantCard from "../components/RestaurantCard";
import RestaurantFilter from "../components/RestaurantFilter";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurants } from "../contexts/ResRedux";
import Pagination from "../components/Pagination";
import { IconCheck } from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";

const Products = () => {
  const { menu } = useSelector((state) => state.menu);

  const [seachtext, setSearchText] = useState("");
  const [seachmenu, setSearchMenu] = useState("");
  const [filtermenu, setFilterMenu] = useState("");
  const [stage, setStage] = useState(false);

  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  //lay url
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "10");
  const sort_by = searchParams.get("sort_by") || "";
  const keyword = searchParams.get("keyword") || "";
  const type = searchParams.get("type");
  //goi fetch
  useEffect(() => {
    // dispatch(getAllRestaurant({ page, limit }));
    dispatch(fetchRestaurants({ page, limit, sort_by, keyword, type }));
  }, [dispatch, limit, page, keyword, sort_by, type]);
  //update query
  const updateQuery = (key, value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (value === "" || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      return params;
    });
  };
  const {
    restaurants,
    loading,
    currentSort,
    pagination,
    total_dishes,
    total_restaurants,
  } = useSelector((state) => state.restaurant);
  // useEffect(() => {
  //   dispatch(
  //     getAllRestaurant({ page: pagination.page, limit: pagination.limit })
  //   );
  // }, [dispatch, pagination.limit, pagination.page]);
  const handleChangePage = (newPage) => {
    // dispatch(getAllRestaurant({ page: newPage, limit: 10 }));
    updateQuery("page", newPage);
  };
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleCheckBox = (type, checked) => {
    setSelectedTypes((prev) => {
      const newSelectedTypes = checked
        ? [...prev, type]
        : prev.filter((t) => t !== type);
      updateQuery("type", newSelectedTypes.join(", "));

      return newSelectedTypes;
    });
  };
  const SORT_OPTIONS = [
    { key: "rating", label: "Đánh giá cao nhất" },
    { key: "distance", label: "Gần nhất" },
    { key: "price_asc", label: "Giá thấp nhất" },
    { key: "price_desc", label: "Giá cao nhất" },
    { key: "review", label: "Nhiều đánh giá nhất" },
  ];

  // Sử dụng dữ liệu từ sortResult nếu có, ngược lại dùng restaurants
  // const displayRestaurants =
  //   sortResult && sortResult.length > 0 ? sortResult : restaurants;

  // const filterRestaurant = displayRestaurants.filter((item) => {
  //   const keyword = seachtext.toLowerCase();
  //   return item.name?.toLowerCase().includes(keyword);
  // });

  // const finalRestaurant = [...filterRestaurant].sort((a, b) => {
  //   switch (filtertype) {
  //     case "lowtohigh":
  //       return (a.medium_price || 0) - (b.medium_price || 0);
  //     case "hightolow":
  //       return (b.medium_price || 0) - (a.medium_price || 0);
  //     default:
  //       return 0; // Sửa từ 1 thành 0 để không thay đổi thứ tự
  //   }
  // });

  const filterMenu = menu.filter((item) => {
    const keyword = seachmenu.toLowerCase();
    return item.name?.toLowerCase().includes(keyword);
  });

  const finalMenu = [...filterMenu].sort((a, b) => {
    switch (filtermenu) {
      case "lowtohigh":
        return (a.price || 0) - (b.price || 0);
      case "hightolow":
        return (b.price || 0) - (a.price || 0);
      default:
        return 0; // Sửa từ 1 thành 0
    }
  });

  // const handleSort = async (sortBy) => {
  //   if (sortBy === currentSort || loading) return;

  //   try {
  //     // Lấy vị trí người dùng nếu có
  //     let userLat = null;
  //     let userLng = null;

  //     // Thử lấy vị trí từ localStorage hoặc mặc định
  //     try {
  //       const userLocation = localStorage.getItem("userLocation");
  //       if (userLocation) {
  //         const location = JSON.parse(userLocation);
  //         userLat = location.lat;
  //         userLng = location.lng;
  //       }
  //     } catch (e) {
  //       console.log("Không thể lấy vị trí người dùng", e);
  //     }

  //     // Gọi API sắp xếp
  //     await dispatch(
  //       fetchRestaurants({
  //         sort_by: sortBy,
  //         lat: userLat,
  //         lng: userLng,
  //         page: pagination.page,
  //         limit: pagination.limit,
  //       })
  //     ).unwrap();
  //   } catch (error) {
  //     console.error("Lỗi khi sắp xếp:", error);
  //   }
  // };

  return (
    <>
      <div className="lg:px-[10vw] px-[5vw] pt-[20vh] pb-[10vh]">
        {!keyword ? (
          <>
            <h1 className="text-6xl font-bold font-playfair">Products</h1>
            <p className="text-xl text-gray-800/60">
              Find all luxury restaurant and food here
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-4 font-playfair text-4xl font-bold lg:text-5xl">
              Kết quả tìm kiếm cho "{keyword}"
            </h1>
            <p className="mb-10 text-lg text-gray-600 lg:text-xl">
              Tìm thấy {total_restaurants || 0} nhà hàng và {total_dishes || 0}{" "}
              món ăn có liên quan
            </p>
          </>
        )}
        <div className="flex flex-row justify-between w-screen lg:w-[80vw] gap-4 ">
          <div className="flex flex-col gap-4 lg:w-[60vw] w-[90vw] py-[4vh]">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-gray-700">Sắp xếp theo:</span>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => updateQuery("sort_by", option.key)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-full transition flex gap-2
                      ${
                        currentSort === option.key
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }
                      ${loading ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    {option.label}
                    {currentSort === option.key && <IconCheck />}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-row flex ">
              <button
                className={`py-3 lg:w-full w-[50vw] px-6 p transition-all duration-300 hover:bg-warning border-r border-gray-800/40 rounded-l-xl ${
                  !stage ? "bg-yellow-400" : "bg-gray-400/20"
                }`}
                onClick={() => setStage(false)}
              >
                Restaurants
              </button>
              <button
                className={`py-3 lg:w-full w-[50vw] px-6 p transition-all duration-300 hover:bg-warning rounded-r-xl ${
                  stage ? "bg-yellow-400" : "bg-gray-400/20"
                }`}
                onClick={() => setStage(true)}
              >
                Foods
              </button>
            </div>
            {!stage ? (
              <div className="flex justify-between lg:w-[80vw] w-[90vw] gap-[4vw] lg:gap-0">
                <div className="flex flex-col">
                  <RestaurantCard data={restaurants} loading={loading} />
                  <div>
                    <Pagination
                      page={pagination.page}
                      totalPages={pagination.total_pages}
                      total={pagination.total}
                      limit={pagination.limit}
                      onChange={handleChangePage}
                    />
                  </div>
                </div>
                <RestaurantFilter
                  selectedTypes={selectedTypes}
                  setSearchText={setSearchText}
                  seachtext={seachtext}
                  onChange={handleCheckBox}
                />
              </div>
            ) : (
              <div className="flex lg:gap-0 gap-9 justify-between lg:w-[80vw] w-[90vw]">
                <Menu data={finalMenu} />
                <FoodFilter
                  setFilterMenu={setFilterMenu}
                  setSearchMenu={setSearchMenu}
                  seachmenu={seachmenu}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Products;
