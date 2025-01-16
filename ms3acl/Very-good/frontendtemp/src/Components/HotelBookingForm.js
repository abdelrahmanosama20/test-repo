import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createHotelInfo } from '../Services/BookingFlightServices';

const HotelBookingForm = () => {
  const { state } = useLocation(); // Access the hotel offer from the location state
  const { hotel, hotelId } = state;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    nationality: '',
    phoneNumber: '',
    roomType: '',
    extraBed: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = { ...formData, offerId:hotelId };
    console.log('updatedFormData : ', updatedFormData);
    const hotelInfo = createHotelInfo(updatedFormData);
    console.log('created hotel info : ', hotelInfo);
    navigate('/hotelConfirmation', { state: { hotel, formData } });
  };

  return (
    <div>
      <h2>Book Hotel</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Full Name" 
          value={formData.name} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          required 
        />
        
        {/* Date of Birth Input with Label */}
        <label htmlFor="dob">Date of Birth (DOB):</label>
        <input 
          type="date" 
          id="dob" 
          value={formData.dateOfBirth} 
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} 
          required 
        />
        
        <input 
          type="text" 
          placeholder="Nationality" 
          value={formData.nationality} 
          onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} 
          required 
        />
        <input 
          type="tel" 
          placeholder="Phone Number" 
          value={formData.phoneNumber} 
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} 
          required 
        />

        <select 
          value={formData.roomType} 
          onChange={(e) => setFormData({ ...formData, roomType: e.target.value })} 
          required
        >
          <option value="">Select Room Type</option>
          <option value="Master Room">Master Room</option>
          <option value="Double">Double</option>
          <option value="Triple">Triple</option>
          <option value="Suite">Suite</option>
        </select>

        <label>
          <input 
            type="checkbox" 
            checked={formData.extraBed} 
            onChange={(e) => setFormData({ ...formData, extraBed: e.target.checked })} 
          />
          Extra Bed
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default HotelBookingForm;
