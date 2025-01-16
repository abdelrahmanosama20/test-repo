const { default: mongoose } = require('mongoose')
const TourGuide = require('../models/tourGuideModel')
const Itinerary = require('../models/itineraryModel')


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

const getItinerarieswithTourGuideId = async (req, res) => {
  try {
      const itineraries = await Itinerary.find({ tourGuideId: req.params.id });
      res.json(itineraries);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
}

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

// a method that gets a single tour guide data based on email
const getTourGuideByEmail = async (req, res) => {
  const { email } = req.body; // Ensure the email is in the request body
  
  try {
      const tourGuide = await TourGuide.findOne({ email });

      if (!tourGuide) {
          return res.status(404).json({ message: 'Tour Guide not found' });
      }

      res.status(200).json({ tourGuide });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching Tour Guide', error: error.message });
  }
};

const deleteItineraryById = async (req, res) => {
  try {
      const { id } = req.params; // Get the ID from the request parameters

      // Find the activity by ID and delete it
      const deletedItinerary = await Itinerary.findByIdAndDelete(id);

      // Check if the activity was found and deleted
      if (!deletedItinerary) {
          return res.status(404).json({ message: 'Itinerary not found' });
      }

      res.status(200).json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
};

const updateItineraryWithId = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the request parameters
    const updatedData = req.body; // Get the updated data from the request body

    // Find the activity by ID and update it with the new data
    const updatedItinerary = await Itinerary.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure the update respects schema validation
    });

    // Check if the activity was found and updated
    if (!updatedItinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.status(200).json({ message: 'Itinerary updated successfully', updatedItinerary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



// create a workout
const createWorkout = async (req, res) => {


}

// delete a workout
const deleteWorkout = async (req, res) => {
    

}

const updateWorkout = async (req, res) => {

}
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

module.exports = {createTourGuide, getTourGuides ,getTourGuideByEmail,deleteTourGuide, getItinerarieswithTourGuideId, deleteItineraryById, updateItineraryWithId}