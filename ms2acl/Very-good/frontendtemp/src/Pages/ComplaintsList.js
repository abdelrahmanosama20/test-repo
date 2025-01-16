import React, { useEffect, useState } from 'react';
import ComplaintDetails from './ComplaintDetails'; // Ensure this path is correct

const ComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null); // State for selected complaint

  useEffect(() => {
      const fetchComplaints = async () => {
          try {
              const response = await fetch('http://localhost:4000/api/complaints');
              const data = await response.json();
              console.log(data); // Log the fetched data for debugging
              setComplaints(data); // Assuming data is an array of complaints
          } catch (error) {
              console.error('Error fetching complaints:', error);
          }
      };

      fetchComplaints();
  }, []);

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint); // Set the selected complaint
  };

  const handleCloseDetails = () => {
    setSelectedComplaint(null); // Reset the selected complaint
  };

  return (
      <div>
          <h1>Complaints List</h1>
          <ul>
              {complaints.map((complaint) => (
                  <div key={complaint._id}>
                      <h3>{complaint.title}</h3>
                      <p>{complaint.body}</p>
                      <p>Date: {new Date(complaint.date).toLocaleString()}</p>
                      <p>Resolved: {complaint.isResolved ? "Yes" : "No"}</p>
                      <button onClick={() => handleViewDetails(complaint)}>View Details</button>
                  </div>
              ))}
          </ul>
          {selectedComplaint && (
              <ComplaintDetails 
                  complaint={selectedComplaint} 
                  onClose={handleCloseDetails} 
              />
          )}
      </div>
  );
};

export default ComplaintsList;
