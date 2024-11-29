import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Link } from "react-router-dom";

function register() {
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const PA = import.meta.env.VITE_PUBLIC_FOLDER;

  const handleShowPass = (e) => {
    e.preventDefault();
    setShowPass((prev) => !prev);
  };

  const handleShowCPass = (e) => {
    e.preventDefault();
    setShowCPass((prev) => !prev);
  };

  const username = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.current.value != confirmPassword.current.value) {
      confirmPassword.current.setCustomValidity("password don't match!");
    } else {
      confirmPassword.current.setCustomValidity("");
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };

      try {
        await axios.post( `${PA}/api/auth/register`, user);
        navigate("/login");
      } catch (error) {
        alert("Registration failed. Please try again!");
        console.error(error);
      }
    }
  };

  return (
    <div className="w-full h-screen bg-gray-200 flex justify-center items-center gap-8 ">
      <div className=" w-[500px] ">
        <h1 className="text-textColor text-5xl font-bold">Social</h1>
        <p className="text-2xl ">
          connect with friends and the world arround you on Social
        </p>
      </div>
      <div className="bg-white w-[500px] h-[380px] rounded-xl flex justify-center items-center">
        <form
          className="flex flex-col gap-4 py-7 w-[400px]"
          onSubmit={handleRegister}
        >
          <input
            required
            type="text"
            ref={username}
            placeholder="Username"
            className="border placeholder-gray-500 border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:border-gray-500"
          />
          <input
            required
            type="Email"
            ref={email}
            placeholder="Email"
            className="placeholder-gray-500 border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-gray-500"
          />
          <div className="relative">
            <input
              required
              ref={password}
              type={!showPass ? "password" : "text"}
              placeholder="Password"
              className="placeholder-gray-500 border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-gray-500 w-full"
            />
            <button
              onClick={handleShowPass}
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {!showPass ? (
                <i className="ri-eye-off-fill"></i>
              ) : (
                <i className="ri-eye-fill"></i>
              )}
            </button>
          </div>

          <div className="relative ">
            <input
              required
              ref={confirmPassword}
              type={!showCPass ? "password" : "text"}
              placeholder="Confirm Password"
              className="placeholder-gray-500 border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-gray-500 w-full"
            />

            <button
              onClick={handleShowCPass}
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {!showCPass ? (
                <i className="ri-eye-off-fill"></i>
              ) : (
                <i className="ri-eye-fill"></i>
              )}
            </button>
          </div>
          <div className="flex items-center justify-center">
            <Link
              to="/login"
              className="cursor-pointer text-textColor hover:text-blue-800 list-none"
            >
              Already have an account?
            </Link>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white text-lg px-4 py-3 rounded-md hover:bg-blue-600 transition duration-200 flex justify-center items-center"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
export default register;
