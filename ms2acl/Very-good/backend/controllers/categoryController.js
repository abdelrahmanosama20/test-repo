const { default: mongoose } = require('mongoose')
const Category = require('../models/categoryModel')
const Activity = require('../models/activityModel');


const createCategory = async (req, res) => {
    try {
      const newCategory = new Category(req.body);
      const savedCategory = await newCategory.save();
      res.status(201).json({
        message: 'Category created successfully',
        category: savedCategory // Ensure this is the expected structure
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating category', error });
    }
  };
  
  

const getCategories = async (req, res) => {
    try {
        const Categories = await Category.find(); // Fetch all Categories from the database
        res.status(200).json({
            message: 'Categories retrieved successfully',
            data: Categories
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Categories',
            error: error.message
        });
    }
}

const getCategoryById = async (req, res) => {
  try {
      const id = req.params.id; // Extract 'id' from req.params
      const category = await Category.findById(id); // Fetch Category by ID

      if (!category) {
          return res.status(404).json({
              message: 'Category not found',
          });
      }

      res.status(200).json({
          message: 'Category retrieved successfully',
          data: category
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          message: 'Error retrieving category',
          error: error.message
      });
  }
}


const deleteCategory = async (req, res) => {
  try {
      const categoryId = req.params.id; // Make sure this is the ID
      const category = await Category.findById(categoryId);

      if (!category) {
          return res.status(404).json({ message: 'Category not found' });
      }

      // Delete activities associated with the category
      await Activity.deleteMany({ categoryId: category._id });

      // Delete the category
      await Category.findByIdAndDelete(category._id);

      res.status(200).json({ message: 'Category and associated activities deleted successfully' });
  } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

const updateCategory = async (req, res) => {
    const { categoryName } = req.params; // Get the category name from the route parameters
  const updatedData = req.body; // Get the updated data from the request body

  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { name: categoryName },
      updatedData,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }

};

module.exports = {createCategory, getCategories,deleteCategory, updateCategory, getCategoryById}