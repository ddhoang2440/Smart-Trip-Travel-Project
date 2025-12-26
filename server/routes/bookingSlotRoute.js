import express from "express";
import { protect } from "../middlewares/Protect.js";
import {
  createBookingSlot,
  deleteBookingSlot,
  getBookingSlot,
  getBookingSlotById,
  // getTablesByRestaurant,
  updateBookingSlot,
} from "../controllers/bookingSlotcontroller.js";
const bookingSlotRouter = express.Router();

bookingSlotRouter.post("/create", createBookingSlot);
bookingSlotRouter.get("/get", getBookingSlot);
bookingSlotRouter.put("/update/:id", updateBookingSlot);
bookingSlotRouter.delete("/delete/:id", deleteBookingSlot);
// bookingSlotRouter.get("/get/:restaurantId", getTablesByRestaurant);
bookingSlotRouter.get("/getall", getBookingSlotById);

export default bookingSlotRouter;
