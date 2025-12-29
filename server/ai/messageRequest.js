import mongoose, { Types } from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    user_id: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    session_id: {
      type: Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("messages", MessageSchema);
export default Message;
