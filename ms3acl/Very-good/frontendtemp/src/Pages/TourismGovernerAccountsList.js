import React, { useEffect, useState } from 'react';

const TourismGovernerAccountsList = () => {
    const [governors, setGovernors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGovernors = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/tourismGoverners/');
                if (!response.ok) {
                    throw new Error('Failed to fetch tourism governors data');
                }
                const data = await response.json();
                setGovernors(data.data); // Assuming the API returns { data: [{...}, {...}] }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGovernors();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/api/tourismGoverners/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete tourism governor');
            }

            // Update the state by removing the deleted governor from the list
            setGovernors((prevGovernors) => prevGovernors.filter((governor) => governor._id !== id));
        } catch (error) {
            console.error('Error deleting tourism governor:', error);
            setError(error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Tourism Governor Accounts List</h2>
            {governors.length > 0 ? (
                <ul>
                    {governors.map((governor) => (
                        <li key={governor._id}>
                            <h3>{governor.name}</h3>
                            <p>Email: {governor.email}</p>
                            <p>Description: {governor.description || 'No description available'}</p>
                            <button onClick={() => handleDelete(governor._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tourism governors found.</p>
            )}
        </div>
    );
};

export default TourismGovernerAccountsList;
