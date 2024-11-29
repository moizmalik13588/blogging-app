import React, { useEffect, useState } from 'react'
import { auth, getAllData } from '../config/firebase/firebasemethods'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getAllData('blogs')
      .then((res) => {
        console.log(res);
        setBlogs(res)
      }).catch((err) => {
        console.log(err);
        setError(true)
      }).finally(() => {
        setLoading(false)
      })
  }, [])

  const navigate = useNavigate()

  const singleUserBlog = (item) => {
    if (!auth.currentUser) {
      console.log('User not logged in.');
      alert('User not logged in.')
      return
    }
    console.log('User logged in.', item);
    navigate(`/user/${item.uid}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-5">
      {/* Hero Section */}
      <div className="mb-8 ml-[8rem]">
        <h1 className="text-4xl font-bold text-gray-800">Good Morning Readers!</h1>
        <p className="mt-2 text-gray-600 text-lg">Catch up with the latest blogs and articles.</p>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="h-[70vh] flex justify-center items-center">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-500 font-semibold">
          Internal server error! Please try again later.
        </div>
      )}

      {/* Blog Cards Section */}
      {!loading && !error && (
        <div className="container ml-[8rem] space-y-6 max-w-4xl">
          {blogs && blogs.map((item) => (
            <div key={item.documentId} className="flex items-start bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
              {/* Author Avatar */}
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 mr-4">
                <img 
                  src={item.authorImage || "https://e7.pngegg.com/pngimages/1008/377/png-clipart-computer-icons-avatar-user-profile-avatar-heroes-black-hair-thumbnail.png"} 
                  alt="Author" 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Blog Content */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h2>
                <p className="text-gray-600 text-sm mb-2">
                  {item.description.length > 150 ? item.description.slice(0, 150) + "..." : item.description}
                </p>
                <p className="text-gray-500 text-sm mb-2">
                  {/* Removed "By Unknown" */}
                  on {new Date(item.timeStamp?.seconds * 1000).toLocaleDateString()}
                </p>

                <button onClick={() => singleUserBlog(item)} className="text-indigo-600 hover:underline text-sm font-medium">
                  See all blogs by this user
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
