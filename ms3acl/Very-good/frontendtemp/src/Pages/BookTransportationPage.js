import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransportationDisplay from '../Components/TransportationDisplay';
import { fetchTouristByEmail } from '../RequestSendingMethods';
import { useLocation } from 'react-router-dom';


const BookTransportationPage = () => {
  const location = useLocation();
  const { email } = location.state || {};
  const [touristId, setTouristId] = useState(null);
  const [transportations, setTransportations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTouristData = async () => {
      if (email) {
        const data = await fetchTouristByEmail({ email });
        if (data) {
          setTouristId(data.data._id); // Extract and store only the ID
        }
      }
      setLoading(false);
    };

    getTouristData();
  }, [email]);

  useEffect(() => {
    const fetchTransportations = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/transportations/'); // Adjust the endpoint as necessary
        setTransportations(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransportations();
  }, []);

  if (loading) {
    return <div>Loading transportations...</div>;
  }

  if (error) {
    return <div>Error fetching transportations: {error}</div>;
  }

  return (
    <div className="book-transportation-page">
      <h1>Available Transportations</h1>
      {transportations.length === 0 ? (
        <p>No transportations available at the moment.</p>
      ) : (
        transportations.map((transportation) => (
          <TransportationDisplay key={transportation._id} transportation={transportation} touristId={touristId}/>
        ))
      )}
    </div>
  );
};

export default BookTransportationPage;
