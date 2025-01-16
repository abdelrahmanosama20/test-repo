// TouristPage.js
import React, { useState, useEffect } from 'react';
import './AdvertiserPage.css'; 
import CreateMuseumForm from '../Components/CreateMuseumForm';
import MuseumList from  '../Components/MusuemList'
import { updateTouristByEmailT } from '../RequestSendingMethods';
import CreateTagForm from './CreateTagForm'; // Import CreateTagForm

const TourismGovernerPage = ({ email }) => {
  const [isCreatingMuseum, setIsCreatingMuseum] = useState(false); // State to manage the visibility of the museum form
  const [isCreatingTag, setIsCreatingTag] = useState(false); // State to manage the visibility of the tag form
  const [tags, setTags] = useState([]); // State to hold created tags
  const [tourismData, setTourismData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [oldEmail, setOldEmail] = useState(email);
  
  const [showProfileInfo, setShowProfileInfo] = useState(false);

  useEffect(() => {
    const getTourismData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/tourismGoverners`); // Ensure the endpoint is correct
  
        if (!response.ok) {
          throw new Error('Failed to fetch tourism governor data');
        }
  
        const data = await response.json(); // Parse the response body as JSON
  
        console.log("Fetched data:", data);
        console.log("Email to match:", email);
  
        // Find the tourism governor whose email matches the provided email
        const matchedGovernor = data.data.find(governor => governor.email === email);
  
        if (matchedGovernor) {
          setTourismData(matchedGovernor); // Update the tourismData state with the matched object
          setEditedData(matchedGovernor); // Update the editedData state
          console.log("Matched tourism data:", matchedGovernor);
        } else {
          console.log("No tourism governor found with the provided email.");
        }
      } catch (error) {
        console.error('Error fetching tourism data:', error);
      }
    };
  
    if (email) {
      getTourismData(); // Fetch data only if email is available
    }
  }, [email]);
  
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleUpdateProfile = () => {
    
    setIsEditing(!isEditing);
    setShowProfileInfo(!showProfileInfo); // Toggle profile info
    if(!isEditing){
      const userInput = prompt("Please enter your password:");
      if( userInput !== tourismData.password){
        return
      }
      
    }
    if (isEditing) {
      if (editedData.email !== oldEmail) {
        setOldEmail(editedData.email);
      }
      setTourismData(editedData);
      updateTouristByEmailT(oldEmail, editedData);
     
      const userInput2 = prompt("Please confirm password:");
      if( userInput2 !== tourismData.password && isEditing){
        return
      }
    }

  };

  return (
    <div>
      <h1>Tourism Governer Page</h1>
      <p>Welcome to the Tourism Governer Page!</p>
      <div className="profile-info">
        <label>Name:</label>
        {isEditing ? (
          <input
            type="text"
            name="username"
            value={editedData.username || ''}
            onChange={handleEditChange}
          />
        ) : (
          <p>{tourismData?.username || 'NA'}</p>
        )}
      </div>
      <div className="profile-info">
        <label>ID:</label>
        {isEditing ? (
          <input
            type="text"
            name="_id"
            value={editedData._id || ''}
            onChange={handleEditChange}
          />
        ) : (
          <p>{tourismData?._id || 'NA'}</p>
        )}
      </div>
      <div className="profile-info">
        <label>Password:</label>
        {isEditing ? (
          <input
            type="text"
            name="password"
            value={editedData.password || ''}
            onChange={handleEditChange}
          />
        ) : (
          <p>{"Not Visible" || 'NA'}</p>
        )}
      </div>
      <div className="profile-info">
        <label>Email:</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={editedData.email || ''}
            onChange={handleEditChange}
          />
        ) : (
          <p>{tourismData?.email || 'NA'}</p>
        )}
      </div>
      <div className="profile-info">
        <label>Mobile:</label>
        {isEditing ? (
          <input
            type="text"
            name="mobile"
            value={editedData.mobile || ''}
            onChange={handleEditChange}
          />
        ) : (
          <p>{tourismData?.mobile || 'NA'}</p>
        )}
      </div>
      <div className="profile-info">
        <label>Nationality:</label>
        {isEditing ? (
          <input
            type="text"
            name="nationality"
            value={editedData.nationality || ''}
            onChange={handleEditChange}
          />
        ) : (
          <p>{tourismData?.nationality || 'NA'}</p>
        )}
      </div>

      <button className="btn" onClick={handleUpdateProfile}>
        {isEditing ? 'Save Changes' : 'Update Profile'}
      </button>
    
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
