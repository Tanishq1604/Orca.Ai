import React from "react";
import "./Second.css";
const Second = () => {
  return (
    <>
      <div className="second">
        <img src="/orbital.png" alt="" className="orbital" />
        <div className="left">
          <h1>ORCA AI</h1>
          <h4>
            Meet Your New AI Assistant – Ready to Help, Anytime, Anywhere!
          </h4>
          <h4>
            Ask Anything, Get Instant Answers – Your AI-Powered Companion
            Awaits!
          </h4>
          <h2>
            Experience the future of conversation with our cutting-edge AI. Dive
            into seamless interactions and discover how our assistant can
            simplify your life
          </h2>
          {/* <Link to="/dashboard">Get Started</Link> */}
        </div>
      </div>
    </>
  );
};

export default Second;
