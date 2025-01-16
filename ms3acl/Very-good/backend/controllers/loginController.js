// Import the necessary models
const Tourist = require('../models/touristModel');
const TourGuide = require('../models/tourGuideModel');
const Admin = require('../models/adminModel');
const TourismGovernor = require('../models/tourismGovernerModel');
// Add more models as needed for other roles (e.g., Seller, Advertiser)

// Define valid roles
const validRoles = ['admin', 'tourist', 'tourGuide', 'tourismGovernor', 'seller', 'advertiser'];

// Function to handle user login
const loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    // Validate role
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role provided.' });
    }

    try {
        // Authenticate user
        const user = await authenticateUser(email, password, role);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // If authentication is successful, return success response
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to authenticate user against the correct database collection
const authenticateUser = async (email, password, role) => {
    let user;
    
    // Dynamically search in the appropriate collection based on the role
    switch (role) {
        case 'tourist':
            user = await Tourist.findOne({ email });
            break;
        case 'tourGuide':
            user = await TourGuide.findOne({ email });
            break;
        case 'admin':
            user = await Admin.findOne({ email });
            break;
        case 'tourismGovernor':
            user = await TourismGovernor.findOne({ email });
            break;
        // Add other roles like 'seller', 'advertiser', etc.
        default:
            console.log("Invalid role provided.");
            return null;
    }

    // Check if user exists
    if (!user) {
        console.log("No user found with this email and role.");
        return null;
    }

    // Check if the password matches (since you're not using bcrypt)
    if (user.password !== password) {
        console.log("Password mismatch.");
        return null;
    }

    // Return the authenticated user
    return user;
};

module.exports = { loginUser };
