import React, { useState } from 'react';
import { createTag } from './Services/TagServices'; // Adjust the import path as needed

const CreateTagForm = ({ onClose, onAddTag,id }) => {
    const [newTag, setNewTag] = useState({
        name: '',
        tourismGovernerId:id
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTag((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSaveClick = async () => {
        try {
            console.log(newTag)
            const createdTag = await createTag(newTag); // Call the createTag service
            onAddTag(createdTag); // Call the function to add the new tag
            onClose(); // Close the form after successful creation
        } catch (err) {
            console.error('Failed to create tag:', err.message);
        }
    };

    return (
        <div className="tag-card">
            <h2>Create Tag</h2>
            <input 
                type="text" 
                name="name" 
                value={newTag.name} 
                onChange={handleInputChange} 
                placeholder="Tag Name" 
                required 
            />
            <button className="save-button" onClick={handleSaveClick}>Save</button>
            <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
    );
};

export default CreateTagForm;