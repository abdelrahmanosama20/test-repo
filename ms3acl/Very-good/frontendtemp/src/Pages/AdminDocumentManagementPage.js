import React, { useState } from 'react';
import '../styles/global.css';
import { fetchTourGuides, acceptTourGuide, rejectTourGuide, fetchAdvertisers, acceptAdvertiser, rejectAdvertiser,fetchSellers,acceptSeller,rejectSeller } from '../RequestSendingMethods';

const AdminDocumentManagementPage = ({ onSelect }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [tableData, setTableData] = useState([]);

  const handleSelectChange = (event) => {
    const role = event.target.value;
    setSelectedOption(role);

    if (onSelect) onSelect(role);

    if (role === 'tour-guide') {
      handleTourGuideSelection();
    } else if (role === 'seller') {
      handleSellerSelection();
    } else if (role === 'advertiser') {
      handleAdvertiserSelection();
    } else {
      setTableData([]);
    }
  };

  const handleTourGuideSelection = async () => {
    try {
      const response = await fetchTourGuides();
      if (!response || !response.data || !Array.isArray(response.data)) {
        setTableData([]);
        return;
      }
      const filteredTourGuides = response.data.filter(tourguide => {
        return tourguide.isPendingAcceptance;
    });
      const filteredData = filteredTourGuides.map(({ email, IdDocument, certificatesDocument }) => ({
        email,
        IdDocument,
        certificates: Array.isArray(certificatesDocument) ? certificatesDocument : [],
      }));
      setTableData(filteredData);
    } catch (error) {
      setTableData([]);
    }
  };

  const handleSellerSelection = async () => {
    try {
      const response = await fetchSellers();
      if (!response || !response.data || !Array.isArray(response.data)) {
        setTableData([]);
        return;
      }
      const filteredSeller = response.data.filter(seller => {
        return seller.isPendingAcceptance;
      });
  
      // Make sure taxCardDocument exists in the filtered data
      const sellerData = filteredSeller.map(({ email, IdDocument, taxationRegistryCard }) => ({
        email,
        IdDocument,
        taxationRegistryCard: taxationRegistryCard || [],
        // Ensure it's always a string or empty if not available
      }));
  
      setTableData(sellerData);
    } catch (error) {
      setTableData([]);
      console.error('Error fetching sellers:', error);
    }
  };
  

  const handleAdvertiserSelection = async () => {
    try {
      const response = await fetchAdvertisers();
      if (!response || !response.data || !Array.isArray(response.data)) {
        setTableData([]);
        return;
      }
      const filteredAdvertiser = response.data.filter(advertiser => {
        return advertiser.isPendingAcceptance;
    });
      const advertiserData = filteredAdvertiser.map(({ email, IdDocument, taxationRegistryCard }) => ({
        email,
        IdDocument,
        taxationRegistryCard: taxationRegistryCard || [],
      }));
      setTableData(advertiserData);
    } catch (error) {
      setTableData([]);
    }
  };

  const handleAccept = async (email) => {
    try {
      if (selectedOption === 'tour-guide') {
        await acceptTourGuide(email);
      } else if (selectedOption === 'seller') {
        await acceptSeller(email);
      } 
     else if (selectedOption === 'advertiser') {
        await acceptAdvertiser(email);
      }
      setTableData((prevData) => prevData.filter((row) => row.email !== email));
    } catch (error) {
      console.error(`Error accepting ${selectedOption}:`, error);
    }
  };

  const handleReject = async (email) => {
    try {
      if (selectedOption === 'tour-guide') {
        await rejectTourGuide(email);
      } else if (selectedOption === 'seller') {
        await rejectSeller(email);
      }
       else if (selectedOption === 'advertiser') {
        await rejectAdvertiser(email);
      }
      setTableData((prevData) => prevData.filter((row) => row.email !== email));
    } catch (error) {
      console.error(`Error rejecting ${selectedOption}:`, error);
    }
  };

  return (
    <div className="container">
      <h2>View Documents of</h2>
      <select value={selectedOption} onChange={handleSelectChange} className="dropdown">
        <option value="">Select Role</option>
        <option value="tour-guide">Tour Guide</option>
        <option value="seller">Seller</option>
        <option value="advertiser">Advertiser</option>
      </select>

      {tableData.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>ID Document</th>
              {selectedOption === 'tour-guide' ? <th>Certificate Documents</th> : <th>Tax Card Document</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {tableData.map((row, index) => (
    <tr key={index}>
      <td>{row.email}</td>
      <td>
        <a href={row.IdDocument} target="_blank" rel="noopener noreferrer">
          {row.IdDocument}
        </a>
      </td>
      {selectedOption === 'tour-guide' ? (
        <td>
          {Array.isArray(row.certificates) && row.certificates.length > 0 ? (
            row.certificates.map((cert, certIndex) => (
              <div key={certIndex}>
                <a href={cert} target="_blank" rel="noopener noreferrer">
                  {cert}
                </a>
              </div>
            ))
          ) : (
            <span>No certificates available</span>
          )}
        </td>
      ) : (
<td>
{Array.isArray(row.taxationRegistryCard) && row.taxationRegistryCard.length > 0 ? (
  row.taxationRegistryCard.map((taxCard, taxIndex) => (
    <div key={taxIndex}>
      <a href={taxCard} target="_blank" rel="noopener noreferrer">
        {taxCard}
      </a>
    </div>
  ))
) : (
  <span>No tax card available</span>
)}
</td>
      )}
                <td>
                  <button onClick={() => handleAccept(row.email)}>Accept</button>
                  <button onClick={() => handleReject(row.email)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDocumentManagementPage;
