import React, { useState } from "react"; // Importing React and useState hook to create the component and manage state
import "./Home.css"; // Importing the CSS file for styling the Home component
import { Link } from "react-router-dom"; // Importing Link component from React Router for navigation
import { TypeAnimation } from "react-type-animation"; // Importing TypeAnimation for text animations
import Second from "../../components/Second/Second.jsx"; // Importing Second component
import Footer from "../../components/footer/Footer.jsx"; // Importing Footer component

// Defining the Home functional component
const Home = () => {
  const [typingStatus, setTypingStatus] = useState("human1"); // State to track the current typing status

  return (
    <>
      {/* Main container for the home page */}
      <div className="home">
        <img src="/orbital.png" alt="" className="orbital" /> {/* Background orbital image */}
        
        {/* Left section of the home page */}
        <div className="left">
          <h1>ORCA AI</h1> {/* Main heading */}
          <h2>Supercharge your creativity and productivity</h2> {/* Subheading */}
          <h3>
            Unlock the next generation of dialogue with our advanced AI. Engage
            in effortless conversations and explore how our assistant can
            transform your daily tasks.
          </h3> {/* Description */}
          <Link to="/dashboard">Get Started</Link> {/* Link to the dashboard */}
        </div>
        
        {/* Right section of the home page */}
        <div className="right">
          <div className="imgContainer">
            <div className="bgContainer">
              <div className="bg"></div> {/* Background element */}
            </div>
            <img src="/bot.png" alt="" className="bot" /> {/* Bot image */}
            
            {/* Chat simulation section */}
            <div className="chat">
              <img
                src={
                  typingStatus === "human1"
                    ? "./human1.jpeg"
                    : typingStatus === "human2"
                    ? "./human2.jpeg"
                    : "./bot.png"
                } // Conditional rendering of the chat image based on typingStatus
                alt=""
              />
              <TypeAnimation
                sequence={[
                  "Human:We produce food for Mice",
                  2000,
                  () => {
                    setTypingStatus("bot"); // Set typing status to bot
                  },
                  "Bot:We produce food for Hamsters",
                  2000,
                  () => {
                    setTypingStatus("human2"); // Set typing status to human2
                  },
                  "Human2:We produce food for Guinea Pigs",
                  2000,
                  () => {
                    setTypingStatus("bot"); // Set typing status to bot
                  },
                  "Bot:We produce food for Chinchillas",
                  2000,
                  () => {
                    setTypingStatus("human1"); // Set typing status to human1
                  },
                ]}
                wrapper="span" // Wrapper element for the animation
                repeat={Infinity} // Repeat the animation indefinitely
                cursor={true} // Show cursor during typing
                omitDeletionAnimation={true} // Omit the deletion animation
              />
            </div>
          </div>
        </div>
        
        {/* Terms and social media links section */}
        <div className="terms">
          <img
            src="/orca-logo.png"
            alt=""
            style={{ width: "50px", height: "50px", borderRadius: "50%" }} // ORCA logo
          />
          <div className="links">
            <Link to="/">Terms of Service</Link> {/* Link to Terms of Service */}
            <span>|</span>
            <Link to="/">Privacy Policy</Link> {/* Link to Privacy Policy */}
          </div>
          <div className="li">
            <a href="https://github.com/Akgithhub">
              <img src="./github.png" alt="" /> {/* GitHub icon */}
            </a> 
            <a href="https://www.linkedin.com/in/web-devloper-amaan-khan/">
              <img src="./linkedin.png" alt="" /> {/* LinkedIn icon */}
            </a>
            <a href="mailto:ak08118967@gmail.com">
              <img src="./mail.png" alt="" /> {/* Email icon */}
            </a>
          </div>
        </div>
      </div>
      
      {/* Uncomment these lines if Second and Footer components are needed */}
      {/* <Second />
      <Footer /> */}
    </>
  );
};

export default Home; // Exporting the Home component to be used in other parts of the application
