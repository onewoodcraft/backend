require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../model/Category');
const categories = require('../seed/categories');
const { secret } = require('../config/secret');

async function seedCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(secret.db_url);
    console.log('Connected to MongoDB');

    // Drop existing collection and indexes
    await mongoose.connection.db.dropCollection('categories');
    console.log('Dropped existing categories collection');

    // Insert new categories
    const result = await Category.insertMany(categories);
    console.log(`Seeded ${result.length} categories successfully`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    if (error.code === 26) {
      // Collection doesn't exist, continue with seeding
      try {
        const result = await Category.insertMany(categories);
        console.log(`Seeded ${result.length} categories successfully`);
        await mongoose.connection.close();
        console.log('Database connection closed');
      } catch (seedError) {
        console.error('Error seeding categories:', seedError);
        process.exit(1);
      }
    } else {
      console.error('Error seeding categories:', error);
      process.exit(1);
    }
  }
}

// Run the seeding function
seedCategories(); 