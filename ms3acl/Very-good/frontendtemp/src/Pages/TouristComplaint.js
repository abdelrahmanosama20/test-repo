import React, { useState } from 'react';
import { sendComplaint } from '../RequestSendingMethods'; // Import the sendComplaint function

const TouristComplaint = ({email}) => {
    const [title, setTitle] = useState(''); // State for complaint title
    const [body, setBody] = useState(''); // State for complaint body
    const [message, setMessage] = useState(''); // State for feedback message

    //const email = localStorage.getItem("userEmail"); // Get email from localStorage

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        
        const complaintData = {
            title,
            body,
            date: new Date().toISOString(), // Get the current date in ISO format
            email, // Include email in the data to be sent
        };

        try {
            
            const response = await sendComplaint(complaintData); // Send the complaint data to the backend
            setMessage(response.message); // Display success message
            // Optionally, clear the form after submission
            setTitle('');
            setBody('');
        } catch (error) {
            console.error("Error submitting complaint:", error);
            setMessage("An error occurred while submitting your complaint."); // Display error message
        }
    };

    return (
        <div>
            <h2>Submit Your Complaint</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Complaint Title"
                    required
                />
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Describe your complaint..."
                    required
                />
                <button type="submit">Submit Complaint</button>
            </form>
            {message && <p>{message}</p>} {/* Display feedback message */}
        </div>
    );
};

export default TouristComplaint;