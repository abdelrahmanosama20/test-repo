import React, { useState, useEffect } from 'react';
import { fetchAdvertiserByEmail, updateAdvertiserByEmail } from '../RequestSendingMethods'; // Import the fetching method
import '../styles/global.css'; // Assuming global styles are shared across components

const AdvertiserInfo = ({ email, onBack }) => {
  const [advertiserData, setAdvertiserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const getAdvertiserData = async () => {
      try {
        const response = await fetchAdvertiserByEmail({ email }); // Call fetch method with email as JSON object
        if (response) {
          setAdvertiserData(response.advertiser);
          setEditedData(response.advertiser);
        }
      } catch (error) {
        console.error('Error fetching advertiser data:', error);
      }
    };

    if (email) {
      getAdvertiserData();
    }
  }, [email]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleUpdateProfile = async () => {
  if (isEditing) {
    try {
      console.log('Email:', email);
      console.log('Updated Data:', { updatedData: editedData }); // Log updated data
      const response = await updateAdvertiserByEmail(email, { updatedData: editedData });
      if (response) {
        setAdvertiserData(editedData); // Update state with edited data
      }
    } catch (error) {
      console.error('Error updating advertiser:', error);
    }
  }
  setIsEditing(!isEditing); // Toggle editing state
};

  return (
    <div className="advertiser-page">
      <div className="container">
        <header className="header">
          <h1>Welcome, Advertiser!</h1>
        </header>

        <div className="profile">
          <h2 className="form-header">Advertiser Profile</h2>

          <div className="profile-info">
            <label>Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedData?.name || ''}
                onChange={handleEditChange}
              />
            ) : (
              <p>{advertiserData?.name || 'NA'}</p>
            )}
          </div>

          <div className="profile-info">
            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editedData?.email || ''}
                onChange={handleEditChange}
              />
            ) : (
              <p>{advertiserData?.email || 'NA'}</p>
            )}
          </div>

          <div className="profile-info">
            <label>Description:</label>
            {isEditing ? (
              <input
                type="text"
                name="description"
                value={editedData?.description || ''}
                onChange={handleEditChange}
              />
            ) : (
              <p>{advertiserData?.description || 'NA'}</p>
            )}
          </div>

          {/* Removed Wallet Balance field */}
          {/* <div className="profile-info">
            <label>Wallet Balance:</label>
            {isEditing ? (
              <input
                type="text"
                name="wallet"
                value={editedData?.wallet || ''}
                onChange={handleEditChange}
              />
            ) : (
              <p>${advertiserData?.wallet || 'NA'}</p>
            )}
          </div> */}

          <button className="btn" onClick={handleUpdateProfile}>
            {isEditing ? 'Save Changes' : 'Update Profile'}
          </button>

          {/* Back Button in Bottom Right */}
          <button className="back-button bottom-right" onClick={onBack}>
            &larr; Back
          </button>
        </div>

        <footer className="footer">
          <p>&copy; 2024 TravelApp. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default AdvertiserInfo;
