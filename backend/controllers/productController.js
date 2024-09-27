const Product = require('../models/productModel');
const Seller = require('../models/sellerModel');

// Create a new Product
const createProduct = async (req, res) => {
    try {
        // Destructure the request body to get product details
        const { name, price, description, stock, rating, sellerId } = req.body;

        const newProduct = new Product({
            name,
            price,
            description,
            stock,
            rating,
            sellerId
        });

        await newProduct.save();

        // Add the product ID to the seller's list of products
        
        await Seller.findByIdAndUpdate(sellerId, {
            $push: { createdProducts: newProduct._id } // Add the product ID to the seller's products array
        });
        

        // Send success response
        res.status(200).json({
            message: 'Product created successfully',
            product: {
                id: newProduct._id,
                name: newProduct.name,
                price: newProduct.price,
                description: newProduct.description,
                stock: newProduct.stock,
                rating: newProduct.rating,
                sellerId: newProduct.sellerId
            }
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(400).json({
            message: 'Error creating Product',
            error: error.message
        });
    }
};

// Get all Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all Products from the database
        res.status(200).json({
            message: 'Products retrieved successfully',
            data: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Products',
            error: error.message
        });
    }
};

module.exports = {createProduct, getProducts}