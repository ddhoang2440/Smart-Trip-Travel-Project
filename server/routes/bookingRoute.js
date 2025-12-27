import express from "express";
import { protect } from "../middlewares/Protect.js";
import {
  assignTableToBooking,
  createBooking,
  getBooking,
  getBookingById,
  updateBookingStatus,
} from "../controllers/bookingcontroller.js";
const bookingRouter = express.Router();

bookingRouter.post("/create", protect, createBooking);
bookingRouter.get("/get/:id", protect, getBookingById);
bookingRouter.get("/get", protect, getBooking);
bookingRouter.put("/update/:bookingId", updateBookingStatus);
bookingRouter.put("/get/:id/assign-table", assignTableToBooking);

export default bookingRouter;
