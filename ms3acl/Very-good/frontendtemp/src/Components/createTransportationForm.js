import React, { useState } from 'react';
import { createTransportation } from '../Services/bookingTransportationServices';

const CreateTransportationForm = ({ advertiserId, onClose }) => {
  const [formData, setFormData] = useState({
    type: '',
    provider: '',
    departureLocation: '',
    arrivalLocation: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    isAvailable: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = { ...formData, advertiserId : advertiserId };

    try {
      const result = await createTransportation(dataToSend);
      console.log('Transportation created successfully:', result);

      onClose && onClose();
    } catch (error) {
      console.error('Failed to create transportation:', error);
    }
  };

  return (
    <form className="create-transportation-form" onSubmit={handleSubmit}>
      <h2>Create Transportation</h2>

      <label>
        Type:
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="Bus">Bus</option>
          <option value="Train">Train</option>
          <option value="Taxi">Taxi</option>
          <option value="Rental Car">Rental Car</option>
          <option value="Flight">Flight</option>
        </select>
      </label>

      <label>
        Provider:
        <input
          type="text"
          name="provider"
          value={formData.provider}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Departure Location:
        <input
          type="text"
          name="departureLocation"
          value={formData.departureLocation}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Arrival Location:
        <input
          type="text"
          name="arrivalLocation"
          value={formData.arrivalLocation}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Departure Time:
        <input
          type="datetime-local"
          name="departureTime"
          value={formData.departureTime}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Arrival Time:
        <input
          type="datetime-local"
          name="arrivalTime"
          value={formData.arrivalTime}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Price:
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
        />
      </label>

      <label>
        Available for Booking:
        <input
          type="checkbox"
          name="isAvailable"
          checked={formData.isAvailable}
          onChange={handleChange}
        />
      </label>

      <button type="submit">Create Transportation</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default CreateTransportationForm;
