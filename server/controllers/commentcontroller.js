import Comment from "../model/comment.js";
import { v2 as cloudinary } from "cloudinary";

export const createComment = async (req, res) => {
  try {
    const { _id } = req.user;
    const files = req.files;
    const { restaurant_id, content, rating } = req.body;
    if (!restaurant_id || !content || !rating) {
      return res.json({ success: false, message: "All Value Must Valid !" });
    }
    let urls = [];
    if (files) {
      for (const file of files) {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "comment",
        });
        urls.push(uploaded);
      }
    }
    const images = urls.map((url) => url.secure_url);
    const newComment = {
      user_id: _id,
      restaurant_id,
      content,
      images,
      rating,
    };
    const result = await Comment.create(newComment);
    if (!result) {
      res.json({ success: false, message: "Create Comment Failed !" });
    }
    res.json({ success: true, message: "Create Comment Successfully !" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getComment = async (req, res) => {
  try {
    const { restaurant_id } = req.query;

    const data = await Comment.find({
      restaurant_id: restaurant_id,
    }).populate("user_id").sort({ createdAt: -1 });
    if (!data) {
      res.json({ success: false, message: "Get Comment Failed !" });
    }
    res.json({
      success: true,
      message: "Get Comment Successfully !",
      comment: data,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
