import express from "express"; // Importing the express module to create an Express application
import ImageKit from "imagekit"; // Importing ImageKit for image management
import { configDotenv } from "dotenv"; // Importing dotenv to load environment variables
import cors from "cors"; // Importing cors to handle Cross-Origin Resource Sharing
import path from "path"; // Importing path module to work with file and directory paths
import url, { fileURLToPath } from "url"; // Importing url and fileURLToPath for handling file paths
import dbConnect from "./config/dbConnect.js"; // Importing database connection module
import Chat from "./model/chat.js"; // Importing Chat model
import userChat from "./model/userChat.js"; // Importing userChat model
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node"; // Importing Clerk middleware for authentication

// Load environment variables from .env file
configDotenv();

// Determine the directory name of the current module
const __filename = fileURLToPath(import.meta.url); // Get the current file path
const __dirname = path.dirname(__filename); // Get the directory name of the current file

// Define the port to be used by the server, default to 3000
const port = process.env.PORT || 3000;

// Create an instance of Express
const app = express();

// Set up CORS to allow requests from the client
app.use(
  cors({
    origin: ["https://orca-ai-1.onrender.com"], // Allow only this origin to access the server
    methods: ["GET", "POST", "PUT"], // Allow only these methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

// Configure ImageKit with environment variables
const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT, // ImageKit URL endpoint
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY, // ImageKit public key
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY, // ImageKit private key
});

// Connect to the database
dbConnect(); // Establish the database connection

// Middleware to parse JSON bodies
app.use(express.json()); // Parse incoming JSON requests

// Route to get authentication parameters for ImageKit
app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters(); // Get auth parameters from ImageKit
  res.send(result); // Send the auth parameters as response
});

// Route to create a new chat
app.post(
  "/api/chats",
  // Adding authentication middleware
  ClerkExpressRequireAuth(), // Require authentication using Clerk
  async (req, res) => {
    // Extract text from request body and userId from authentication
    const { text } = req.body; // Get the text from the request body
    const userId = req.auth.userId; // Get the userId from the authenticated user
    try {
      // Create a new chat document
      const newChat = new Chat({
        userId: userId, // Associate the chat with the user
        history: [{ role: "user", parts: [{ text }] }], // Initialize chat history with the user message
      });
      const savedChat = await newChat.save(); // Save the chat to the database

      // Check if user chats already exist
      const userChats = await userChat.find({ userId: userId });

      // If user chats do not exist, create a new user chat document and add the chat to the chats array
      if (!userChats.length) {
        const newUserChat = new userChat({
          userId: userId, // Associate the userChat with the user
          chats: [
            {
              _id: savedChat._id, // Add the new chat's ID
              title: text.substring(0, 40), // Set the chat title as the first 40 characters of the text
              createdAt: savedChat.createdAt, // Set the creation date of the chat
            },
          ],
        });
        await newUserChat.save(); // Save the userChat to the database
      } else {
        // If user chats exist, push the new chat to the existing array
        await userChat.updateOne(
          { userId: userId }, // Find the userChat by userId
          {
            $push: {
              chats: { _id: savedChat._id, title: text.substring(0, 40) }, // Push the new chat to the chats array
            },
          }
        );
      }
      // Send the new chat ID as response
      res.status(201).send(newChat._id); // Respond with the new chat's ID
    } catch (error) {
      console.log(error); // Log any errors
      res.status(500).send("Error creating chat"); // Respond with an error message
    }
  }
);

// Route to get user chats
app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId; // Get the userId from the authenticated user
  try {
    const userChats = await userChat.find({ userId }); // Find the userChats by userId
    res.status(200).send(userChats[0].chats); // Send the chats array of the first userChat document
  } catch (error) {
    console.log(error); // Log any errors
    res.status(500).send("Error creating user chat"); // Respond with an error message
  }
});

// Route to get a specific chat by ID
app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId; // Get the userId from the authenticated user
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId }); // Find the chat by ID and userId
    res.status(200).send(chat); // Send the chat document
  } catch (error) {
    console.log(error); // Log any errors
    res.status(500).send("Error fetching chats"); // Respond with an error message
  }
});

// Route to update a chat by ID
app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId; // Get the userId from the authenticated user
  const { question, answer, img } = req.body; // Get the question, answer, and img from the request body

  // Construct new items to be added to the chat history
  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []), // Add user question if present, including image if provided
    { role: "model", parts: [{ text: answer }] }, // Add model's answer
  ];
  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId }, // Find the chat by ID and userId
      {
        $push: {
          history: {
            $each: newItems, // Push the new items to the chat history
          },
        },
      }
    );
    res.status(200).send(updatedChat); // Send the updated chat
  } catch (error) {
    console.log(error); // Log any errors
    res.status(500).send("Error fetching chats"); // Respond with an error message
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack
  res.status(401).send("Unauthenticated!"); // Respond with an unauthenticated message
});

// Default route
app.get("/", (req, res) => {
  res.json("Hello world this is orca ai!!"); // Send a simple JSON response
});

// Start the server
app.listen(port, () => {
  console.log("server running"); // Log a message when the server starts
});
