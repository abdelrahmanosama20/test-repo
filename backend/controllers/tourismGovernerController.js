const { default: mongoose } = require('mongoose')
const TourismGoverner = require('../models/tourismGovernerModel')
const bcrypt = require('bcrypt');

// get all workout
const createTourismGoverner = async (req, res) => {
    try {
      // Destructure the request body to get user details
      const { username, email, password, mobile, nationality, dob} = req.body;

      // Check if the username already exists
      const existingUser = await TourismGoverner.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ message: 'Username already taken' });
      }

      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

  
      const newTourismGoverner = new TourismGoverner({
        username,
        email,
        password: hashedPassword, // Save hashed password
        mobile,
        nationality,
        dob
      });
  
      await newTourismGoverner.save();
  
      // Send success response
      res.status(200).json({
        message: 'Tourism Governer created successfully',
        toursimGoverner: {
          id: newTourismGoverner._id,
          username: newTourismGoverner.username,
          email: newTourismGoverner.email,
          mobile: newTourismGoverner.mobile,
          nationality: newTourismGoverner.nationality,
          dob: newTourismGoverner.dob,
        }
      });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(400).json({
        message: 'Error creating Tourism Governer',
        error: error.message
      });
    }
};

const getTourismGoverners = async (req, res) => {
    try {
        const TourismGoverners = await TourismGoverner.find(); // Fetch all Tour Guides from the database
        res.status(200).json({
            message: 'Tourism Governers retrieved successfully',
            data: TourismGoverners
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Tourism Governers',
            error: error.message
        });
    }
};

// Delete Tourism Governer by ID
const deleteTourismGoverner = async (req, res) => {
  try {
      const { id } = req.params; // Get the tourism governor ID from the request parameters

      // Find the tourism governor and delete them
      const deletedTourismGoverner = await TourismGoverner.findByIdAndDelete(id);

      // Check if the tourism governor was found and deleted
      if (!deletedTourismGoverner) {
          return res.status(404).json({ message: 'Tourism Governer not found' });
      }

      res.status(200).json({ message: 'Tourism Governer deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting tourism governer', error: error.message });
  }
};

// get a single workout
const getWorkout = async (req, res) => {



}

// create a workout
const createWorkout = async (req, res) => {


}

// delete a workout
const deleteWorkout = async (req, res) => {
    

}

const updateWorkout = async (req, res) => {

}

module.exports = {createTourismGoverner, getTourismGoverners, deleteTourismGoverner}