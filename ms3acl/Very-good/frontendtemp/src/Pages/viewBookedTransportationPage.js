import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransportationDisplay from '../Components/TransportationDisplay';
import { fetchTouristByEmail } from '../RequestSendingMethods';
import { useLocation } from 'react-router-dom';

const ViewBookedTransportationPage = () => {
  const location = useLocation();
  const { email } = location.state || {};
  const [bookedTransportations, setBookedTransportations] = useState([]);
  const [transportations, setTransportations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch booked transportations (IDs) for the tourist by email
  useEffect(() => {
    const fetchBookedTransportations = async () => {
      try {
        if (email) {
          const response = await fetchTouristByEmail({ email });
          setBookedTransportations(response.data.bookedTransportations);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedTransportations();
  }, [email]);

  // Fetch the transportations based on the booked transportations (IDs)
  useEffect(() => {
    const fetchTransportations = async () => {
      if (bookedTransportations.length > 0) {
        try {
          const transportationPromises = bookedTransportations.map((transportationId) =>
            axios.get(`http://localhost:4000/api/transportations/${transportationId}`)
          );

          // Wait for all requests to complete
          const responses = await Promise.all(transportationPromises);
          const transportationData = responses.map(response => response.data);
          
          setTransportations(transportationData);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransportations();
  }, [bookedTransportations]);

  if (loading) {
    return <div>Loading transportations...</div>;
  }

  if (error) {
    return <div>Error fetching transportations: {error}</div>;
  }

  return (
    <div className="book-transportation-page">
      <h1>Your Booked Transportations</h1>
      {transportations.length === 0 ? (
        <p>No transportations available at the moment.</p>
      ) : (
        transportations.map((transportation) => (
          <TransportationDisplay key={transportation._id} transportation={transportation} />
        ))
      )}
    </div>
  );
};

export default ViewBookedTransportationPage;
