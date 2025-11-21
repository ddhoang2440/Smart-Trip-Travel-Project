
import {v2 as cloudinary } from 'cloudinary'

import chalk from 'chalk'
import Restaurant from '../model/restaurant.js';

const log = console.log;
export const CreateRestaurant = async (req, res) => {
    const routelog = [];
    routelog.push(chalk.white("Starting Create Restaurant Route:"))
    try {
        const files = req.files;
        const { name,type,medium_price,from,to,address,description } = req.body;
        const {_id} = req.user;
        const isExist = Restaurant.find({owner: _id});
        if(isExist) {
            return res.json({success: false, message: "User already have restaurant"})
        }
        if(!name || !type || !medium_price || !from || !to || !address || !description){
            routelog.push(chalk.yellow("Input not valid"));
            return res.json({success: false, message: "All Input Must Valid !"});
        }
        let urls = [];
        if(files) {
            for (const file of files){
                const uploaded = await cloudinary.uploader.upload(file.path, {folder: 'restaurant'} );
                urls.push(uploaded);
            }
        }
        routelog.push(chalk.cyan("Input valid !"))
        const images = urls.map((url) => url.secure_url);
        const images_id = urls.map((url) => url.public_id);
        console.log(images);
        console.log(images_id);
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
        }
        const restaurant = await Restaurant.create(newRestaurant);
        routelog.push(chalk.green("Create new Restaurant successfully !"));
        routelog.push(chalk.white("End Route"))
        log(routelog.join(" | "));
        res.json({success: true, message: "Create Restaurant successfully !"});
        
        
    } catch (error) {
        routelog.push(chalk.red("Create restaurant error message: ", error.message));
        log(routelog.join(" | "));

        res.json({success: false, message:"Create new Restaurant failed!"})
    }
}


export const getUserRestaurant = async (req, res) => {
    const routelog = [];
    routelog.push(chalk.white("Starting Create Restaurant Route:"))
    try {
        const {_id} = req.user;
        const restaurant = await Restaurant.find({owner: _id});
        
        res.json({success: true, message: "Get User Restaurant successfully !", restaurant});
    } catch (error) {
        routelog.push(chalk.red("SignIn error message: ", error.message));
        log(routelog.join(" | "));

        res.json({success: false, message:"get user restaurant failed!"})
    }
}


export const getAllRestaurants = async (req, res) => {
    const routelog = [];
    routelog.push(chalk.white("Starting GetAllRestaurant Route:"))
    try {
        const restaurants = await Restaurant.find().sort({rating: -1});
        log(routelog.join(" | "));
        res.json({success: true, message: "Get all restaurant successfully !", restaurants})
    } catch (error) {
        routelog.push(chalk.red(`SignIn error message: ${error.message} `));
        log(routelog.join(" | "));

        res.json({success: false, message:"get all restaurant failed!"})
    }
}

