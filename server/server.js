import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import chalk from "chalk";
import { connectDB } from "./configs/mongodb.js";
import userRoute from "./routes/userRoute.js";
import configCloudinary from "./utils/cloudinary.js";
import restaurantRoute from "./routes/restaurantRoute.js";
import menuRoute from "./routes/menuRoute.js";
import commentRoute from "./routes/commentRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import bookingSlotRouter from "./routes/bookingSlotRoute.js";
import ChatRouter from "./ai/chatRoute.js";
export const app = express();
configDotenv();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

configCloudinary();
connectDB();

app.get("/", (req, res) => {
  res.send("Server is running ...");
});



app.use("/auth", userRoute);
app.use("/restaurant", restaurantRoute);
app.use("/menu", menuRoute);
app.use("/comment", commentRoute);
app.use("/booking", bookingRouter);
app.use("/bookingslots", bookingSlotRouter);
app.use("/chatbot", ChatRouter);





if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(chalk.green(`Server is running at port: ${PORT}`));
  });
}