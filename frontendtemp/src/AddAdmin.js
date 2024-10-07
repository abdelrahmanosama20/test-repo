import React, { useState } from 'react';

const AddAdmin = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');  // Add state for email
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleAddAdmin = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        // Make the POST request to your backend API
        try {
            const response = await fetch('http://localhost:5000/api/admins', {  // Point to the backend's port
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,  // Include email in the body
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("Admin created successfully");
                setErrorMessage('');
                setUsername(''); // Clear the form
                setEmail('');    // Clear the email
                setPassword('');
                setConfirmPassword('');
            } else {
                setErrorMessage(data.message || "Error creating admin");
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage("An error occurred while creating the admin");
            setSuccessMessage('');
        }
    };

    return (
        <div className="form-container">
            <h2>Add New Admin</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <form onSubmit={handleAddAdmin}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                
                <button type="submit">Add Admin</button>
            </form>
        </div>
    );
};

export default AddAdmin;
