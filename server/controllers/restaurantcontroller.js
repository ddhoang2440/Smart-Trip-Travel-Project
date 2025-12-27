import { v2 as cloudinary } from "cloudinary";

import chalk from "chalk";
import Restaurant from "../model/restaurant.js";

const log = console.log;

export const CreateRestaurant = async (req, res) => {
  const routelog = [];
  routelog.push(chalk.white("Starting Create Restaurant Route:"));
  try {
    const files = req.files;
    const { name, type, medium_price, from, to, address, description } =
      req.body;
    const { _id } = req.user;
    const location = JSON.parse(req.body.location);
    if (
      !name ||
      !type ||
      !medium_price ||
      !from ||
      !to ||
      !address ||
      !description ||
      !location
    ) {
      routelog.push(chalk.yellow("Input not valid"));
      return res.json({ success: false, message: "All Input Must Valid !" });
    }
    let urls = [];
    if (files) {
      for (const file of files) {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "restaurant",
        });
        urls.push(uploaded);
      }
    }
    routelog.push(chalk.cyan("Input valid !"));
    const images = urls.map((url) => url.secure_url);
    const images_id = urls.map((url) => url.public_id);
    console.log(images);
    console.log(images_id);
    console.log(location);

    const newRestaurant = {
      name,
      type,
      medium_price,
      from,
      to,
      address,
      description,
      owner: _id,
      images,
      images_id,
      location,
    };
    const restaurant = await Restaurant.create(newRestaurant);
    routelog.push(chalk.green("Create new Restaurant successfully !"));
    routelog.push(chalk.white("End Route"));
    log(routelog.join(" | "));
    res.json({ success: true, message: "Create Restaurant successfully !" });
  } catch (error) {
    routelog.push(
      chalk.red("Create restaurant error message: ", error.message)
    );
    log(routelog.join(" | "));

    res.json({ success: false, message: "Create new Restaurant failed!" });
  }
};

export const getUserRestaurant = async (req, res) => {
  const routelog = [];
  routelog.push(chalk.white("Starting Create Restaurant Route:"));
  try {
    const { _id } = req.user;
    const restaurant = await Restaurant.find({ owner: _id });

    res.json({
      success: true,
      message: "Get User Restaurant successfully !",
      restaurant,
    });
  } catch (error) {
    routelog.push(chalk.red("SignIn error message: ", error.message));
    log(routelog.join(" | "));

    res.json({ success: false, message: "get user restaurant failed!" });
  }
};

export const getAllRestaurants = async (req, res) => {
  const routelog = [];
  routelog.push(chalk.white("Starting GetAllRestaurant Route:"));
  try {
    const { latitude, longitude } = req.body;
    console.log(latitude, longitude);
    let restaurants;
    if (!latitude || !longitude) {
      restaurants = await Restaurant.aggregate([
        { $sort: { rating: -1 } },
        {
          $lookup: {
            from: "bookingslots",
            localField: "_id",
            foreignField: "restaurant_id",
            as: "bookingslots",
          },
        },
      ]);
    } else {
      restaurants = await Restaurant.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [longitude, latitude] },
            distanceField: "distance",
            maxDistance: 100000000,
            spherical: true,
            key: "location",
          },
        },
        { $sort: { rating: -1 } },
        {
          $lookup: {
            from: "bookingslots",
            localField: "_id",
            foreignField: "restaurant_id",
            as: "bookingslots",
          },
        },
      ]);
    }

    log(routelog.join(" | "));
    res.json({
      success: true,
      message: "Get all restaurant successfully !",
      restaurants,
    });
  } catch (error) {
    routelog.push(
      chalk.red(`Get All Restaurant error message: ${error.message} `)
    );
    log(routelog.join(" | "));

    res.json({ success: false, message: "get all restaurant failed!" });
  }
};
