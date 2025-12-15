import express from "express";
import { handleSessionMessage } from "./chatcontroller.js";
import { protect } from "../middlewares/Protect.js";
import Message from "./messageRequest.js";

const router = express.Router();

router.post("/analyze", protect, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        type: "error",
        message: "Unauthorized",
      });
    }

    const { message, lat, lng } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const msgRequest = new Message({
      user_id: String(user.sub),
      message,
      timestamp: new Date().toISOString(),
    });

    const result = await handleSessionMessage(msgRequest, user, lat, lng);

    if (typeof result === "object") {
      const responseType = result.type || "reply";

      if (responseType === "restaurant-list") {
        return res.json({
          success: true,
          type: "restaurant-list",
          restaurants: result.restaurants || [],
          message:
            result.message ||
            `Tìm thấy ${result.restaurants?.length || 0} nhà hàng`,
        });
      }

      if (responseType === "food-list") {
        return res.json({
          success: true,
          type: "food-list",
          food: result.food || [],
          message:
            result.message || `Tìm thấy ${result.food?.length || 0} món ăn`,
        });
      }

      if (responseType === "error") {
        return res.json({
          success: false,
          type: "error",
          message: result.message || "Đã có lỗi xảy ra",
          error: result.error,
        });
      }

      return res.json({
        success: true,
        type: "reply",
        reply: result.message || JSON.stringify(result),
      });
    }

    return res.json({
      success: true,
      type: "reply",
      reply: typeof result === "string" ? result : "Đã xử lý yêu cầu",
    });
  } catch (err) {
    console.error("Chatbot error:", err);
    return res.status(500).json({
      success: false,
      type: "error",
      message: "Đã có lỗi xảy ra trong hệ thống",
      error: err.message,
    });
  }
});

export default router;
