import React from "react";
import { Link } from "react-router-dom";
import "./Chat_list.css";
import { useQuery } from "@tanstack/react-query";

const Chat_list = () => {
  // Fetching user chats data from the API
  const { isLoading, error, data } = useQuery({
    queryKey: ["userchats"], // Key for the query cache
    queryFn: () =>
      fetch(`https://orca-ai-q9xm.onrender.com/api/userchats`, {
        credentials: "include", // Include cookies for authentication
      }).then((res) => res.json()), // Convert response to JSON
  });

  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      {/* Links for navigation */}
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Explore Orca AI</Link>
      <a href="https://main-portfolio-lovat.vercel.app/">Contact Us</a>
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        {isLoading
          ? "Loading..." // Show loading message while data is being fetched
          : error
          ? "Something went wrong" // Show error message if there is an error
          : data
              ?.slice() // Make a copy of data
              .reverse() // Reverse the order of the data
              .map((chat) => (
                <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                  {chat.title} {/* Display chat title */}
                </Link>
              ))}
      </div>
      <hr />
      <div className="upgrade">
        <img src="/orca-logo.png" alt="" /> {/* Display logo */}
        <div className="texts">
          <span>Upgrade to Lama AI Pro</span>
          <span>Get unlimited access to all features</span>
        </div>
      </div>
    </div>
  );
};

export default Chat_list;
