const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');

// Create a new Admin
const createAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the username already exists
        const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            username,
            email,
            password: hashedPassword,
        });

        await newAdmin.save();

        res.status(201).json({
            message: 'Admin created successfully',
            admin: {
                id: newAdmin._id,
                username: newAdmin.username,
                email: newAdmin.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Error creating Admin',
            error: error.message
        });
    }
};


module.exports = { createAdmin,};
