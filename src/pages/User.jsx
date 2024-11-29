import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate for back navigation
import { db, getData } from '../config/firebase/firebasemethods';
import { collection, getDocs, query, where } from 'firebase/firestore';

const User = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Back navigation logic

  const [username, setUsername] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch user and blogs
  useEffect(() => {
    getDataFromFirestore();
  }, []);

  async function getDataFromFirestore() {
    setLoading(true);
    try {
      const dataArr = [];
      const q = query(collection(db, 'users'), where('id', '==', id));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        dataArr.push({ ...doc.data(), docid: doc.id });
      });

      if (dataArr.length > 0) {
        setUsername(dataArr[0].fullname || 'Anonymous User');
        console.log('User fetched:', dataArr[0]);
      } else {
        setUsername('Unknown User');
        console.error('User not found in the database.');
        setError(true);
        return;
      }

      // Fetch blogs using `id`
      const userBlogs = await getData('blogs', id);
      console.log('Blogs fetched:', userBlogs);
      setBlogs(userBlogs);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-indigo-600 hover:underline mb-5 ml-[8rem]" // Left margin added
      >
        &lt; Back to All Blogs
      </button>

      {/* Header Section */}
      <div className="max-w-6xl mb-10 ml-[8rem]"> {/* Increased max-width */}
        <h1 className="text-4xl font-bold text-indigo-600">
          {username ? `${username}'s Blogs` : "User's Blogs"}
        </h1>
        <p className="text-gray-600 mt-2">
          Explore the thoughts and writings shared by {username || 'the user'}.
        </p>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-500 font-semibold">
          Failed to load blogs. Please try again later.
        </div>
      )}

      {/* Blogs Section */}
      {!loading && !error && (
        <div className="container ml-[8rem] space-y-6 max-w-4xl">
          {blogs.length > 0 ? (
            blogs.map((item) => (
              <div
                key={item.docid}
                className="flex-1 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {item.description.length > 100
                    ? item.description.slice(0, 100) + '...'
                    : item.description}
                </p>
                <div className="flex justify-start">
                  <button className="btn btn-outline btn-sm">
                    Read More
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center mt-10">
              <h3 className="text-lg text-gray-500">No blogs found!</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default User;
