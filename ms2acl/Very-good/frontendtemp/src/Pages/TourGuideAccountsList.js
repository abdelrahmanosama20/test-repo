import React, { useEffect, useState } from 'react';

const TourGuideAccountsList = () => {
    const [tourGuides, setTourGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTourGuides = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/tourGuides/');
                if (!response.ok) {
                    throw new Error('Failed to fetch tour guides data');
                }
                const data = await response.json();
                setTourGuides(data.data); // Assuming the API returns { data: [{...}, {...}] }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTourGuides();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/api/tourGuides/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete tour guide');
            }

            // Update the state by removing the deleted tour guide from the list
            setTourGuides((prevTourGuides) => prevTourGuides.filter((guide) => guide._id !== id));
        } catch (error) {
            console.error('Error deleting tour guide:', error);
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
            <h2>Tour Guide Accounts List</h2>
            {tourGuides.length > 0 ? (
                <ul>
                    {tourGuides.map((guide) => (
                        <li key={guide._id}>
                            <h3>{guide.name}</h3>
                            <p>Email: {guide.email}</p>
                            <p>Description: {guide.description || 'No description available'}</p>
                            <button onClick={() => handleDelete(guide._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tour guides found.</p>
            )}
        </div>
    );
};

export default TourGuideAccountsList;
