const mongoose = require('mongoose');
const Admin = require('./model/Admin');
const { secret } = require('./config/secret');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function verifyAdmins() {
  try {
    const admins = await Admin.find({});
    console.log('Total admins found:', admins.length);
    admins.forEach(admin => {
      console.log('Admin:', {
        email: admin.email,
        role: admin.role,
        status: admin.status
      });
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

verifyAdmins(); 