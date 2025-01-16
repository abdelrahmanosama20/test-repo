import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TouristPage = () => {
  const [tourists, setTourists] = useState([]);

  useEffect(() => {
    const fetchTourists = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/tourists');
        setTourists(response.data.data); // Assuming the data is in response.data.data
      } catch (error) {
        console.error('Error fetching tourists:', error);
      }
    };

    fetchTourists();
  }, []);

  const deleteTourist = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/tourists/${id}`);
      console.log(response.data.message); // For debugging, you can remove this later
      // Filter out the deleted tourist from the state
      setTourists(tourists.filter((tourist) => tourist._id !== id));
    } catch (error) {
      console.error('Error deleting tourist:', error);
    }
  };

  return (
    <div>
      <h1>Tourist List</h1>
      <ul>
        {tourists.map((tourist) => (
          <li key={tourist._id}>
            {tourist.name} - {tourist.email}
            <button onClick={() => deleteTourist(tourist._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TouristPage;
