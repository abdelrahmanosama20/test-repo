const HotelInfo = require('../models/hotelInfoModel'); // Ensure correct path to the model

// Function to create hotel info
const createHotelInfo = async (req, res) => {
  try {
    const newInfo = new HotelInfo(req.body);
    const savedInfo = await newInfo.save();
    res.status(201).json({
      message: 'Hotel info created successfully',
      info: savedInfo
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating hotel info', error });
  }
};

// Function to get all hotel info entries
const getAllHotelInfo = async (req, res) => {
  try {
    const infos = await HotelInfo.find(); // Fetch all entries from the database
    res.status(200).json({
      message: 'Hotel infos retrieved successfully',
      data: infos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error retrieving hotel infos',
      error: error.message
    });
  }
};

// Function to get hotel info by offer ID
const getHotelInfoByOfferId = async (req, res) => {
  try {
    const offerId = req.params.id; // Extract 'offerId' from req.params
    const info = await HotelInfo.findOne({ offerId }); // Fetch by offerId instead of _id

    if (!info) {
      return res.status(404).json({
        message: 'Hotel info not found',
      });
    }

    res.status(200).json({
      message: 'Hotel info retrieved successfully',
      data: info
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error retrieving hotel info',
      error: error.message
    });
  }
};

// Export the controller functions
module.exports = {
  createHotelInfo,
  getAllHotelInfo,
  getHotelInfoByOfferId
};
