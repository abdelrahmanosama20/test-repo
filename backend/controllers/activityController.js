const { default: mongoose } = require('mongoose')
const Activity = require('../models/activityModel')
const tourGuide = require('../models/tourGuideModel')
const advertiser = require('../models/advertiserModel')



// get all workout
const createActivity = async (req, res) => {
    try {
        // Destructure the request body to get activity details
        const { name, date, duration, address, location, price, time, category, ratings, tags, tourGuideId, advertiserId, specialDiscount, bookingOpen} = req.body;

        const newActivity = new Activity({
            name,
            date,
            duration,
            address,
            location,
            price,
            time,
            category,
            ratings,
            tags,
            tourGuideId,
            advertiserId
        });

        await newActivity.save();

        if (tourGuideId) {
            await tourGuide.findByIdAndUpdate(tourGuideId, {
                $push: { createdActivities: newActivity._id } // Add the activity ID to the tour guide's created activities
            });
        }
        else if (advertiserId) {
            await advertiser.findByIdAndUpdate(advertiserId, {
                $push: { createdActivities: newActivity._id } // Add the activity ID to the advertiser's created activities
            });
        }


        // Send success response
        res.status(200).json({
            message: 'Activity created successfully',
            activity: {
                id: newActivity._id,
                name: newActivity.name,
                date: newActivity.date,
                duration: newActivity.duration,
                location: newActivity.location,
                price: newActivity.price,
                time: newActivity.time,
                category: newActivity.category,
                ratings: newActivity.ratings,
                tags: newActivity.tags,
                tourGuideId: newActivity.tourGuideId,
                advertiserId: newActivity.advertiserId
            }
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(400).json({
            message: 'Error creating Activity',
            error: error.message
        });
    }
};

const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find(); // Fetch all Activities from the database
        res.status(200).json({
            message: 'Activities retrieved successfully',
            data: activities
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving Activities',
            error: error.message
        });
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

module.exports = {createActivity, getActivities}