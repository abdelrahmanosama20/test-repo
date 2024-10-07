const Seller = require('../models/sellerModel');

// Create a new Seller
const createSeller = async (req, res) => {
    try {
        // Destructure the request body to get seller details
        const { name, email, password, description } = req.body;

        const newSeller = new Seller({
            name,
            email,
            password,
            description
        });

        await newSeller.save();

        // Send success response
        res.status(201).json({
            message: 'Seller created successfully',
            seller: {
                id: newSeller._id,
                name: newSeller.name,
                email: newSeller.email,
                description: newSeller.description
            }
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(400).json({
            message: 'Error creating Seller',
            error: error.message
        });
    }
};

// Get all Sellers
const getSellers = async (req, res) => {
    try {
        const sellers = await Seller.find(); // Fetch all Sellers from the database
        res.status(200).json({
            message: 'Sellers retrieved successfully',
            data: sellers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Sellers',
            error: error.message
        });
    }
};

// Delete seller by ID
const deleteSeller = async (req, res) => {
    try {
        const { id } = req.params; // Get the seller ID from the request parameters

        // Find the seller and delete them
        const deletedSeller = await Seller.findByIdAndDelete(id);

        // Check if the seller was found and deleted
        if (!deletedSeller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        res.status(200).json({ message: 'Seller deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting seller', error: error.message });
    }
};

module.exports = {createSeller, getSellers, deleteSeller}