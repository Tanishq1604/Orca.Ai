import React from "react";
import { Link, Outlet } from "react-router-dom"; // Importing Link and Outlet from react-router-dom for navigation
import "./Root.css"; // Importing CSS for styling
import { ClerkProvider } from "@clerk/clerk-react"; // Importing ClerkProvider for authentication
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Importing QueryClient and QueryClientProvider for React Query
import { SignedIn, UserButton } from "@clerk/clerk-react"; // Importing SignedIn and UserButton components from Clerk

// Import the publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key"); // Throw an error if the publishable key is missing
}

// Create a new QueryClient instance for managing server state
const queryClient = new QueryClient();

const Root = () => {
  return (
    <>
      {/* Wrapping the application in ClerkProvider for authentication */}
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        {/* Wrapping the application in QueryClientProvider for React Query */}
        <QueryClientProvider client={queryClient}>
          <div className="rootlayout">
            <header>
              {/* Link to the home page with a logo */}
              <Link to={"/"} className="logo">
                <img id="orca" src={"/orca-logo.png"} alt="" />
                <span>Orca.Ai</span>
              </Link>
              <div className="user">
                {/* Show the user button if the user is signed in */}
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </header>
            <main>
              {/* Outlet for nested routes */}
              <Outlet />
            </main>
          </div>
        </QueryClientProvider>
      </ClerkProvider>
    </>
  );
};

export default Root;
