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
export const transformRestaurantData = (restaurant) => {
  if (!restaurant) return null;

  return {
    id: formatObjectId(restaurant.id || restaurant._id),
    name: restaurant.name || "Chưa có tên",
    rating: formatRating(restaurant.rating),
    reviewCount: restaurant.review || 0,
    isOpen: restaurant.open !== false,
    address: formatAddress(restaurant.address),
    openingHours: formatOpeningHours(restaurant.from_time, restaurant.to_time),
    categories: restaurant.type ? [restaurant.type] : ["Nhà hàng"],
    image:
      restaurant.images?.[0] ||
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    images: restaurant.images || [],
    priceRange: {
      min: 0,
      max: restaurant.medium_price || 200000,
      average: restaurant.medium_price || 100000,
    },
    priceDisplay: formatPrice(restaurant.medium_price),
    description: restaurant.description || "Nhà hàng ẩm thực ngon",
    type: restaurant.type || "Nhà hàng",
    bookingAvailable: restaurant.bookingAvailable || false,
    hasDiscount: !!restaurant.sale,
    discount: restaurant.sale,
    createdAt: formatDateTime(restaurant.created_at),
    updatedAt: formatDateTime(restaurant.updated_at),

    rawData: restaurant,
  };
};

export const transformRestaurants = (restaurants) => {
  if (!Array.isArray(restaurants)) return [];
  return restaurants.map(transformRestaurantData).filter(Boolean);
};
