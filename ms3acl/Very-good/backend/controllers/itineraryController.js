const { default: mongoose } = require('mongoose');
const Itinerary = require('../models/itineraryModel'); // Ensure this is the correct path for the Itinerary model
const TourGuide = require('../models/tourGuideModel'); // Ensure this is the correct path for the TourGuide model
const Tag = require('../models/tagModel'); // Adjust the path if necessary
// Create an Itinerary

const getItineraryByID = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameters
        const itinerary = await Itinerary.findById(id); // Find the activity by ID

        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' }); // Handle case where activity is not found
        }

        // Send success response with the activity data
        res.status(200).json({
            message: 'Itinerary retrieved successfully',
            data: itinerary
        });
    } catch (error) {
        console.error('Error retrieving itinerary:', error);
        res.status(500).json({
            message: 'Error retrieving itinerary',
            error: error.message
        });
    }
};


const createItinerary = async (req, res) => {
    try {
        // Destructure the request body to get itinerary details
        const {
            title,
            description,
            activities,    // Array of embedded activities
            touristIds,    // Array of tourist IDs
            tourGuideId,   // ID of the tour guide
            locationsToVisit,
            language,
            price,
            availableDates,
            availableTimes,
            accessibility,
            pickUpLocation,
            dropOffLocation,
            tags
        } = req.body;

        // Create a new Itinerary object with embedded activities
        const newItinerary = new Itinerary({
            title,
            description,
            activities,    // Embedded activities
            touristIds,    // Array of tourist IDs
            tourGuideId,   // ID of the tour guide
            locationsToVisit,
            language,
            price,
            availableDates,
            availableTimes,
            accessibility,
            pickUpLocation,
            dropOffLocation,
            tags
        });

        // Save the new itinerary to the database
        await newItinerary.save();

        // Update the tour guide's createdItineraries array
        await TourGuide.findByIdAndUpdate(tourGuideId, {
            $push: { createdItineraries: newItinerary._id }
        });

        // Send success response
        res.status(200).json({
            message: 'Itinerary created successfully',
            itinerary: newItinerary
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(400).json({
            message: 'Error creating Itinerary',
            error: error.message
        });
    }
};

// Get all Itineraries
const getItineraries = async (req, res) => {
    try {
        const itineraries = await Itinerary.find()
            .populate('tourGuideId') // Populate the tour guide details
            .populate('touristIds'); // Populate tourists

        res.status(200).json({
            message: 'Itineraries retrieved successfully',
            data: itineraries
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Itineraries',
            error: error.message
        });
    }
};

// Filter itineraries based on parameters
const filterItineraries = async (req, res) => {
    try {
        // Destructure filter parameters from the request body
        const { budget, startDate, endDate, preferences, language } = req.body;

        // Build the query object based on provided filters
        let query = {};

        if (budget) {
            query.price = { $lte: budget }; // Filter itineraries by price
        }

        if (startDate || endDate) {
            query.availableDates = {};
            if (startDate) {
                query.availableDates.$gte = new Date(startDate); // Filter by start date
            }
            if (endDate) {
                query.availableDates.$lte = new Date(endDate); // Filter by end date
            }
        }

        if (preferences && preferences.length > 0) {
            query.preferences = { $in: preferences }; // Assuming you have a 'preferences' field in your itinerary model
        }

        if (language) {
            query.language = language; // Assuming you have a 'language' field in your itinerary model
        }

        // Fetch itineraries based on the query
        const itineraries = await Itinerary.find(query);

        // Send the filtered itineraries back as a response
        res.status(200).json({
            message: 'Filtered itineraries retrieved successfully',
            data: itineraries
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving itineraries',
            error: error.message
        });
    }
};

const searchforitinerary = async (req, res) => {
    const { title } = req.query;

    if (!title) {
        return res.status(400).json({ error: 'Search term "title" is required.' });
    }

    try {
        const itinerary = await Itinerary.find({ title: title });
        res.status(200).json(itinerary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const filterItinerariesYassin = async (req, res) => {
    try {
        const { price, date, tags, language } = req.body; // Include language in destructuring

        // Array to hold our filtering conditions
        const filterConditions = [];

        // If price is provided, add it to the conditions
        if (price) {
            filterConditions.push({ price: { $eq: price } }); // Exact match for price
        }

        // If date is provided, add it to the conditions
        if (date) {
            const inputDate = new Date(date); // Ensure input date is a Date object
            if (!isNaN(inputDate)) { // Check if date is valid
                filterConditions.push({ availableDates: { $elemMatch: { $eq: inputDate } } });
            } else {
                console.error('Invalid date format provided:', date);
                return res.status(400).json({ error: 'Invalid date format' });
            }
        }

        // If tags are provided, find the corresponding tag IDs and add to the conditions
        if (tags) {
            const tagIds = await Tag.find({ name: tags }).select('_id'); // Find tag IDs by tag name
            if (tagIds.length > 0) {
                filterConditions.push({ tags: { $in: tagIds.map(tag => tag._id) } });
            } else {
                // If no tags are found, handle accordingly
                return res.status(404).json({ error: 'No matching tags found' });
            }
        }

        // If language is provided, add it to the conditions
        if (language) {
            filterConditions.push({ language: { $eq: language } }); // Exact match for language
        }

        // Check if we have any filter conditions, if not return all itineraries
        let query = {};
        if (filterConditions.length > 0) {
            query = { $and: filterConditions }; // Use $and for all conditions to match all
        }

        // Perform the filtering query
        const itineraries = await Itinerary.find(query);
        res.status(200).json(itineraries);
    } catch (error) {
        console.error('Error filtering itineraries:', error.message); // Log the specific error message
        res.status(500).json({ error: 'Error filtering itineraries' });
    }
};



const flagItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        const itinerary = await Itinerary.findById(id);
        if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });

        itinerary.flagged = true; // Toggle flag status
        await itinerary.save();

        return res.status(200).json({ message: 'Itinerary flag status updated', itinerary });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
const itinerary_status = async (req, res) => {
    try {
        const { id } = req.params;
        const itinerary = await Itinerary.findById(id);

        if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });

        // Check if there are existing bookings (touristIds list)
        if (itinerary.touristIds && itinerary.touristIds.length > 0) {
            // If there are bookings, the itinerary can be deactivated for new users but remains visible for those who booked
            itinerary.isActive = false; // You can also add a flag for showing this to existing tourists
        } else {
            // Toggle active status if no bookings are present
            itinerary.isActive = !itinerary.isActive;
        }

        await itinerary.save();

        return res.status(200).json({ message: 'Itinerary status updated', itinerary });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

// function takes tourist id and a comment , and itnerary id 
const addCommentToItinerary = async (req, res) => {
    try {
        const { itineraryId, touristId, comment } = req.body;

        // Find the itinerary by ID
        const itinerary = await Itinerary.findById(itineraryId);
        
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // Add the comment and tourist ID to the comments array
        itinerary.commentsArray.push({ comment, touristId });

        // Save the updated itinerary
        await itinerary.save();

        res.status(200).json({
            message: 'Comment added successfully',
            itinerary
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({
            message: 'Error adding comment',
            error: error.message
        });
    }
};




module.exports = {
    createItinerary,
    getItineraries,
    filterItineraries,
    searchforitinerary,filterItinerariesYassin,
    flagItinerary,
    getItineraryByID,
    itinerary_status,
    addCommentToItinerary,
    
};
