const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  getFeaturedCategories,
} = require('../controller/categoryController');
const { verifyToken } = require('../middleware/verifyToken');
const { isAdmin } = require('../middleware/isAdmin');

// Public routes
router.get('/', getAllCategories);
router.get('/featured', getFeaturedCategories);
router.get('/:id', getCategory);

// Protected routes (admin only)
router.use(verifyToken, isAdmin);
router.post('/', createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router; 