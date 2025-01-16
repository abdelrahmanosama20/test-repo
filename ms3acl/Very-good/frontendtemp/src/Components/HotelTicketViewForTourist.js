import React from 'react';
import { useLocation } from 'react-router-dom';
import './Ticket.css'; // Ensure you import the CSS file

const HotelTicketViewForTourist = (offer) => {
  console.log("offer inside  : ", offer)
  const formData = offer.offer.hotelInfo.data
  const hotel = offer.offer.bookedHotels.data.data
  //console.log('offer inside the component :', formData)
  //console.log('formData inside the component :', formData)
  // Accessing the itinerary details
  const hotelName = hotel.name;
  const hotelCountry = hotel.address ? hotel.address.countryCode : 'N/A';
  const hotelDistance = hotel.distance ? `${hotel.distance.value} ${hotel.distance.unit}` : 'N/A';
  const geoCode = hotel.geoCode || {};

  // Booking details from formData
  const { name, email, dateOfBirth, nationality, phoneNumber, roomType, extraBed } = formData;

  return (
    <div className="ticket-container">
      <div className="ticket-header">
        <h2 className="ticket-title">Booking Confirmed!</h2>
      </div>
      <h3 className="ticket-subtitle">Your Hotel Booking:</h3>
      
      {/* Personal Information */}
      <p className="ticket-info"><strong>Name:</strong> {name}</p>
      <p className="ticket-info"><strong>Email:</strong> {email}</p>
      <p className="ticket-info"><strong>Date of Birth:</strong> {new Date(dateOfBirth).toLocaleDateString()}</p>
      <p className="ticket-info"><strong>Nationality:</strong> {nationality}</p>
      <p className="ticket-info"><strong>Phone Number:</strong> {phoneNumber}</p>
      
      {/* Hotel Information */}
      <div className="ticket-segment">
        <p className="ticket-info"><strong>Hotel Name:</strong> {hotelName}</p>
        <p className="ticket-info"><strong>Country Code:</strong> {hotelCountry}</p>
        <p className="ticket-info"><strong>Hotel ID:</strong> {hotel.hotelId}</p>
        <p className="ticket-info"><strong>Location (IATA):</strong> {hotel.iataCode}</p>
        
        <p className="ticket-info"><strong>Distance from city center:</strong> {hotelDistance}</p>
        <p className="ticket-info"><strong>Latitude:</strong> {geoCode.latitude || 'N/A'}</p>
        <p className="ticket-info"><strong>Longitude:</strong> {geoCode.longitude || 'N/A'}</p>
      </div>

      {/* Room Details */}
      <p className="ticket-info"><strong>Room Type:</strong> {roomType}</p>
      <p className="ticket-info"><strong>Extra Bed:</strong> {extraBed ? 'Yes' : 'No'}</p>

      {/* Footer with confirmation message */}
      <div className="ticket-footer">
        <p>Thank you for booking with us!</p>
      </div>
    </div>
  );
};

export default HotelTicketViewForTourist;
