import React, { useState, useEffect } from 'react';
import {fetchMuseumTags} from '../Services/museumServices'
import './ActivityDisplay.css'; // Reuse the same CSS file for consistency

const MuseumDisplay = ({ museum, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false); // Toggle between edit and view mode
  const [updatedMuseum, setUpdatedMuseum] = useState(museum); // Copy of museum object for editing
  const [tags, setTags] = useState([]); // State to store fetched tags

  // Fetch the museum's tags when the component mounts
  useEffect(() => {
    const getTags = async () => {
      try {
        const fetchedTags = await fetchMuseumTags(museum._id); // Fetch tags using the museum ID
        setTags(fetchedTags); // Set the fetched tags to state
      } catch (err) {
        console.error('Failed to fetch museum tags:', err.message);
      }
    };
    getTags();
  }, [museum._id]);

  const handleEditClick = () => {
    setIsEditing(true); // Switch to edit mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMuseum({
      ...updatedMuseum,
      [name]: value, // Update museum values
    });
  };

  const handleSaveClick = async () => {
    try {
      await onUpdate(museum._id, updatedMuseum); // Update function passed as prop
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error('Failed to update museum:', err.message);
    }
  };

  return (
    <div className="activity-card"> {/* Reusing activity-card class */}
      {isEditing ? (
        // Edit mode: input fields for museum details
        <>
          <input
            type="text"
            name="name"
            value={updatedMuseum.name}
            onChange={handleInputChange}
            placeholder="Museum Name"
          />
          <textarea
            name="description"
            value={updatedMuseum.description}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <div className="pictures-input">
            {updatedMuseum.pictures.map((picture, index) => (
              <input
                key={index}
                type="text"
                name={`picture-${index}`}
                value={picture}
                onChange={(e) => {
                  const newPictures = [...updatedMuseum.pictures];
                  newPictures[index] = e.target.value;
                  setUpdatedMuseum({
                    ...updatedMuseum,
                    pictures: newPictures,
                  });
                }}
                placeholder={`Picture URL ${index + 1}`}
              />
            ))}
          </div>
          <input
            type="text"
            name="locationCity"
            value={updatedMuseum.location.city}
            onChange={(e) =>
              setUpdatedMuseum({
                ...updatedMuseum,
                location: { ...updatedMuseum.location, city: e.target.value },
              })
            }
            placeholder="City"
          />
          <input
            type="text"
            name="locationCountry"
            value={updatedMuseum.location.country}
            onChange={(e) =>
              setUpdatedMuseum({
                ...updatedMuseum,
                location: { ...updatedMuseum.location, country: e.target.value },
              })
            }
            placeholder="Country"
          />
          <input
            type="text"
            name="locationAddress"
            value={updatedMuseum.location.address}
            onChange={(e) =>
              setUpdatedMuseum({
                ...updatedMuseum,
                location: { ...updatedMuseum.location, address: e.target.value },
              })
            }
            placeholder="Address"
          />
          <div className="opening-hours">
            {Object.keys(updatedMuseum.openingHours).map((day) => (
              <input
                key={day}
                type="text"
                name={`openingHours-${day}`}
                value={updatedMuseum.openingHours[day]}
                onChange={(e) =>
                  setUpdatedMuseum({
                    ...updatedMuseum,
                    openingHours: {
                      ...updatedMuseum.openingHours,
                      [day]: e.target.value,
                    },
                  })
                }
                placeholder={`Opening hours on ${day}`}
              />
            ))}
          </div>
          <input
            type="number"
            name="ticketPricesForeigner"
            value={updatedMuseum.ticketPrices.foreigner}
            onChange={(e) =>
              setUpdatedMuseum({
                ...updatedMuseum,
                ticketPrices: {
                  ...updatedMuseum.ticketPrices,
                  foreigner: e.target.value,
                },
              })
            }
            placeholder="Ticket Price (Foreigner)"
          />
          <input
            type="number"
            name="ticketPricesNative"
            value={updatedMuseum.ticketPrices.native}
            onChange={(e) =>
              setUpdatedMuseum({
                ...updatedMuseum,
                ticketPrices: {
                  ...updatedMuseum.ticketPrices,
                  native: e.target.value,
                },
              })
            }
            placeholder="Ticket Price (Native)"
          />
          <input
            type="number"
            name="ticketPricesStudent"
            value={updatedMuseum.ticketPrices.student}
            onChange={(e) =>
              setUpdatedMuseum({
                ...updatedMuseum,
                ticketPrices: {
                  ...updatedMuseum.ticketPrices,
                  student: e.target.value,
                },
              })
            }
            placeholder="Ticket Price (Student)"
          />
          <input
            type="checkbox"
            name="museum"
            checked={updatedMuseum.museum}
            onChange={(e) =>
              setUpdatedMuseum({ ...updatedMuseum, museum: e.target.checked })
            }
          />
          Is this a museum?

          <button className="save-button" onClick={handleSaveClick}>
            Save
          </button>
          <button className="cancel-button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </>
      ) : (
        // View mode: display museum details
        <>
          <h2 className="activity-title">{museum.name}</h2>
          <p className="activity-description">{museum.description}</p>
          <div className="pictures-container">
            {museum.pictures.map((picture, index) => (
              <img key={index} src={picture} alt={`Museum Picture ${index + 1}`} className="museum-image"/>
            ))}
          </div>
          <p className="activity-location">
            Location: {museum.location.city}, {museum.location.country}, {museum.location.address}
          </p>
          <div className="opening-hours">
            <p>Opening Hours:</p>
            {Object.keys(museum.openingHours).map((day) => (
              <p key={day}>
                {day}: {museum.openingHours[day]}
              </p>
            ))}
          </div>
          <p className="ticket-prices">
            Ticket Prices: Foreigner - ${museum.ticketPrices.foreigner}, Native - ${museum.ticketPrices.native}, Student - ${museum.ticketPrices.student}
          </p>
          <p className="museum-status">
            Is this a museum? {museum.museum ? "Yes" : "No"}
          </p>

          {/* Tags Display */}
          {tags.length > 0 && (
            <div className="tags-container">
              <p>Tags:</p>
              {tags.map((tag) => (
                <span key={tag._id} className="tag">{tag.name+" ,"}</span>
              ))}
            </div>
          )}

          <div className="activity-buttons">
            <button className="edit-button" onClick={handleEditClick}>Edit</button>
            <button className="delete-button" onClick={() => onDelete(museum._id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MuseumDisplay;
