// import {
//   IconChevronDown,
//   IconChevronUp,
//   IconClock,
//   IconHeart,
//   IconMapPin,
//   IconNfcOff,
//   IconShoppingCart,
//   IconStar,
// } from "@tabler/icons-react";
// import React, { useState } from "react";

// const FoodCardChat = ({
//   food,
//   onAddToCart,
//   onViewDetails,
//   onToggleFavorite,
//   isFavorite = false,
//   compact = false,
// }) => {
//   const [showDetails, setShowDetails] = useState(false);
//   const [imageError, setImageError] = useState(false);

//   const handleImageError = () => {
//     setImageError(true);
//   };

//   const renderStars = (rating) => {
//     const numericRating = parseFloat(rating) || 0;
//     const fullStars = Math.floor(numericRating);
//     const hasHalfStar = numericRating % 1 >= 0.5;

//     return (
//       <div className="flex items-center gap-1">
//         {[...Array(5)].map((_, i) => (
//           <Star
//             key={i}
//             className={`w-4 h-4 ${
//               i < fullStars
//                 ? "fill-yellow-400 text-yellow-400"
//                 : i === fullStars && hasHalfStar
//                 ? "fill-yellow-400 text-yellow-400 fill-opacity-50"
//                 : "text-gray-300"
//             }`}
//           />
//         ))}
//         <span className="text-sm text-gray-600 ml-1">{rating}</span>
//       </div>
//     );
//   };

//   const renderTags = (tags) => {
//     if (!tags || tags.length === 0) return null;

//     return (
//       <div className="flex flex-wrap gap-2 mt-2">
//         {tags.map((tag, index) => (
//           <span
//             key={index}
//             className={`px-2 py-1 rounded-full text-xs font-medium ${tag.bg} ${tag.color} flex items-center gap-1`}
//           >
//             <span>{tag.icon}</span>
//             {tag.label}
//           </span>
//         ))}
//       </div>
//     );
//   };

//   const renderSpicyIndicator = (spicyInfo) => {
//     if (!spicyInfo || !spicyInfo.label || spicyInfo.label === "Không cay")
//       return null;

//     return (
//       <div
//         className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${spicyInfo.bg}`}
//       >
//         <span className={spicyInfo.color}>{spicyInfo.emoji}</span>
//         <span className={`font-medium ${spicyInfo.color}`}>
//           {spicyInfo.label}
//         </span>
//       </div>
//     );
//   };

//   const renderPrice = (food) => {
//     if (food.discount_percent) {
//       return (
//         <div className="flex items-center gap-2">
//           <span className="text-xl font-bold text-red-600">
//             {food.price_display}
//           </span>
//           <span className="text-sm text-gray-500 line-through">
//             {food.original_price_display}
//           </span>
//           <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
//             -{food.discount_percent}%
//           </span>
//         </div>
//       );
//     }

//     return (
//       <span className="text-xl font-bold text-gray-900">
//         {food.price_display}
//       </span>
//     );
//   };

//   if (compact) {
//     return (
//       <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//         <div className="flex">
//           {/* Image */}
//           <div className="w-24 h-24 flex-shrink-0">
//             <img
//               src={
//                 imageError
//                   ? "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200&h=200&fit=crop"
//                   : food.image
//               }
//               alt={food.name}
//               className="w-full h-full object-cover"
//               onError={handleImageError}
//             />
//           </div>

//           {/* Content */}
//           <div className="flex-1 p-3">
//             <div className="flex justify-between items-start">
//               <h3 className="font-semibold text-gray-900 line-clamp-1">
//                 {food.name}
//               </h3>
//               <button
//                 onClick={() => onToggleFavorite && onToggleFavorite(food)}
//                 className="text-gray-400 hover:text-red-500"
//               >
//                 <IconHeart
//                   className={`w-5 h-5 ${
//                     isFavorite ? "fill-red-500 text-red-500" : ""
//                   }`}
//                 />
//               </button>
//             </div>

//             <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//               {food.description}
//             </p>

//             <div className="flex items-center justify-between mt-2">
//               {renderPrice(food)}
//               <button
//                 onClick={() => onAddToCart && onAddToCart(food)}
//                 className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-1"
//               >
//                 <IconShoppingCart className="w-4 h-4" />
//                 Thêm
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
//       {/* Image with badges */}
//       <div className="relative h-48 overflow-hidden">
//         <img
//           src={
//             imageError
//               ? "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop"
//               : food.image
//           }
//           alt={food.name}
//           className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//           onError={handleImageError}
//         />

//         {/* Discount badge */}
//         {food.discount_percent && (
//           <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
//             -{food.discount_percent}%
//           </div>
//         )}

//         {/* Spicy badge */}
//         {renderSpicyIndicator(food.spicy_level)}

//         {/* Favorite button */}
//         <button
//           onClick={() => onToggleFavorite && onToggleFavorite(food)}
//           className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white"
//         >
//           <Heart
//             className={`w-5 h-5 ${
//               isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
//             }`}
//           />
//         </button>

//         {/* Availability overlay */}
//         {!food.is_available && (
//           <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
//             <span className="text-white font-bold text-lg bg-red-500 px-4 py-2 rounded">
//               HẾT HÀNG
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       <div className="p-4">
//         {/* Header with name and rating */}
//         <div className="flex justify-between items-start">
//           <div className="flex-1">
//             <h3 className="text-lg font-bold text-gray-900">{food.name}</h3>
//             <div className="flex items-center gap-2 mt-1">
//               {renderStars(food.rating)}
//               {food.review_count > 0 && (
//                 <span className="text-sm text-gray-500">
//                   ({food.review_count})
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="text-right">{renderPrice(food)}</div>
//         </div>

//         {/* Description */}
//         {food.description && (
//           <p className="text-gray-600 mt-2 line-clamp-2">{food.description}</p>
//         )}

//         {/* Tags */}
//         {renderTags(food.tags)}

//         {/* Nutrition info */}
//         {food.nutrition_info?.calories && (
//           <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
//             <span className="flex items-center gap-1">
//               🔥 {food.nutrition_info.calories} cal
//             </span>
//             {food.nutrition_info.protein && (
//               <span className="flex items-center gap-1">
//                 🥩 {food.nutrition_info.protein}g protein
//               </span>
//             )}
//           </div>
//         )}

//         {/* Cooking time */}
//         {food.cooking_time && (
//           <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
//             <IconClock className="w-4 h-4" />
//             <span>{food.cooking_time}</span>
//           </div>
//         )}

//         {/* Restaurant info */}
//         <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <IconMapPin className="w-4 h-4 text-blue-600" />
//               <div>
//                 <p className="font-semibold text-gray-900">
//                   {food.restaurant.name}
//                 </p>
//                 {food.restaurant.rating && (
//                   <div className="flex items-center gap-1 text-sm text-gray-600">
//                     <IconStar className="w-3 h-3 fill-yellow-400 text-yellow-400" />
//                     <span>{food.restaurant.rating}</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {food.restaurant.delivery_fee &&
//               food.restaurant.delivery_fee !== "Liên hệ" && (
//                 <span className="text-sm text-gray-600">
//                   🚚 {food.restaurant.delivery_fee}
//                 </span>
//               )}
//           </div>

//           {food.restaurant.address && (
//             <p className="text-xs text-gray-500 mt-1 truncate">
//               {food.restaurant.address}
//             </p>
//           )}
//         </div>

//         {/* Expandable details */}
//         <button
//           onClick={() => setShowDetails(!showDetails)}
//           className="w-full flex items-center justify-center gap-2 mt-3 text-blue-600 hover:text-blue-700"
//         >
//           <IconNfcOff className="w-4 h-4" />
//           <span className="text-sm font-medium">Chi tiết</span>
//           {showDetails ? (
//             <IconChevronUp className="w-4 h-4" />
//           ) : (
//             <IconChevronDown className="w-4 h-4" />
//           )}
//         </button>

//         {showDetails && (
//           <div className="mt-3 pt-3 border-t border-gray-200">
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <div>
//                 <p className="text-gray-500">Danh mục</p>
//                 <p className="font-medium">{food.category}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Tình trạng</p>
//                 <p className="font-medium">
//                   {food.is_available ? "🟢 Còn hàng" : "🔴 Hết hàng"}
//                 </p>
//               </div>
//               {food.is_vegetarian && (
//                 <div className="col-span-2">
//                   <p className="text-gray-500">Đặc điểm</p>
//                   <p className="font-medium text-green-600">🍃 Món chay</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Action buttons */}
//         <div className="flex gap-2 mt-4">
//           <button
//             onClick={() => onAddToCart && onAddToCart(food)}
//             disabled={!food.is_available}
//             className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
//               food.is_available
//                 ? "bg-blue-600 text-white hover:bg-blue-700"
//                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//             }`}
//           >
//             <ShoppingCart className="w-5 h-5" />
//             Thêm vào giỏ
//           </button>

//           <button
//             onClick={() => onViewDetails && onViewDetails(food)}
//             className="px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
//           >
//             Xem
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // FoodListChat Component
// const FoodListChat = ({ response, onFoodSelect, onAddToCart }) => {
//   if (!response || !response.success || !response.data?.items?.length) {
//     return (
//       <div className="text-center py-8">
//         <div className="text-gray-400 mb-2">🍽️</div>
//         <p className="text-gray-500">Không tìm thấy món ăn nào</p>
//       </div>
//     );
//   }

//   const { items, grouped_by_restaurant, stats } = response.data;

//   // Function to format large numbers
//   const formatNumber = (num) => {
//     if (!num) return "0";
//     return new Intl.NumberFormat("vi-VN").format(num);
//   };

//   // Render grouped by restaurant
//   const renderGrouped = () => {
//     return (
//       <div className="space-y-6">
//         {grouped_by_restaurant.map((group, index) => (
//           <div key={index} className="bg-white rounded-xl shadow-sm p-4">
//             {/* Restaurant header */}
//             <div className="flex items-center justify-between mb-4 pb-3 border-b">
//               <div>
//                 <h3 className="text-xl font-bold text-gray-900">
//                   {group.restaurant.name}
//                 </h3>
//                 {group.restaurant.rating && (
//                   <div className="flex items-center gap-2 mt-1">
//                     <div className="flex items-center">
//                       <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                       <span className="ml-1 font-medium">
//                         {group.restaurant.rating}
//                       </span>
//                     </div>
//                     {group.restaurant.address && (
//                       <span className="text-sm text-gray-500 flex items-center gap-1">
//                         <MapPin className="w-3 h-3" />
//                         {group.restaurant.address}
//                       </span>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
//                 Xem nhà hàng
//               </button>
//             </div>

//             {/* Food items grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {group.items.map((food) => (
//                 <FoodCardChat
//                   key={food.id}
//                   food={food}
//                   onAddToCart={() => onAddToCart && onAddToCart(food)}
//                   onViewDetails={() => onFoodSelect && onFoodSelect(food)}
//                   compact={true}
//                 />
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   // Render all items in grid
//   const renderGrid = () => {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {items.map((food) => (
//           <FoodCardChat
//             key={food.id}
//             food={food}
//             onAddToCart={() => onAddToCart && onAddToCart(food)}
//             onViewDetails={() => onFoodSelect && onFoodSelect(food)}
//           />
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header with stats */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
//         <div className="flex flex-col md:flex-row md:items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">
//               {response.message}
//             </h2>
//             <p className="text-gray-600 mt-1">
//               Tìm thấy {formatNumber(items.length)} món ăn phù hợp
//             </p>
//           </div>

//           {stats && (
//             <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
//               {stats.min_price > 0 && (
//                 <div className="text-center">
//                   <p className="text-sm text-gray-500">Giá từ</p>
//                   <p className="text-lg font-bold text-blue-600">
//                     {new Intl.NumberFormat("vi-VN", {
//                       style: "currency",
//                       currency: "VND",
//                       minimumFractionDigits: 0,
//                     }).format(stats.min_price)}
//                   </p>
//                 </div>
//               )}
//               {stats.avg_rating > 0 && (
//                 <div className="text-center">
//                   <p className="text-sm text-gray-500">Đánh giá TB</p>
//                   <p className="text-lg font-bold text-amber-600">
//                     ⭐ {stats.avg_rating.toFixed(1)}
//                   </p>
//                 </div>
//               )}
//               {stats.vegetarian_count > 0 && (
//                 <div className="text-center">
//                   <p className="text-sm text-gray-500">Món chay</p>
//                   <p className="text-lg font-bold text-green-600">
//                     🥬 {stats.vegetarian_count}
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Render content based on grouping */}
//       {grouped_by_restaurant && grouped_by_restaurant.length > 1
//         ? renderGrouped()
//         : renderGrid()}
//     </div>
//   );
// };

// export { FoodCardChat, FoodListChat };
// FoodCardChat.jsx
// FoodCardChat.jsx - ĐÃ SỬA
import React, { useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconClock,
  IconHeart,
  IconMapPin,
  IconShoppingCart,
  IconStar,
  IconTag, // Thêm Tag icon
  IconFlame, // Thêm Flame icon
  IconLeaf, // Thêm icon lá cho món chay
  IconPackage, // Thêm icon package
  IconInfoCircle, // Thêm icon info
} from "@tabler/icons-react";
import { formatPrice } from "../utils/mongoFormatter.js";

const FoodCardChat = ({
  data,
  loading = false,
  onViewDetails,
  onToggleFavorite,
  compact = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-4">
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="flex justify-between">
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Kiểm tra data có hợp lệ không
  if (!data || typeof data !== "object") {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-4 text-center">
        <p className="text-gray-500">Không có dữ liệu món ăn</p>
      </div>
    );
  }

  // Safe access to data properties
  const foodName = data.name || "Không có tên";
  const foodDescription = data.description || "";
  const foodPrice = data.priceDisplay || formatPrice(data.price) || "Liên hệ";
  const foodImage =
    data.image ||
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop";
  const foodRating = data.rating || "0.0";
  const foodReviewCount = data.reviewCount || 0;
  const isAvailable = data.isAvailable !== false; // Default to true
  const isVegetarian = data.isVegetarian || false;
  const category = data.category || "Món chính";
  const spicyLevel = data.spicyLevel || {
    label: "Không cay",
    emoji: "",
    color: "text-green-600",
    bgColor: "bg-green-100",
  };
  const dietaryTags = data.dietaryTags || [];
  const restaurant = data.restaurant || {
    name: "Không rõ",
    address: "",
    rating: "0.0",
    deliveryFee: "0 ₫",
  };
  const nutritionInfo = data.nutritionInfo || {};
  const calories = data.calories || nutritionInfo.calories;
  const cookingTime = data.cookingTime;
  const discountPercent = data.discountPercent;
  const originalPriceDisplay = data.originalPriceDisplay;

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    if (onToggleFavorite) {
      onToggleFavorite(data, !isFavorite);
    }
  };

  const handleViewDetailsClick = () => {
    if (onViewDetails) {
      onViewDetails(data);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Render stars for rating
  const renderStars = () => {
    const rating = parseFloat(foodRating) || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <IconStar
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? "fill-yellow-400 text-yellow-400"
                : i === fullStars && hasHalfStar
                ? "fill-yellow-400 text-yellow-400 fill-opacity-50"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">{foodRating}</span>
        {foodReviewCount > 0 && (
          <span className="text-xs text-gray-500 ml-1">
            ({foodReviewCount})
          </span>
        )}
      </div>
    );
  };

  // Render dietary tags
  const renderTags = () => {
    if (!dietaryTags || dietaryTags.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {dietaryTags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              tag.bgColor || "bg-gray-100"
            } ${tag.color || "text-gray-600"} flex items-center gap-1`}
          >
            <span>{tag.icon || "🏷️"}</span>
            {tag.label || "Tag"}
          </span>
        ))}
        {dietaryTags.length > 3 && (
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
            +{dietaryTags.length - 3}
          </span>
        )}
      </div>
    );
  };

  // Render spicy indicator
  const renderSpicyIndicator = () => {
    if (!spicyLevel || !spicyLevel.label || spicyLevel.label === "Không cay")
      return null;

    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
          spicyLevel.bgColor || "bg-red-100"
        } mt-2`}
      >
        <span className={spicyLevel.color || "text-red-600"}>
          {spicyLevel.emoji || "🌶️"}
        </span>
        <span className={`font-medium ${spicyLevel.color || "text-red-600"}`}>
          {spicyLevel.label}
        </span>
      </div>
    );
  };

  // Render price with discount
  const renderPrice = () => {
    if (discountPercent) {
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-red-600">{foodPrice}</span>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
              -{discountPercent}%
            </span>
          </div>
          {originalPriceDisplay && (
            <span className="text-sm text-gray-500 line-through mt-1">
              {originalPriceDisplay}
            </span>
          )}
        </div>
      );
    }

    return <span className="text-xl font-bold text-gray-900">{foodPrice}</span>;
  };

  // Compact version for list view
  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex flex-col">
          <div className="flex">
            {" "}
            {/* Image */}
            <div className="w-24 h-24 flex-shrink-0 relative">
              <img
                src={
                  imageError
                    ? "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200&h=200&fit=crop"
                    : foodImage
                }
                alt={foodName}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
              {discountPercent && (
                <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
                  -{discountPercent}%
                </div>
              )}
            </div>
            {/* Content */}
            <div className="flex-1 p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {foodName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {foodDescription}
                  </p>
                </div>
                <button
                  onClick={handleFavoriteClick}
                  className="text-gray-400 hover:text-red-500 ml-2"
                >
                  <IconHeart
                    className={`w-5 h-5 ${
                      isFavorite ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </button>
              </div>
              <div className="text-lg font-bold text-gray-900">{foodPrice}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full version
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
      {/* Image with badges */}
      <div className="relative h-56 overflow-hidden">
        <img
          // src={
          //   imageError
          //     ? "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop"
          //     : foodImage
          // }
          src={foodImage}
          alt={foodName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />

        {/* Discount badge */}
        {discountPercent && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
            -{discountPercent}%
          </div>
        )}

        {/* Vegetarian badge */}
        {isVegetarian && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
            🥬 Chay
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white shadow-md"
        >
          <IconHeart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* Availability overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-red-500 px-4 py-2 rounded-lg shadow-lg">
              HẾT HÀNG
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header with name and rating */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{foodName}</h3>
            <div className="flex items-center gap-2 mt-1">{renderStars()}</div>
          </div>

          <div className="text-right">{renderPrice()}</div>
        </div>

        {/* Description */}
        {foodDescription && (
          <p className="text-gray-600 mt-3 line-clamp-2">{foodDescription}</p>
        )}

        {/* Tags and spicy indicator */}
        <div className="mt-3">
          {renderTags()}
          {renderSpicyIndicator()}
        </div>

        {/* Nutrition info and cooking time */}
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
          {calories && (
            <span className="flex items-center gap-1.5">
              <IconFlame className="w-4 h-4 text-orange-500" />
              {calories} cal
            </span>
          )}
          {cookingTime && (
            <span className="flex items-center gap-1.5">
              <IconClock className="w-4 h-4 text-blue-500" />
              {cookingTime}
            </span>
          )}
          {isVegetarian && (
            <span className="flex items-center gap-1.5">
              <IconLeaf className="w-4 h-4 text-green-500" />
              Món chay
            </span>
          )}
        </div>

        {/* Restaurant info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                <IconMapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{restaurant.name}</p>
                {restaurant.rating && restaurant.rating !== "0.0" && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <IconStar className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{restaurant.rating}</span>
                  </div>
                )}
              </div>
            </div>

            {restaurant.deliveryFee && restaurant.deliveryFee !== "Liên hệ" && (
              <span className="text-sm text-gray-600 font-medium">
                🚚 {restaurant.deliveryFee}
              </span>
            )}
          </div>

          {restaurant.address && (
            <p className="text-xs text-gray-500 mt-2 truncate">
              {restaurant.address}
            </p>
          )}
        </div>

        {/* Expandable details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center gap-2 mt-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          <IconTag className="w-4 h-4" />
          <span>Chi tiết món ăn</span>
          {showDetails ? (
            <IconChevronUp className="w-4 h-4" />
          ) : (
            <IconChevronDown className="w-4 h-4" />
          )}
        </button>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Danh mục</p>
                <p className="font-medium text-gray-900">{category}</p>
              </div>
              <div>
                <p className="text-gray-500">Tình trạng</p>
                <p
                  className={`font-medium ${
                    isAvailable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isAvailable ? "🟢 Còn hàng" : "🔴 Hết hàng"}
                </p>
              </div>
              {isVegetarian && (
                <div className="col-span-2">
                  <p className="text-gray-500">Đặc điểm</p>
                  <p className="font-medium text-green-600">
                    🍃 Món chay thích hợp
                  </p>
                </div>
              )}
              {nutritionInfo.protein && (
                <div>
                  <p className="text-gray-500">Protein</p>
                  <p className="font-medium">{nutritionInfo.protein}g</p>
                </div>
              )}
              {calories && (
                <div>
                  <p className="text-gray-500">Calories</p>
                  <p className="font-medium">{calories} cal</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mt-6">
          {/* <button
            onClick={handleAddToCartClick}
            disabled={!isAvailable}
            className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
              isAvailable
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <IconShoppingCart className="w-5 h-5" />
            Thêm vào giỏ hàng
          </button> */}

          <button
            onClick={handleViewDetailsClick}
            className="px-5 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <IconInfoCircle className="w-4 h-4" />
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

// FoodListChat Component
const FoodListChat = ({
  message,
  data,
  groupedData,
  stats,
  metadata,
  onFoodSelect,
  onAddToCart,
  time,
}) => {
  const foods = data || [];

  if (!foods || foods.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">🍽️</div>
        <p className="text-gray-500">Không tìm thấy món ăn nào phù hợp</p>
      </div>
    );
  }

  // Format số với dấu chấm ngăn hàng nghìn
  const formatNumber = (num) => {
    if (!num || isNaN(num)) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Format price
  const formatPriceDisplay = (price) => {
    if (!price) return "0₫";
    return `${formatNumber(price)}₫`;
  };

  // Render grouped by restaurant
  const renderGrouped = () => {
    if (!groupedData || groupedData.length === 0) {
      return renderGrid();
    }

    return (
      <div className="space-y-6">
        {groupedData.map((group, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
          >
            {/* Restaurant header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {group.restaurant?.name || "Không rõ"}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  {group.restaurant?.rating &&
                    group.restaurant.rating !== "0.0" && (
                      <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                        <IconStar className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">
                          {group.restaurant.rating}
                        </span>
                      </div>
                    )}
                  {group.restaurant?.address && (
                    <span className="text-sm text-gray-500 flex items-center gap-1.5 w-[70%]">
                      <IconMapPin className="w-4 h-4" />
                      <span>{group.restaurant.address}</span>
                    </span>
                  )}
                </div>
              </div>
              <button
                className="px-4 py-2 text-blue-600 border-2 border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors w-[30%]"
                onClick={() =>
                  onFoodSelect &&
                  onFoodSelect({ ...group.restaurant, type: "restaurant" })
                }
              >
                Xem nhà hàng
              </button>
            </div>

            {/* Food items grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.items?.map((food) => (
                <FoodCardChat
                  key={food.id}
                  data={food}
                  onAddToCart={() => onAddToCart && onAddToCart(food)}
                  onViewDetails={() => onFoodSelect && onFoodSelect(food)}
                  compact={true}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render all items in grid
  const renderGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food) => (
          <FoodCardChat
            key={food.id}
            data={food}
            onAddToCart={() => onAddToCart && onAddToCart(food)}
            onViewDetails={() => onFoodSelect && onFoodSelect(food)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats banner */}
      {stats && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-xl">🍴</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Kết quả tìm kiếm
                </h3>
                <p className="text-gray-600">
                  {message || `Tìm thấy ${formatNumber(foods.length)} món ăn`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {stats.minPrice > 0 && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">Giá từ</p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatPriceDisplay(stats.minPrice)}
                  </p>
                  <p className="text-sm text-gray-500">đến</p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatPriceDisplay(stats.maxPrice)}
                  </p>
                </div>
              )}
              {stats.avgRating && stats.avgRating !== "0.0" && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">Đánh giá TB</p>
                  <p className="text-lg font-bold text-amber-600">
                    ⭐ {stats.avgRating}
                  </p>
                </div>
              )}
              {stats.vegetarianCount > 0 && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">Món chay</p>
                  <p className="text-lg font-bold text-green-600">
                    🥬 {formatNumber(stats.vegetarianCount)}
                  </p>
                </div>
              )}
              {stats.spicyCount > 0 && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">Món cay</p>
                  <p className="text-lg font-bold text-red-600">
                    🌶️ {formatNumber(stats.spicyCount)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Render content based on grouping */}
      {groupedData && groupedData.length > 1 ? renderGrouped() : renderGrid()}

      {/* Metadata footer */}
      {metadata && (
        <div className="text-center text-sm text-gray-500 pt-4 border-t">
          Hiển thị {formatNumber(foods.length)} món ăn
          {time && <span className="ml-4">⏰ {time}</span>}
        </div>
      )}
    </div>
  );
};

export { FoodCardChat, FoodListChat };
