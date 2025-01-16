import React, { useState, useEffect } from 'react';
import { getTagNames, filterMuseumByTagName } from '../RequestSendingMethods'; // Import the new method
import MuseumDisplayFilterWise from '../Components/MuseumDisplayFilterWise';

const FilterHistoricalPage = () => {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [museums, setMuseums] = useState([]);

  // Fetch tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagNames = await getTagNames();
        setTags(tagNames);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  // Handle tag selection
  const handleTagSelection = async () => {
    try {
      // Send the selected tag name to the backend
      const filteredMuseums = await filterMuseumByTagName(selectedTag);
      setMuseums(filteredMuseums); // Store the filtered museums
    } catch (error) {
      console.error('Error filtering museums:', error);
    }
  };

  return (
    <div className="filter-historical-page">
      <h1>Choose a tag to filter museums</h1>

      {/* Dropdown menu to choose tag */}
      <select
        value={selectedTag}
        onChange={(e) => setSelectedTag(e.target.value)}
      >
        <option value="" disabled>
          Select a tag
        </option>
        {tags.map((tag, index) => (
          <option key={index} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      <button onClick={handleTagSelection}>Filter Museums</button>

      {/* Render filtered museums */}
      <div className="museum-list">
        {museums.length > 0 ? (
          museums.map((museum) => (
            <div key={museum._id} className="museum-item">
              <MuseumDisplayFilterWise museum={museum} /> {/* Use the new component */}
            </div>
          ))
        ) : (
          <p>No museums found for the selected tag.</p>
        )}
      </div>
    </div>
  );
};

export default FilterHistoricalPage;
