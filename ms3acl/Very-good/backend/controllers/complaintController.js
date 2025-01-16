const Complaint = require('../models/complaintModel'); // Adjust the path if necessary
const Tourist = require('../models/touristModel');
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


      const getComplaintsForTourist = async (req, res) => {
        try {
            const email = req.query.email; // Get the tourist's email from the query parameters
           // console.log(Request received for email: ${email}); // Log email received
            if (!email) {
                console.log('Email parameter is missing');
                return res.status(400).json({ message: 'Email is required' });
            }
    
           // console.log(Fetching complaints for email: ${email});
            const complaints = await Complaint.find({ email: email.toLowerCase() });
          //  console.log(Complaints fetched: ${complaints.length}); // Log number of complaints fetched
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














// Function to update complaint status
const updateComplaintStatus = async (req, res) => {
    const { complaintId } = req.params;
    const { isResolved } = req.body;

    try {
        // Validate the isResolved value
        if (typeof isResolved !== 'boolean') {
            return res.status(400).json({ message: 'isResolved should be a boolean' });
        }

        // Find the complaint and update the isResolved field
        const complaint = await Complaint.findByIdAndUpdate(
            complaintId,
            { isResolved },
            { new: true } // Return the updated document
        );

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.status(200).json({ message: 'Complaint status updated', complaint });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



const replyToComplaint = async (req, res) => {
    const { complaintId } = req.params;
    const { reply } = req.body;

    try {
        const complaint = await Complaint.findByIdAndUpdate(
            complaintId,
            { adminReply: reply },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.status(200).json({ message: 'Reply sent successfully', complaint });
    } catch (error) {
        res.status(500).json({ message: 'Error replying to complaint', error });
    }
};


const getComplaintsSortedByDate = async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ date: -1 }); // Sort by date in descending order
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaints', error });
    }
};

const filterComplaintsByStatus = async (req, res) => {
    const { status } = req.query; // Get the status from the query parameters

    try {
        // Ensure status is a boolean
        const isResolved = status === 'true'; // Converts 'true'/'false' string to boolean
        const complaints = await Complaint.find({ isResolved }); // Filter by isResolved status

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaints', error });
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

module.exports = {
    submitComplaint,getComplaintById,getComplaints,updateComplaintStatus, replyToComplaint, getComplaintsSortedByDate, filterComplaintsByStatus,getComplaintsForTourist};