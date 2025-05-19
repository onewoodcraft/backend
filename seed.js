require('dotenv').config();

const connectDB = require('./config/db');

const Brand = require('./model/Brand');
const brandData = require('./utils/brands');

const Category = require('./model/Category');
const categoryData = require('./utils/categories');

const Products = require('./model/Products');
const productsData = require('./utils/products');

const Coupon = require('./model/Coupon');
const couponData = require('./utils/coupons');

const Order = require('./model/Order');
const orderData = require('./utils/orders');

const User = require('./model/User');
const userData = require('./utils/users');

const Reviews = require('./model/Review');
const reviewsData = require('./utils/reviews');

const Admin = require('./model/Admin');
const adminData = require('./utils/admin');

const mongoose = require('mongoose');
const categories = require('./seed/categories');

connectDB();

const importAdminData = async () => {
  try {
    await Admin.deleteMany();
    await Admin.insertMany(adminData);
    console.log('Admin data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.log('error', error);
    process.exit(1);
  }
};

importAdminData();
