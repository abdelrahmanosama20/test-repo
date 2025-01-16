const { default: mongoose } = require('mongoose')
const HistoricalPlace = require('../models/historicalPlaceModel');
const Tag = require('../models/tagModel');

// Create a new Historical Place

const getMuseumByID = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameters
        const museum = await HistoricalPlace.findById(id); // Find the activity by ID

        if (!museum) {
            return res.status(404).json({ message: 'Museum not found' }); // Handle case where activity is not found
        }

        // Send success response with the activity data
        res.status(200).json({
            message: 'Museum retrieved successfully',
            data: museum
        });
    } catch (error) {
        console.error('Error retrieving Museum:', error);
        res.status(500).json({
            message: 'Error retrieving Museum',
            error: error.message
        });
    }
};


const createHistoricalPlace = async (req, res) => {
    try {
        // Destructure the request body to get historical place details
        const { name, description, pictures, location, openingHours, ticketPrices, museum, tourismGovernerId, tags } = req.body;

        const newHistoricalPlace = new HistoricalPlace({
            name,
            description,
            pictures,
            location,
            openingHours,
            ticketPrices,
            museum,
            tourismGovernerId,
            tags
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
                ticketPrices: newHistoricalPlace.ticketPrices,
                museum: newHistoricalPlace.museum,
                tourismGovernerId: newHistoricalPlace.tourismGovernerId,
                tags: newHistoricalPlace.tags
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
        const historicalPlaces = await HistoricalPlace.find();
        res.status(200).json({ // Fetch all Historical Places from the database
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

const deleteHistoricalPlace = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the request parameters

        // Find the historical place by ID and delete it
        const deletedPlace = await HistoricalPlace.findByIdAndDelete(id);

        if (!deletedPlace) {
            return res.status(404).json({
                message: 'Historical Place not found'
            });
        }

        res.status(200).json({
            message: 'Historical Place deleted successfully',
            data: deletedPlace
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting Historical Place',
            error: error.message
        });
    }
};

const updateHistoricalPlace = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the request parameters
        const updatedData = req.body; // Get the updated data from the request body

        // Find the historical place by ID and update it
        const updatedPlace = await HistoricalPlace.findByIdAndUpdate(id, updatedData, {
            new: true, // Return the updated document
            runValidators: true // Run schema validation
        });

        if (!updatedPlace) {
            return res.status(404).json({
                message: 'Historical Place not found'
            });
        }

        res.status(200).json({
            message: 'Historical Place updated successfully',
            data: updatedPlace
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error updating Historical Place',
            error: error.message
        });
    }
};

const getHistoricalPlaceTags = async (req, res) => {
    try {
        const { id } = req.params; // Get museumId from request parameters

        // Step 1: Find the historical place (museum) by its ID
        const historicalPlace = await HistoricalPlace.findById(id);

        if (!historicalPlace) {
            return res.status(404).json({ message: 'Museum not found' });
        }

        // Step 2: Get the tag IDs from the historical place
        const tagIds = historicalPlace.tags; // Assuming tags is an array of ObjectId

        if (tagIds.length === 0) {
            return res.status(200).json({ message: 'No tags associated with this museum', tags: [] });
        }

        // Step 3: Fetch the tags based on the tag IDs
        const tags = await Tag.find({ _id: { $in: tagIds } });

        // Step 4: Send the fetched tags as the response
        return res.status(200).json(tags);
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const searchforHP = async (req, res) => {
    console.log("req.query.name", req.query.name)
    const { name, tag } = req.query;
    let historicalPlace = [];

    try {
        const query = {};

        if (name) {
            query.name = name; // Match the historical place name
            console.log("query.name :", query.name)
        }

        if (tag) {
            const tagObject = await Tag.findOne({ name: tag }); // Find tag by name
            if (tagObject) {
                query.tags = tagObject._id; // Query by the ObjectId of the tag
            } else {
                return res.status(404).json({ error: 'Tag not found.' });
            }
        }

        if (!name && !tag) {
            return res.status(400).json({ error: 'Search terms are required.' });
        }

        historicalPlace = await HistoricalPlace.find(query) // Populate the tag references

        res.status(200).json(historicalPlace);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Filter museums by tag name
const FilterMuseumByTagName = async (req, res) => {
    try {
      const { tagName } = req.body; // Get the tag name from the request body
  
      // Find the tag with the given name
      const tag = await Tag.findOne({ name: tagName });
  
      if (!tag) {
        return res.status(404).json({ message: 'Tag not found' });
      }
  
      // Find all museums that have this tag ID in their tags array
      const museums = await HistoricalPlace.find({ tags: tag._id });
  
      if (museums.length === 0) {
        return res.status(404).json({ message: 'No museums found with the given tag' });
      }
  
      // Return the matching museums
      return res.status(200).json(museums);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
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

module.exports = { createHistoricalPlace, getHistoricalPlaces, deleteHistoricalPlace, updateHistoricalPlace, getHistoricalPlaceTags , 
    searchforHP, FilterMuseumByTagName, getMuseumByID};
