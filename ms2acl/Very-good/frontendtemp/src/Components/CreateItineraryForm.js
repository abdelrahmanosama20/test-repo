import React, { useState, useEffect } from 'react';
import { createItinerary } from '../Services/itineraryServices'; // Adjust the import path as needed
import axios from 'axios';

const CreateItineraryForm = ({ onClose, tourGuideId }) => {
    const [newItinerary, setNewItinerary] = useState({
        title: '',
        description: '',
        price: '',
        language: '',
        pickUpLocation: '',
        dropOffLocation: '',
        activities: [
            {
                title: '',
                description: '',
                duration: '',
                price: '',
                startTime: '',
                endTime: '',
                location: { lat: '', lng: '' }
            }
        ],
        locationsToVisit: [
            { name: '', lat: '', lng: '', address: '' }
        ],
        availableDates: [''],
        availableTimes: [''],
        accessibility: false,
        tags: [], // Tags to be selected
    });
    
    const [tags, setTags] = useState([]); // To store tags fetched from API
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // For managing loading state

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/tags/');
                console.log('Fetched tags:', response.data); // Log the raw fetched data
        
                // Assuming response.data is an object containing 'data' which is an array of tag objects
                if (response.data && Array.isArray(response.data.data)) {
                    // Filter tags where category equals 'preference'
                    const filteredTags = response.data.data.filter(tag => tag.category === 'preference');
                    console.log('Filtered tags:', filteredTags); // Log filtered tags for debugging
                    
                    setTags(filteredTags); // Set only filtered tags
                } else {
                    throw new Error('Response data is not in the expected format.');
                }
                setIsLoading(false); // Stop loading once fetched
            } catch (err) {
                console.error('Failed to fetch tags:', err.message);
                setError('Failed to load tags.');
                setIsLoading(false); // Stop loading even if there's an error
            }
        };
        
        

        fetchTags();
    }, []);

    const handleAddActivity = () => {
        setNewItinerary(prevState => ({
            ...prevState,
            activities: [...prevState.activities, { title: '', description: '', duration: '', price: '', startTime: '', endTime: '', location: { lat: '', lng: '' } }],
        }));
    };

    const handleAddLocation = () => {
        setNewItinerary(prevState => ({
            ...prevState,
            locationsToVisit: [...prevState.locationsToVisit, { name: '', lat: '', lng: '', address: '' }],
        }));
    };

    const handleAddAvailableDate = () => {
        setNewItinerary(prevState => ({
            ...prevState,
            availableDates: [...prevState.availableDates, ''],
        }));
    };


    const handleAddAvailableTime = () => {
        setNewItinerary(prevState => ({
            ...prevState,
            availableTimes: [...prevState.availableTimes, ''],
        }));
    };



    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;

        setNewItinerary(prevState => ({
            ...prevState,
            [name]: inputValue,
        }));
    };

    const handleTagClick = (tagId) => {
        setNewItinerary(prevState => {
            const alreadySelected = prevState.tags.includes(tagId);
            const updatedTags = alreadySelected
                ? prevState.tags.filter(id => id !== tagId)
                : [...prevState.tags, tagId];
            return { ...prevState, tags: updatedTags };
        });
    };

    const handleSaveClick = async () => {
        // Validation logic for all required fields
        const requiredFields = {
            title: newItinerary.title,
            price: newItinerary.price,
            activityTitle: newItinerary.activities[0].title,
            activityDuration: newItinerary.activities[0].duration,
            activityStartTime: newItinerary.activities[0].startTime,
            activityEndTime: newItinerary.activities[0].endTime,
            activityLocationLat: newItinerary.activities[0].location.lat,
            activityLocationLng: newItinerary.activities[0].location.lng,
            language: newItinerary.language,
            pickUpLocation: newItinerary.pickUpLocation,
            dropOffLocation: newItinerary.dropOffLocation,
            availableDate: newItinerary.availableDates[0],
            availableTime: newItinerary.availableTimes[0],
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => value === '' || value === undefined)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
            return;
        }

        try {
            const itineraryWithTourGuideId = {
                ...newItinerary,
                tourGuideId: tourGuideId, // Include the tour guide ID
                activities: newItinerary.activities.map(activity => ({
                    ...activity,
                    location: {
                        lat: parseFloat(activity.location.lat),
                        lng: parseFloat(activity.location.lng),
                    },
                })),
                locationsToVisit: newItinerary.locationsToVisit.map(location => ({
                    ...location,
                    lat: parseFloat(location.lat),
                    lng: parseFloat(location.lng),
                })),
            };

            const createdItinerary = await createItinerary(itineraryWithTourGuideId);
            console.log('Itinerary created:', createdItinerary);
            onClose(); // Close the form after successful creation
        } catch (err) {
            console.error('Failed to create itinerary:', err.message);
            alert('Failed to create itinerary:', err.message);
        }
    };

    return (
        <div className="itinerary-card">
            {/* Form fields */}
            <input type="text" name="title" value={newItinerary.title} onChange={handleInputChange} placeholder="Itinerary Title" required />
            <textarea name="description" value={newItinerary.description} onChange={handleInputChange} placeholder="Itinerary Description" />
            <input type="number" name="price" value={newItinerary.price} onChange={handleInputChange} placeholder="Price" />
            
            {/* Language Dropdown */}
            <select name="language" value={newItinerary.language} onChange={handleInputChange} required>
                <option value="" disabled>Select Language</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
                <option value="Other">Other</option>
            </select>

            <input type="text" name="pickUpLocation" value={newItinerary.pickUpLocation} onChange={handleInputChange} placeholder="Pick Up Location" required />
            <input type="text" name="dropOffLocation" value={newItinerary.dropOffLocation} onChange={handleInputChange} placeholder="Drop Off Location" required />

            {/* Activities */}
            <div className="itinerary-activities">
                <h3>Activities</h3>
                {newItinerary.activities.map((activity, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            name={`activityTitle-${index}`}
                            value={activity.title}
                            onChange={(e) => {
                                const newActivities = [...newItinerary.activities];
                                newActivities[index].title = e.target.value;
                                setNewItinerary({ ...newItinerary, activities: newActivities });
                            }}
                            placeholder={`Activity Title`}
                            required
                        />
                        <input
                            type="text"
                            name={`activityDescription-${index}`}
                            value={activity.description}
                            onChange={(e) => {
                                const newActivities = [...newItinerary.activities];
                                newActivities[index].description = e.target.value;
                                setNewItinerary({ ...newItinerary, activities: newActivities });
                            }}
                            placeholder={`Activity Description`}
                        />
                        <input
                            type="number"
                            name={`activityDuration-${index}`}
                            value={activity.duration}
                            onChange={(e) => {
                                const newActivities = [...newItinerary.activities];
                                newActivities[index].duration = e.target.value;
                                setNewItinerary({ ...newItinerary, activities: newActivities });
                            }}
                            placeholder="Duration (minutes)"
                            required
                        />
                        <input
                            type="number"
                            name={`activityPrice-${index}`}
                            value={activity.price}
                            onChange={(e) => {
                                const newActivities = [...newItinerary.activities];
                                newActivities[index].price = e.target.value;
                                setNewItinerary({ ...newItinerary, activities: newActivities });
                            }}
                            placeholder="Price"
                        />
                        <input
                            type="text"
                            name={`activityStartTime-${index}`}
                            value={activity.startTime}
                            onChange={(e) => {
                                const newActivities = [...newItinerary.activities];
                                newActivities[index].startTime = e.target.value;
                                setNewItinerary({ ...newItinerary, activities: newActivities });
                            }}
                            placeholder="Start Time"
                            required
                        />
                        <input
                            type="text"
                            name={`activityEndTime-${index}`}
                            value={activity.endTime}
                            onChange={(e) => {
                                const newActivities = [...newItinerary.activities];
                                newActivities[index].endTime = e.target.value;
                                setNewItinerary({ ...newItinerary, activities: newActivities });
                            }}
                            placeholder="End Time"
                            required
                        />
                        <input
                            type="text"
                            name={`activityLocationLat-${index}`}
                            value={activity.location.lat}
                            onChange={(e) => {
                                const newActivities = [...newItinerary.activities];
                                newActivities[index].location.lat = e.target.value;
                                setNewItinerary({ ...newItinerary, activities: newActivities });
                            }}
                            placeholder="Activity Location Latitude"
                            required
                        />
                        <input
                            type="text"
                            name={`activityLocationLng-${index}`}
                            value={activity.location.lng}
                            onChange={(e) => {
                                const newActivities = [...newItinerary.activities];
                                newActivities[index].location.lng = e.target.value;
                                setNewItinerary({ ...newItinerary, activities: newActivities });
                            }}
                            placeholder="Activity Location Longitude"
                            required
                        />
                    </div>
                ))}
                <button onClick={handleAddActivity}>Add Activity</button>
            </div>

            {/* Locations to visit */}
            <div className="itinerary-locations">
                <h3>Locations to Visit</h3>
                {newItinerary.locationsToVisit.map((location, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            name={`locationName-${index}`}
                            value={location.name}
                            onChange={(e) => {
                                const newLocations = [...newItinerary.locationsToVisit];
                                newLocations[index].name = e.target.value;
                                setNewItinerary({ ...newItinerary, locationsToVisit: newLocations });
                            }}
                            placeholder={`Location Name`}
                        />
                        <input
                            type="text"
                            name={`locationLat-${index}`}
                            value={location.lat}
                            onChange={(e) => {
                                const newLocations = [...newItinerary.locationsToVisit];
                                newLocations[index].lat = e.target.value;
                                setNewItinerary({ ...newItinerary, locationsToVisit: newLocations });
                            }}
                            placeholder="Location Latitude"
                        />
                        <input
                            type="text"
                            name={`locationLng-${index}`}
                            value={location.lng}
                            onChange={(e) => {
                                const newLocations = [...newItinerary.locationsToVisit];
                                newLocations[index].lng = e.target.value;
                                setNewItinerary({ ...newItinerary, locationsToVisit: newLocations });
                            }}
                            placeholder="Location Longitude"
                        />
                        <input
                            type="text"
                            name={`locationAddress-${index}`}
                            value={location.address}
                            onChange={(e) => {
                                const newLocations = [...newItinerary.locationsToVisit];
                                newLocations[index].address = e.target.value;
                                setNewItinerary({ ...newItinerary, locationsToVisit: newLocations });
                            }}
                            placeholder="Location Address"
                        />
                    </div>
                ))}
                <button onClick={handleAddLocation}>Add Location</button>
            </div>

            {/* Available Dates */}
            <div className="itinerary-available-dates">
                <h3>Available Dates</h3>
                {newItinerary.availableDates.map((date, index) => (
                    <div key={index}>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => {
                                const newDates = [...newItinerary.availableDates];
                                newDates[index] = e.target.value;
                                setNewItinerary({ ...newItinerary, availableDates: newDates });
                            }}
                        />
                    </div>
                ))}
                <button onClick={handleAddAvailableDate}>Add Available Date</button>
            </div>

            {/* Available Times */}
            <div className="itinerary-available-times">
                <h3>Available Times</h3>
                {newItinerary.availableTimes.map((time, index) => (
                    <div key={index}>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => {
                                const newTimes = [...newItinerary.availableTimes];
                                newTimes[index] = e.target.value;
                                setNewItinerary({ ...newItinerary, availableTimes: newTimes });
                            }}
                        />
                    </div>
                ))}
                <button onClick={handleAddAvailableTime}>Add Available Time</button>
            </div>

            <label>
                Accessibility:
                <input
                    type="checkbox"
                    checked={newItinerary.accessibility}
                    onChange={() => setNewItinerary(prevState => ({ ...prevState, accessibility: !prevState.accessibility }))}
                />
            </label>


            {/* Tags Section */}
            <div>
                <h3>Select Tags</h3>
                {isLoading ? (
                    <p>Loading tags...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div>
                        {tags.length > 0 ? (
                            tags.map(tag => (
                                <button
                                    key={tag._id}
                                    onClick={() => handleTagClick(tag._id)}
                                    style={{
                                        backgroundColor: newItinerary.tags.includes(tag._id) ? 'green' : 'grey',
                                    }}
                                >
                                    {tag.name}
                                </button>
                            ))
                        ) : (
                            <p>No tags available</p>
                        )}
                    </div>
                )}
            </div>

            <button onClick={handleSaveClick}>Save Itinerary</button>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default CreateItineraryForm;
