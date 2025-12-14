import { Router } from "express";
import { protect } from "../middlewares/Protect.js";
import { createComment, getComment } from "../controllers/commentcontroller.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const commentRoute = Router();

commentRoute.post("/create", protect, upload.array("images", 5), createComment);
commentRoute.get("/get", getComment);

export default commentRoute;
