const { default: mongoose } = require('mongoose')
const Tourist = require('../models/touristModel')


// get all workout
const createTourist = async (req, res) => {
    try {
      // Destructure the request body to get user details
      const { name, email, password, mobile, nationality, dob, job} = req.body;
  
      // Create a new user instance with the role of tourist
      const newUser = new Tourist({
        name,
        email,
        password,
        mobile,
        nationality,
        dob,
        job 
        // No need to set bookedItineraries, createdItineraries, or wallet; they will default to appropriate values
      });
  
      // Save the user to the database
      await newUser.save();
  
      // Send success response
      res.status(200).json({
        message: 'Tourist created successfully',
        tourist: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
          nationality: newUser.nationality,
          dob: newUser.dob,
          job: newUser.job,
        }
      });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(400).json({
        message: 'Error creating tourist',
        error: error.message
      });
    }
};

const getTourist = async (req, res) => {
    try {
        const users = await Tourist.find(); // Fetch all users from the database
        res.status(200).json({
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving users',
            error: error.message
        });
    }
};

// Delete tourist by ID
const deleteTourist = async (req, res) => {
  try {
      const { id } = req.params; // Get the tourist ID from the request parameters

      // Find the tourist and delete them
      const deletedTourist = await Tourist.findByIdAndDelete(id);

      // Check if the tourist was found and deleted
      if (!deletedTourist) {
          return res.status(404).json({ message: 'Tourist not found' });
      }

      res.status(200).json({ message: 'Tourist deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting tourist', error: error.message });
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

module.exports = {createTourist, getTourist, deleteTourist}