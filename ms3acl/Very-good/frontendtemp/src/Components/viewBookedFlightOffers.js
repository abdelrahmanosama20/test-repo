import React, { useEffect, useState } from 'react';
import './ActivityList';
import { useLocation } from 'react-router-dom';
import { fetchFlightWithId, getFlightInfoById } from '../Services/BookingFlightServices';
import TicketViewForTourist from './TicketViewForTourist';

const ViewBookedFlightOffers = () => {
    const location = useLocation();
    const { bookedFlightsIds = [] } = location.state || {};
    const [bookedFlights, setBookedFlights] = useState([]);
    const [activityError, setActivityError] = useState(null);

    useEffect(() => {
        const getBookedFlights = async () => {
            if (bookedFlightsIds.length > 0) {
                try {
                    console.log("Booked Flight IDs:", bookedFlightsIds);

                    // Fetch flights for each ID and then fetch corresponding flight info
                    const flightPromises = bookedFlightsIds.map(async (id) => {
                        const bookedFlight = await fetchFlightWithId(id);
                        const flightInfo = await getFlightInfoById(id); // Fetch corresponding flight info
                        return { bookedFlight, flightInfo }; // Return as separate properties
                    });

                    const fetchedFlights = await Promise.all(flightPromises);
                    console.log("Fetched flights with info:", fetchedFlights);
                    setBookedFlights(fetchedFlights);
                } catch (error) {
                    console.error("Error fetching booked flights and info:", error);
                    setActivityError('Error fetching booked flights');
                }
            }
        };

        getBookedFlights();
    }, [bookedFlightsIds]);

    return (
        <div>
            {activityError && <p>{activityError}</p>}
            {bookedFlights.length > 0 ? (
                <>
                    {console.log("Booked flights with info:", bookedFlights)}
                    {bookedFlights.map((bookedFlight, index) => (
                        
                        <TicketViewForTourist
                            key={index}
                            offer={bookedFlight} // Pass bookedFlight as offer
                        />
                    ))}
                </>
            ) : (
                <p>No booked flights available.</p>
            )}
        </div>
    );
};

export default ViewBookedFlightOffers;
