import React, { useEffect, useRef } from "react"; // Importing necessary hooks and React
import "./Chat.css"; // Importing CSS for styling the Chat component
import NewPrompt from "../../components/newPrompt/NewPrompt.jsx"; // Importing NewPrompt component
import { useQuery } from "@tanstack/react-query"; // Importing useQuery hook from React Query for data fetching
import { useLocation } from "react-router-dom"; // Importing useLocation hook for accessing the current URL
import Markdown from "react-markdown"; // Importing Markdown component for rendering markdown text
import { IKImage } from "imagekitio-react"; // Importing IKImage component for handling images with ImageKit
import { BACK_URL } from "../../../url.js";

const Chat = () => {
  const path = useLocation().pathname; // Getting the current path from the URL
  const chatId = path.split("/").pop(); // Extracting the chat ID from the URL

  // Using useQuery to fetch chat data based on the chat ID
  const { isLoading, error, data } = useQuery({
    queryKey: ["chat", chatId], // Unique query key
    queryFn: () =>
      fetch(`${BACK_URL}/api/chats/${chatId}`, {
        credentials: "include", // Including credentials in the request
      }).then((res) => res.json()), // Parsing the response as JSON
  });

  // Using ref hook and useEffect to scroll to the last message automatically
  const endRef = useRef(); // Creating a ref for the end of the chat
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to the end of the chat smoothly
  }, [data]); // Run the effect only when `data` changes

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {isLoading // Display loading message if data is still loading
            ? "Loading..."
            : error // Display error message if there is an error
            ? "Something went wrong"
            : data?.history?.map((message, index) => (
                // Mapping over the chat history and displaying each message
                <React.Fragment key={index}>
                  {message.img && (
                    // If the message contains an image, display it using IKImage
                    <IKImage
                      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT} // URL endpoint from environment variables
                      path={message.img} // Path of the image
                      height={300} // Height of the image
                      width={400} // Width of the image
                      transformation={[{ height: 300, width: 400 }]} // Transformation parameters
                      loading="lazy" // Lazy loading the image
                      lgip={{ active: true, quality: 20 }} // Low-quality image placeholder settings
                    />
                  )}
                  <div
                    className={
                      message.role === "user" ? "message user" : "message"
                    } // Assigning different classes based on the message role
                  >
                    {/* Rendering the message text as Markdown */}

                    <Markdown>{message.parts[0].text}</Markdown>
                  </div>
                </React.Fragment>
              ))}
          {/* Displaying the NewPrompt component if data exis */}
          {data && <NewPrompt data={data} />}
          {/* Ref for scrolling to the end of the chat */}
          <div ref={endRef}></div>
        </div>
      </div>
    </div>
  );
};

export default Chat; // Exporting the Chat component to be used in other parts of the application
