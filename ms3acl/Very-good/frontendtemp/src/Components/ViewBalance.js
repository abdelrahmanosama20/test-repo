import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ActivityDisplay.css'; // Make sure to replace with the actual path to your CSS file
import { redeemPoints } from '../Services/payementServices'; // Import redeemPoints function
import { fetchTouristByEmail } from '../RequestSendingMethods'; // Import method to fetch tourist data

const ViewBalance = () => {
  const location = useLocation();
  const { touristData } = location.state || {}; // Retrieve touristData from location.state
  const [tourist, setTourist] = useState(touristData); // Initialize tourist state with passed touristData
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [error, setError] = useState(null);

  // Handle redeem points button click
  const handleRedeemPoints = async () => {
    try {
      if (pointsToRedeem <= 0 || pointsToRedeem > tourist.loyaltyPoints) {
        alert('Invalid points to redeem.');
        return;
      }

      // Redeem points (call the API and update state)
      const updatedTourist = await redeemPoints(tourist._id, pointsToRedeem);
      
      // After redeeming points, fetch the latest data (trigger useEffect behavior)
      const fetchData = async () => {
        try {
          const response = await fetchTouristByEmail({ email: tourist.email });
          setTourist(response.data);  // Update the tourist state with the fetched data
          setPointsToRedeem(0); // Reset pointsToRedeem after successful redemption
          alert('Points redeemed successfully!');
        } catch (err) {
          setError('Error fetching updated tourist data: ' + err.message);
        }
      };

      fetchData();  // Fetch updated data after redeeming points
    } catch (error) {
      console.error('Error redeeming points:', error);
      alert('Error redeeming points, please try again later.');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!tourist) {
    return <p>Loading...</p>;
  }

  return (
    <div className="activity-card">
      <h2 className="activity-title">Tourist Balance Details</h2>
      
      <p className="activity-wallet">
        <strong>Wallet Balance:</strong> {tourist.wallet} EGP
      </p>
      
      <p className="activity-loyalty">
        <strong>Loyalty Points:</strong> {tourist.loyaltyPoints}
      </p>
      
      <p className="activity-badge">
        <strong>Badge:</strong> {tourist.badge}
      </p>

      <div className="redeem-section">
        <label htmlFor="pointsToRedeem">Points to Redeem:</label>
        <input
          type="number"
          id="pointsToRedeem"
          value={pointsToRedeem}
          onChange={(e) => setPointsToRedeem(Number(e.target.value))} // Update points to redeem
          min="0"
          max={tourist.loyaltyPoints} // Limit the input to available loyalty points
        />
        <button onClick={handleRedeemPoints}>Redeem Points</button>
      </div>
    </div>
  );
};

export default ViewBalance;
