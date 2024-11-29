import React, { useRef } from 'react';
import { signUpUser } from '../config/firebase/firebasemethods';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const fullName = useRef();
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();

  const registerUser = (event) => {
    event.preventDefault();
    signUpUser({
      email: email.current.value,
      password: password.current.value,
      fullname: fullName.current.value,
    })
      .then((res) => {
        console.log('User registered successfully:', res);
        navigate('/login');
      })
      .catch((err) => {
        console.error('Error registering user:', err);
      });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Signup</h1>
      <form
        onSubmit={registerUser}
        className="bg-white p-8 rounded-md shadow-md w-full max-w-sm"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="First Name"
            className="input input-bordered w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
            ref={fullName}
          />
        </div>
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
          Signup
        </button>
      </form>
    </div>
  );
};

export default Register;
