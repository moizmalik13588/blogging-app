import React, { useRef } from 'react';
import { loginUser } from '../config/firebase/firebasemethods';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();

  const loginUsers = (event) => {
    event.preventDefault();
    loginUser({
      email: email.current.value,
      password: password.current.value,
    })
      .then((res) => {
        console.log('User logged in successfully:', res);
        navigate('/');
      })
      .catch((err) => {
        console.error('Error logging in:', err);
      });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form
        onSubmit={loginUsers}
        className="bg-white p-8 rounded-md shadow-md w-full max-w-sm"
      >
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
            ref={email}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
            ref={password}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
