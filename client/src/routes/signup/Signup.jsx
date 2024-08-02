import React from "react"; // Importing React to create the component
import "./Signup.css"; // Importing the CSS file for styling the Signup component
import { SignUp } from "@clerk/clerk-react"; // Importing the SignUp component from Clerk for user authentication

// Defining the Signup functional component
const Signup = () => {
  return (
    <div className="signup"> {/* A div container with a class name for styling */}
      <SignUp 
        path="/sign-up" // Path for the sign-up process
        signInUrl="/sign-in" // URL to redirect to if the user needs to sign in
        forceRedirectUrl={"/dashboard"} // URL to redirect to after successful sign-up
      />
    </div>
  );
};

export default Signup; // Exporting the Signup component to be used in other parts of the application
