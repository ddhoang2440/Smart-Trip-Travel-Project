import express from 'express'
import { protect } from '../middlewares/Protect.js'
import { createBooking, getBooking } from '../controllers/booking.js'
const bookingRouter = express.Router()

bookingRouter.post("/create", protect, createBooking)
bookingRouter.get('/get', protect, getBooking)

export default bookingRouter