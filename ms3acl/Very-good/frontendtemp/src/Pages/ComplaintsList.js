import React, { useEffect, useState } from 'react';
import ComplaintDetails from './ComplaintDetails'; // Ensure this path is correct

const ComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyingComplaintId, setReplyingComplaintId] = useState(null);
  const [filterResolved, setFilterResolved] = useState(null); // null means no filter
  const [sortDescending, setSortDescending] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/complaints');
        const data = await response.json();
        setComplaints(data);
        setFilteredComplaints(data); // Initialize filtered complaints
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, []);

  useEffect(() => {
    let updatedComplaints = [...complaints];
    
    // Apply filter
    if (filterResolved !== null) {
      updatedComplaints = updatedComplaints.filter(
        (complaint) => complaint.isResolved === filterResolved
      );
    }

    // Apply sorting by date
    updatedComplaints.sort((a, b) => {
      return sortDescending
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    });

    setFilteredComplaints(updatedComplaints);
  }, [complaints, filterResolved, sortDescending]);

  const handleFilterResolved = (status) => {
    setFilterResolved(status);
  };

  const handleToggleSortOrder = () => {
    setSortDescending((prev) => !prev);
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleCloseDetails = () => {
    setSelectedComplaint(null);
  };

  const handleMarkAsResolved = async (complaintId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/complaints/${complaintId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isResolved: true }),
      });
      
      if (response.ok) {
        setComplaints((prevComplaints) =>
          prevComplaints.map((complaint) =>
            complaint._id === complaintId ? { ...complaint, isResolved: true } : complaint
          )
        );
        alert('Complaint marked as resolved.');
      } else {
        alert('Failed to mark as resolved.');
      }
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  };

  const handleReply = (complaint) => {
    setReplyingComplaintId(complaint._id);
    setReplyText('');
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      alert("Reply text cannot be empty");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/complaints/${replyingComplaintId}/reply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText }),
      });
      
      if (response.ok) {
        setComplaints((prevComplaints) =>
          prevComplaints.map((complaint) =>
            complaint._id === replyingComplaintId ? { ...complaint, adminReply: replyText } : complaint
          )
        );
        alert('Reply sent successfully.');
        setReplyingComplaintId(null);
      } else {
        alert('Failed to send reply.');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  return (
    <div>
      <h1>Complaints List</h1>
      <div>
        <button onClick={() => handleFilterResolved(true)}>Filter Resolved</button>
        <button onClick={() => handleFilterResolved(false)}>Filter Unresolved</button>
        <button onClick={() => handleFilterResolved(null)}>Clear Filter</button>
        <button onClick={handleToggleSortOrder}>
          Sort by Date {sortDescending ? 'Descending' : 'Ascending'}
        </button>
      </div>
      
      <ul>
        {filteredComplaints.map((complaint) => (
          <div key={complaint._id}>
            <h3>{complaint.title}</h3>
            <p>{complaint.body}</p>
            <p>Date: {new Date(complaint.date).toLocaleString()}</p>
            <p>Resolved: {complaint.isResolved ? 'Yes' : 'No'}</p>
            <p>Admin Reply: {complaint.adminReply || 'No reply yet'}</p>
            <button onClick={() => handleViewDetails(complaint)}>View Details</button>
            {!complaint.isResolved && (
              <button onClick={() => handleMarkAsResolved(complaint._id)}>Mark as Resolved</button>
            )}
            <button onClick={() => handleReply(complaint)}>Reply</button>

            {replyingComplaintId === complaint._id && (
              <div>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                />
                <button onClick={handleSendReply}>Done</button>
                <button onClick={() => setReplyingComplaintId(null)}>Cancel</button>
              </div>
            )}
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
