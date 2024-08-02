import React, { useEffect, useRef, useState } from "react"; // Importing React and necessary hooks
import "./NewPrompt.css"; // Importing CSS for styling
import Upload from "../upload/Upload.jsx"; // Importing Upload component for handling file uploads
import { IKImage } from "imagekitio-react"; // Importing IKImage for image handling
import model from "../../lib/gemini.js"; // Importing the AI model for generating responses
import Markdown from "react-markdown"; // Importing Markdown component to render markdown content
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Importing React Query hooks for data fetching and mutation

const NewPrompt = ({ data }) => {
  // Local state to manage question, answer, and image data
  const [que, setque] = useState(""); // State for storing user question
  const [ans, setans] = useState(""); // State for storing AI response
  const [image, setimage] = useState({
    isLoading: false, // Flag to indicate if an image is being loaded
    error: "", // Error message for image loading
    dbData: {}, // Image data from the database
    aiData: {}, // Image data from AI
  });

  // Initialize the AI chat model with predefined history
  const chat = model.startChat({
    history: [
      {
        role: "user", // Role of the user in the conversation
        parts: [{ text: "Hello, I have 2 dogs in my house." }], // Initial user message
      },
      {
        role: "model", // Role of the AI model
        parts: [{ text: "Great to meet you. What would you like to know?" }], // Initial AI response
      },
    ],
    generationConfig: {
      // Configuration for AI generation (currently not used)
      // maxOutputTokens: 100,
    },
  });

  const endRef = useRef(); // Ref for scrolling to the end of the chat
  const inputRef = useRef(); // Ref for the input field

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to the end of the chat when data, question, answer, or image changes
  }, [data, que, ans, image.dbData]);

  const queryClient = useQueryClient(); // Create a QueryClient instance for managing server state
  // Mutation function to update chat data in the database
  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT", // HTTP method to update data
        credentials: "include", // Include cookies in the request
        headers: { "Content-Type": "application/json" }, // Set content type to JSON
        body: JSON.stringify({
          question: que.length ? que : undefined, // Include question if it exists
          answer: ans, // Include answer
          img: image.dbData?.filePath || undefined, // Include image file path if it exists
        }),
      }).then((res) => res.json()); // Parse the response as JSON
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] }) // Invalidate the query to refetch data
        .then(() => {
          setque(""); // Clear the question state
          setans(""); // Clear the answer state
          setimage({ isLoading: false, error: "", dbData: {}, aiData: {} }); // Clear the image state (commented out)
          if (inputRef.current) inputRef.current.value = ""; // Clear the input field
        });
    },
    onError: (error) => {
      console.log(error); // Log any errors
    },
  });

  // Function to get response from the AI model
  async function add(text, isInitial) {
    if (!isInitial) setque(text); // Update question state if not initial
    try {
      const result = await chat.sendMessageStream(
        Object.entries(image.aiData).length ? [image.aiData, text] : [text] // Pass AI data and text to the chat
      );
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text(); // Extract text from each chunk
        // console.log(chunkText); // Log the text for debugging
        accumulatedText += chunkText; // Accumulate the text
        setans(accumulatedText); // Update answer state with accumulated text
      }
      mutation.mutate(); // Trigger mutation to update the database
    } catch (error) {
      console.log(error); // Log any errors
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const text = e.target.text.value; // Get the value from the input field
    if (!text) return; // Return if no text is provided
    await add(text, true); // Call add function with the text and initial flag
  };

  // Ensure add function runs only once for initial data
  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true); // Add initial message if history length is 1
      }
    }
    hasRun.current = true; // Set hasRun to true after first run
  }, []);

  return (
    <>
      {image.isLoading && <div className="loader"></div>}{" "}
      {/* Display loading message if image is loading */}
      {image.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT} // ImageKit URL endpoint
          path={image.dbData?.filePath} // Path to the image
          width="380" // Set image width
          // transformation={{ width: 380 }} // Apply image transformation
        />
      )}
      {que && <div className="message user">{que}</div>}{" "}
      {/* Display user question if exists */}
      {ans && (
        <div className="message">
          <Markdown>{ans}</Markdown> {/* Render AI response as Markdown */}
        </div>
      )}
      <div className="newPrompt" ref={endRef}>
        <form action="" className="newForm" onSubmit={handleSubmit}>
          <Upload setimage={setimage} />{" "}
          {/* Upload component for image upload */}
          <input type="file" multiple={false} id="file" hidden />{" "}
          {/* Hidden file input */}
          <input
            type="text"
            name="text"
            placeholder="Ask Me Anything..."
            ref={inputRef} // Ref for the input field
          />
          <button className="btn">
            <img src="/arrow.png" alt="" />{" "}
            {/* Button for submitting the form */}
          </button>
        </form>
      </div>
    </>
  );
};

export default NewPrompt;
