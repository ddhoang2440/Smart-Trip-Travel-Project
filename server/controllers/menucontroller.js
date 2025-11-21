import {v2 as cloudinary} from 'cloudinary'
import Menu from '../model/food.js';
import Restaurant from '../model/restaurant.js';

const log = console.log;

export const createMenu = async (req,res) => {
    try {
        const {name,description,price,ingredient, restaurant} = req.body;
        const file = req.file;

        console.log(file);
        if(!name || !description || !price || !ingredient || !restaurant) {
            return res.json({success: false, message: "All Input Must Valid !"});
        }
        if(!file) {
            return res.json({success:false, message: "Cant not get image !"})
        }
        const _ingredient = ingredient.split(',').map((items) => items.trim());
        const result = await cloudinary.uploader.upload(file.path, {folder: 'menu'});
        const newMenu = {
            name,
            description,
            price,
            ingredient: _ingredient,
            restaurant,
            image: result.secure_url,
            image_id: result.public_id
        }
        await Menu.create(newMenu);

        res.json({success: true, message: "Create Menu Successfully!"})

    } catch (error) {
        log("error: ", error.message);
        res.json({success: false, message: "Create Menu Failed!"})
    }
}


export const getMenu = async (req,res) => {
    try {
    const menu = await Menu.find().populate("restaurant", ("address name"));
    if(!menu) {
        return res.json({success: false , message: "Cant find any menu!"})
    }

    res.json({success: true, message: "Get Menu Successfully!", menu})
    } catch (error) {
        log("error: ", error.message);
        res.json({success: false, message: "Get Menu Failed!"})
    }
}

export const getUserMenu = async (req,res) => {
    try {
        const {_id} = req.user;
        const rest =  await Restaurant.findOne({owner: _id});
        const usermenu = await Menu.find({restaurant: rest._id});
        if(!usermenu) {
        return res.json({success: false , message: "Cant find any menu!"})
    }

    res.json({success: true, message: "Get User Menu Successfully!", usermenu})
        
    } catch (error) {
        log("error: ", error.message);
        res.json({success: false, message: "Get Menu Failed!"})
    }
}


export const getRestaurantMenu = async (req, res) => {
    try {
            const { restaurant_id } = req.body;
            const restaurantmenu = await Menu.find({
              restaurant: restaurant_id,
            }).populate("restaurant", ('address name'));
            if (!restaurantmenu) {
              return res.json({
                success: false,
                message: "Cant get Restaurant Menu!",
              });
            }
            res.json({
              success: true,
              message: "Get Restaurant Menu Successfully !",
              restaurantmenu
            });
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}