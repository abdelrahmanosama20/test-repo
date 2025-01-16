// TouristPage.js
import React, { useState } from 'react';
import './AdvertiserPage.css'; 
import CreateMuseumForm from '../Components/CreateMuseumForm';
import MuseumList from '../Components/MusuemList'; // Ensure the path is correct

import CreateTagForm from './CreateTagForm'; // Import CreateTagForm

const TourismGovernerPage = () => {
  const [isCreatingMuseum, setIsCreatingMuseum] = useState(false); // State to manage the visibility of the museum form
  const [isCreatingTag, setIsCreatingTag] = useState(false); // State to manage the visibility of the tag form
  const [tags, setTags] = useState([]); // State to hold created tags

  const handleCreateMuseumButtonClick = () => {
      setIsCreatingMuseum(true); // Show the museum form when the button is clicked
  };

  const handleCreateTagButtonClick = () => {
      setIsCreatingTag(true); // Show the tag form when the button is clicked
  };

  const closeMuseumForm = () => {
      setIsCreatingMuseum(false); // Hide the museum form
  };

  const closeTagForm = () => {
      setIsCreatingTag(false); // Hide the tag form
  };

  const addTag = (newTag) => {
      setTags((prevTags) => [...prevTags, newTag]); // Update the tags state
  };

  return (
      <div>
          <h1>Tourism Governer Page</h1>
          <p>Welcome to the Tourism Governer Page!</p>
          
          {/* Create Museum button */}
          <button className="create-activity-button" onClick={handleCreateMuseumButtonClick}>
              Create Museum/Historical Place
          </button>
          {isCreatingMuseum && <CreateMuseumForm onClose={closeMuseumForm}/>}

          {/* Create Tag button */}
          <button className="create-tag-button" onClick={handleCreateTagButtonClick}>
              Create Tag
          </button>
          {isCreatingTag && <CreateTagForm onClose={closeTagForm} onAddTag={addTag} />} {/* Render CreateTagForm */}
          
          <MuseumList/>

          {/* Optional: Render created tags for display */}
          {tags.length > 0 && (
              <div className="tags-list">
                  <h3>Created Tags:</h3>
                  <ul>
                      {tags.map((tag, index) => (
                          <li key={index}>{tag.name}</li>
                      ))}
                  </ul>
              </div>
          )}
      </div>
  );
};

export default TourismGovernerPage;
