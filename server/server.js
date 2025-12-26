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
import axios from "axios";
import bookingSlotRouter from "./routes/bookingSlotRoute.js";
import ChatRouter from "./ai/chatRoute.js";
const app = express();

configDotenv();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

configCloudinary();
connectDB();

app.get("/", (req, res) => {
  res.send("Server is running ...");
});

//
app.use("/auth", userRoute);
app.use("/restaurant", restaurantRoute);
app.use("/menu", menuRoute);
app.use("/comment", commentRoute);
app.use("/booking", bookingRouter);
app.use("/bookingslots", bookingSlotRouter);
// app.post("/chatbot/analyze", async (req, res) => {
//   console.log("=== CHATBOT REQUEST ===");
//   console.log("Body:", JSON.stringify(req.body, null, 2));

//   try {
//     const { message, timestamp } = req.body;

//     if (!message) {
//       return res.status(400).json({
//         success: false,
//         type: "error",
//         message: "Message is required",
//       });
//     }
//     const payload = {
//       message: message,
//       timestamp: timestamp || new Date().toISOString(),
//     };

//     console.log("Sending to FastAPI:", payload);
//     const fastapiResponse = await axios({
//       method: "post",
//       url: "http://localhost:8000/chatbot/analyze",
//       data: payload,
//       headers: {
//         "Content-Type": "application/json",
//         ...(req.headers.authorization && {
//           Authorization: req.headers.authorization,
//         }),
//       },
//       timeout: 30000,
//       validateStatus: function (status) {
//         return status >= 200 && status < 600;
//       },
//     });

//     console.log("FastAPI Response Status:", fastapiResponse.status);
//     console.log(
//       "FastAPI Response Data:",
//       JSON.stringify(fastapiResponse.data, null, 2)
//     );
//     return res.status(fastapiResponse.status).json(fastapiResponse.data);
//   } catch (error) {
//     console.error("=== AXIOS ERROR ===");

//     if (error.response) {
//       console.error("Status:", error.response.status);
//       console.error("Data:", error.response.data);
//       console.error("Headers:", error.response.headers);

//       return res.status(error.response.status).json({
//         success: false,
//         type: "error",
//         message: "Chatbot service error",
//         detail: error.response.data,
//       });
//     } else if (error.request) {
//       console.error("No response received:", error.request);

//       return res.status(503).json({
//         success: false,
//         type: "error",
//         message: "Chatbot service is not available",
//         detail: "Cannot connect to FastAPI server on port 8000",
//       });
//     } else {
//       console.error("Request setup error:", error.message);

//       return res.status(500).json({
//         success: false,
//         type: "error",
//         message: "Internal server error",
//         detail: error.message,
//       });
//     }
//   }
// });
app.use("/chatbot", ChatRouter);
app.listen(PORT, () => {
  console.log(chalk.green(`Server is runing at port: ${PORT}`));
});
