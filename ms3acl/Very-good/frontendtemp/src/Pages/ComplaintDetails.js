import React from 'react';

const ComplaintDetails = ({ complaint }) => {
  if (!complaint) {
    return <div>No complaint selected.</div>; // Display a message if no complaint is selected
  }

  return (
    <div>
      <h1>Complaint Details</h1>
      <h2>{complaint.title}</h2>
      <p>{complaint.body}</p>
      <p>Date: {new Date(complaint.date).toLocaleString()}</p>
      <p>Resolved: {complaint.isResolved ? "Yes" : "No"}</p>
      {/* Display other complaint details as needed */}
    </div>
  );
};

export default ComplaintDetails;