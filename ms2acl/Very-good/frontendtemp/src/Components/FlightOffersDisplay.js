import React from 'react';
import './ActivityList'; // Ensure you import the same CSS file

const FlightOffersDisplay = ({ flightOffers, onBookFlight }) => {
  return (
    <div>
      <h2 className="activity-title" style={{ color: '#003366' }}>Flight Offers</h2>
      {flightOffers.length === 0 ? (
        <p>No flight offers available.</p>
      ) : (
        flightOffers.map((offer) => {
          const { id, price, itineraries, travelerPricings } = offer;

          return (
            <div className="activity-card" key={id}>
              <h3 className="activity-title">Flight Offer ID: {id}</h3>
              <p className="activity-price">Price: {price.total} {price.currency}</p>

              {itineraries.map((itinerary, index) => (
                <div key={index}>
                  <h4 className="activity-title">Itinerary {index + 1}</h4>
                  <p className="activity-duration">Duration: {itinerary.duration}</p>
                  {itinerary.segments.map((segment, segmentIndex) => {
                    const { departure, arrival, carrierCode, number, amenities } = segment;

                    return (
                      <div key={segmentIndex} style={{ margin: '10px 0' }}>
                        <h5 className="activity-title">Flight Segment</h5>
                        <p>
                          Flight Number: {carrierCode} {number}<br />
                          Departure: {departure.iataCode} at {new Date(departure.at).toLocaleString()}<br />
                          Arrival: {arrival.iataCode} at {new Date(arrival.at).toLocaleString()}<br />
                        </p>
                        {amenities && amenities.length > 0 ? (
                          <div>
                            <h5>Amenities:</h5>
                            <ul className="tags-container">
                              {amenities.map((amenity, amenityIndex) => (
                                <li key={amenityIndex} className="activity-tag">
                                  {amenity.description} - {amenity.isChargeable ? 'Chargeable' : 'Included'}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p>No amenities available for this segment.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {travelerPricings.map((traveler, travelerIndex) => (
                <div key={travelerIndex}>
                  <h4 className="activity-title">Traveler Type: {traveler.travelerType}</h4>
                  <p className="activity-price">Total Price: {traveler.price.total} {traveler.price.currency}</p>
                </div>
              ))}

              {/* Add the "Book this flight" button here */}
              <button 
                className="book-flight-button" 
                onClick={() => onBookFlight(offer)}
                style={{ 
                  backgroundColor: '#003366', 
                  color: '#fff', 
                  padding: '10px 20px', 
                  marginTop: '10px', 
                  cursor: 'pointer', 
                  border: 'none', 
                  borderRadius: '5px' 
                }}
              >
                Book this flight
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default FlightOffersDisplay;
