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
          previousJob : newTourGuide.previousJob,
          isAccepted : "false",
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

const addCommentToTourGuide = async (req, res) => {
  try {
      const { tourGuideId, touristId, comment } = req.body;

      // Find the itinerary by ID
      const tourGuide = await TourGuide.findById(tourGuideId);
      
      if (!tourGuide) {
          return res.status(404).json({ message: 'tourGuide not found' });
      }

      // Add the comment and tourist ID to the comments array
      tourGuide.commentsArray.push({ comment, touristId });

      // Save the updated itinerary
      await tourGuide.save();

      res.status(200).json({
          message: 'Comment added successfully',
          tourGuide
      });
  } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({
          message: 'Error adding comment',
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





const uploadDocuments = async (req, res) => {
  try {
      const { email } = req.params;
      console.log("Received email:", email);

      const idDocumentFile = req.files['IdDocument'] ? req.files['IdDocument'][0] : null;
      const certificatesFiles = req.files['certificatesDocument'] || [];

      console.log("ID Document File:", idDocumentFile);
      console.log("Certificates Files:", certificatesFiles);

      if (!email || !idDocumentFile || certificatesFiles.length === 0) {
          console.error("Missing required documents or email");
          return res.status(400).json({ message: 'Missing required documents or email' });
      }

      const idDocumentUrl = `http://localhost:4000/uploads/${idDocumentFile.filename}`;
      const certificatesUrls = certificatesFiles.map(file => `http://localhost:4000/uploads/${file.filename}`);

      // Attempt to update the database
      const updatedTourGuide = await TourGuide.findOneAndUpdate(
          { email },
          {
              IdDocument: idDocumentUrl,
              certificatesDocument: certificatesUrls,
          },
          { new: true }
      );

      if (!updatedTourGuide) {
          console.error("Tour Guide not found with email:", email);
          return res.status(404).json({ message: 'Tour Guide not found' });
      }

      console.log("Documents uploaded successfully:", updatedTourGuide);
      res.status(200).json({ message: 'Documents uploaded successfully', tourGuide: updatedTourGuide });
  } catch (error) {
      console.error("Error in uploadDocuments function:", error);
      res.status(500).json({ message: 'An error occurred while uploading documents', error });
  }
};
const uploadPhoto = async (req, res) => {
  try {
      const { email } = req.params;

      // Check if the 'photo' file exists in the request
      const photoFile = req.file; // Access the single uploaded file

      if (!email || !photoFile) {
        return res.status(400).json({ message: 'Missing required photo or email' });
    }

      // Construct the photo URL (adjust path as necessary)
      const photoUrl = `http://localhost:4000/uploads/${photoFile.filename}`;

      // Update the TourGuide document with the photo URL
      const updatedTourGuide = await TourGuide.findOneAndUpdate(
          { email },
          { photo: photoUrl },
          { new: true }
      );

      if (!updatedTourGuide) {
          return res.status(404).json({ message: 'Tour Guide not found' });
      }

      res.status(200).json({
          message: 'Photo uploaded successfully',
          tourGuide: updatedTourGuide
      });
  } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(500).json({ message: 'An error occurred while uploading photo', error });
  }
};

// we want a method that sets the attribute isAccepted to true , 

const acceptTourGuide = async (req, res) => {
  try {
    // Extract email from request body
    const { email } = req.body;

    // Find the tour guide by email
    const tourGuide = await TourGuide.findOne({ email });
    
    if (!tourGuide) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }

    // Update the isAccepted attribute to "true"
    tourGuide.isAccepted = "true";
    tourGuide.isPendingAcceptance = false;
    await tourGuide.save();

    // Send success response
    res.status(200).json({ message: 'Tour guide accepted successfully', tourGuide });
  } catch (error) {
    console.error('Error accepting tour guide:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const rejectTourGuide = async (req, res) => {
  try {
    // Extract email from request body
    const { email } = req.body;

    // Find the tour guide by email
    const tourGuide = await TourGuide.findOne({ email });
    
    if (!tourGuide) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }

    // Update the isAccepted attribute to "true"
    tourGuide.isAccepted = "false";
    tourGuide.isPendingAcceptance = false;
    await tourGuide.save();

    // Send success response
    res.status(200).json({ message: 'Tour guide accepted successfully', tourGuide });
  } catch (error) {
    console.error('Error accepting tour guide:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTourGuideByEmail = async (req, res) => {
  const { email, updatedData } = req.body;

  try {
    const tourGuide = await TourGuide.findOneAndUpdate(
      { email }, // Find by email
      { $set: updatedData }, // Update only the fields in updatedData
      { new: true } // Return the updated document
      );

      if (!tourGuide) {
          console.log("No TourGuide found with this email", tourGuide);
          return res.status(404).json({ message: "TourGuide not found" });
      }
      
      res.status(200).json(tourGuide); // Send back the updated advertiser
  } catch (error) {
      console.error("Error updating TourGuide:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};




module.exports = {createTourGuide, getTourGuides ,getTourGuideByEmail,deleteTourGuide, getItinerarieswithTourGuideId, updateTourGuideByEmail, deleteItineraryById, updateItineraryWithId,uploadDocuments,uploadPhoto,acceptTourGuide,rejectTourGuide, addCommentToTourGuide}

