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

const updateAdvertiserByEmail = async (req, res) => {
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA")
  console.log("Received a request to update advertiser");
  const { email, updatedData } = req.body;
  console.log("Updating advertiser with emailYY:", email);
  console.log("Updated DataYY:", updatedData);
  console.log("BODY",req.body)

  try {
    const advertiser = await Advertiser.findOneAndUpdate(
      { email }, // Find by email
      { $set: updatedData }, // Update only the fields in updatedData
      { new: true } // Return the updated document
      );

      if (!advertiser) {
          console.log("No advertiser found with this email", advertiser);
          return res.status(404).json({ message: "Advertiser not found" });
      }
      
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA")
      console.log("Advertiser updated successfully:", advertiser);
      console.log("Updating advertiser with emailYY:", email);
      console.log("Updated DataYY:", updatedData);

      res.status(200).json(advertiser); // Send back the updated advertiser
  } catch (error) {
      console.error("Error updating advertiser:", error);
      res.status(500).json({ message: "Internal server error" });
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



const uploadDocuments = async (req, res) => {
  try {
      const { email } = req.params;
      console.log("Received email:", email);

      const idDocumentFile = req.files['IdDocument'] ? req.files['IdDocument'][0] : null;
      const taxFiles = req.files['taxationRegistryCard'] || [];

      console.log("ID Document File:", idDocumentFile);
      console.log("Certificates Files:", taxFiles);

      if (!email || !idDocumentFile || taxFiles.length === 0) {
          console.error("Missing required documents or email");
          return res.status(400).json({ message: 'Missing required documents or email' });
      }

      const idDocumentUrl = `http://localhost:4000/uploads/${idDocumentFile.filename}`;
      const taxUrls = taxFiles.map(file => `http://localhost:4000/uploads/${file.filename}`);

      // Attempt to update the database
      const updatedadvertiser = await Advertiser.findOneAndUpdate(
          { email },
          {
              IdDocument: idDocumentUrl,
              taxationRegistryCard: taxUrls,
          },
          { new: true }
      );

      if (!updatedadvertiser) {
          console.error("Tour Guide not found with email:", email);
          return res.status(404).json({ message: 'Tour Guide not found' });
      }

      console.log("Documents uploaded successfully:", updatedadvertiser);
      res.status(200).json({ message: 'Documents uploaded successfully', Advertiser: updatedadvertiser });
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
      const updatedAdvertiser = await Advertiser.findOneAndUpdate(
          { email },
          { logo: photoUrl },
          { new: true }
      );

      if (!updatedAdvertiser) {
          return res.status(404).json({ message: 'advertiser not found' });
      }

      res.status(200).json({
          message: 'Photo uploaded successfully',
          Advertiser: updatedAdvertiser
      });
  } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(500).json({ message: 'An error occurred while uploading photo', error });
  }
};

const acceptAdvertiser = async (req, res) => {
  try {
    // Extract email from request body
    const { email } = req.body;

    // Find the tour guide by email
    const advertiser = await Advertiser.findOne({ email });
    
    if (!advertiser) {
      return res.status(404).json({ message: 'advertiser not found' });
    }

    // Update the isAccepted attribute to "true"
    advertiser.isAccepted = "true";
    advertiser.isPendingAcceptance = false;
    await advertiser.save();

    // Send success response
    res.status(200).json({ message: 'advertiser accepted successfully', advertiser });
  } catch (error) {
    console.error('Error accepting advertiser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const rejectadvertiser = async (req, res) => {
  try {
    // Extract email from request body
    const { email } = req.body;

    // Find the tour guide by email
    const advertiser = await Advertiser.findOne({ email });
    
    if (!advertiser) {
      return res.status(404).json({ message: 'advertiser not found' });
    }

    // Update the isAccepted attribute to "true"
    advertiser.isAccepted = "false";
    advertiser.isPendingAcceptance = false;
    await advertiser.save();

    // Send success response
    res.status(200).json({ message: 'advertiser rejected successfully', advertiser });
  } catch (error) {
    console.error('Error accepting tour guide:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




module.exports = {createAdvertiser, getAdvertisers, getActivitieswithAdvertiserId, deleteActivityById, updateActivityWithId ,
fetchAdvertiserByEmail,deleteAdvertiser,updateAdvertiserByEmailBackend,uploadDocuments,uploadPhoto,acceptAdvertiser,rejectadvertiser ,updateAdvertiserByEmail,uploadDocuments,uploadPhoto,acceptAdvertiser,rejectadvertiser} 