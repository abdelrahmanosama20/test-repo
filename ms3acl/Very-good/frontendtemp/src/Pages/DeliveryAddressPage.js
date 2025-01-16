import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChooseDeliveryAddress = () => {
  const { touristId } = useParams(); // Get the touristId from the URL
  
  // Log the touristId to verify its value
  console.log('touristId:', touristId); 

  const [deliveryAdresses, setDeliveryAdresses] = useState([]); // Initialize with an empty array
  const [selectedAddress, setSelectedAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!touristId) {
      setError('No touristId in the URL');
      return;
    }

    const fetchDeliveryAdresses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/tourists/${touristId}/get-delivery-addresses`
        );
        if (response.data.addresses) {
          setDeliveryAdresses(response.data.addresses);  // Use 'addresses' instead of 'deliveryAdresses'
        } else {
          setError('No delivery addresses found.');
        }
      } catch (error) {
        setError('Failed to fetch delivery addresses');
        console.error('Error fetching delivery addresses:', error);
      }
    };

    fetchDeliveryAdresses();
  }, [touristId]); // Re-run the effect when touristId changes

  const handleSelectAddress = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/api/tourists/${touristId}/select-delivery-address`,
        { selectedAddress }
      );
      alert(response.data.message);
    } catch (error) {
      console.error('Error selecting delivery address:', error);
    }
  };

  return (
    <div>
      <h2>Select a Delivery Address</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div>
        <label>Choose an address:</label>
        <select onChange={(e) => setSelectedAddress(e.target.value)}>
          <option value="">Select Address</option>
          {deliveryAdresses && deliveryAdresses.length > 0 ? (
            deliveryAdresses.map((address, index) => (
              <option key={index} value={address}>
                {address}
              </option>
            ))
          ) : (
            <option>No addresses available</option>
          )}
        </select>
      </div>

      <button onClick={handleSelectAddress}>Select Address</button>
    </div>
  );
};

export default ChooseDeliveryAddress;
