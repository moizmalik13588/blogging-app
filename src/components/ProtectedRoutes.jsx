import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase/firebasemethods";

const ProtectedRoutes = ({ component }) => {
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [user, setUser] = useState(null); // Track user state

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user if authenticated
      } else {
        navigate("/login"); // Redirect to login if not authenticated
      }
      setIsLoading(false); // Stop loading after auth check
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [navigate]);

  if (isLoading) {
    return <h1 className="text-center mt-20">Loading...</h1>; // Show a spinner or loader
  }

  return user ? component : null; // Render the component if user exists
};

export default ProtectedRoutes;
