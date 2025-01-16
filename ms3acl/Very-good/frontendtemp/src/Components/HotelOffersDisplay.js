import React from 'react';
import './ActivityList'; // Ensure you import the same CSS file
import { useNavigate } from 'react-router-dom';

const HotelOffersDisplay = ({ hotels, onBookHotel }) => {
  const navigate = useNavigate(); // Define navigate

  const handleBookHotel = async (hotel) => {
    try {
      const hotelId = await onBookHotel(hotel); // Call the asynchronous booking function
      navigate('/Hotelbooking', { state: { hotel, hotelId } }); // Navigate after booking
    } catch (error) {
      console.error('Error booking hotel:', error); // Handle any errors
    }
  };

  return (
    <div>
      <h2 className="activity-title" style={{ color: '#003366' }}>Hotel Offers</h2>
      {hotels.length === 0 ? (
        <p>No hotel offers available.</p>
      ) : (
        hotels.map((hotel) => {
          const { hotelId, name, chainCode, address, distance, geoCode, lastUpdate } = hotel;

          return (
            <div className="activity-card" key={hotelId}>
              <h3 className="activity-title">{name}</h3>
              <p className="activity-chain">Chain Code: {chainCode}</p>
              <p className="activity-address">Address: {address?.countryCode}</p>
              <p className="activity-distance">Distance: {distance?.value} {distance?.unit}</p>
              <p className="activity-geo">Location: Latitude {geoCode?.latitude}, Longitude {geoCode?.longitude}</p>
              <p className="activity-last-update">Last Updated: {new Date(lastUpdate).toLocaleString()}</p>

              {/* Add the "Book this hotel" button here */}
              <button
                className="book-hotel-button"
                onClick={() => handleBookHotel(hotel)} // Call handleBookHotel with the current hotel
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
                Book this hotel
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default HotelOffersDisplay;
