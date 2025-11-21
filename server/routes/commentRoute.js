import { Router } from "express";
import { protect } from "../middlewares/Protect.js";
import { createComment, getComment } from "../controllers/commentcontroller.js";


const commentRoute = Router();


commentRoute.post("/create", protect, createComment);
commentRoute.post("/get", getComment);

export default commentRoute;