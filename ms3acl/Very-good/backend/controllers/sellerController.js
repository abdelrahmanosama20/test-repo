const Seller = require('../models/sellerModel');

// Create a new Seller
const createSeller = async (req, res) => {
    try {
        // Destructure the request body to get seller details
        const { name, email, password, description } = req.body;

        const newSeller = new Seller({
            name,
            email,
            password,
            description
        });

        await newSeller.save();

        // Send success response
        res.status(201).json({
            message: 'Seller created successfully',
            seller: {
                id: newSeller._id,
                name: newSeller.name,
                email: newSeller.email,
                description: newSeller.description
            }
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(400).json({
            message: 'Error creating Seller',
            error: error.message
        });
    }
};

// Get all Sellers
const getSellers = async (req, res) => {
    try {
        const sellers = await Seller.find(); // Fetch all Sellers from the database
        res.status(200).json({
            message: 'Sellers retrieved successfully',
            data: sellers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Sellers',
            error: error.message
        });
    }
};
// Method to fetch seller by email
const fetchSellerByEmail = async (req, res) => {
    try {
        // Get the email from the request body
        const { email } = req.body; // Expecting { email: 'Smirbdr@gmail.com' }

        // Ensure email is a string
        if (typeof email !== 'string') {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Find the seller by email
        const seller = await Seller.findOne({ email }).populate('createdProducts');

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Send success response
        res.status(200).json({
            message: 'Seller fetched successfully',
            seller: seller,
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({
            message: 'Error fetching Seller',
            error: error.message,
        });
    }
};
const updateSeller = async (req, res) => {
    const { email } = req.body; // Extract email from request body
    const updatedData = req.body.updatedData; // Extract updated data
  
    try {
      // Find seller by email and update with new data
      const seller = await Seller.findOneAndUpdate(
        { email }, // Search by email
        updatedData, // New data
        { new: true } // Return the updated document
      );
  
      if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
      }
  
      return res.status(200).json({ message: "Seller updated successfully", seller });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating seller", error });
    }
  };

// Delete seller by ID

const deleteSeller = async (req, res) => {
    try {
        const { id } = req.params; // Get seller ID from URL params
        
        // Try to delete the seller from DB
        const deletedSeller = await Seller.findByIdAndDelete(id);

        if (!deletedSeller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        res.status(200).json({ message: 'Seller deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting seller', error: error.message });
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
        const updatedSeller = await Seller.findOneAndUpdate(
            { email },
            {
                IdDocument: idDocumentUrl,
                taxationRegistryCard: taxUrls,
            },
            { new: true }
        );
  
        if (!updatedSeller) {
            console.error("Tour Guide not found with email:", email);
            return res.status(404).json({ message: 'Tour Guide not found' });
        }
  
        console.log("Documents uploaded successfully:", updatedSeller);
        res.status(200).json({ message: 'Documents uploaded successfully', Seller: updatedSeller });
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
        const updatedSeller = await Seller.findOneAndUpdate(
            { email },
            { logo: photoUrl },
            { new: true }
        );
  
        if (!updatedSeller) {
            return res.status(404).json({ message: 'seller not found' });
        }
  
        res.status(200).json({
            message: 'Photo uploaded successfully',
            Seller: updatedSeller
        });
    } catch (error) {
        console.error("Error uploading photo:", error);
        res.status(500).json({ message: 'An error occurred while uploading photo', error });
    }
  };
  const acceptsellers = async (req, res) => {
    try {
      // Extract email from request body
      const { email } = req.body;
  
      // Find the tour guide by email
      const seller = await Seller.findOne({ email });
      
      if (!seller) {
        return res.status(404).json({ message: 'seller not found' });
      }
  
      // Update the isAccepted attribute to "true"
      seller.isAccepted = "true";
      seller.isPendingAcceptance = false;
      await seller.save();
  
      // Send success response
      res.status(200).json({ message: 'seller accepted successfully', seller });
    } catch (error) {
      console.error('Error accepting seller:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  const rejectsellers = async (req, res) => {
    try {
      // Extract email from request body
      const { email } = req.body;
  
      // Find the tour guide by email
      const seller = await Seller.findOne({ email });
      
      if (!seller) {
        return res.status(404).json({ message: 'seller not found' });
      }
  
      // Update the isAccepted attribute to "true"
      seller.isAccepted = "false";
      seller.isPendingAcceptance = false;
      await seller.save();
  
      // Send success response
      res.status(200).json({ message: 'seller rejected successfully', seller });
    } catch (error) {
      console.error('Error accepting seller:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Fetch all product IDs for a seller by email
const fetchProductsBySellerEmail = async (req, res) => {
    try {
        const { email } = req.params; // Extract email from URL params
        
        // Find the seller by email
        const seller = await Seller.findOne({ email }); // Populate only the _id field from the Product model
        
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Extract the product IDs from the populated 'createdProducts' array
        const productIds = seller.createdProducts;
        
        // Send success response with the list of product IDs
        res.status(200).json({
            message: 'Products fetched successfully',
            productIds: productIds
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching products for seller',
            error: error.message
        });
    }
};


module.exports = {createSeller, getSellers,fetchSellerByEmail,updateSeller,deleteSeller,uploadDocuments,uploadPhoto,acceptsellers,rejectsellers,fetchProductsBySellerEmail}