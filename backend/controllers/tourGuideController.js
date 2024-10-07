const { default: mongoose } = require('mongoose')
const TourGuide = require('../models/tourGuideModel')


// get all workout
const createTourGuide = async (req, res) => {
    try {
      // Destructure the request body to get user details
      const { name, email, password, mobile, nationality, dob, yearsOfExperience, previousJob} = req.body;
  
      const newTourGuide = new TourGuide({
        name,
        email,
        password,
        mobile,
        nationality,
        dob,
        yearsOfExperience,
        previousJob
      });
  
      await newTourGuide.save();
  
      // Send success response
      res.status(200).json({
        message: 'Tour Guide created successfully',
        tourGuide: {
          id: newTourGuide._id,
          name: newTourGuide.name,
          email: newTourGuide.email,
          mobile: newTourGuide.mobile,
          nationality: newTourGuide.nationality,
          dob: newTourGuide.dob,
          yearsOfExperience : newTourGuide.yearsOfExperience,
          previousJob : newTourGuide.previousJob
        }
      });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(400).json({
        message: 'Error creating Tour Guide',
        error: error.message
      });
    }
};

const getTourGuides = async (req, res) => {
    try {
        const users = await TourGuide.find(); // Fetch all Tour Guides from the database
        res.status(200).json({
            message: 'Tour Guides retrieved successfully',
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Tour Guides',
            error: error.message
        });
    }
};

// Delete Tour Guide by ID
const deleteTourGuide = async (req, res) => {
  try {
      const { id } = req.params; // Get the tour guide ID from the request parameters

      // Find the tour guide and delete them
      const deletedTourGuide = await TourGuide.findByIdAndDelete(id);

      // Check if the tour guide was found and deleted
      if (!deletedTourGuide) {
          return res.status(404).json({ message: 'Tour guide not found' });
      }

      res.status(200).json({ message: 'Tour guide deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting tour guide', error: error.message });
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

module.exports = {createTourGuide, getTourGuides, deleteTourGuide}