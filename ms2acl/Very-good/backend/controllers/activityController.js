const { default: mongoose } = require('mongoose')
const Activity = require('../models/activityModel')
const tourGuide = require('../models/tourGuideModel')
const advertiser = require('../models/advertiserModel')
const activity = require('../models/activityModel');
const Category = require('../models/categoryModel')

// get all workout


const getActivityById = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameters
        const activity = await Activity.findById(id); // Find the activity by ID

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' }); // Handle case where activity is not found
        }

        // Send success response with the activity data
        res.status(200).json({
            message: 'Activity retrieved successfully',
            data: activity
        });
    } catch (error) {
        console.error('Error retrieving activity:', error);
        res.status(500).json({
            message: 'Error retrieving activity',
            error: error.message
        });
    }
};

const createActivity = async (req, res) => {
    try {
        // Destructure the request body to get activity details
        const { name, date, duration, location, price, time, categoryId, ratings, tags, tourGuideId, advertiserId, specialDiscount, bookingOpen} = req.body;

        const newActivity = new Activity({
            name,
            date,
            duration,
            location,
            price,
            time,
            categoryId,
            ratings,
            tags,
            tourGuideId,
            advertiserId,
            specialDiscount,
            bookingOpen
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
                categoryId: newActivity.categoryId,
                ratings: newActivity.ratings,
                tags: newActivity.tags,
                tourGuideId: newActivity.tourGuideId,
                advertiserId: newActivity.advertiserId,
                bookingOpen: newActivity.bookingOpen,
                specialDiscount: newActivity.specialDiscount
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
const searchactivity = async(req,res) => {


    const {name,category, tag } = req.query;
        let activities = [];
    
        try {
            const query = {};
            
            if (name) {
                query.name = name; // Match the activity name
            }
            if (tag) {
                query['tags.name'] = tag; // Match the activity tags
            }
            if (category) {
                const catObject = await Category.findOne({ name: category }); // Find tag by name
                if (catObject) {
                    query.categoryId = catObject._id; // Query by the ObjectId of the tag
                } else {
                    return res.status(404).json({ error: 'Category not found.' });
                }
            }
            if (!name && !tag && !category)   {
                return res.status(400).json({ error: 'Search terms are required.' });
            }

            console.log(query)
    
            activities = await Activity.find(query); 
            
    
    
            res.status(200).json(activities);
    
        }
        
        catch(error){
            res.status(400).json({error :error.message})
    
        }
    }

// create a workout
const createWorkout = async (req, res) => {


}

// delete a workout
const deleteWorkout = async (req, res) => {
    

}

const updateWorkout = async (req, res) => {

}
// Import Activity model
//const Activity = require('../models/activityModel');    ((already present))

// Controller for filtering activities based on budget, date, category, or ratings
const filterActivities = async (req, res) => {
    try {
      // Extract query parameters from the request
      const { budget, startDate, endDate, category, minRating } = req.query;
  
      // Build a filter object dynamically
      let filter = {};
  
      // Apply filters based on query parameters
      if (budget) {
        filter.price = { $lte: budget }; // Less than or equal to the specified budget
      }
  
      if (startDate && endDate) {
        filter.date = {
          $gte: new Date(startDate), // Greater than or equal to the start date
          $lte: new Date(endDate) // Less than or equal to the end date
        };
      } else if (startDate) {
        filter.date = { $gte: new Date(startDate) }; // Only apply start date if no end date is provided
      }
  
      if (category) {
        filter.category = category; // Match the category exactly
      }
  
      if (minRating) {
        filter.ratings = { $gte: minRating }; // Minimum rating
      }
  
      // Find activities that match the filter
      const filteredActivities = await Activity.find(filter);
  
      // Send response with the filtered activities
      res.status(200).json({
        message: 'Filtered activities retrieved successfully',
        data: filteredActivities
      });
    } catch (error) {
      console.error('Error filtering activities:', error);
      res.status(500).json({
        message: 'Error filtering activities',
        error: error.message
      });
    }
  };
  const filterActivitiesyassin = async (req, res) => {
    try {
        const { price, date, category, ratings } = req.body; // Destructure the input from the request body

        // Prepare an array to hold all filtering conditions
        const filterConditions = [];

        // Add filters based on the provided parameters
        if (price !== undefined) {
            filterConditions.push({ price: price }); // Exact match for price
        }
        if (date) {
            filterConditions.push({ date: new Date(date) }); // Convert string date to Date object
        }
        if (ratings !== undefined) {
            filterConditions.push({ ratings:  ratings  }); // Filter activities with ratings greater than or equal to provided rating
        }
        if (category) {
            // Find categoryId corresponding to category name
            const foundCategory = await Category.findOne({ name: category });
            if (foundCategory) {
                filterConditions.push({ categoryId: foundCategory._id }); // Use categoryId for filtering
            } else {
                return res.status(404).json({ message: 'Category not found' });
            }
        }

        // If no filter conditions are provided, return all activities
        if (filterConditions.length === 0) {
            const activities = await Activity.find(); // Get all activities
            return res.status(200).json(activities);
        }

        // Use the $or operator to combine the filter conditions
        const activities = await Activity.find({ $or: filterConditions });

        // Return the filtered activities
        res.status(200).json(activities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
 
  

module.exports = {createActivity, getActivities,filterActivities,filterActivitiesyassin,searchactivity, getActivityById}