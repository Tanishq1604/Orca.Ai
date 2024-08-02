import React from "react"; // Importing React to create components
import ReactDOM from "react-dom/client"; // Importing ReactDOM to render the application
import "./index.css"; // Importing global CSS styles
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // Importing React Router for routing

// Importing page components
import Home from "./routes/homepage/Home.jsx"; // Home page component
import Dashboard from "./routes/dashboardpage/Dashboard.jsx"; // Dashboard page component
import Chat from "./routes/chatpage/Chat.jsx"; // Chat page component
import Dashboardlayout from "./layouts/dashboardlayout/Dashboardlayout.jsx"; // Dashboard layout component
import Root from "./layouts/rootlayout/Root.jsx"; // Root layout component
import Signin from "./routes/signinpage/Signin.jsx"; // Sign-in page component
import Signup from "./routes/signup/Signup.jsx"; // Sign-up page component

// Importing other components
import Second from "./components/Second/Second.jsx"; // Second component (not used in the router)
import Footer from "./components/footer/Footer.jsx"; // Footer component (not used in the router)

// Create the router configuration
const router = createBrowserRouter([
  {
    element: <Root />, // Root layout component to be rendered at the root level
    children: [
      {
        path: "/", // Root path
        element: <Home />, // Home component to be rendered at the root path
      },
      {
        path: "/sign-in", // Path for sign-in page
        element: <Signin />, // Sign-in component to be rendered
      },
      {
        path: "/sign-up", // Path for sign-up page
        element: <Signup />, // Sign-up component to be rendered
      },
      {
        element: <Dashboardlayout />, // Dashboard layout component to be rendered for dashboard paths
        children: [
          {
            path: "/dashboard", // Path for dashboard
            element: <Dashboard />, // Dashboard component to be rendered
          },
          {
            path: "/dashboard/chats/:id", // Path for specific chat in the dashboard
            element: <Chat />, // Chat component to be rendered
          },
        ],
      },
    ],
  },
]);

// Render the application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {" "}
    {/* // StrictMode is a tool for highlighting potential problems in the */}
    {/* application */}
    <RouterProvider router={router} />
    {/* // RouterProvider to provide the routing
    configuration to the application */}
  </React.StrictMode>
);
