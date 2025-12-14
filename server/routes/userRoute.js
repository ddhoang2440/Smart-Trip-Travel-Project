import express from "express";
import {
  authCheck,
  authDelete,
  getUserById,
  profile,
  signin,
  signinGoogle,
  signup,
} from "../controllers/usercontroller.js";
import multer from "multer";
import { protect } from "../middlewares/Protect.js";

const upload = multer({ dest: "uploads/" });

const userRoute = express.Router();

userRoute.post("/signin", signin);
userRoute.post("/google", signinGoogle);
userRoute.post("/signup", signup);
userRoute.post("/profile", protect, upload.single("image"), profile);
userRoute.get("/check", protect, authCheck);
userRoute.get("/delete", protect, authDelete);
userRoute.get("/get/:id", getUserById);

export default userRoute;
