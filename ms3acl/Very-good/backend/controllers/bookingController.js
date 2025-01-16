const Booking = require('../models/bookingModel'); // Adjust if the path is different
const Activity = require('../models/activityModel'); // Import the Activity model
const Itinerary = require('../models/itineraryModel'); // Import the Itinerary model
const Tourist = require('../models/touristModel'); // Import the Tourist model

const createBooking = async (req, res) => {
    const { touristId, activityId, itineraryId, numberOfParticipants, startDateTime: reqStartDateTime } = req.body;
    console.log("Received startDateTime:", reqStartDateTime);
    console.log("Tourist ID:", touristId);

    try {
        // Check if tourist exists
        const tourist = await Tourist.findById(touristId);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        let booking = null;
        let startDateTime = null;

        if (activityId) {
            const activity = await Activity.findById(activityId);
            if (!activity ) {
                return res.status(400).json({ message: 'Activity not available for booking' });
            }
            startDateTime = activity.date;
            booking = new Booking({ touristId, activityId, numberOfParticipants, startDateTime });
            await Tourist.findByIdAndUpdate(touristId, { $addToSet: { bookedActivities: activityId } });
        } else if (itineraryId) {
            const itinerary = await Itinerary.findById(itineraryId);
            if (!itinerary || !itinerary.isActive) {
                return res.status(400).json({ message: 'Itinerary not available for booking' });
            }
            console.log("itenraries",itinerary)

           startDateTime = new Date(reqStartDateTime);
            console.log("Parsed startDateTime:", startDateTime);

           /* if (isNaN(startDateTime.getTime())) {
                return res.status(400).json({ message: 'Invalid startDateTime format.' });
            }

            const dateOnly = startDateTime.toISOString().split('T')[0];
            const timeOnly = startDateTime.toISOString().split('T')[1].substr(0, 5);

            const isDateAvailable = itinerary.availableDates.some(date => date.toISOString().split('T')[0] === dateOnly);
            const isTimeAvailable = itinerary.availableTimes.includes(timeOnly);

            if (!isDateAvailable || !isTimeAvailable) {
                return res.status(400).json({ message: 'Selected date and time are not available.' });
            }*/
            booking = new Booking({
                touristId,
                itineraryId,
                numberOfParticipants,
                startDateTime,
            });
            await Tourist.findByIdAndUpdate(touristId, { $addToSet: { bookedItineraries: itineraryId } });
        } else {
            return res.status(400).json({ message: 'Must provide either activityId or itineraryId' });
        }

        await booking.save();
        res.status(201).json({ message: 'Booking successful', booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



// Function to get all bookings
const getBookings = async (req, res) => {
    try {
        const { touristId } = req.params; // Extract the touristId from the request params
        const bookings = await Booking.find({ touristId }) // Fetch bookings for the given touristId
            .populate('touristId')
            .populate('activityId')
            .populate('itineraryId');
        
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this tourist' });
        }

        res.status(200).json(bookings); // Return the bookings as JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        // Find the booking by ID
        console.log('Booking ID:', bookingId);

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if the booking already has a "Cancelled" status
        if (booking.status === 'Cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        // Check if cancellation is allowed based on the start time
        const now = new Date();
        const startDateTime = new Date(booking.startDateTime);

        const hoursDifference = (startDateTime - now) / (1000 * 60 * 60); // Difference in hours

        if (hoursDifference < 48) {
            return res.status(400).json({ message: 'Cancellation is only allowed 48 hours before the start time' });
        }

        // Update booking status to "Cancelled"
        booking.status = 'Cancelled';
        await booking.save();
        const updateField = booking.activityId ? 'bookedActivities' : 'bookedItineraries';
        await Tourist.findByIdAndUpdate(booking.touristId, {
            $pull: { [updateField]: booking.activityId || booking.itineraryId }
        });

        res.status(200).json({ message: 'Booking successfully cancelled', booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error cancelling booking', error });
    }
};

module.exports = { createBooking, getBookings, cancelBooking };