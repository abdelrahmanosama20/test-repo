import React, { useEffect, useState } from 'react';
import './ActivityList';
import { useLocation } from 'react-router-dom';
import { getHotelById, getHotelInfoByOfferId } from '../Services/BookingFlightServices';
import HotelTicketViewForTourist from './HotelTicketViewForTourist';

const ViewBookedHotelOffers = () => {
    const location = useLocation();
    const { bookedHotelsIds = [] } = location.state || {};
    const [bookedHotels, setBookedHotels] = useState([]);
    const [activityError, setActivityError] = useState(null);

    useEffect(() => {
        const getBookedHotels = async () => {
            if (bookedHotelsIds.length > 0) {
                try {
                    console.log("Booked Hotels IDs:", bookedHotelsIds);

                    // Fetch flights for each ID and then fetch corresponding flight info
                    const hotelPromises = bookedHotelsIds.map(async (id) => {
                        const bookedHotels = await getHotelById(id);
                        const hotelInfo = await getHotelInfoByOfferId(id); // Fetch corresponding flight info
                        return { bookedHotels, hotelInfo }; // Return as separate properties
                    });

                    const fetchedHotels = await Promise.all(hotelPromises);
                    console.log("Fetched flights with info:", fetchedHotels);
                    setBookedHotels(fetchedHotels);
                } catch (error) {
                    console.error("Error fetching booked hotels and info:", error);
                    setActivityError('Error fetching booked hotels');
                }
            }
        };

        getBookedHotels();
    }, [bookedHotelsIds]);

    return (
        <div>
            {activityError && <p>{activityError}</p>}
            {bookedHotels.length > 0 ? (
                <>
                    {console.log("Booked hotels with info:", bookedHotels)}
                    {bookedHotels.map((bookedHotel, index) => (
                        
                        <HotelTicketViewForTourist
                            key={index}
                            offer={bookedHotel} // Pass bookedFlight as offer
                        />
                    ))}
                </>
            ) : (
                <p>No booked hotels available.</p>
            )}
        </div>
    );
};

export default ViewBookedHotelOffers;
