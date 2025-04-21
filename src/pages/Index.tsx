import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Login from "./Login";

const Index = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    // If this is the first load, clear any existing login state
    if (!sessionStorage.getItem("appInitialized")) {
      localStorage.removeItem("isLoggedIn");
      sessionStorage.setItem("appInitialized", "true");
    }
  }, []);

  // If user is logged in, redirect to dashboard
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise show login page
  return <Login />;
};

export default Index;
