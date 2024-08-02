import React from "react"; // Importing React to create the component
import "./Signin.css"; // Importing the CSS file for styling the Signin component
import { SignIn } from "@clerk/clerk-react"; // Importing the SignIn component from Clerk for user authentication

// Defining the Signin functional component
const Signin = () => {
  return (
    <div className="signin"> {/* A div container with a class name for styling */}
      <SignIn 
        path="/sign-in" // Path for the sign-in process
        signUpUrl="/sign-up" // URL to redirect to if the user needs to sign up
        forceRedirectUrl={"/dashboard"} // URL to redirect to after successful sign-in
      />
    </div>
  );
};

export default Signin; // Exporting the Signin component to be used in other parts of the application
