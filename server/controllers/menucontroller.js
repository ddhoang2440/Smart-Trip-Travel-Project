import { v2 as cloudinary } from "cloudinary";
import Menu from "../model/food.js";
import Restaurant from "../model/restaurant.js";

const log = console.log;

export const createMenu = async (req, res) => {
  try {
    const { name, price,  type, restaurant } = req.body;
    const file = req.file;

    console.log(file);
    if (!name  || !price ||  !restaurant) {
      return res.json({ success: false, message: "All Input Must Valid !" });
    }
    if (!file) {
      return res.json({ success: false, message: "Cant not get image !" });
    }
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "menu",
    });
    const newMenu = {
      name,
      price,
      type: type,
      restaurant,
      image: result.secure_url,
      image_id: result.public_id,
    };
    await Menu.create(newMenu);

    res.json({ success: true, message: "Create Menu Successfully!" });
  } catch (error) {
    log("error: ", error.message);
    res.json({ success: false, message: "Create Menu Failed!" });
  }
};

export const getMenu = async (req, res) => {
  try {
    const menu = await Menu.find().populate("restaurant", "address name");
    if (!menu) {
      return res.json({ success: false, message: "Cant find any menu!" });
    }

    res.json({ success: true, message: "Get Menu Successfully!", menu });
  } catch (error) {
    log("error: ", error.message);
    res.json({ success: false, message: "Get Menu Failed!" });
  }
};

export const getUserMenu = async (req, res) => {
  try {
    const { _id } = req.user;
    const rest = await Restaurant.findOne({ owner: _id });
    const usermenu = await Menu.find({ restaurant: rest._id });
    if (!usermenu) {
      return res.json({ success: false, message: "Cant find any menu!" });
    }

    res.json({
      success: true,
      message: "Get User Menu Successfully!",
      usermenu,
    });
  } catch (error) {
    log("error: ", error.message);
    res.json({ success: false, message: "Get Menu Failed!" });
  }
};

export const getRestaurantMenu = async (req, res) => {
  try {
    const { restaurant_id } = req.body;
    const restaurantmenu = await Menu.find({
      restaurant: restaurant_id,
    }).populate("restaurant", "address name");
    if (!restaurantmenu) {
      return res.json({
        success: false,
        message: "Cant get Restaurant Menu!",
      });
    }
    res.json({
      success: true,
      message: "Get Restaurant Menu Successfully !",
      restaurantmenu,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
export const updateRestaurantMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, type, restaurant } = req.body;
    const file = req.file;

    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    if (!name  || !price || !restaurant) {
      return res.json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin!",
      });
    }
    const currentMenu = await Menu.findById(id);
    if (!currentMenu) {
      return res.json({
        success: false,
        message: "Không tìm thấy menu!",
      });
    }
    const updateData = {
      name,
      price,
      type,
      restaurant,
    };

    if (file) {
      if (currentMenu.image_id) {
        try {
          await cloudinary.uploader.destroy(currentMenu.image_id);
        } catch (cloudinaryError) {
          console.log(
            "Lỗi xóa ảnh cũ trên Cloudinary:",
            cloudinaryError.message
          );
        }
      }
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "menu",
      });

      updateData.image = result.secure_url;
      updateData.image_id = result.public_id;
    }
    const updatedMenu = await Menu.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedMenu) {
      return res.json({
        success: false,
        message: "Không thể cập nhật menu!",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật menu thành công!",
      newMenu: updatedMenu,
    });
  } catch (error) {
    console.log("Lỗi update menu:", error.message);
    res.json({
      success: false,
      message: error.message || "Cập nhật menu thất bại!",
    });
  }
};


export const removeMenu = async (req, res) => {
  try {
    const { menu_id } = req.params;
    console.log(menu_id)
    await Menu.findByIdAndDelete(menu_id)
    res.json({ success: true, message: "Remove Menu Items Successfully !"})
  } catch (error) {
    log("error: ", error.message);
    res.json({ success: false, message: "Remove Menu Items Failed!" });
  }
}