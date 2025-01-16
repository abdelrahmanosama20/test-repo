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
// Method to fetch seller by email
const fetchSellerByEmail = async (req, res) => {
    try {
        // Get the email from the request body
        const { email } = req.body; // Expecting { email: 'Smirbdr@gmail.com' }

        // Ensure email is a string
        if (typeof email !== 'string') {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Find the seller by email
        const seller = await Seller.findOne({ email }).populate('createdProducts');

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Send success response
        res.status(200).json({
            message: 'Seller fetched successfully',
            seller: seller,
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({
            message: 'Error fetching Seller',
            error: error.message,
        });
    }
};
const updateSeller = async (req, res) => {
    const { email } = req.body; // Extract email from request body
    const updatedData = req.body.updatedData; // Extract updated data
  
    try {
      // Find seller by email and update with new data
      const seller = await Seller.findOneAndUpdate(
        { email }, // Search by email
        updatedData, // New data
        { new: true } // Return the updated document
      );
  
      if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
      }
  
      return res.status(200).json({ message: "Seller updated successfully", seller });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating seller", error });
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


module.exports = {createSeller, getSellers,fetchSellerByEmail,updateSeller,deleteSeller}