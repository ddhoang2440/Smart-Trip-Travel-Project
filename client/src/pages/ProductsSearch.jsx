// // import React from "react";
// // import { useSelector } from "react-redux";
// // import RestaurantCard from "../components/RestaurantCard";

// // const ProductsSearch = () => {
// //   const { restaurants } = useSelector((state) => state.restaurant);

// //   return (
// //     <div className="flex justify-between lg:w-[80vw] w-[90vw] gap-[4vw] lg:gap-0">
// //       <RestaurantCard data={restaurants} />
// //       {/* <RestaurantFilter
// //                   setFilterType={setFilterType}
// //                   setSearchText={setSearchText}
// //                   seachtext={seachtext}
// //                 /> */}
// //     </div>
// //   );
// // };

// // export default ProductsSearch;
// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import RestaurantCard from "../components/RestaurantCard";
// import { searchDish, setCurrent } from "../contexts/ResRedux";
// import { formatPrice } from "../components/ultil";
// import {
//   IconChefHat,
//   IconCurrencyDollar,
//   IconFileDescription,
//   IconHome,
//   IconMapPin,
//   IconStar,
//   IconStarFilled,
// } from "@tabler/icons-react";
// const ProductsSearch = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleRestaurantClick = (restaurant) => {
//     dispatch(setCurrent(restaurant));
//     navigate(`/restaurant/${restaurant._id}`);
//   };
//   const { searchResult, loading, error } = useSelector(
//     (state) => state.restaurant
//   );

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const keyword = params.get("keyword") || "";

//     if (!keyword.trim()) {
//       navigate("/restaurants", { replace: true });
//       return;
//     }
//     dispatch(
//       searchDish({
//         keyword,
//       })
//     );
//   }, [location.search, dispatch, navigate]);

//   if (loading) {
//     return <div className="text-center py-10">Đang tìm kiếm nhà hàng...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500 text-center py-10">{error}</div>;
//   }

//   return (
//     <div className="min-h-screen bg-base-100 px-4 py-20 lg:px-8 lg:py-24">
//       <div className="mx-auto max-w-[80vw] mt-20">
//         <h1 className="mb-4 font-playfair text-4xl font-bold lg:text-5xl">
//           Kết quả tìm kiếm cho "
//           {searchResult.search_query ||
//             new URLSearchParams(location.search).get("keyword") ||
//             "nhà hàng"}
//           "
//         </h1>
//         <p className="mb-10 text-lg text-gray-600 lg:text-xl">
//           Tìm thấy {searchResult.total_restaurants || 0} nhà hàng và{" "}
//           {searchResult.total_dishes || 0} món ăn có liên quan
//         </p>
//         {/* Bỏ hết các w-[80vw], gap-[4vw] thủ công */}
//         <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
//           {searchResult.restaurants?.map((dat) => {
//             const hasMatchedMenus = dat.matched_menus?.length > 0;
//             return (
//               <div key={dat._id} className="flex flex-col gap-6">
//                 <div className="card bg-base-100 shadow-xl transition-shadow hover:shadow-2xl lg:card-side">
//                   <figure
//                     className="lg:w-80"
//                     onClick={(e) => (
//                       e.preventDefault(), handleRestaurantClick(dat)
//                     )}
//                   >
//                     <img
//                       src={
//                         dat.image ||
//                         "https://cdn.pixabay.com/photo/2016/11/21/16/02/outdoor-dining-1846137_640.jpg"
//                       }
//                       alt={dat.name}
//                       className="cursor-pointer h-64 w-full object-cover lg:h-full lg:rounded-l-2xl lg:rounded-r-none"
//                     />
//                   </figure>

//                   <div className="card-body">
//                     <h2
//                       className="card-title text-2xl font-bold flex items-center gap-2 cursor-pointer"
//                       onClick={(e) => (
//                         e.preventDefault(), handleRestaurantClick(dat)
//                       )}
//                     >
//                       <IconHome className="h-6 w-6" />
//                       {dat.name}
//                     </h2>
//                     <div className="my-3 flex items-center gap-2">
//                       <div className="flex">
//                         {[...Array(5)].map((_, i) =>
//                           i < Math.floor(dat.rating) ? (
//                             <IconStarFilled
//                               key={i}
//                               className="h-5 w-5 text-orange-500"
//                             />
//                           ) : (
//                             <IconStar
//                               key={i}
//                               className="h-5 w-5 text-orange-500"
//                             />
//                           )
//                         )}
//                       </div>
//                       <span className="font-semibold">{dat.rating} sao</span>
//                     </div>

//                     <p className="flex items-center gap-2">
//                       <IconCurrencyDollar className="h-5 w-5" />
//                       Trung bình:{" "}
//                       <strong>{formatPrice(dat.medium_price)}đ</strong>/bữa
//                     </p>

//                     <p
//                       className="flex items-center gap-2 tooltip"
//                       data-tip={dat.address}
//                     >
//                       <IconMapPin className="h-5 w-5" />
//                       <span className="truncate">{dat.address}</span>
//                     </p>

//                     <div className="card-actions mt-6 justify-end">
//                       <button
//                         className="btn btn-accent text-white"
//                         onClick={() => handleRestaurantClick(dat)}
//                       >
//                         Xem chi tiết
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//                 {hasMatchedMenus && (
//                   <div className="collapse collapse-arrow rounded-xl border border-base-300 bg-base-200">
//                     <input type="checkbox" />
//                     <div className="collapse-title flex items-center gap-3 text-lg font-semibold">
//                       <IconChefHat className="h-6 w-6" />
//                       {dat.matched_menus.length} món ăn phù hợp
//                     </div>
//                     <div className="collapse-content space-y-5 pt-4">
//                       {dat.matched_menus.map((item, i) => (
//                         <a
//                           href=""
//                           onClick={(e) => (
//                             e.preventDefault(), handleRestaurantClick(dat)
//                           )}
//                         >
//                           <div
//                             key={i}
//                             className="flex gap-4 rounded-xl bg-base-100 p-5 shadow-sm"
//                           >
//                             <img
//                               src={item.image || "/placeholder.jpg"}
//                               alt={item.name}
//                               className="h-20 w-20 shrink-0 rounded-full border-4 border-accent object-cover"
//                             />
//                             <div className="flex-1">
//                               <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
//                                 <h3 className="text-xl font-bold">
//                                   {item.name}
//                                 </h3>
//                                 <span className="badge badge-success badge-lg">
//                                   {formatPrice(item.price)}đ
//                                 </span>
//                               </div>
//                               {item.ingredient && (
//                                 <p className="text-sm text-gray-600">
//                                   <span className="font-medium">
//                                     Nguyên liệu:
//                                   </span>
//                                   {item.ingredient.join(", ")}
//                                 </p>
//                               )}
//                               {item.description && (
//                                 <p className="mt-1 text-sm italic text-gray-700">
//                                   {item.description}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </a>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductsSearch;
