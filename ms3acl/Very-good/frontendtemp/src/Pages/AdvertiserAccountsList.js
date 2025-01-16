import React, { useEffect, useState } from 'react';

const AdvertiserAccountsList = () => {
    const [advertisers, setAdvertisers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdvertisers = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/advertisers/');
                if (!response.ok) {
                    throw new Error('Failed to fetch advertisers data');
                }
                const data = await response.json();
                setAdvertisers(data.data); // Assuming the API returns { data: [ { ... } ] }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAdvertisers();
    }, []); // Only run on mount

    const deleteAdvertiser = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/api/advertisers/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete advertiser');
            }

            // Filter out the deleted advertiser from the state
            setAdvertisers(advertisers.filter(advertiser => advertiser._id !== id));
        } catch (err) {
            setError(err.message);
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
            <h2>Advertiser Accounts List</h2>
            {advertisers.length > 0 ? (
                advertisers.map(advertiser => (
                    <div key={advertiser._id}>
                        <h3>{advertiser.name}</h3>
                        <p>Email: {advertiser.email}</p>
                        <p>Website: {advertiser.websiteLink}</p>
                        <p>Hotline: {advertiser.hotline}</p>
                        <button onClick={() => deleteAdvertiser(advertiser._id)}>Delete</button>
                    </div>
                ))
            ) : (
                <p>No advertisers found.</p>
            )}
        </div>
    );
};

export default AdvertiserAccountsList;
