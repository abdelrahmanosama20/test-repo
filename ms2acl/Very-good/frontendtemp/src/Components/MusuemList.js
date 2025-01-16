import React, { useEffect, useState } from 'react';
import MuseumDisplay from './MuseumDisplay';
import { fetchMuseums, deleteMuseum, updateMuseum,searchforHP } from '../Services/museumServices'; // Adjust the import path as needed

const MuseumList = () => {
    const [museums, setMuseums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm , setSearchTerm] = useState('');

    useEffect(() => {
        const getMuseums = async () => {
            try {
                console.log("will fetch now")
                const response = await fetchMuseums(); // Fetch all museums
                console.log(response)
                setMuseums(response.data);
            } catch (err) {
                console.error("Fetch error:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getMuseums();
    }, []); // Empty dependency array means this effect runs once on mount

    const handleDeleteMuseum = async (museumId) => {
        try {
            await deleteMuseum(museumId); // Call the delete function from services
            setMuseums(museums.filter(museum => museum._id !== museumId)); // Update the state
        } catch (err) {
            console.error('Failed to delete museum:', err.message);
        }
    };

    const handleUpdateMuseum = async (museumId, updatedData) => {
        try {
            const updatedMuseum = await updateMuseum(museumId, updatedData); // Call the update function from services
            setMuseums(prevMuseums => 
                prevMuseums.map(museum => 
                    museum._id === updatedMuseum._id ? updatedMuseum : museum
                )
            ); // Update the state with the new data
            return updatedMuseum;
        } catch (err) {
            console.error('Failed to update museum:', err.message);
        }
    };
    const handleSearch = async () => {
        try {
            if (searchTerm.trim() === '') {
                const data = await fetchMuseums();
                setMuseums(data);
            } else {
                // Search based on the input
                const data = await searchforHP( searchTerm);
                setMuseums(data);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading museums...</p>;
    if (error) return <p>Error occurred: {error}</p>;

    return (
        <div className="container">
            <h1>Museums</h1>
            {/* Search input */}
            <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search by name or tag" 
            />
            <button onClick={handleSearch}>Search</button>
            {museums.length === 0 ? (
                <p>No museums found.</p>
            ) : (
                museums.map((museum) => (
                    <MuseumDisplay key={museum._id} museum={museum} onDelete={handleDeleteMuseum} onUpdate={handleUpdateMuseum} />
                ))
            )}
        </div>
    );
};

export default MuseumList;