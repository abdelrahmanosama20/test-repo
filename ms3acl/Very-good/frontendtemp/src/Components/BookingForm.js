import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {createFlightInfo} from '../Services/BookingFlightServices'

const BookingForm = () => {
  const { state } = useLocation(); // Access the offer from the location state
  const { offer, offerId } = state;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    passportNumber: '',
    dateOfBirth: '',
    nationality: '',
    phoneNumber: '',
    checkedBags: 0,
    seatPreference: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = { ...formData, offerId };
    console.log('updatedFormData : ', updatedFormData);
    const flightInfo = createFlightInfo(updatedFormData);
    console.log('created flight info : ', flightInfo);
    navigate('/ticket', { state: { offer, formData } });
  };

  return (
    <div>
      <h2>Book Flight</h2>
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
        <input 
          type="text" 
          placeholder="Passport Number" 
          value={formData.passportNumber} 
          onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })} 
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
        
        <input 
          type="number" 
          placeholder="Checked Bags" 
          value={formData.checkedBags} 
          onChange={(e) => setFormData({ ...formData, checkedBags: e.target.value })} 
          min="0" 
          required 
        />
        <select 
          value={formData.seatPreference} 
          onChange={(e) => setFormData({ ...formData, seatPreference: e.target.value })} 
          required
        >
          <option value="">Select Seat Preference</option>
          <option value="Window">Window</option>
          <option value="Aisle">Aisle</option>
          <option value="Middle">Middle</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BookingForm;
