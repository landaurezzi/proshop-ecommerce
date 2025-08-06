import mongoose from "mongoose";
import dotenv from 'dotenv';
import colors from 'colors';
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
//console.log('Loaded Product model:', Product?.modelName);
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async ()  => {
    try {
        //console.log('Loaded products:', products);

        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        
        // Debug: check each product for missing 'image'
        products.forEach((product, idx) => {
            if (!product.image) {
                console.error(`Product at index ${idx} is missing 'image' field:`, product);
            }
        });
        
        const sampleProducts = products.map((product) => ({
            ...product,
            user: adminUser,
        }));

        /*
        const sampleProducts = products.map((product) => {
            return {...product, user: adminUser};
        });
        */

        await Product.insertMany(sampleProducts);
        console.log('Data Imported!'.green.inverse);
        process.exit();
    } 
    catch (error) {
        console.log(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } 
    catch (error) {
        console.log(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} 
else {
    importData();
}