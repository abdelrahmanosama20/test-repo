const { default: mongoose } = require('mongoose')
const Tourist = require('../models/touristModel');
const Itinerary = require('../models/itineraryModel'); // Import your Itinerary model
const TourGuide = require('../models/tourGuideModel')
const Activity = require ('../models/activityModel')
const Product = require ('../models/productModel')
const bookTransportation = async (req, res) => {
  try {
    const { id } = req.params; // Get the tourist ID from the request parameters
    const { transportationId } = req.body; // Get the transportation ID from the request body

    // Find the tourist by ID
    const tourist = await Tourist.findById(id);

    // Check if the tourist was found
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Add the transportation ID to the bookedTransportations array
    tourist.bookedTransportations.push(transportationId);
    
    // Save the updated tourist record back to the database
    await tourist.save();

    // Send a success response
    res.status(200).json({
      message: 'Transportation booked successfully',
      tourist: {
        id: tourist._id,
        bookedTransportations: tourist.bookedTransportations // Optionally return the updated array
      }
    });
  } catch (error) {
    console.error('Error booking transportation:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const addFlightOfferToTourist = async (req, res) => {
  const { userId, offerId } = req.params; // Assuming userId and offerId are passed as URL parameters

  try {
    // Find the tourist by userId
    const tourist = await Tourist.findById(userId);

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Add the offerId to the bookedFlightOffers array
    tourist.bookedFlightOffers.push(offerId);

    // Save the updated tourist document
    await tourist.save();

    return res.status(200).json({ message: 'Flight offer added successfully', bookedFlightOffers: tourist.bookedFlightOffers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const addHotelOfferToTourist = async (req, res) => {
  const { userId, offerId } = req.params; // Assuming userId and offerId are passed as URL parameters

  try {
    // Find the tourist by userId
    const tourist = await Tourist.findById(userId);

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Add the offerId to the bookedFlightOffers array
    tourist.bookedHotelOffers.push(offerId);

    // Save the updated tourist document
    await tourist.save();

    return res.status(200).json({ message: 'Hotel offer added successfully', bookedHotelOffers: tourist.bookedHotelOffers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// get all workout
const createTourist = async (req, res) => {
    try {
      // Destructure the request body to get user details
      const { name, email, password, mobile, nationality, dob, job} = req.body;
  
      // Create a new user instance with the role of tourist
      const newUser = new Tourist({
        name,
        email,
        password,
        mobile,
        nationality,
        dob,
        job 
        // No need to set bookedItineraries, createdItineraries, or wallet; they will default to appropriate values
      });
  
      // Save the user to the database
      await newUser.save();
  
      // Send success response
      res.status(200).json({
        message: 'Tourist created successfully',
        tourist: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
          nationality: newUser.nationality,
          dob: newUser.dob,
          job: newUser.job,
        }
      });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(400).json({
        message: 'Error creating tourist',
        error: error.message
      });
    }
};

const getTourist = async (req, res) => {
    try {
        const users = await Tourist.find(); // Fetch all users from the database
        res.status(200).json({
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving users',
            error: error.message
        });
    }
};

// get a single workout
const getTouristByEmail = async (req, res) => {
  try {
      // Extract email from the request body
      const { email } = req.body; // Assuming the email is sent in the request body

      // Query the database for the tourist with the given email
      const tourist = await Tourist.findOne({ email: email });

      // Check if the tourist was found
      if (!tourist) {
          return res.status(404).json({
              message: 'Tourist not found'
          });
      }

      // Return the tourist data in JSON format
      res.status(200).json({
          message: 'Tourist retrieved successfully',
          data: tourist
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          message: 'Error retrieving tourist',
          error: error.message
      });
  }
};



// create a workout
const createWorkout = async (req, res) => {


}

// Delete tourist by ID
const deleteTourist = async (req, res) => {
  try {
      const { id } = req.params; // Get the tourist ID from the request parameters

      // Find the tourist and delete them
      const deletedTourist = await Tourist.findByIdAndDelete(id);

      // Check if the tourist was found and deleted
      if (!deletedTourist) {
          return res.status(404).json({ message: 'Tourist not found' });
      }

      res.status(200).json({ message: 'Tourist deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting tourist', error: error.message });
  }
};
const updateRecords = async (req, res) => {
  try {
    const { email, updatedData } = req.body; // Extract email and updated data from the request body

    // Find the tourist by email
    const tourist = await Tourist.findOne({ email: email });

    if (!tourist) {
      // If no tourist is found with the provided email, send an error response
      return res.status(404).json({ error: 'Tourist not found' });
    }

    // Update the tourist's fields with the values from updatedData
    tourist.name = updatedData.name || tourist.name;
    tourist.mobile = updatedData.mobile || tourist.mobile;
    tourist.nationality = updatedData.nationality || tourist.nationality;
    tourist.job = updatedData.job || tourist.job;
    tourist.wallet = updatedData.wallet || tourist.wallet;
    tourist.email=updatedData.email||tourist.email;
    tourist.password=updatedData.password||tourist.password;
    tourist.delete=updatedData.delete||tourist.delete;
    // Any other fields you want to update
    // We are not updating `email` or `password` for security reasons unless explicitly needed

    // Save the updated tourist record back to the database
    const updatedTourist = await tourist.save();

    // Send a success response with the updated tourist data
    res.status(200).json({
      message: 'Tourist updated successfully',
      data: updatedTourist
    });
  } catch (error) {
    console.error('Error updating tourist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// comments methods 
// first we want to fetch all the tourguides a tourist completed a tour with , tour being an actual itnerary 
// to know if a tourist completed the tour or not we will assume that any booked itenaray with the date past , then it must have been attended 
// so what we need here is a method that extracts the email from the request body , seraches the database for that specific instance of the tourist 
// get all booked itneraries where their dates has passed , for each of these itneraries we want to extract their equivalent tour guide responsible for it 

const getPastItinerariesWithTourGuides = async (req, res) => {
  try {
      const { email } = req.body; // Extract email from the request body

      // Find the tourist by email
      const tourist = await Tourist.findOne({ email: email });
      
      if (!tourist) {
          return res.status(404).json({ message: 'Tourist not found' });
      }

      // Get the current date
      const currentDate = new Date();

      // Fetch itineraries based on the IDs in the bookedItineraries array
      const pastItineraries = await Itinerary.find({
          _id: { $in: tourist.bookedItineraries }, // Match itinerary IDs in the bookedItineraries array
          availableDates: { $exists: true, $ne: [] } // Ensure availableDates field exists and is not empty
      });

      // Filter past itineraries based on the last available date
      const filteredPastItineraries = pastItineraries.filter(itinerary => {
        const lastAvailableDate = new Date(Math.max(...itinerary.availableDates.map(date => new Date(date).getTime())));
        return lastAvailableDate < currentDate; // Check if it's in the past
    });

      // Extract tour guide emails from the filtered itineraries
      const tourGuideEmails = await Promise.all(filteredPastItineraries.map(async (itinerary) => {
          const tourGuide = await TourGuide.findById(itinerary.tourGuideId); // Get the tour guide by ID
          return {
            email: tourGuide ? tourGuide.email : null, // Return the email or null if not found
            rating: tourGuide ? tourGuide.rating : null ,// Return the rating or null if not found
            id : tourGuide ? tourGuide._id : null

        };
    }));

      // Filter out any null values in case a tour guide was not found
      const uniqueTourGuideEmails = [...new Set(tourGuideEmails.filter(email => email))];

      // Send the response with the tour guide emails
      res.status(200).json({
          message: 'Past tour guide emails retrieved successfully',
          data: uniqueTourGuideEmails // Send only the unique tour guide emails
      });
  } catch (error) {
      console.error('Error retrieving past itineraries:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


const getPastItinerariesWithTourGuidesForCommentOnItenrary = async (req, res) => {
  // used for if we want to fetch a past itenrary so that we can either comment or rate it  
  // takes an email , of the tourist , returns an array where each element is the folowing info about an itnerary
  // title , tour guide name , rating 
  try {
    const { email } = req.body; // Extract email from the request body

    // Find the tourist by email
    const tourist = await Tourist.findOne({ email: email });
    
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Get the current date
    const currentDate = new Date();

    // Fetch itineraries based on the IDs in the bookedItineraries array
    const pastItineraries = await Itinerary.find({
      _id: { $in: tourist.bookedItineraries }, // Match itinerary IDs in the bookedItineraries array
      availableDates: { $exists: true, $ne: [] } // Ensure availableDates field exists and is not empty
    });

    console.log("Past itineraries:", pastItineraries);

    // Filter past itineraries based on the last available date
    const filteredPastItineraries = pastItineraries.filter(itinerary => {
      const lastAvailableDateTimestamp = Math.max(...itinerary.availableDates.map(date => new Date(date).getTime()));
      const lastAvailableDate = new Date(lastAvailableDateTimestamp);
      
      console.log("Last available date:", lastAvailableDate);
      console.log("Current date:", currentDate);

      return lastAvailableDate < currentDate;
    });

    // Fetch itinerary details and handle missing tour guides
    const itineraryDetails = await Promise.all(
      filteredPastItineraries.map(async (itinerary) => {
        const tourGuide = await TourGuide.findById(itinerary.tourGuideId);
        console.log("Tour guide found:", tourGuide ? tourGuide.name : null);

        return {
          itineraryTitle: itinerary.title,
          tourGuideName: tourGuide ? tourGuide.name : null ,// Return null if tour guide not found
          ratings: itinerary.ratings ,
          id : itinerary.id
        };
      })
    );

    // Send the response including itineraries with `null` tour guide names if necessary
    res.status(200).json({
      message: 'Past itineraries retrieved successfully',
      data: itineraryDetails
    });
  } catch (error) {
    console.error('Error retrieving past itineraries:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


const addItineraryToTourist = async (req, res) => {
  try {
    const { email, itineraryId } = req.body; // Extract email and itineraryId from the request body

    // Find the tourist by email
    const tourist = await Tourist.findOne({ email: email });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Check if the itinerary already exists in the tourist's booked itineraries
    if (tourist.bookedItineraries.includes(itineraryId)) {
      return res.status(400).json({ message: 'Itinerary is already booked by this tourist' });
    }

    // Add the itinerary ID to the booked itineraries
    tourist.bookedActivities.push(itineraryId);
    
    // Save the updated tourist document
    await tourist.save();

    // Send a success response
    res.status(200).json({ message: 'Itinerary added to tourist successfully', data: tourist.bookedItineraries });
  } catch (error) {
    console.error('Error adding itinerary to tourist:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
const getPastBookedActivities = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the tourist by email and populate bookedActivities with activity details
    const tourist = await Tourist.findOne({ email }).populate('bookedActivities');

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Helper to zero out time for date-only comparison
    const toDateOnly = date => new Date(date.setHours(0, 0, 0, 0));

    // Get today's date without the time component
    const today = toDateOnly(new Date());

    // Filter activities based on date only, ignoring time
    const pastActivities = tourist.bookedActivities
      .filter(activity => toDateOnly(new Date(activity.date)) < today)
      .map(activity => ({
        name: activity.name,
        ratings: activity.ratings,
        id : activity._id
      }));

    res.status(200).json({
      message: 'Past activities retrieved successfully',
      pastActivities
    });
  } catch (error) {
    console.error('Error fetching past activities:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


const rateTourGuide = async (req, res) => {
  try {
    const {email, rating } = req.body; // Extract IDs and rating from the request body

    // Find the tourist and tour guide by their IDs
    const tourGuide = await TourGuide.findOne({ email });

    if (!tourGuide) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }

    // Ensure rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Update the tour guide's rating
    tourGuide.rating = ((tourGuide.rating * tourGuide.numberOfRatings) + rating) / (tourGuide.numberOfRatings + 1);
    tourGuide.numberOfRatings += 1;
    
    await tourGuide.save();

    res.status(200).json({
      message: 'Tour guide rated successfully',
      tourGuideRating: tourGuide.rating
    });
  } catch (error) {
    console.error('Error rating tour guide:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const rateActivity = async (req, res) => {
  try {
    const { activityname, rating } = req.body; // Extract IDs and rating from the request body

    // Find the tourist and itinerary by their IDs
    const activity = await Activity.findOne({ name: activityname });
    if (!activity) {
      return res.status(404).json({ message: 'activity not found' });
    }

    // Ensure rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Update the itinerary's rating
    activity.ratings = ((activity.ratings * activity.numberOfRatings) + rating) / (activity.numberOfRatings + 1);
    activity.numberOfRatings += 1;
    
    await activity.save();

    res.status(200).json({
      message: 'Itinerary rated successfully',
      activity: activity.ratings
    });
  } catch (error) {
    console.error('Error rating itinerary:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};






const rateItinerary = async (req, res) => {
  try {
    const { itineraryId, rating } = req.body; // Extract IDs and rating from the request body

    // Find the tourist and itinerary by their IDs
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    // Ensure rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Update the itinerary's rating
    itinerary.ratings = ((itinerary.ratings * itinerary.numberOfRatings) + rating) / (itinerary.numberOfRatings + 1);
    itinerary.numberOfRatings += 1;
    
    await itinerary.save();

    res.status(200).json({
      message: 'Itinerary rated successfully',
      itineraryRating: itinerary.ratings
    });
  } catch (error) {
    console.error('Error rating itinerary:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const purchaseProductbck = async (req, res) => {
  try {
      const { email, productId } = req.body;

      // Find the tourist by email
      const tourist = await Tourist.findOne({ email: email });

      if (!tourist) {
          return res.status(404).json({ message: 'Tourist not found' });
      }

      // Find the product by ID
      const product = await Product.findById(productId);

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      // Check if the product is in stock
      if (product.stock <= 0) {
          return res.status(400).json({ message: 'Product is out of stock' });
      }

      // Check if the tourist has enough money in their wallet
      if (tourist.wallet < product.price) {
          return res.status(400).json({ message: 'Insufficient funds in wallet' });
      }

      // Deduct the product price from the tourist's wallet
      tourist.wallet -= product.price;

      // Add the product ID to the tourist's purchasedProducts array (if not already purchased)
      if (!tourist.purchasedProducts.includes(productId)) {
          tourist.purchasedProducts.push(productId);
      }
      
      // Decrement the product stock by 1 (ensure it doesn't go below 0)
      product.stock = Math.max(0, product.stock - 1);

      // Save the updated tourist and product documents
      await tourist.save();
      await product.save();

      res.status(200).json({ message: 'Product purchased successfully' ,data: tourist.purchasedProducts});
  } catch (error) {
      console.error('Error purchasing product:', error.stack);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getPurchasedProducts = async (req, res) => {
  try {
      const { email } = req.query; // Extract the tourist email

      // Find the tourist by email
      const tourist = await Tourist.findOne({ email: email });

      if (!tourist) {
          return res.status(404).json({ message: 'Tourist not found' });
      }

      // Fetch the products that the tourist has purchased
      
      const purchasedProducts = await Product.find({
          _id: { $in: tourist.purchasedProducts } // Match product IDs in the purchasedProducts array
      });
      console.log(purchasedProducts);

      res.status(200).json({
          message: 'Purchased products retrieved successfully',
          data: purchasedProducts
      });
  } catch (error) {
      console.error('Error fetching purchased products:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const rateProduct = async (req, res) => {
  try {
    const { productId, rating } = req.body; // Get product ID and rating from the request body

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5' });
    }

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate new rating and update the product's numberOfRatings
    const newRating = (product.rating * product.numberOfRatings + rating) / (product.numberOfRatings + 1);

    // Update product's ratings and numberOfRatings
    product.rating = newRating;
    product.numberOfRatings += 1;

    // Save the updated product
    await product.save();

    res.status(200).json({
      message: 'Product rated successfully',
      data: {
        rating: product.rating,
        numberOfRatings: product.numberOfRatings
      }
    });
  } catch (error) {
    console.error('Error rating product:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const makePayment = async (req, res) => {
  try {
      const { id } = req.params; // Tourist ID from the URL
      const { amountPaid } = req.body; // Amount paid from the request body
      if (isNaN(amountPaid)) {
        console.error('Invalid amountPaid:', amountPaid);
        //throw new Error('Invalid amountPaid value.');
      }
      else {
        console.error("amount paid tele3 rakm")
      }
      // Update loyalty points and level based on payment
      const updatedTourist = await updateLoyaltyPoints(id, amountPaid);

      res.status(200).json({
          message: 'Payment successful, loyalty points updated',
          updatedTourist
      });
  } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
// Update loyalty points and level
const updateLoyaltyPoints = async (touristId, amountPaid) => {
  try {
      const tourist = await Tourist.findById(touristId);
      if (!tourist) throw new Error("Tourist not found");

      // Check tourist level validity
      if (![1, 2, 3].includes(tourist.level)) {
          console.error('Invalid tourist level:', tourist.level);
          tourist.level = 1; // default to level 1
      }

      let pointsToAdd;
      if (tourist.level === 1) pointsToAdd = amountPaid * 0.5;
      else if (tourist.level === 2) pointsToAdd = amountPaid * 1;
      else if (tourist.level === 3) pointsToAdd = amountPaid * 1.5;

      console.log('Points to add:', pointsToAdd);
      if (isNaN(pointsToAdd)) {
          console.error('Calculated points are NaN:', pointsToAdd);
          pointsToAdd = 6; // Default to 0 to avoid NaN errors
      }

      // Ensure loyaltyPoints is a valid number
      tourist.loyaltyPoints = isNaN(tourist.loyaltyPoints) ? 0 : tourist.loyaltyPoints;
      tourist.loyaltyPoints += pointsToAdd;

      // Determine the new level based on loyalty points
      if (tourist.loyaltyPoints > 500000) {
          tourist.level = 3;
          tourist.badge = "Gold";
      } else if (tourist.loyaltyPoints > 100000) {
          tourist.level = 2;
          tourist.badge = "Silver";
      } else {
          tourist.level = 1;
          tourist.badge = "Bronze";
      }

      await tourist.save();
      return tourist;
  } catch (error) {
      console.error('Error updating loyalty points:', error);
      throw error;
  }
};

const redeemPoints = async (req, res) => {
  try {
    const { id } = req.params; // Tourist ID from the URL
    const { pointsToRedeem } = req.body; // Points to redeem sent in the request body

    const tourist = await Tourist.findById(id);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Check if tourist has enough points
    if (tourist.loyaltyPoints < pointsToRedeem) {
      return res.status(400).json({ message: 'Not enough points to redeem' });
    }

    // Calculate the cash value of the points (10,000 points = 100 EGP)
    const exchangeRate = 10000; // 10,000 points = 100 EGP
    const cashAmount = (pointsToRedeem / exchangeRate) * 100;

    // Update the tourist's wallet and loyalty points
    tourist.wallet += cashAmount; // Add the equivalent cash to the wallet
    tourist.loyaltyPoints -= pointsToRedeem; // Subtract the redeemed points

    // Save the updated tourist data
    await tourist.save();

    // Return the updated tourist data
    res.status(200).json({
      message: 'Points redeemed successfully!',
      tourist,
    });
  } catch (error) {
    console.error('Error redeeming points:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const makePayment2 = async (req, res) => {
  try {
      const { id } = req.params; // Tourist ID from the URL
      const { amountPaid } = req.body; // Amount paid from the request body
      if (isNaN(amountPaid)) {
        console.error('Invalid amountPaid:', amountPaid);
        //throw new Error('Invalid amountPaid value.');
      }
      else {
      }
      // Update loyalty points and level based on payment
      console.log("ablawait loyalty2")
      const updatedTourist = await updateLoyaltyPoints2(id, amountPaid);
      console.log("b3dawait loyalty2")
      res.status(200).json({
          message: 'Payment successful, loyalty points updated',
          updatedTourist
      });
  } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
// Update loyalty points and level
const updateLoyaltyPoints2 = async (touristId, amountPaid) => {
  try {
    console.log("d5lna makepayment22")
      const tourist = await Tourist.findById(touristId);
      if (!tourist) throw new Error("Tourist not found");

      if(tourist.wallet < amountPaid)
        throw new Error("not enough money in wallet");

      tourist.wallet -= amountPaid;
      
      // Check tourist level validity
      if (![1, 2, 3].includes(tourist.level)) {
          console.error('Invalid tourist level:', tourist.level);
          tourist.level = 1; // default to level 1
      }

      let pointsToAdd;
      if (tourist.level === 1) pointsToAdd = amountPaid * 0.5;
      else if (tourist.level === 2) pointsToAdd = amountPaid * 1;
      else if (tourist.level === 3) pointsToAdd = amountPaid * 1.5;

      console.log('Points to add:', pointsToAdd);
      if (isNaN(pointsToAdd)) {
          console.error('Calculated points are NaN:', pointsToAdd);
          pointsToAdd = 6; // Default to 0 to avoid NaN errors
      }

      // Ensure loyaltyPoints is a valid number
      tourist.loyaltyPoints = isNaN(tourist.loyaltyPoints) ? 0 : tourist.loyaltyPoints;
      tourist.loyaltyPoints += pointsToAdd;

      // Determine the new level based on loyalty points
      if (tourist.loyaltyPoints > 500000) {
          tourist.level = 3;
          tourist.badge = "Gold";
      } else if (tourist.loyaltyPoints > 100000) {
          tourist.level = 2;
          tourist.badge = "Silver";
      } else {
          tourist.level = 1;
          tourist.badge = "Bronze";
      }

      await tourist.save();
      return tourist;
  } catch (error) {
      console.error('Error updating loyalty points:', error);
      throw error;
  }
};

// Add a new delivery address
const addDeliveryAddress = async (req, res) => {
  try {
    console.log('Add Delivery Address function invoked');
    
    const touristId = req.params.touristId;  // Extract touristId from the request params
    const { addresses } = req.body;  // Extract the addresses from the request body

    // Validate addresses: it should be a string or an array of strings
    if (!addresses || (Array.isArray(addresses) && addresses.length === 0) || typeof addresses !== 'string' && !Array.isArray(addresses)) {
      return res.status(400).json({ error: 'Addresses are required and must be a string or an array of strings' });
    }

    // If the addresses is a single string, convert it to an array
    const addressesArray = Array.isArray(addresses) ? addresses : [addresses];

    console.log('Adding these addresses:', addressesArray);  // Log to check the addresses

    // Find the tourist by their ID
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    // Initialize deliveryAdresses if it doesn't exist
    if (!tourist.deliveryAdresses) {
      tourist.deliveryAdresses = [];
    }

    // Add the new addresses to the tourist's deliveryAdresses list
    tourist.deliveryAdresses.push(...addressesArray);
    console.log('Updated deliveryAdresses:', tourist.deliveryAdresses);  // Log the updated addresses

    // Log tourist object before saving
    console.log('Tourist object before saving:', tourist);

    // Save the updated tourist document
    await tourist.save();

    // Log tourist object after saving to check if changes are persisted
    const updatedTourist = await Tourist.findById(touristId);
    console.log('Tourist object after saving:', updatedTourist);

    res.status(200).json({ message: 'Addresses added successfully', tourist: updatedTourist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding the addresses', details: error.message });
  }
};
const getDeliveryAddresses = async (req, res) => {
  try {
    const touristId = req.params.touristId;  // Extract touristId from the request params

    // Find the tourist by their ID
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    // Ensure you are accessing the correct field name, which is 'deliveryAdresses'
    const deliveryAddresses = Array.isArray(tourist.deliveryAdresses) ? tourist.deliveryAdresses : [];

    // Respond with the list of delivery addresses
    res.status(200).json({
      message: 'Success',
      addresses: deliveryAddresses  // This will send the addresses back correctly
    });
  } catch (error) {
    console.error('Error fetching delivery addresses:', error);
    res.status(500).json({
      error: 'An error occurred while fetching delivery addresses',
      details: error.message
    });
  }
};

const selectDeliveryAddress = async (req, res) => {
  try {
    const { touristId } = req.params;
    const { selectedAddress } = req.body;

    if (!selectedAddress) {
      return res.status(400).json({ error: "Selected address is required" });
    }

    // Fetch the tourist by ID
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Ensure deliveryAdresses exists and is an array
    if (!Array.isArray(tourist.deliveryAdresses)) {
      return res.status(400).json({ error: "No delivery addresses available for this tourist" });
    }

    // Check if the selectedAddress exists in deliveryAdresses
    if (!tourist.deliveryAdresses.includes(selectedAddress)) {
      return res.status(400).json({ error: "Selected address does not exist in the available addresses" });
    }

    // Set the selected address
    tourist.selectedDeliveryAddress = selectedAddress;

    // Save the updated tourist document
    await tourist.save();

    res.status(200).json({
      message: "Delivery address selected successfully",
      selectedAddress: tourist.selectedDeliveryAddress,
    });
  } catch (error) {
    console.error("Error selecting delivery address:", error);
    res.status(500).json({
      error: "An error occurred while selecting the delivery address",
      details: error.message,
    });
  }
};

module.exports = {createTourist, getTourist,getTouristByEmail, updateRecords ,deleteTourist, bookTransportation, addFlightOfferToTourist, addHotelOfferToTourist,getPastItinerariesWithTourGuides,
  getPastItinerariesWithTourGuidesForCommentOnItenrary,addItineraryToTourist,getPastBookedActivities, rateTourGuide, rateItinerary, purchaseProductbck, getPurchasedProducts, rateProduct,updateLoyaltyPoints,redeemPoints,makePayment,rateActivity,makePayment2,updateLoyaltyPoints2, addDeliveryAddress, getDeliveryAddresses, selectDeliveryAddress}