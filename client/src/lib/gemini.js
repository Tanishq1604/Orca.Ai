import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai"; // Importing necessary modules from the Google Generative AI package

// Define safety settings to block certain categories of harmful content
const safetySetting = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT, // Setting the category to harassment
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE, // Blocking content with a low threshold and above
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, // Setting the category to hate speech
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE, // Blocking content with a low threshold and above
  },
];

// Instantiate the Google Generative AI client using the API key from environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_PUBIC_KEY); // Note: there seems to be a typo in 'VITE_GEMINI_PUBIC_KEY'. It should likely be 'VITE_GEMINI_PUBLIC_KEY'.

// Get the generative model from the client with the specified safety settings
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Specify the model to be used
  safetySetting, // Apply the safety settings defined earlier
});

export default model; // Export the model to be used in other parts of the application
