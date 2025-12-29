import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: "" },
    contact: { type: String, default: "" },
    allergy: { type: [String], default: [] },
    image: { type: String },
    image_url: { type: String },
    auth_provider: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);

export default User;
