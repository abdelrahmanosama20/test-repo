import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// now here we need to specify the connection between the frontend and the backend 
const UploadDocumentsAdvertiser= ({ onBack,email }) =>  {
  const [idCard, setIdCard] = useState(null); // Holds the uploaded ID card file.
  const [certificates, setCertificates] = useState([]);// Holds an array of uploaded certificate files.
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  // Handle ID card file selection
  const handleIdCardChange = (event) => {
    setIdCard(event.target.files[0]);
  }; //The handleIdCardChange function updates the idCard state when the user selects an ID card file. meaning 
  // we place the chosen document in the object idCard 

  // Handle certificates file selection (multiple files)
  const handleCertificatesChange = (event) => {
    setCertificates(Array.from(event.target.files));
  }; // same for the certificates 

  // Submit the form
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!idCard || certificates.length === 0) {
        setErrorMessage('Please upload both ID card and at least one certificate.');
        return;
    }

    const formData = new FormData();
    formData.append('IdDocument', idCard);  // Appending ID card file
    certificates.forEach((cert) => {
        formData.append('taxationRegistryCard', cert);  // Appending each certificate
    });

    // Here is where you can send the formData to your server using axios
    // should pass the email 
    try {
        const response = await axios.post(`http://localhost:4000/api/advertisers/upload/${email}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('Upload successful:', response.data);
    } catch (error) {
       // console.error('Upload failed:', error);
        setErrorMessage('Upload failed. Please try again.');
    }
};

  return (
    <div>
      <h1>Upload Your Documents</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID Card:</label>
          <input type="file" accept="image/*" onChange={handleIdCardChange} required />
        </div>
        <div>
          <label>taxation_Registry_Card:</label>
          <input type="file" accept="image/*" multiple onChange={handleCertificatesChange} required />
        </div>
        <button type="submit">Upload Documents</button>
      </form>
      <button className="btn" onClick={onBack}>Back</button> {/* Call onBack when back is clicked */}
    </div>
  );
};

export default UploadDocumentsAdvertiser;
