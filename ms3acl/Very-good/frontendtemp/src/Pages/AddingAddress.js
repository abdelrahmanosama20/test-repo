import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { addDeliveryAddress } from '../RequestSendingMethods';

const AddingAddress = () => {
  const { touristId } = useParams();
  
  // State for addresses, success and error
  const [addressCount, setAddressCount] = useState(null);  // Track how many addresses
  const [addresses, setAddresses] = useState([]);  // Array to store addresses
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle when user selects number of addresses
  const handleAddressCount = (count) => {
    setAddressCount(count);
    setAddresses(new Array(count).fill('')); // Create an array of empty strings
  };

  // Handle input change for each address
  const handleAddressChange = (e, index) => {
    const newAddresses = [...addresses];
    newAddresses[index] = e.target.value;
    setAddresses(newAddresses);
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const addressData = {
        addresses: addresses,  // Send the array of addresses
      };
      console.log("address from form :",addressData)
      const response = await addDeliveryAddress(touristId, addressData);

      if (response.message === 'Addresses added successfully') {
        setSuccess('Addresses added successfully!');
        setAddresses(new Array(addressCount).fill('')); // Clear the input fields
      } else {
        setError('Failed to add addresses');
      }
    } catch (error) {
      setError('Failed to add addresses');
      console.error('Error adding addresses:', error);
    }
  };

  return (
    <div>
      <h1>Add Delivery Address</h1>

      {!addressCount && (
        <div>
          <button onClick={() => handleAddressCount(1)}>How many addresses do you want to add?</button>
        </div>
      )}

      {addressCount && (
        <div>
          <h3>Choose number of addresses:</h3>
          {[1, 2, 3, 4, 5].map((count) => (
            <button key={count} onClick={() => handleAddressCount(count)}>
              {count}
            </button>
          ))}
        </div>
      )}

      {addressCount > 0 && (
        <form onSubmit={handleSubmit}>
          <div>
            {Array.from({ length: addressCount }, (_, index) => (
              <div key={index}>
                <label>Address {index + 1}</label>
                <input
                  type="text"
                  value={addresses[index]}
                  onChange={(e) => handleAddressChange(e, index)}
                  placeholder={`Enter Address ${index + 1}`}
                  required
                />
              </div>
            ))}
          </div>
          <button type="submit">Add Address</button>
        </form>
      )}

      {success && <div style={{ color: 'green' }}>{success}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default AddingAddress;
