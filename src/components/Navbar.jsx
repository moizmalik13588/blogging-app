import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOutUser } from "../config/firebase/firebasemethods";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null); // Track logged-in user
  const [dropdownVisible, setDropdownVisible] = useState(false); // Toggle dropdown
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User data:", currentUser); // Debug user data
        console.log(currentUser)
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOutUser()
      .then(() => {
        setUser(null); // Clear user state after logout
        navigate("/login"); // Redirect to login page
      })
      .catch((error) => console.log(error));
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <nav className="navbar bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold hover:text-gray-200 ml-[8rem]">
          Blogging App
        </Link>

        {/* User Section */}
        {user ? (
          <div className="relative">
            {/* Display Registered Name */}
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 text-white font-medium hover:text-gray-200 focus:outline-none"
            >
              {user.email || "User"}  {/* Fallback to Anonymous User */}
            </button>

            {/* Dropdown Menu */}
            {dropdownVisible && (
              <ul className="absolute right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-md w-40">
                <li>
                  <Link
                    to="/"
                    className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="btn btn-sm btn-outline border-white text-white hover:bg-white hover:text-blue-600"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
