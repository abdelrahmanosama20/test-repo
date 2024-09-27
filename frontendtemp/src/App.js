import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './styles/global.css';
import TouristPage from './TouristPage'; 

function App() {
  const [action, setAction] = useState(''); // Tracks the user's action (register or sign in)
  const [registrationType, setRegistrationType] = useState(''); // Tracks if user is individual or organization
  const [role, setRole] = useState(''); // Tracks the selected role
  const [step, setStep] = useState(1); // Tracks if we're on the initial or detailed form
  const [isTouristPageActive, setIsTouristPageActive] = useState(false); // Should we render tourist page

  // Function to handle action selection
  const handleActionSelection = (selectedAction) => {
    setAction(selectedAction);
  };

  // Function to handle proceeding to the next step (after role selection)
  const handleProceed = (event) => {
    event.preventDefault(); // Prevent the default form behavior
    setStep(2); // Move to the next step which is the detailed form based on role
  };

  // Function to handle form submission (register button click)
  const handleRegister = (event) => {
    console.log("Register button clicked");
    event.preventDefault(); // Prevent the default form submission behavior

    // Based on the role, set state to render the tourist page if applicable
    if (role === 'tourist') {
      setIsTouristPageActive(true);
      // BACKEND CONNECTION As in Update The dataBase 
    } else {
      // Handle other roles or proceed with registration
      console.log(`Role selected: ${role}`);
      // Implement other role redirects here if necessary
    }
  };

  return (
    <div className="container">
      {/* Render Tourist Page if active */}
      {isTouristPageActive ? (
        <TouristPage />
      ) : (
        <>
          {/* Welcome Message and Action Selection */}
          {action === '' && (
            <div className="welcome-message">
              <h1>Welcome to the Very Good Travel App</h1>
              <p>Please select an action:</p>
              <button onClick={() => handleActionSelection('register')}>Register</button>
              <button onClick={() => handleActionSelection('signin')}>Sign In</button>
            </div>
          )}

          {/* Registration Type Selection */}
          {action === 'register' && step === 1 && (
            <div className="form-container">
              <h2 className="form-header">Register</h2>
              <form onSubmit={handleProceed}>
                <label htmlFor="registrationType">Are you registering as an individual or an organization?</label>
                <select
                  id="registrationType"
                  value={registrationType}
                  onChange={(e) => setRegistrationType(e.target.value)}
                  required
                >
                  <option value="">Select type</option>
                  <option value="individual">Individual</option>
                  <option value="organization">Organization</option>
                </select>

                {registrationType === 'individual' && (
                  <>
                    <label htmlFor="role">Select your role:</label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      <option value="">Select role</option>
                      <option value="tourist">Tourist</option>
                      <option value="tourGuide">Tour Guide</option>
                      <option value="tourismGovernor">Tourism Governor</option>
                    </select>
                  </>
                )}

                {registrationType === 'organization' && (
                  <>
                    <label htmlFor="role">Select your role:</label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      <option value="">Select role</option>
                      <option value="seller">Seller</option>
                      <option value="advertiser">Advertiser</option>
                    </select>
                  </>
                )}

                <button type="submit" className="btn proceed-btn">Proceed</button>
                <button type="button" className="btn" onClick={() => setAction('')}>Back</button>
              </form>
            </div>
          )}

          {/* Detailed Registration Form */}
          {action === 'register' && step === 2 && (
            <div className="form-container">
              <h2 className="form-header">Complete Your {role} Registration</h2>
              <form onSubmit={handleRegister}>
                {role === 'tourist' && (
                  <>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />

                    <label htmlFor="mobile">Mobile Number:</label>
                    <input type="tel" id="mobile" name="mobile" required />

                    <label htmlFor="dob">Date of Birth:</label>
                    <input type="date" id="dob" name="dob" required />

                    <label htmlFor="nationality">Nationality:</label>
                    <input type="text" id="nationality" name="nationality" required />

                    <label htmlFor="job">Job:</label>
                    <input type="text" id="job" name="job" />
                  </>
                )}

                {role === 'tourGuide' && (
                  <>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />

                    <label htmlFor="mobile">Mobile Number:</label>
                    <input type="tel" id="mobile" name="mobile" required />

                    <label htmlFor="dob">Date of Birth:</label>
                    <input type="date" id="dob" name="dob" required />

                    <label htmlFor="nationality">Nationality:</label>
                    <input type="text" id="nationality" name="nationality" required />

                    <label htmlFor="experience">Years of Experience:</label>
                    <input type="number" id="experience" name="experience" required />

                    <label htmlFor="previousWork">Previous Work (if any):</label>
                    <input type="text" id="previousWork" name="previousWork" />
                  </>
                )}

                {role === 'tourismGovernor' && (
                  <>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />

                    <label htmlFor="mobile">Mobile Number:</label>
                    <input type="tel" id="mobile" name="mobile" required />

                    <label htmlFor="dob">Date of Birth:</label>
                    <input type="date" id="dob" name="dob" required />

                    <label htmlFor="nationality">Nationality:</label>
                    <input type="text" id="nationality" name="nationality" required />
                  </>
                )}

                {role === 'seller' && (
                  <>
                    <label htmlFor="storeName">Store Name:</label>
                    <input type="text" id="storeName" name="storeName" required />

                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />

                    <label htmlFor="description">Description:</label>
                    <textarea id="description" name="description" required></textarea>
                  </>
                )}

                {role === 'advertiser' && (
                  <>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" required />

                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />

                    <label htmlFor="website">Link to Website:</label>
                    <input type="url" id="website" name="website" required />

                    <label htmlFor="hotline">Hotline:</label>
                    <input type="tel" id="hotline" name="hotline" required />
                  </>
                )}
                <button type="submit" className="btn register-btn">Register</button>
                <button type="button" className="btn" onClick={() => setStep(1)}>Back</button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
    
  );
}

export default App;
