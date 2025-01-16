const Transportation = require('../models/transportationModel'); // Import the Transportation model


// Function to get all transportations
const getAllTransportations = async (req, res) => {
  try {
    // Fetch all transportation documents from the database
    const transportations = await Transportation.find();

    // If no transportations are found, return a message
    if (!transportations.length) {
      return res.status(404).json({ message: 'No transportation records found.' });
    }

    // Return the transportations in the response
    res.status(200).json(transportations);
  } catch (error) {
    // Handle errors and return an appropriate response
    res.status(500).json({ message: 'Error fetching transportation records', error: error.message });
  }
};

const editTransportation = async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters
  
  try {
    // Find the transportation by ID and update it with the request body
    const updatedTransportation = await Transportation.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    // If the transportation was not found, return a 404 error
    if (!updatedTransportation) {
      return res.status(404).json({ message: 'Transportation not found' });
    }

    // Return the updated transportation record
    res.status(200).json(updatedTransportation);
  } catch (error) {
    // Handle errors and return an appropriate response
    res.status(500).json({ message: 'Error updating transportation record', error: error.message });
  }
};

const deleteTransportation = async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters

  try {
    // Find the transportation by ID and remove it
    const deletedTransportation = await Transportation.findByIdAndDelete(id);

    // If the transportation was not found, return a 404 error
    if (!deletedTransportation) {
      return res.status(404).json({ message: 'Transportation not found' });
    }

    // Return a success message
    res.status(200).json({ message: 'Transportation deleted successfully' });
  } catch (error) {
    // Handle errors and return an appropriate response
    res.status(500).json({ message: 'Error deleting transportation record', error: error.message });
  }
};


const getTransportationsByAdvertiserId = async (req, res) => {
  try {
    // Get advertiserId from the request parameters
    const { advertiserId } = req.params;

    // Fetch all transportation documents that match the given advertiserId
    const transportations = await Transportation.find({ advertiserId });

    // If no transportations are found for the given advertiserId, return a message
    if (!transportations.length) {
      return res.status(404).json({ message: 'No transportation records found for this advertiser.' });
    }

    // Return the transportations in the response
    res.status(200).json(transportations);
  } catch (error) {
    // Handle errors and return an appropriate response
    res.status(500).json({ message: 'Error fetching transportation records', error: error.message });
  }
};


const getTransportationById = async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
  
    try {
      const transportation = await Transportation.findById(id); // Fetch the transportation by ID
  
      if (!transportation) {
        return res.status(404).json({ message: 'Transportation not found' });
      }
  
      res.status(200).json(transportation); // Return the found transportation
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


// Function to create a new transportation
const createTransportation = async (req, res) => {
  try {
    // Destructure the request body to extract the necessary fields
    const {
      advertiserId,
      type,
      provider,
      departureLocation,
      arrivalLocation,
      departureTime,
      arrivalTime,
      price,
      isAvailable,
    } = req.body;

    // Ensure all required fields are provided
    if (!type || !provider || !departureLocation || !arrivalLocation || !departureTime || !arrivalTime || !price || !advertiserId) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    // Create a new transportation document using the model
    const newTransportation = new Transportation({
      advertiserId,
      type,
      provider,
      departureLocation,
      arrivalLocation,
      departureTime,
      arrivalTime,
      price,
      isAvailable: isAvailable !== undefined ? isAvailable : true, // Set default if not provided
    });

    // Save the transportation document to the database
    await newTransportation.save();

    // Respond with the created transportation record
    res.status(201).json(newTransportation);
  } catch (error) {
    // Handle errors and return an appropriate response
    res.status(500).json({ message: 'Error creating transportation record', error: error.message });
  }
};

module.exports = {
  createTransportation,
  getAllTransportations,
  createTransportation,
  getTransportationById,
  getTransportationsByAdvertiserId,
  editTransportation,
  deleteTransportation
};
