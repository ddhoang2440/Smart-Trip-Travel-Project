import express from 'express'

const restaurantRoute = express.Router();
import multer from 'multer';
import { protect } from '../middlewares/Protect.js';
import { CreateRestaurant, getAllRestaurants, getUserRestaurant } from '../controllers/restaurantcontroller.js';

const upload = multer({dest: "uploads/"});

restaurantRoute.post("/create", protect, upload.array("images", 4), CreateRestaurant);
restaurantRoute.post("/getall", getAllRestaurants);
restaurantRoute.get("/user", protect, getUserRestaurant);

export default restaurantRoute;