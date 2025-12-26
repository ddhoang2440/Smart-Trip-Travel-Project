import { createToken } from "../configs/token.js";
import User from "../model/user.js";
import bcrypt from "bcrypt";
import chalk from "chalk";
import { v2 as cloudinary } from "cloudinary";
import validator from "validator";
import Restaurant from "../model/restaurant.js";
import Menu from "../model/food.js";
import axios from "axios";
const log = console.log;

// sign in
export const signin = async (req, res) => {
  const routelog = [];
  routelog.push(chalk.white("Starting signin Route:"));
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      routelog.push(log(chalk.yellow("Wrong email syntax!, return ...")));
      return res.json({ success: false, message: "Wrong Email Syntax !" });
    }
    routelog.push(chalk.cyan("Email is valid!", email));

    const isValid = await User.findOne({ email });
    if (!isValid) {
      routelog.push(chalk.yellow("User not found !, return ..."));
      return res.json({ success: false, message: "Email not found!" });
    }
    routelog.push(chalk.cyan("User founded !"));

    const isPassValid = await bcrypt.compare(password, isValid.password);
    if (!isPassValid) {
      routelog.push(chalk.yellow("Wrong password !, return ..."));
      return res.json({ success: false, message: "Password Incorrect!" });
    }
    routelog.push(chalk.cyan("Create Token ..."));

    const token = await createToken(isValid);
    routelog.push(chalk.green("User", isValid.username, "login Successfully!"));
    log(routelog.join(" | "));

    res.json({
      success: true,
      message: "Login successfully!",
      user: {
        username: isValid.username,
        email: isValid.email,
        image: isValid.image,
        allergy: isValid.allergy,
        contact: isValid.contact,
      },
      token: token,
    });
  } catch (error) {
    routelog.push(chalk.red("SignIn error message: ", error.message));
    log(routelog.join(" | "));

    res.json({ success: false, message: "Signin failed!" });
  }
};

export const signinGoogle = async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Google Access Token." });
    }
    const googleRes = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    );
    const { email, name, picture } = googleRes.data;
    let _user = await User.findOne({ email });
    if (!_user) {
      _user = await User.create({
        email,
        username: name,
        image: picture,
        auth_provider: "google",
      });
    } else {
      _user.username = name;
      _user.image = picture;
      await _user.save();
    }
    const token = await createToken(_user);
    res.json({
      success: true,
      message: "Login By Google Successfully !",
      user: _user,
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Signin failed!" });
  }
};
// sign up
export const signup = async (req, res) => {
  const routelog = [];
  routelog.push(chalk.white("Starting signup Route: "));
  try {
    const { username, email, password } = req.body;
    const User = await User.findOne({ email });

    if (User) {
      routelog.push(chalk.cyan("Account exist !"));
      return res.json({ success: false, message: "Account exist!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    const newUser = {
      username: username,
      email: email,
      password: hashPass,
      image: "",
      contact: "",
      image_url: "",
    };
    const newuser = await User.create(newUser);
    const token = await createToken(newuser);

    routelog.push(
      chalk.green("Create accout", newuser.username, "successfully!")
    );
    log(routelog.join(" | "));
    res.json({
      success: true,
      message: "Create accout successfully!",
      user: {
        username: newuser.username,
        email: newuser.email,
        image: newuser.image,
      },
      token: token,
    });
  } catch (error) {
    routelog.push(chalk.red("Signup error message: ", error.message));
    log(routelog.join(" | "));
    res.json({ success: false, message: "Signup failed!:" });
  }
};

// change profile
export const profile = async (req, res) => {
  const routelog = [];
  routelog.push(chalk.white("Starting profile change Route:"));
  try {
    const { _id } = req.user;

    const data = req.body;

    const file = req.file;

    const _user = await User.findOne({ _id });
    routelog.push(
      chalk.cyan("Receiver Data Successfully!, email: ", _user.email)
    );
    let result = null;
    if (file) {
      routelog.push(chalk.green("Upload file..."));
      result = await cloudinary.uploader.upload(file.path, { folder: "users" });
    }
    if (_user && _user.image_url && file) {
      routelog.push(chalk.green("Delete Old Image"));
      const result = await cloudinary.uploader.destroy(_user.image_url, {
        invalidate: true,
      });
      console.log(result);
    }
    let hashPass = _user.password;
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      hashPass = await bcrypt.hash(data.password, salt);
      routelog.push(chalk.cyan("Hass Password..."));
    }
    const newProfile = {
      username: data.username || User.username,
      password: hashPass || User.password,
      image: result ? result.secure_url : User.image,
      image_url: result ? result.public_id : User.image_id,
      allergy: data.allergy
        ? data.allergy
            .split(",")
            .map((a) => a.trim())
            .filter((a) => a !== "")
        : User.allergy,
      contact: data.contact.length === 10 ? data.contact : User.contact,
    };
    const newuser = await User.findOneAndUpdate({ _id }, newProfile, {
      new: true,
    });
    routelog.push(chalk.cyan("Replace user profile with new profile..."));
    log(routelog.join(" | "));
    res.json({
      success: true,
      message: "Profile changed successfully!",
      user: newuser,
    });
  } catch (error) {
    routelog.push(chalk.red("Signup error message: ", error.message));
    log(routelog.join(" | "));
    res.json({ success: false, message: "Profile changed fail!" });
  }
};

// check if user is login before

export const authCheck = async (req, res) => {
  const routelog = [];
  routelog.push(chalk.white("Starting authCheck Route:"));
  try {
    const data = req.user;
    const _user = await User.findOne({ _id: data._id });
    if (!_user) {
      routelog.push(chalk.yellow("User not found !"));
      return res.json({ success: false, message: "Auth not Found!" });
    }
    routelog.push(chalk.cyan("User Founded!", _user.email));
    log(routelog.join(" | "));
    res.json({
      success: true,
      message: "Auth found successfully!",
      user: {
        username: _user.username,
        email: _user.email,
        image: _user.image,
        allergy: _user.allergy,
      },
    });
  } catch (error) {
    routelog.push(chalk.red("Signup error message: ", error.message));
    log(routelog.join(" | "));
    res.json({ success: false, message: "Auth found error!" });
  }
};

export const authDelete = async (req, res) => {
  const routelog = [];
  routelog.push(chalk.white("Starting Delete Account Route: "));
  try {
    const { _id, email } = req.user;

    const _restaurant = await Restaurant.find({ owner: _id });
    for (const re of _restaurant) {
      const _menu = Menu.find({ restaurant: re._id });
      await cloudinary.uploader.destroy();
    }

    const _user = await User.findById(_id);
    await cloudinary.uploader.destroy(_user.image_url, { invalidate: true });
    await User.findByIdAndDelete({ _id });

    routelog.push(chalk.green("Delete Account ", email, " Successfully"));
    routelog.push(chalk.white("End Route"));
    log(routelog.join(" | "));
    res.json({ success: true, message: "Delete Account Successfully !" });
  } catch (error) {
    routelog.push(chalk.red("AuthDelete error message: ", error.message));
    routelog.push(chalk.white("End Route! "));
    log(routelog.join(" | "));
    res.json({ success: false, message: "Error while Delete Account !" });
  }
};
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const user = await User.findOne({ _id: id });

    res.json({
      success: true,
      message: "get Account Successfully !",
      user: user,
    });
  } catch (error) {
    res.json({ success: false, message: "Error while get Account !" });
  }
};
