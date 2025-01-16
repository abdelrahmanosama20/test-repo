import React, { useEffect, useState } from 'react';
import { fetchTouristByEmail } from './RequestSendingMethods';

const TestFetchTourist = () => {
    const [touristData, setTouristData] = useState(null);
    const [loading, setLoading] = useState(true);
    const email = 'john.doe@example.com'; // Change this to the email you want to test

    useEffect(() => {
        const getTouristData = async () => {
            const emailObject = { email }; // Prepare the email object
            const data = await fetchTouristByEmail(emailObject);
            console.log('Retrieved tourist data:', data); // Log the data to the console
            setTouristData(data);
            setLoading(false);
        };

        getTouristData();
    }, [email]);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Display the fetched data as is
    return (
        <div>
            <h1>Fetched Tourist Data</h1>
            <pre>{JSON.stringify(touristData, null, 2)}</pre> {/* Displaying the data as JSON */}
        </div>
    );
};

export default TestFetchTourist;
