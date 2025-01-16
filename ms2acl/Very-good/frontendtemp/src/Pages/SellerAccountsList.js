import React, { useEffect, useState } from 'react';

const SellerAccountsList = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/sellers/');
                if (!response.ok) {
                    throw new Error('Failed to fetch sellers data');
                }
                const data = await response.json();
                setSellers(data.data); // Assuming the API returns { data: [{...}, {...}] }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSellers();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/api/sellers/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete seller');
            }

            // Update the state by removing the deleted seller from the list
            setSellers((prevSellers) => prevSellers.filter((seller) => seller._id !== id));
        } catch (error) {
            console.error('Error deleting seller:', error);
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
            <h2>Seller Accounts List</h2>
            {sellers.length > 0 ? (
                <ul>
                    {sellers.map((seller) => (
                        <li key={seller._id}>
                            <h3>{seller.name}</h3>
                            <p>Email: {seller.email}</p>
                            <p>Description: {seller.description || 'No description available'}</p>
                            <button onClick={() => handleDelete(seller._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No sellers found.</p>
            )}
        </div>
    );
};

export default SellerAccountsList;
