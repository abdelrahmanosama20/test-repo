const { default: mongoose } = require('mongoose')
const Advertiser = require('../models/advertiserModel')


// get all workout
const createAdvertiser = async (req, res) => {
    try {
      // Destructure the request body to get user details
      const { name, email, password, websiteLink, hotline} = req.body;
  
      const newAdvertiser = new Advertiser({
        name,
        email,
        password,
        websiteLink,
        hotline
      });
  
      await newAdvertiser.save();
  
      // Send success response
      res.status(200).json({
        message: 'Advertiser created successfully',
        advertiser: {
          id: newAdvertiser._id,
          name: newAdvertiser.name,
          email: newAdvertiser.email,
          password : newAdvertiser.password,
          websiteLink : newAdvertiser.websiteLink,
          hotline : newAdvertiser.hotline
        }
      });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(400).json({
        message: 'Error creating Advertiser',
        error: error.message
      });
    }
};

const getAdvertisers = async (req, res) => {
    try {
        const advertisers = await Advertiser.find(); // Fetch all Tour Guides from the database
        res.status(200).json({
            message: 'Advertisers retrieved successfully',
            data: advertisers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Advertisers',
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

module.exports = {createAdvertiser, getAdvertisers}