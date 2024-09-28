const { default: mongoose } = require('mongoose')
const Advertiser = require('../models/advertiserModel')
const Activity = require('../models/activityModel')


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

const getActivitieswithAdvertiserId = async (req, res) => {
  try {
      const activities = await Activity.find({ advertiserId: req.params.id });
      res.json(activities);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
}

const deleteActivityById = async (req, res) => {
  try {
      const { id } = req.params; // Get the ID from the request parameters

      // Find the activity by ID and delete it
      const deletedActivity = await Activity.findByIdAndDelete(id);

      // Check if the activity was found and deleted
      if (!deletedActivity) {
          return res.status(404).json({ message: 'Activity not found' });
      }

      res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
};

const updateActivityWithId = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the request parameters
    const updatedData = req.body; // Get the updated data from the request body

    // Find the activity by ID and update it with the new data
    const updatedActivity = await Activity.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure the update respects schema validation
    });

    // Check if the activity was found and updated
    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json({ message: 'Activity updated successfully', updatedActivity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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

module.exports = {createAdvertiser, getAdvertisers, getActivitieswithAdvertiserId, deleteActivityById, updateActivityWithId}