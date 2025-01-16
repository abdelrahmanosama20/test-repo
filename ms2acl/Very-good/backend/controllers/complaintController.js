// controllers/touristController.js
const Tourist = require('../models/touristModel');
const Complaint = require('../models/complaintModel');

const submitComplaint = async (req, res) => {
  try {
    const { email, title, body } = req.body;

    // Find the tourist by email
    const tourist = await Tourist.findOne({ email });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Create the complaint
    const newComplaint = new Complaint({
        email: email.toLowerCase(), // Store email in lowercase
        title,
        body,
        date: new Date().toISOString(), // Ensure date is included

      });

    // Save the complaint to the database
    await newComplaint.save();
    console.log('Saved complaint:', newComplaint); // Log saved complaint details

    res.status(200).json({
        message: 'Complaint filed successfully',
        complaint: newComplaint
      });
    } catch (error) {
        console.error('Error filing complaint:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
    };

    const getComplaints = async (req, res) => {
        try {
          const complaints = await Complaint.find(); // Fetch all complaints from the database
          res.status(200).json(complaints); // Send the complaints as a response
        } catch (error) {
          console.error('Error retrieving complaints:', error);
          res.status(500).json({ message: 'Internal server error', error: error.message });
        }
      };

      // controllers/complaintController.js

const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id).populate('touristId'); // Populate touristId if you want to get tourist details
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.status(200).json(complaint);
    } catch (error) {
        console.error('Error retrieving complaint:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const getComplaintsForTourist = async (req, res) => {
    try {
        const email = req.query.email; // Get the tourist's email from the query parameters
        console.log(`Request received for email: ${email}`); // Log email received
        if (!email) {
            console.log('Email parameter is missing');
            return res.status(400).json({ message: 'Email is required' });
        }

        console.log(`Fetching complaints for email: ${email}`);
        const complaints = await Complaint.find({ email: email.toLowerCase() }).select('title body date isResolved');
        console.log(`Complaints fetched: ${complaints.length}`); // Log number of complaints fetched
        // Provide a message if no complaints are found
        if (complaints.length === 0) {
            return res.status(200).json({ message: 'No complaints found for this email.' });
        }
        res.status(200).json(complaints); // Return the complaints
    } catch (error) {
        console.error('Error retrieving complaints:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = { submitComplaint, getComplaints, getComplaintById, getComplaintsForTourist};
