//const mongoose = require('mongoose');
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
const addReviewToProduct = async (req, res) => {
    try {
        const { productId, touristId, comment } = req.body;

        // Find the itinerary by ID
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: 'product not found' });
        }

        // Add the comment and tourist ID to the comments array
        product.reviewsArray.push({ comment, touristId });

        // Save the updated itinerary
        await product.save();

        res.status(200).json({
            message: 'review added successfully',
            product
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({
            message: 'Error adding review',
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

const searchbyname = async (req, res) => {
    const { name } = req.query;

    // Validate that the name query parameter is provided
    if (!name) {
        return res.status(400).json({ error: 'Search term "name" is required.' });
    }

    try {
        // Find products with the specified name that are also unarchived
        const products = await Product.find({
            name: name,
            isArchived: false // Only fetch unarchived products
        });

        res.status(200).json(products);
    } catch (error) {
        console.error('Error searching by name:', error);
        res.status(500).json({ error: error.message });
    }
};

// In your productController.js or a similar controller
/*const updateProductSales = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.sales += 1; // Increment the sales count
        await product.save();

        res.json({ message: "Product sales incremented successfully", product });
    } catch (err) {
        res.status(500).json({ message: "Error updating sales", error: err.message });
    }
};*/



// In your productController.js
const putProducts = async (req, res) => {
    const { sellerId, productId } = req.params;
    const updatedData = req.body;

    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: productId, sellerId: sellerId }, // Find by both product ID and seller ID
            { $set: updatedData }, // Apply the updates
            { new: true } // Return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct); // Send back updated product data
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
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
            price: { $gte: minPrice, $lte: maxPrice } , // Filtering condition
            isArchived: false // Only fetch unarchived products

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
// Archive a product
// Archive a product
// Archive a product
const archiveProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Updated to match the route parameter
        const product = await Product.findByIdAndUpdate(
            productId,
            { isArchived: true },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({
            message: 'Product archived successfully',
            product
        });
    } catch (err) {
        console.error('Error archiving product:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Unarchive a product
const unarchiveProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Updated to match the route parameter
        const product = await Product.findByIdAndUpdate(
            productId,
            { isArchived: false },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({
            message: 'Product unarchived successfully',
            product
        });
    } catch (err) {
        console.error('Error unarchiving product:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};



module.exports = {createProduct, getProducts ,putProducts, getavailableProducts, searchbyname,filterProductsByPrice,archiveProduct,unarchiveProduct}
const deleteProductsBySeller = async (req, res) => {
    try {
        const { sellerId } = req.params; // Get sellerId from URL parameters

      //  console.log(Attempting to delete products for sellerId: ${sellerId});
        
        // Delete all products with the specified sellerId
        const result = await Product.deleteMany({ sellerId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No products found for this seller' });
        }

        res.status(200).json({ message: 'Products deleted successfully' });
    } catch (error) {
        console.error("Error deleting products Controller:", error);
        res.status(500).json({ message: 'Error deleting products', error: error.message });
    }
};

const uploadPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const trimmedId = id.trim(); // Remove any extra spaces or newline characters

        const photoFile = req.file;

        if (!trimmedId || !photoFile) {
            return res.status(400).json({ message: 'Missing required photo or id' });
        }

        const photoUrl = `http://localhost:4000/uploads/${photoFile.filename}`;

        const updatedProduct = await Product.findOneAndUpdate(
            { _id: trimmedId },
            { $push: { pictures: photoUrl } },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Photo uploaded successfully',
            Product: updatedProduct
        });
    } catch (error) {
        console.error("Error uploading photo:", error);
        res.status(500).json({ message: 'An error occurred while uploading photo', error });
    }
};

// Method to fetch product name by ID
const getProductNameById = async (req, res) => {
    try {
        const { productId } = req.params; // Extract the product ID from URL parameters

        // Validate if productId is provided
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Find the product by ID
        const product = await Product.findById(productId);

        // Check if product exists
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Send success response with product name and ID
        res.status(200).json({
            message: 'Product fetched successfully',
            product: {
                productId: product._id,   // Returning product ID
                productName: product.name, // Returning product name
                pic : product.pictures
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching product details',
            error: error.message
        });
    }
};

const getfullproductbyid = async (req, res) => {
    try {
        const { productId } = req.params; // Extract the product ID from URL parameters

        // Validate if productId is provided
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Find the product by ID
        const product = await Product.findById(productId);

        // Check if product exists
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Send success response with product name and ID
        res.status(200).json({
            message: 'Product fetched successfully',
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching product details',
            error: error.message
        });
    }
};




module.exports = {createProduct, getProducts ,putProducts, getavailableProducts, searchbyname,filterProductsByPrice,deleteProductsBySeller,addReviewToProduct,    
    archiveProduct,
    unarchiveProduct,uploadPhoto,getProductNameById,getfullproductbyid}