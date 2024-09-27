const { default: mongoose } = require('mongoose')
const HistoricalPlace = require('../models/historicalPlaceModel');

// Create a new Historical Place
const createHistoricalPlace = async (req, res) => {
    try {
        // Destructure the request body to get historical place details
        const { name, description, pictures, location, openingHours, ticketPrices } = req.body;

        const newHistoricalPlace = new HistoricalPlace({
            name,
            description,
            pictures,
            location,
            openingHours,
            ticketPrices
        });

        await newHistoricalPlace.save();

        // Send success response
        res.status(200).json({
            message: 'Historical Place created successfully',
            historicalPlace: {
                id: newHistoricalPlace._id,
                name: newHistoricalPlace.name,
                description: newHistoricalPlace.description,
                pictures: newHistoricalPlace.pictures,
                location: newHistoricalPlace.location,
                openingHours: newHistoricalPlace.openingHours,
                ticketPrices: newHistoricalPlace.ticketPrices
            }
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(400).json({
            message: 'Error creating Historical Place',
            error: error.message
        });
    }
};

// Get all Historical Places
const getHistoricalPlaces = async (req, res) => {
    try {
        const historicalPlaces = await HistoricalPlace.find(); // Fetch all Historical Places from the database
        res.status(200).json({
            message: 'Historical Places retrieved successfully',
            data: historicalPlaces
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Historical Places',
            error: error.message
        });
    }
};

// Placeholder functions
const getWorkout = async (req, res) => {
    // Function implementation here
};

const createWorkout = async (req, res) => {
    // Function implementation here
};

const deleteWorkout = async (req, res) => {
    // Function implementation here
};

const updateWorkout = async (req, res) => {
    // Function implementation here
};

module.exports = { createHistoricalPlace, getHistoricalPlaces };
