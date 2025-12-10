// mongo_formatter.js

export const formatObjectId = (id) => {
  if (!id) return "";
  if (typeof id === "object" && id.toString) {
    return id.toString();
  }
  return String(id);
};

export const formatDateTime = (date) => {
  if (!date) return "";

  if (typeof date === "string") {
    date = new Date(date);
  }

  if (date && typeof date === "object" && date.$date) {
    date = new Date(date.$date);
  }

  try {
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "N/A", e;
  }
};

export const formatOpeningHours = (fromTime, toTime) => {
  if (!fromTime || !toTime) return "Đang cập nhật";
  return `${fromTime} - ${toTime}`;
};

export const formatPrice = (price) => {
  if (!price) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatRating = (rating) => {
  if (!rating) return "0.0";
  return rating.toFixed(1);
};

export const formatAddress = (address) => {
  if (!address) return "Đang cập nhật địa chỉ";
  return address.replace(/\s+/g, " ").trim();
};

export const formatCookingTime = (minutes) => {
  if (!minutes) return null;
  if (minutes < 60) {
    return `${minutes} phút`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} giờ`;
  }
  return `${hours} giờ ${mins} phút`;
};

export const getSpicyInfo = (level) => {
  const levels = {
    0: {
      label: "Không cay",
      emoji: "",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    1: {
      label: "Hơi cay",
      emoji: "🌶️",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    2: {
      label: "Cay vừa",
      emoji: "🌶️🌶️",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    3: {
      label: "Cay",
      emoji: "🌶️🌶️🌶️",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    4: {
      label: "Rất cay",
      emoji: "🌶️🌶️🌶️🌶️",
      color: "text-red-700",
      bgColor: "bg-red-200",
    },
    5: {
      label: "Cực cay",
      emoji: "🌶️🌶️🌶️🌶️🌶️",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  };
  return levels[level] || levels[0];
};

export const getDietaryTagInfo = (tag) => {
  const tagConfig = {
    vegetarian: {
      label: "Chay",
      icon: "🥬",
      color: "text-green-700",
      bgColor: "bg-green-50",
    },
    vegan: {
      label: "Thuần chay",
      icon: "🌱",
      color: "text-green-800",
      bgColor: "bg-green-100",
    },
    "gluten-free": {
      label: "Không gluten",
      icon: "🌾❌",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    "dairy-free": {
      label: "Không sữa",
      icon: "🥛❌",
      color: "text-blue-700",
      bgColor: "bg-blue-100",
    },
    "nut-free": {
      label: "Không hạt",
      icon: "🥜❌",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
    },
    halal: {
      label: "Halal",
      icon: "🕌",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    kosher: {
      label: "Kosher",
      icon: "✡️",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    spicy: {
      label: "Cay",
      icon: "🌶️",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    popular: {
      label: "Phổ biến",
      icon: "🔥",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    new: {
      label: "Mới",
      icon: "🆕",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    "chef-special": {
      label: "Đặc biệt",
      icon: "👨‍🍳",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    healthy: {
      label: "Tốt cho sức khỏe",
      icon: "💚",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    organic: {
      label: "Hữu cơ",
      icon: "🌿",
      color: "text-green-700",
      bgColor: "bg-green-100",
    },
  };

  const tagLower = tag.toLowerCase();
  return (
    tagConfig[tagLower] || {
      label: tag,
      icon: "🏷️",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    }
  );
};

export const transformFoodData = (foodItem, restaurantInfo = null) => {
  if (!foodItem) return null;

  const restaurantId = foodItem.restaurant || foodItem.restaurant_id;
  let restaurantName = "Không rõ";
  let restaurantRating = null;
  let restaurantAddress = "";
  let restaurantDeliveryFee = 0;

  if (restaurantInfo) {
    if (typeof restaurantInfo === "string") {
      restaurantName = restaurantInfo;
    } else if (typeof restaurantInfo === "object") {
      restaurantName = restaurantInfo.name || "Không rõ";
      restaurantRating = restaurantInfo.rating;
      restaurantAddress = restaurantInfo.address || "";
      restaurantDeliveryFee = restaurantInfo.delivery_fee || 0;
    }
  }

  // Calculate discount
  const originalPrice = foodItem.original_price || foodItem.originalPrice;
  const price = foodItem.price;
  let discountPercent = null;

  if (originalPrice && price && originalPrice > price) {
    discountPercent = Math.round(
      ((originalPrice - price) / originalPrice) * 100
    );
  }

  // Format spicy level
  const spicyLevel = foodItem.spicy_level || foodItem.spicyLevel || 0;
  const spicyInfo = getSpicyInfo(spicyLevel);

  // Format dietary tags
  const dietaryTags = foodItem.dietary_tags || foodItem.dietaryTags || [];
  const formattedTags = dietaryTags.map((tag) => getDietaryTagInfo(tag));

  // Check if vegetarian
  const isVegetarian = dietaryTags.some(
    (tag) =>
      tag.toLowerCase().includes("vegetarian") ||
      tag.toLowerCase().includes("vegan")
  );

  // Get images
  const images = foodItem.images || foodItem.image || [];
  const mainImage =
    Array.isArray(images) && images.length > 0
      ? images[0]
      : "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop";

  // Format nutrition info
  const nutritionInfo = {
    calories: foodItem.calories,
    protein: foodItem.protein,
    carbs: foodItem.carbs,
    fat: foodItem.fat,
    fiber: foodItem.fiber,
    sugar: foodItem.sugar,
    sodium: foodItem.sodium,
  };

  return {
    id: formatObjectId(foodItem.id || foodItem._id),
    name: foodItem.name || "Không có tên",
    price: price,
    priceDisplay: formatPrice(price),
    originalPrice: originalPrice,
    originalPriceDisplay: originalPrice ? formatPrice(originalPrice) : null,
    discountPercent: discountPercent,
    currency: "VND",
    description: foodItem.description || "",
    category: foodItem.category || "Món chính",
    dietaryTags: formattedTags,
    spicyLevel: spicyInfo,
    isSpicy: spicyLevel > 2,
    isVegetarian: isVegetarian,
    rating: formatRating(foodItem.rating),
    reviewCount: foodItem.review_count || foodItem.reviewCount || 0,
    image: mainImage,
    images: Array.isArray(images) ? images : [images].filter(Boolean),
    isAvailable: foodItem.is_available !== false,
    calories: foodItem.calories,
    cookingTime: formatCookingTime(
      foodItem.cooking_time || foodItem.cookingTime
    ),
    nutritionInfo: nutritionInfo,
    restaurant: {
      id: formatObjectId(restaurantId),
      name: restaurantName,
      rating: formatRating(restaurantRating),
      address: formatAddress(restaurantAddress),
      deliveryFee: formatPrice(restaurantDeliveryFee),
      deliveryFeeRaw: restaurantDeliveryFee,
    },
    tags: formattedTags,
    createdAt: formatDateTime(foodItem.created_at || foodItem.createdAt),
    updatedAt: formatDateTime(foodItem.updated_at || foodItem.updatedAt),
    rawData: foodItem,
  };
};

export const transformFoodList = (foodItems, restaurantMap = null) => {
  if (!Array.isArray(foodItems)) return [];

  return foodItems
    .map((foodItem) => {
      let restaurantInfo = null;
      const restaurantId = foodItem.restaurant || foodItem.restaurant_id;

      if (restaurantMap && restaurantId) {
        restaurantInfo =
          restaurantMap[restaurantId] ||
          restaurantMap[formatObjectId(restaurantId)];
      }

      return transformFoodData(foodItem, restaurantInfo);
    })
    .filter(Boolean);
};

export const formatFoodListResponse = (
  foodItems,
  restaurantMap = null,
  message = "",
  filters = null,
  entity = "food"
) => {
  const transformedItems = transformFoodList(foodItems, restaurantMap);

  // Group by restaurant
  const groupedByRestaurant = {};
  transformedItems.forEach((item) => {
    const restId = item.restaurant.id;
    if (!groupedByRestaurant[restId]) {
      groupedByRestaurant[restId] = {
        restaurant: item.restaurant,
        items: [],
      };
    }
    groupedByRestaurant[restId].items.push(item);
  });

  // Calculate stats
  const prices = transformedItems
    .filter((item) => item.price)
    .map((item) => item.price);
  const ratings = transformedItems
    .filter((item) => item.rating && item.rating !== "0.0")
    .map((item) => parseFloat(item.rating));

  const vegetarianCount = transformedItems.filter(
    (item) => item.isVegetarian
  ).length;
  const spicyCount = transformedItems.filter((item) => item.isSpicy).length;

  const stats = {
    minPrice: prices.length > 0 ? Math.min(...prices) : 0,
    maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
    avgRating:
      ratings.length > 0
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : "0.0",
    vegetarianCount: vegetarianCount,
    spicyCount: spicyCount,
  };

  return {
    type: "food-list",
    success: true,
    timestamp: new Date().toISOString(),
    message: message || `Tìm thấy ${transformedItems.length} món ăn phù hợp`,
    text: message || `Tìm thấy ${transformedItems.length} món ăn phù hợp`,
    data: transformedItems,
    groupedData: Object.values(groupedByRestaurant),
    stats: stats,
    metadata: {
      entity: entity,
      filtersApplied: filters || {},
      hasMore: false,
      count: transformedItems.length,
    },
  };
};
