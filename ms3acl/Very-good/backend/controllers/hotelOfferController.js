const HotelOffer = require('../models/hotelOfferModel'); // Adjust the path as necessary

// Function to create a hotel offer
const createHotelOffer = async (req, res) => {
  try {
    // Create a new hotel offer instance with the JSON data stored in the "data" field
    const hotelOffer = new HotelOffer({ data: req.body });
    
    // Save the hotel offer to the database
    const savedOffer = await hotelOffer.save();

    // Return a success response with the created hotel offer
    return res.status(201).json({
      success: true,
      message: 'Hotel offer created successfully',
      data: savedOffer,
    });
  } catch (error) {
    // Handle errors and return a 400 status code with an error message
    return res.status(400).json({
      success: false,
      message: 'Error creating hotel offer',
      error: error.message,
    });
  }
};

// Function to get all hotel offers
const getAllHotelOffers = async (req, res) => {
  try {
    // Retrieve all hotel offers from the database
    const hotelOffers = await HotelOffer.find();

    // Return a success response with the hotel offers
    return res.status(200).json({
      success: true,
      message: 'Hotel offers retrieved successfully',
      data: hotelOffers,
    });
  } catch (error) {
    // Handle errors and return a 500 status code with an error message
    return res.status(500).json({
      success: false,
      message: 'Error retrieving hotel offers',
      error: error.message,
    });
  }
};

// Function to get a hotel offer by ID
const getHotelOfferById = async (req, res) => {
  const { id } = req.params; // Extract ID from request parameters

  try {
    const hotelOffer = await HotelOffer.findById(id); // Find the hotel offer by ID

    if (!hotelOffer) {
      return res.status(404).json({
        success: false,
        message: 'Hotel offer not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Hotel offer retrieved successfully',
      data: hotelOffer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving hotel offer',
      error: error.message,
    });
  }
};

// Export the controller functions
module.exports = {
  createHotelOffer,
  getAllHotelOffers,
  getHotelOfferById,
};
