const FlightOffer = require('../models/flightOfferModel'); // Adjust the path as necessary

// Function to create a flight offer
const createFlightOffer = async (req, res) => {
  try {
    // Create a new flight offer instance with the JSON data stored in the "data" field
    const flightOffer = new FlightOffer({ data: req.body });
    
    // Save the flight offer to the database
    const savedOffer = await flightOffer.save();

    // Return a success response with the created flight offer
    return res.status(201).json({
      success: true,
      message: 'Flight offer created successfully',
      data: savedOffer,
    });
  } catch (error) {
    // Handle errors and return a 400 status code with an error message
    return res.status(400).json({
      success: false,
      message: 'Error creating flight offer',
      error: error.message,
    });
  }
};

// Function to get all flight offers
const getAllFlightOffers = async (req, res) => {
  try {
    // Retrieve all flight offers from the database
    const flightOffers = await FlightOffer.find();

    // Return a success response with the flight offers
    return res.status(200).json({
      success: true,
      message: 'Flight offers retrieved successfully',
      data: flightOffers,
    });
  } catch (error) {
    // Handle errors and return a 500 status code with an error message
    return res.status(500).json({
      success: false,
      message: 'Error retrieving flight offers',
      error: error.message,
    });
  }
};

const getFlightOfferById = async (req, res) => {
  const { id } = req.params; // Extract ID from request parameters

  try {
    const flightOffer = await FlightOffer.findById(id); // Find the flight offer by ID

    if (!flightOffer) {
      return res.status(404).json({
        success: false,
        message: 'Flight offer not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Flight offer retrieved successfully',
      data: flightOffer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving flight offer',
      error: error.message,
    });
  }
};

// Export the controller functions
module.exports = {
  createFlightOffer,
  getAllFlightOffers,
  getFlightOfferById,
};
