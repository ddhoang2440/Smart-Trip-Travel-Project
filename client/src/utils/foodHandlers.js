// utils/foodHandlers.js
import toast from "react-hot-toast";

/**
 * Xử lý khi người dùng chọn món ăn để xem chi tiết
 * @param {Object} food - Thông tin món ăn
 * @param {Function} navigate - Hàm navigate từ React Router
 * @param {Object} options - Tùy chọn bổ sung
 */
export const handleFoodSelect = (food, navigate, options = {}) => {
  const {
    showToast = true,
    trackAnalytics = true,
    addToRecent = true,
  } = options;

  try {
    // 1. Track analytics
    if (trackAnalytics) {
      trackFoodView(food);
    }

    // 2. Thêm vào danh sách xem gần đây
    if (addToRecent) {
      addToRecentlyViewed(food);
    }

    // 3. Điều hướng đến trang chi tiết
    if (navigate && food.id) {
      navigate(`/food/${food.id}`, {
        state: {
          food,
          from: "chatbot",
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      // Nếu không có navigate, hiển thị modal
      openFoodModal(food);
    }

    // 4. Hiển thị thông báo
    if (showToast) {
      toast.info(`Đang mở chi tiết "${food.name}"`, {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  } catch (error) {
    console.error("Error handling food select:", error);
    toast.error("Có lỗi xảy ra khi mở chi tiết món ăn");
  }
};

/**
 * Xử lý thêm món ăn vào giỏ hàng
 * @param {Object} food - Thông tin món ăn
 * @param {Function} dispatch - Redux dispatch (nếu dùng Redux)
 * @param {Object} options - Tùy chọn bổ sung
 */
export const handleAddToCart = (food, dispatch = null, options = {}) => {
  const {
    quantity = 1,
    showToast = true,
    trackAnalytics = true,
    customMessage = null,
  } = options;

  try {
    // 1. Tạo cart item
    const cartItem = {
      id: food.id,
      name: food.name,
      price: food.price,
      priceDisplay: food.priceDisplay,
      originalPrice: food.originalPrice,
      discountPercent: food.discountPercent,
      image: food.image,
      restaurant: {
        id: food.restaurant?.id,
        name: food.restaurant?.name,
      },
      quantity: quantity,
      specialInstructions: "",
      addedAt: new Date().toISOString(),
    };

    // 2. Thêm vào giỏ hàng (tùy theo state management)
    if (dispatch) {
      // Nếu dùng Redux
      dispatch({
        type: "cart/ADD_ITEM",
        payload: cartItem,
      });
    } else {
      // Nếu dùng localStorage hoặc context
      addToLocalStorageCart(cartItem);
    }

    // 3. Track analytics
    if (trackAnalytics) {
      trackAddToCart(food, quantity);
    }

    // 4. Hiển thị thông báo thành công
    if (showToast) {
      const message = customMessage || `Đã thêm "${food.name}" vào giỏ hàng!`;
      toast.success(message, {
        position: "bottom-right",
        autoClose: 3000,
        icon: "🛒",
      });
    }

    // 5. Cập nhật cart count (nếu cần)
    updateCartCount();

    return cartItem;
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    return null;
  }
};

/**
 * Xử lý đặt bàn tại nhà hàng
 * @param {Object} restaurant - Thông tin nhà hàng
 * @param {Function} navigate - Hàm navigate
 */
export const handleBookTable = (restaurant, navigate) => {
  if (!restaurant?.id) {
    toast.error("Không tìm thấy thông tin nhà hàng");
    return;
  }

  try {
    // Track analytics
    trackBookingIntent(restaurant);

    // Điều hướng đến trang đặt bàn
    if (navigate) {
      navigate(`/restaurant/${restaurant.id}/booking`, {
        state: {
          restaurant,
          from: "chatbot",
        },
      });
    } else {
      // Hoặc mở modal đặt bàn
      openBookingModal(restaurant);
    }
  } catch (error) {
    console.error("Error handling book table:", error);
    toast.error("Có lỗi xảy ra khi đặt bàn");
  }
};

/**
 * Xử lý xem chi tiết nhà hàng
 * @param {Object} restaurant - Thông tin nhà hàng
 * @param {Function} navigate - Hàm navigate
 */
export const handleViewDetails = (restaurant, navigate) => {
  if (!restaurant?.id) {
    toast.error("Không tìm thấy thông tin nhà hàng");
    return;
  }

  try {
    // Track view
    trackRestaurantView(restaurant);

    // Điều hướng đến trang chi tiết nhà hàng
    if (navigate) {
      navigate(`/restaurant/${restaurant.id}`, {
        state: {
          restaurant,
          from: "chatbot",
        },
      });
    }
  } catch (error) {
    console.error("Error handling view details:", error);
    toast.error("Có lỗi xảy ra khi xem chi tiết");
  }
};

// ========== HELPER FUNCTIONS ==========

/**
 * Thêm vào localStorage cart
 */
const addToLocalStorageCart = (cartItem) => {
  try {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = currentCart.findIndex(
      (item) => item.id === cartItem.id
    );

    if (existingIndex >= 0) {
      // Update quantity if already exists
      currentCart[existingIndex].quantity += cartItem.quantity;
    } else {
      // Add new item
      currentCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
    return true;
  } catch (error) {
    console.error("Error adding to localStorage cart:", error);
    return false;
  }
};

/**
 * Thêm vào danh sách xem gần đây
 */
const addToRecentlyViewed = (item) => {
  try {
    const recentItems =
      JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const existingIndex = recentItems.findIndex((i) => i.id === item.id);

    if (existingIndex >= 0) {
      // Move to top if already exists
      recentItems.splice(existingIndex, 1);
    }

    // Add to beginning and keep only last 10 items
    recentItems.unshift({
      id: item.id,
      name: item.name,
      type: item.restaurant ? "food" : "restaurant",
      image: item.image,
      viewedAt: new Date().toISOString(),
    });

    if (recentItems.length > 10) {
      recentItems.pop();
    }

    localStorage.setItem("recentlyViewed", JSON.stringify(recentItems));
  } catch (error) {
    console.error("Error adding to recently viewed:", error);
  }
};

/**
 * Cập nhật số lượng giỏ hàng
 */
const updateCartCount = () => {
  // Dispatch event để components khác cập nhật
  const event = new CustomEvent("cartUpdated");
  window.dispatchEvent(event);
};

/**
 * Mở modal chi tiết món ăn
 */
const openFoodModal = (food) => {
  // Implement modal logic here
  console.log("Open food modal:", food);
  // You can use a modal library or create your own
};

/**
 * Mở modal đặt bàn
 */
const openBookingModal = (restaurant) => {
  console.log("Open booking modal:", restaurant);
};

// ========== ANALYTICS FUNCTIONS ==========

const trackFoodView = (food) => {
  // Implement analytics tracking
  console.log("Track food view:", food);
  // Example: Google Analytics, Mixpanel, etc.
};

const trackAddToCart = (food, quantity) => {
  console.log("Track add to cart:", { food, quantity });
};

const trackBookingIntent = (restaurant) => {
  console.log("Track booking intent:", restaurant);
};

const trackRestaurantView = (restaurant) => {
  console.log("Track restaurant view:", restaurant);
};

export default {
  handleFoodSelect,
  handleAddToCart,
  handleBookTable,
  handleViewDetails,
};
