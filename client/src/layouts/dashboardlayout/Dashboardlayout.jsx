import { useAuth } from "@clerk/clerk-react"; // Importing useAuth hook for authentication management
import React, { useEffect } from "react"; // Importing React and useEffect hook
import { Outlet, useNavigate } from "react-router-dom"; // Importing Outlet for nested routes and useNavigate for navigation
import Chat_list from "../../components/chatlist/Chat_list.jsx"; // Importing Chat_list component for displaying chat options
import "./Dashboard.css"; // Importing CSS for styling
import Second from "../../components/Second/Second.jsx"; // Importing Second component (currently commented out)
import Footer from "../../components/footer/Footer.jsx"; // Importing Footer component (currently commented out)

const Dashboardlayout = () => {
  // Our Protected Routes to prevent users from accessing the dashboard page without logging in
  const { userId, isLoaded } = useAuth(); // Destructuring userId and isLoaded from useAuth hook
  const navigate = useNavigate(); // Hook for programmatic navigation

  useEffect(() => {
    // Effect to redirect to sign-in page if user is not authenticated
    if (isLoaded && !userId) {
      navigate("/sign-in"); // Redirect to sign-in page if userId is not present
    }
  }, [isLoaded, userId, navigate]); // Dependencies array: effect runs when isLoaded, userId, or navigate change

  if (!isLoaded) return "Loading..."; // Render loading message if authentication state is not yet loaded

  return (
    <div className="dashboardlayout">
      <div className="menu">
        {/* Render Chat_list component for displaying chat options */}
        <Chat_list />
      </div>
      <div className="content">
        {/* Render nested routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboardlayout;
