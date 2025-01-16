import React, { useEffect, useState } from 'react';
import { fetchMuseumTags } from '../Services/museumServices'; 
import './ActivityDisplay.css'; // Reuse the same CSS for consistency
import ShareComponent from './shareComponent';


const MuseumDisplayFilterWise = ({ museum }) => {
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

  return (
    <div className="activity-card"> {/* Reusing activity-card class */ }
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
            <span key={tag._id} className="tag">{tag.name + " ,"}</span>
          ))}
        </div>
      )}
        <ShareComponent type="museum" id={museum._id} />
    </div>
  );
};

export default MuseumDisplayFilterWise;
