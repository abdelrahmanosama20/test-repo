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

const fetchAdvertiserByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const advertiser = await Advertiser.findOne({ email });
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    res.status(200).json({ advertiser });
  } catch (error) {
    console.error('Error fetching advertiser:', error);
    res.status(500).json({ message: "Internal Server Error" });
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


// create a workout
const createWorkout = async (req, res) => {


}

// delete a workout
const deleteAdvertiser = async (req, res) => {
  try {
      const { id } = req.params; // Get the advertiser ID from the request parameters

      // Find the advertiser and delete them
      const deletedAdvertiser = await Advertiser.findByIdAndDelete(id);

      // Check if the advertiser was found and deleted
      if (!deletedAdvertiser) {
          return res.status(404).json({ message: 'Advertiser not found' });
      }

      res.status(200).json({ message: 'Advertiser deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting advertiser', error: error.message });
  }
}; 

const updateAdvertiserByEmailBackend = async (req, res) => {
  const { email } = req.body; // Extract email from request body
  const updatedData = req.body.updatedData; // Extract updated data

  try {
    // Find advertiser by email and update with new data
    const advertiser = await Advertiser.findOneAndUpdate(
      { email }, // Search by email
      updatedData, // New data
      { new: true } // Return the updated document
    );

    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    return res.status(200).json({ message: "Advertiser updated successfully", advertiser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating advertiser", error });
  }
};





module.exports = {createAdvertiser, getAdvertisers, getActivitieswithAdvertiserId, deleteActivityById, updateActivityWithId ,
  fetchAdvertiserByEmail,deleteAdvertiser,updateAdvertiserByEmailBackend}