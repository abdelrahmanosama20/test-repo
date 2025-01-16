import React, { useState, useEffect } from 'react';
import { createMuseum, fetchTags } from '../Services/museumServices'; // Adjust the import path as needed
import './ActivityDisplay.css';

const CreateMuseumForm = ({ onClose }) => {
    const [newMuseum, setNewMuseum] = useState({
        name: '',
        description: '',
        pictures: [''],
        location: { city: '', country: '', address: '' },
        openingHours: {
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: '',
            saturday: '',
            sunday: ''
        },
        ticketPrices: {
            foreigner: '',
            native: '',
            student: ''
        },
        museum: false,
        tags: [] 
    });

    const [availableTags, setAvailableTags] = useState([]); // State to store fetched tags

    useEffect(() => {
        // Fetch tags when component mounts
        const getTags = async () => {
            try {
                const fetchedTags = await fetchTags();
                setAvailableTags(fetchedTags); // Set the fetched tags
            } catch (err) {
                console.error('Failed to fetch tags:', err.message);
            }
        };
        getTags();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMuseum(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setNewMuseum(prevState => ({
            ...prevState,
            location: {
                ...prevState.location,
                [name]: value,
            },
        }));
    };

    const handleOpeningHoursChange = (e) => {
        const { name, value } = e.target;
        setNewMuseum(prevState => ({
            ...prevState,
            openingHours: {
                ...prevState.openingHours,
                [name]: value,
            },
        }));
    };

    const handleTicketPricesChange = (e) => {
        const { name, value } = e.target;
        setNewMuseum(prevState => ({
            ...prevState,
            ticketPrices: {
                ...prevState.ticketPrices,
                [name]: value,
            },
        }));
    };

    const handleAddPicture = () => {
        setNewMuseum(prevState => ({
            ...prevState,
            pictures: [...prevState.pictures, ''],
        }));
    };

    const handlePictureChange = (index, value) => {
        const newPictures = [...newMuseum.pictures];
        newPictures[index] = value;
        setNewMuseum({ ...newMuseum, pictures: newPictures });
    };

    const handleMuseumToggle = () => {
        setNewMuseum(prevState => ({
            ...prevState,
            museum: !prevState.museum,
        }));
    };

    const handleTagClick = (tag) => {
        setNewMuseum(prevState => {
            const tagExists = prevState.tags.includes(tag);
            if (tagExists) {
                return {
                    ...prevState,
                    tags: prevState.tags.filter(t => t !== tag) // Remove tag if already selected
                };
            } else {
                return {
                    ...prevState,
                    tags: [...prevState.tags, tag] // Add tag if not selected
                };
            }
        });
    };

    const handleSaveClick = async () => {
        // Check for required fields
        const { name, location, openingHours, ticketPrices } = newMuseum;
        const requiredFields = [
            name,
            location.city,
            location.country,
            openingHours.monday,
            openingHours.tuesday,
            openingHours.wednesday,
            openingHours.thursday,
            openingHours.friday,
            openingHours.saturday,
            openingHours.sunday,
            ticketPrices.foreigner,
            ticketPrices.native,
            ticketPrices.student,
        ];

        const ticketPricesValues = Object.values(ticketPrices);
        const allPricesNumeric = ticketPricesValues.every(price => !isNaN(parseFloat(price)) && isFinite(price));
    
        // If any ticket price is invalid, alert the user
        if (!allPricesNumeric) {
            alert('Please ensure all ticket prices are valid numbers.');
            return; // Exit the function to prevent saving
        }
    
        // If any required field is empty, alert the user
        if (requiredFields.some(field => field === '' || field === undefined)) {
            alert('Please fill in all required fields: Name, City, Country, Opening Hours, and Ticket Prices.');
            return; // Exit the function to prevent saving
        }
    
        // Validate ticket prices to ensure they are numeric
    
        // Parse ticket prices to numbers
        const parsedTicketPrices = {
            foreigner: parseFloat(ticketPrices.foreigner) || 0,
            native: parseFloat(ticketPrices.native) || 0,
            student: parseFloat(ticketPrices.student) || 0,
        };
    
        const museumData = { ...newMuseum, ticketPrices: parsedTicketPrices };
    
        try {
            const createdMuseum = await createMuseum(museumData);
            console.log('Museum created:', createdMuseum);
            onClose(); // Close the form after successful creation
        } catch (err) {
            console.error('Failed to create museum:', err.message);
            alert(`Failed to create museum: ${err.message}`);
        }
    };
    
    
    

    return (
        <div className="museum-card">
            <h2>Create Museum</h2>
            <input type="text" name="name" value={newMuseum.name} onChange={handleInputChange} placeholder="Museum Name" required />
            <textarea name="description" value={newMuseum.description} onChange={handleInputChange} placeholder="Description"></textarea>
            
            {/* Pictures */}
            <div className="museum-pictures">
                {newMuseum.pictures.map((picture, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            value={picture}
                            onChange={(e) => handlePictureChange(index, e.target.value)}
                            placeholder={`Picture URL ${index + 1}`}
                        />
                    </div>
                ))}
                <button onClick={handleAddPicture}>Add Picture</button>
            </div>

            {/* Location Fields */}
            <input type="text" name="city" value={newMuseum.location.city} onChange={handleLocationChange} placeholder="City" required />
            <input type="text" name="country" value={newMuseum.location.country} onChange={handleLocationChange} placeholder="Country" required />
            <input type="text" name="address" value={newMuseum.location.address} onChange={handleLocationChange} placeholder="Address" />

            {/* Opening Hours */}
            <h3>Opening Hours</h3>
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <input
                    key={day}
                    type="text"
                    name={day}
                    value={newMuseum.openingHours[day]}
                    onChange={handleOpeningHoursChange}
                    placeholder={`${day.charAt(0).toUpperCase() + day.slice(1)} hours`}
                    required
                />
            ))}

            {/* Ticket Prices */}
            <h3>Ticket Prices</h3>
            <input type="number" name="foreigner" value={newMuseum.ticketPrices.foreigner} onChange={handleTicketPricesChange} placeholder="Foreigner Price" required />
            <input type="number" name="native" value={newMuseum.ticketPrices.native} onChange={handleTicketPricesChange} placeholder="Native Price" required />
            <input type="number" name="student" value={newMuseum.ticketPrices.student} onChange={handleTicketPricesChange} placeholder="Student Price" required />

            {/* Tags Section */}
{/* Tags Section */}
            <h3>Select Tags</h3>
            <div className="tags-container">
            {availableTags.map(tag => (
                    <button
                        key={tag._id}
                        type="button"
                        className={`tag-button ${newMuseum.tags.includes(tag._id) ? 'selected-tag' : ''}`}
                        onClick={() => handleTagClick(tag._id)}
                    >
                    {tag.name}
                    </button>
                ))}
            </div>


            {/* Museum Checkbox */}
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={newMuseum.museum}
                        onChange={handleMuseumToggle}
                    />
                    Is this a museum?
                </label>
            </div>

            <button className="save-button" onClick={handleSaveClick}>Save</button>
            <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
    );
};

export default CreateMuseumForm;
