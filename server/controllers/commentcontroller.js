import Comment from "../model/comment.js";



export const createComment = async (req, res) => {
  try {
    const { _id } = req.user;
    const { restaurant_id, content } = req.body;

    const newComment = {
      user_id: _id,
      restaurant_id,
      content,
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



export const getComment = async (req,res) => {
    try {
        const {restaurant_id} = req.body;
        const data = await Comment.find({restaurant_id}).populate("user_id").sort({createdAt: -1});
            if (!data) {
              res.json({ success: false, message: "Get Comment Failed !" });
            }
            res.json({
              success: true,
              message: "Get Comment Successfully !",
              data,
            });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}