import {
  auth,
  deleteDocument,
  getData,
  sendData,
  updateDocument,
} from "../config/firebase/firebasemethods";
import React, { useEffect, useState, useRef } from "react";
import { Timestamp } from "firebase/firestore"; // Ensure Timestamp is imported

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editDocId, setEditDocId] = useState(null);

  const title = useRef();
  const description = useRef();

  // Fetch blogs on component mount
  useEffect(() => {
    getData("blogs", auth.currentUser.uid)
      .then((res) => setData(res))
      .catch((err) => console.log("Error fetching blogs:", err));
  }, []);

  // Function to handle publish or update
  const postBlog = async (event) => {
    event.preventDefault();
  
    const blogTitle = title.current.value.trim();
    const blogDescription = description.current.value.trim();
  
    if (!blogTitle || !blogDescription) {
      alert("Both title and description are required!");
      return;
    }
  
    const newBlog = {
      title: blogTitle,
      description: blogDescription,
      uid: auth.currentUser.uid,
      timeStamp: Timestamp.fromDate(new Date()),
    };
  
    if (isEditing) {
      // Update existing blog
      try {
        await updateDocument(editDocId, "blogs", newBlog);
        
        // Update the blog in the state
        setData((prevData) =>
          prevData.map((blog) =>
            blog.docid === editDocId ? { ...blog, ...newBlog } : blog
          )
        );
  
        resetForm();
        alert("Blog updated successfully!");
      } catch (err) {
        console.error("Error updating blog:", err);
        alert("Failed to update blog. Please try again.");
      }
    } else {
      // Create new blog
      try {
        const docId = await sendData(newBlog, "blogs");
        const blogWithId = { ...newBlog, docid: docId };
        setData((prevData) => [...prevData, blogWithId]);
        resetForm();
        alert("Blog published successfully!");
      } catch (err) {
        console.error("Error creating blog:", err);
        alert("Failed to publish blog. Please try again.");
      }
    }
  };
  

  // Function to load blog data into form for editing
  const editBlog = (blog) => {
    title.current.value = blog.title;
    description.current.value = blog.description;
    setEditDocId(blog.docid); // Correctly set docid
    setIsEditing(true); // Activate edit mode
  };
  

  // Function to reset the form
  const resetForm = () => {
    title.current.value = "";
    description.current.value = "";
    setIsEditing(false);
    setEditDocId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Blog Form */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {isEditing ? "Edit Blog" : "Publish Blog"}
        </h2>
        <form>
          <input
            type="text"
            placeholder="Blog Title"
            ref={title}
            className="input input-bordered w-full mb-4 p-3 rounded-md"
          />
          <textarea
            placeholder="What is in your mind"
            ref={description}
            className="textarea textarea-bordered w-full mb-4 p-3 rounded-md"
          ></textarea>
          <button
            type="submit"
            onClick={postBlog}
            className="bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition"
          >
            {isEditing ? "Update Blog" : "Publish Blog"}
          </button>
        </form>
      </div>

      {/* My Blogs */}
      <div className="max-w-3xl mx-auto mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Blogs</h2>
        <div className="flex flex-col gap-4">
          {data.length > 0 ? (
            data.map((item) => (
              <div
                key={item.docid}
                className="bg-white p-5 rounded-lg shadow-md flex flex-col gap-2"
              >
                <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                <div className="flex gap-4 mt-4">
                  <button
                    className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition"
                    onClick={() => editBlog(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
                    onClick={() =>
                      deleteDocument(item.docid, "blogs").then(() =>
                        setData((prevData) =>
                          prevData.filter((blog) => blog.docid !== item.docid)
                        )
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No blogs found. Publish your first blog!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
