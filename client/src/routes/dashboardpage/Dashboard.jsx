import React from "react"; // Importing React to create the component
import "./Dashboard.css"; // Importing the CSS file for styling the Dashboard component
import { useQueryClient } from "@tanstack/react-query"; // Importing useQueryClient hook from React Query for query management
import { useMutation } from "@tanstack/react-query"; // Importing useMutation hook from React Query for handling mutations
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook for navigation
import { BACK_URL } from "../../../url";

// Defining the Dashboard functional component
const Dashboard = () => {
  const queryClient = useQueryClient(); // Initializing query client for managing queries
  const navigate = useNavigate(); // Initializing navigate function for navigation

  // Defining the mutation for creating a new chat
  const mutation = useMutation({
    mutationFn: (text) => {
      // Mutation function to create a new chat by sending a POST request to the server
      return fetch(`${BACK_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }), // Sending the text from the form as the request body
      }).then((res) => res.json()); // Parsing the response as JSON
    },
    onSuccess: (id) => {
      // Function to be called on successful mutation
      queryClient.invalidateQueries({ queryKey: ["userchats"] }); // Invalidate userchats query to refresh the data
      navigate(`/dashboard/chats/${id}`); // Navigate to the newly created chat's page
    },
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const text = e.target.text.value; // Get the text from the form input
    if (!text) return; // If text is empty, do nothing
    mutation.mutate(text); // Trigger the mutation with the text
  };

  return (
    <div className="dashboardPage">
      <div className="ai">Orca Ai</div> {/* AI label */}
      <div className="texts">
        <div className="logo">
          <img src="/orca-logo.png" alt="" /> {/* ORCA logo */}
          <h1>Orca AI</h1> {/* ORCA AI heading */}
        </div>
        <div className="options">
          {/* Option to create a new chat */}
          <div className="option">
            <img src="/chat.png" alt="" /> {/* Chat icon */}
            <span>Create a New Chat</span> {/* Option label */}
          </div>
          {/* Option to analyze images */}
          <div className="option">
            <img src="/image.png" alt="" /> {/* Image icon */}
            <span>Analyze Images</span> {/* Option label */}
          </div>
          {/* Option to get help with code */}
          <div className="option">
            <img src="/code.png" alt="" /> {/* Code icon */}
            <span>Help me with my Code</span> {/* Option label */}
          </div>
        </div>
      </div>
      {/* Form to create a new chat */}
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder="Ask me anything..." />{" "}
          {/* Input field */}
          <button>
            <img src="/arrow.png" alt="" />{" "}
            {/* Submit button with arrow icon */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard; // Exporting the Dashboard component to be used in other parts of the application
