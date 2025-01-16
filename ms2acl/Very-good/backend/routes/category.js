const express = require('express');
const { createCategory, getCategories, deleteCategory, updateCategory, getCategoryById } = require('../controllers/categoryController.js');
const router = express.Router();

router.get('/:id', getCategoryById);

router.get('/', getCategories); // Fetch categories
router.post('/', createCategory); // Create category
// router.delete('/', deleteCategory); // Delete category
router.delete('/:id', deleteCategory); // Expecting the ID instead of name

router.patch('/:categoryName', updateCategory); // Update category

module.exports = router;
