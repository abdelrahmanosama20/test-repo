import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./styles/global.css";
import TouristPage from "./Pages/TouristPage";
import PerfrencePage from './Pages/perfrencePage';
import AdminPage from "./Pages/AdminPagee";
import AdvertiserPage from "./Pages/AdvertiserPage";
import TourismGovernerPage from "./Pages/TourismGovernerPage";
import TourGuideHomePage from "./Pages/tourGuideHomePage";
import SellerPage from "./Pages/SellerPage";
import GuestPage from "./Pages/GuestPage";
import {
  registerTourist,
  createTourGuideRequest,
  registerSeller,
  registerAdvertiser,
  addTourismGoverner,
} from "./RequestSendingMethods";
import { LoadScript } from "@react-google-maps/api";
import ActivityItinerarySort from "./Components/SortRatePrice";
import ActivityHistoricalList from "./Components/UpcomingSort";
import MuseumSearch from "./Pages/MuseumSearch";
import ActivityDetail from "./Components/ActivityDetail";
import ItineraryDetail from "./Components/ItineraryDetail";
import MuseumDetail from "./Components/MuseumDetail";
import BookingForm from "./Components/BookingForm";
import Ticket from "./Components/Ticket";
import BookTransportationPage from "./Pages/BookTransportationPage";
import ViewBookedTransportationPage from "./Pages/viewBookedTransportationPage";
import ViewBookedFlightOffers from "./Components/viewBookedFlightOffers";
import SearchHotel from "./Components/SearchHotel";
import HotelBookingForm from "./Components/HotelBookingForm";
import HotelTicket from "./Components/HotelTicket";
import ViewBookedHotelOffers from "./Components/ViewBookedHotelOffers";
import ViewBalance from "./Components/ViewBalance";
//require('dotenv').config();
import AddingAddress from './Pages/AddingAddress'; // Adjust if necessary
import DeliveryAddressPage from './Pages/DeliveryAddressPage';
import ViewMyOrders from './Pages/ViewMyOrders';

function App() {
  const [action, setAction] = useState(""); // Tracks the user's action (register or sign in)
  const [registrationType, setRegistrationType] = useState(""); // Tracks if user is individual or organization
  const [role, setRole] = useState(""); // Tracks the selected role
  const [step, setStep] = useState(1); // Tracks if we're on the initial or detailed form
  const [emailagain, setEmail] = useState(""); // Holds the tourist email
  const [emailtourguide, setEmailTourGuide] = useState(""); // Holds the tour guide email
  const [emailofseller, setEmailOfSeller] = useState(""); // Holds seller email
  const [emailoftourism, setEmailTourism] = useState(""); // Holds seller email
  const [emailAdvertiser, setEmailOfAdvertiser] = useState(""); // Holds advertiser email
  const [isComingFromGuest, setIsComingFromGuest] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState("");
  const navigate = useNavigate(); // To programmatically navigate
  const location = useLocation();
  // Check if a role was passed from GuestPage
  React.useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
      setStep(2); // Skip to the registration form step
      setIsComingFromGuest(true);
      setAction("register");
    }
  }, [location.state]);

  const handleActionSelection = (selectedAction) => {
    setAction(selectedAction);
  };
  const handleLogin = async (event) => {
    event.preventDefault();
  
    if (!loginRole) {
      alert("Please select a role before logging in.");
      return;
    }
  
    try {
      console.log("Logging in with:", { email: loginEmail, password: loginPassword, role: loginRole });
  
      const response = await fetch("http://localhost:4000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          role: loginRole,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Navigate based on the role
        switch (loginRole) {
          case "admin":
            navigate("/admin");
            break;
          case "tourist":
            navigate("/tourist");
            break;
          case "tourGuide":
            navigate("/tourGuide");
            break;
          case "tourismGovernor":
            navigate("/tourismGoverner");
            break;
          case "seller":
            navigate("/seller");
            break;
          case "advertiser":
            navigate("/advertiser");
            break;
          default:
            console.error("Unknown role:", loginRole);
            alert("Login failed: Unknown role");
            break;
        }
      } else {
        alert(`Login failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Error during login. Please try again.");
    }
  };

  const handleProceed = (event) => {
    event.preventDefault();
    setStep(2); // Move to step 2
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const formElements = event.target.elements;

    // Handle tourist registration
    if (role === "tourist") {
      let touristData = {
        name: formElements.username.value,
        email: formElements.email.value,
        password: formElements.password.value,
        mobile: formElements.mobile.value,
        dob: formElements.dob.value,
        nationality: formElements.nationality.value,
        job: formElements.job.value,
        
      };
      await registerTourist(touristData);
      navigate("/tourist");
    }

    if (role === "tourGuide") {
      let tourGuideData = {
        name: formElements.username.value,
        email: formElements.email.value,
        password: formElements.password.value,
        mobile: formElements.mobile.value,
        dob: formElements.dob.value,
        nationality: formElements.nationality.value,
        yearsOfExperience: formElements.experience.value,
        previousJob: formElements.previousWork.value,
      };
      navigate("/tourGuide");
      await createTourGuideRequest(tourGuideData);
    }

    if (role === "tourismGovernor") {
      let tourismData = {
        username: formElements.username.value, // Capture username from the form
        name: formElements.username.value, // This may need to be adjusted based on your input structure
        email: formElements.email.value,
        password: formElements.password.value,
        mobile: formElements.mobile.value,
        nationality: formElements.nationality.value,
        dob: formElements.dob.value,
      };
      await addTourismGoverner(tourismData);
      navigate("/tourismGoverner");
    }

    if (role === "seller") {
      let sellerData = {
        name: formElements.username.value,
        email: formElements.email.value,
        password: formElements.password.value,
        //  dob: formElements.dob.value,
      };
      await registerSeller(sellerData);
      navigate("/seller");
    }

    if (role === "advertiser") {
      let advertiserData = {
        name: formElements.username.value,
        email: formElements.email.value,
        password: formElements.password.value,
        websiteLink: formElements.website.value,
        hotline: formElements.hotline.value,
        companyProfile: formElements.companyProfile.value,
      };
      await registerAdvertiser(advertiserData);
      navigate("/advertiser");
    }
  };

  const handleAdminSignIn = (event) => {
    // Add logic to handle admin sign in here
    navigate("/admin");
  };

  const handleGuest = () => {
    navigate("/guest");
  };

  return (
    <div className="container">
      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* Welcome Message and Action Selection */}
              {!isComingFromGuest && action === "" && (
                <div className="welcome-message">
                  <h1>Welcome to the Very Good Travel App</h1>
                  <p>Please select an action:</p>
                  <button onClick={() => handleActionSelection("register")}>
                    Register
                  </button>
                  <button onClick={() => handleAdminSignIn()}>
                    Sign In as an Admin
                  </button>
                  <button onClick={() => handleGuest()}>
                    Continue as a Guest
                  </button>
                  <button onClick={() => handleActionSelection("login")}>
                    Login
                  </button>
                </div>
              )}
              {action === "login" && (
  <div className="form-container">
    <h2 className="form-header">Login</h2>
    <form onSubmit={handleLogin}>
      <label htmlFor="loginEmail">Email:</label>
      <input
        type="email"
        id="loginEmail"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
        required
      />
      <label htmlFor="loginPassword">Password:</label>
      <input
        type="password"
        id="loginPassword"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        required
      />
      <label htmlFor="loginRole">Role:</label>
      <select
        id="loginRole"
        value={loginRole}
        onChange={(e) => setLoginRole(e.target.value)}
        required
      >
        <option value="">Select role</option>
        <option value="admin">Admin</option>
        <option value="tourist">Tourist</option>
        <option value="tourGuide">Tour Guide</option>
        <option value="tourismGovernor">Tourism Governor</option>
        <option value="seller">Seller</option>
        <option value="advertiser">Advertiser</option>
      </select>
      <button type="submit" className="btn">Login</button>
      <button
        type="button"
        className="btn"
        onClick={() => setAction("")}
      >
        Back
      </button>
    </form>
  </div>
)}

              {action === "register" && step === 1 && (
                <div className="form-container">
                  <h2 className="form-header">Register</h2>
                  <form onSubmit={handleProceed}>
                    <label htmlFor="registrationType">
                      Are you registering as an individual or an organization?
                    </label>
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

                    {registrationType === "individual" && (
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
                          <option value="tourismGovernor">
                            Tourism Governor
                          </option>
                        </select>
                      </>
                    )}

                    {registrationType === "organization" && (
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

                    <button type="submit" className="btn proceed-btn">
                      Proceed
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setAction("")}
                    >
                      Back
                    </button>
                  </form>
                </div>
              )}

              {action === "register" && step === 2 && (
                <div className="form-container">
                  <h2 className="form-header">
                    Complete Your {role} Registration
                  </h2>
                  <form onSubmit={handleRegister}>
                    {role === "tourist" && (
                      <>
                        <label htmlFor="username">Username:</label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          required
                        />

                        <label htmlFor="email">Email:</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          onChange={(e) => setEmail(e.target.value)}
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          required
                        />

                        <label htmlFor="mobile">Mobile:</label>
                        <input type="tel" id="mobile" name="mobile" required />

                        <label htmlFor="dob">Date of Birth:</label>
                        <input type="date" id="dob" name="dob" required />

                        <label htmlFor="nationality">Nationality:</label>
                        <input
                          type="text"
                          id="nationality"
                          name="nationality"
                          required
                        />

                        <label htmlFor="job">Job:</label>
                        <input type="text" id="job" name="job" required />

                        <button type="submit" className="btn">
                          Register
                        </button>
                      </>
                    )}

                    {role === "tourGuide" && (
                      <>
                        <label htmlFor="username">Username:</label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          required
                        />

                        <label htmlFor="email">Email:</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          onChange={(e) => setEmailTourGuide(e.target.value)}
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          required
                        />

                        <label htmlFor="mobile">Mobile:</label>
                        <input type="tel" id="mobile" name="mobile" required />

                        <label htmlFor="dob">Date of Birth:</label>
                        <input type="date" id="dob" name="dob" required />

                        <label htmlFor="nationality">Nationality:</label>
                        <input
                          type="text"
                          id="nationality"
                          name="nationality"
                          required
                        />

                        <label htmlFor="experience">Years of Experience:</label>
                        <input
                          type="number"
                          id="experience"
                          name="experience"
                          required
                        />

                        <label htmlFor="previousWork">Previous Job:</label>
                        <input
                          type="text"
                          id="previousWork"
                          name="previousWork"
                          required
                        />

                        <button type="submit" className="btn">
                          Register
                        </button>
                      </>
                    )}

                    {role === "tourismGovernor" && (
                      <>
                        <label htmlFor="username">Username:</label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          required
                        />

                        <label htmlFor="dob">Date of Birth:</label>
                        <input type="date" id="dob" name="dob" required />

                        <label htmlFor="email">Email:</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          onChange={(e) => setEmailTourism(e.target.value)}
                        />

                        <label htmlFor="mobile">Mobile:</label>
                        <input type="tel" id="mobile" name="mobile" required />

                        <label htmlFor="password">Password:</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          required
                        />

                        <label htmlFor="nationality">Nationality:</label>
                        <input
                          type="text"
                          id="nationality"
                          name="nationality"
                          required
                        />

                        <button type="submit" className="btn">
                          Register
                        </button>
                      </>
                    )}

                    {role === "seller" && (
                      <>
                        <label htmlFor="username">Username:</label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          required
                        />

                        <label htmlFor="email">Email:</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          onChange={(e) => setEmailOfSeller(e.target.value)}
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          required
                        />

                        <label htmlFor="description">
                          Business Description:
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          required
                        />

                        <button type="submit" className="btn">
                          Register
                        </button>
                      </>
                    )}

                    {role === "advertiser" && (
                      <>
                        <label htmlFor="username">Username:</label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          required
                        />

                        <label htmlFor="email">Email:</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          onChange={(e) => setEmailOfAdvertiser(e.target.value)}
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          required
                        />

                        <label htmlFor="website">Website Link:</label>
                        <input
                          type="url"
                          id="website"
                          name="website"
                          required
                        />

                        <label htmlFor="hotline">Hotline:</label>
                        <input
                          type="tel"
                          id="hotline"
                          name="hotline"
                          required
                        />

                        <label htmlFor="companyProfile">Company Profile:</label>
                        <textarea
                          id="companyProfile"
                          name="companyProfile"
                          required
                        />

                        <button type="submit" className="btn">
                          Register
                        </button>
                      </>
                    )}
                  </form>
                </div>
              )}
            </>
          }
        />
        {/*what we do here is that we choose the type of user from the drop down menu then according to the choice we render the form specific 
          we should also according to the choice render the upload page then we render the registration forum 
          look , from page guest we should upon pressing an option from the drop down menu come here bu we should skip the part where we are asked to choose the type of the user again since this was already done in the guest page  */ }
          <Route path="/tourist" element={<TouristPage email={emailagain}/>} />
          <Route path="/tourist/preference" element={<PerfrencePage/>} /> 
          <Route path="/Hotelbooking" element={<HotelBookingForm/>} />
          <Route path="/hotelConfirmation" element={<HotelTicket/>} />
          <Route path="/tourist/viewBalance" element={<ViewBalance/>} />
          <Route path="/tourist/viewBookedHotels" element={<ViewBookedHotelOffers />} />
          <Route path="/tourist/viewBookedFlights" element={<ViewBookedFlightOffers />} />
          <Route path="/tourist/SearchHotel" element={<SearchHotel />} />
          <Route path="/tourist/activities" element={<ActivityItinerarySort />} />
          <Route path="/tourist/activity/:id" element={<ActivityDetail />} />
          <Route path="/tourist/itinerary/:id" element={<ItineraryDetail />} />
          <Route path="/tourist/museum/:id" element={<MuseumDetail />} />
          <Route path="/tourist/upcoming" element={<ActivityHistoricalList />} />
          <Route path="/tourist/search" element={<MuseumSearch />} />
          <Route path="/tourist/viewBookedTransportation" element={<ViewBookedTransportationPage />} />
          <Route path="/tourist/bookTransportation" element={<BookTransportationPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/advertiser" element={<LoadScript googleMapsApiKey='AIzaSyAbrhlteb_a1DkS0Jp1tU9fLD5Hi-j2CrA'> <AdvertiserPage email={emailAdvertiser}/> </LoadScript>} />
          <Route path="/tourismGoverner" element={<TourismGovernerPage  email={emailoftourism}/>} />
          <Route path="/tourGuide" element={<TourGuideHomePage email={emailtourguide}/>} />
          <Route path="/seller" element={<SellerPage email={emailofseller}/>} />
          <Route path="/guest" element={<GuestPage />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/tourist/add-address/:touristId" element={<AddingAddress />} />
          <Route path="/tourist/choose-delivery-address/:touristId" element={<DeliveryAddressPage />} />
          <Route path="/tourist/view-my-orders/:touristId" element={<ViewMyOrders />} />
          </Routes>
      </div>
  );
}

export default App;
