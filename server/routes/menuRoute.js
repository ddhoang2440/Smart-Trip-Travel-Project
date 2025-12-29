import express from "express";
import { protect } from "../middlewares/Protect.js";
import multer from "multer";
import {
  createMenu,
  getMenu,
  getRestaurantMenu,
  getUserMenu,
  removeMenu,
  updateRestaurantMenu,
} from "../controllers/menucontroller.js";

const upload = multer({ dest: "uploads/" });

const menuRoute = express.Router();

menuRoute.post("/create", protect, upload.single("image"), createMenu);
menuRoute.get("/get", getMenu);
menuRoute.get("/user", protect, getUserMenu);
menuRoute.post("/restaurant", getRestaurantMenu);
menuRoute.put(
  "/restaurant/update/:id",
  upload.single("image"),
  updateRestaurantMenu
);
menuRoute.get("/remove/:menu_id", removeMenu)

export default menuRoute;
