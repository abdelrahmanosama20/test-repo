const { default: mongoose } = require('mongoose')
const TourismGoverner = require('../models/tourismGovernerModel')


// get all workout
const createTourismGoverner = async (req, res) => {
    try {
      // Destructure the request body to get user details
      const { name, email, password, mobile, nationality, dob} = req.body;
  
      const newTourismGoverner = new TourismGoverner({
        name,
        email,
        password,
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
          name: newTourismGoverner.name,
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
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Tourism Governers',
            error: error.message
        });
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

module.exports = {createTourismGoverner, getTourismGoverners}