import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import User from "./pages/User.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Layout wrapper for all routes
    children: [
      {
        path: "",
        element: <Home />, // Public route for Home
      },
      {
        path: "login",
        element: <Login />, // Public route for Login
      },
      {
        path: "register",
        element: <Register />, // Public route for Register
      },
      {
        path: "dashboard",
        element: <ProtectedRoutes component={<Dashboard />} />, // Protected route
      },
      {
        path: "profile",
        element: <ProtectedRoutes component={<Profile />} />, // Protected route
      },
      {
        path: "user/:id",
        element: <ProtectedRoutes component={<User />} />, // Protected route
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
