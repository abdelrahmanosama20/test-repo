import React, { useState } from 'react';

const AddTourismGovernor = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        mobile: '',
        nationality: '',
        dob: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle form field changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/tourismGoverners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Tourism Governor added successfully');
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    mobile: '',
                    nationality: '',
                    dob: ''
                });
            } else {
                setError(data.message || 'Error adding Tourism Governor');
            }
        } catch (error) {
            setError('Failed to add Tourism Governor');
        }
    };

    return (
        <div className="add-governor-form">
            <h2>Add Tourism Governor</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    UserName:
                    <input type="text" name="username" value={formData.name} onChange={handleChange} required />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </label>
                <label>
                    Mobile:
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required />
                </label>
                <label>
                    Nationality:
                    <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} required />
                </label>
                <label>
                    Date of Birth:
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                </label>
                <button type="submit">Add Tourism Governor</button>
            </form>
        </div>
    );
};

export default AddTourismGovernor;
