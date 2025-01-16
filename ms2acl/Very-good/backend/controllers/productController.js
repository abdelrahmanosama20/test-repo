const productModel = require('../models/productModel');
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
const getavailableProducts = async (req, res) => {
    try {
        
        const products = await Product.find({ stock: { $gt: 0 } }); 

        if (products.length === 0) {
            return res.status(200).json({
                message: 'No products available',
                data: []
            });
        }

        res.status(200).json({
            message: 'Available products retrieved successfully',
            data: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Available Products',
            error: error.message
        });
    }
};

const searchbyname = async (req,res) => {

    const {name} = req.query;

    try {
        const products = await Product.find({name : name});
        if (!name) {
            return res.status(400).json({ error: 'Search term "name" is required.' });
        }
        res.status(200).json(products)
    }
    catch(error){
        res.status(400).json({error :error.message})

    }
}


// In your productController.js
const putProducts = async (req, res) => {
    const { sellerId, productId } = req.params;
    const { name, price, description, stock, rating } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { name, price, description, stock, rating },
            { new: true } // Return the updated product
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json({
            message: 'Product updated successfully.',
            product: updatedProduct
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error updating product.',
            error: error.message
        });
    }
};

// Filter Products by Price
const filterProductsByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query; // Get min and max prices from query parameters

        // Validate price inputs
        if (!minPrice || !maxPrice) {
            return res.status(400).json({
                message: 'Please provide both minPrice and maxPrice'
            });
        }

        // Fetch products within the price range
        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice } // Filtering condition
        });

        res.status(200).json({
            message: 'Filtered Products retrieved successfully',
            data: products
        });
    } catch (error) {
        console.error('Error filtering Products:', error);
        res.status(500).json({
            message: 'Error filtering Products',
            error: error.message
        });
    }
};

module.exports = {createProduct, getProducts ,putProducts, getavailableProducts, searchbyname,filterProductsByPrice}