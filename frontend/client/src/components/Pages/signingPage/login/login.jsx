import { useContext, useState, useRef } from "react";
import { loginCall } from "../../../../apiCalls";
import { UserContext } from "../../../context/UserContext";
// import { CircularProgress } from "@mui/material";
// import { Link } from "react-router-dom";
import loginBg from "../../../../../assets/images/loginBg.jpg";
import { Link } from "react-router-dom";

function login() {
  const [showPass, setShowPass] = useState(false);
  const email = useRef();
  const password = useRef();
  const { user, isFetching, error, dispatch } = useContext(UserContext);

  const handleShowPass = (e) => {
    e.preventDefault();
    setShowPass((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  return (
    <div className="min-h-screen flex flex-row-reverse bg-gray-50">
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-1/2 p-8 bg-white rounded-l-lg shadow-lg flex flex-col justify-center relative space-y-6">
        {/* Form Heading */}
        <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
          Welcome Back!
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          {/* Email Input */}
          <div className="relative">
            <input
              ref={email}
              type="email"
              id="email"
              placeholder="Email"
              className="w-full p-3 focus:placeholder-transparent border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all peer"
            />
            {/* Password Label */}
            <label
              htmlFor="password"
              className="absolute text-blue-500 bg-white px-2 left-2 top-1/2 transform -translate-y-1/2  text-md peer-focus:tranform peer-focus:-translate-y-[39px] peer-focus:block z-999 hidden"
            >
              Email
            </label>
            <i className="ri-mail-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          {/* Password Input */}
          <div className="relative">
            <input
              required
              ref={password}
              type={!showPass ? "password" : "text"}
              id="Password"
              placeholder="Password"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all pr-12 focus:placeholder-transparent peer"
            />
            {/* Password Label */}
            <label
              htmlFor="Passworda"
              className="absolute  text-blue-500 bg-white px-2 left-2 top-1/2 transform -translate-y-1/2  text-md peer-focus:tranform peer-focus:-translate-y-[39px] peer-focus:block z-999 hidden"
            >
              Password
            </label>

            {/* Show/Hide Password Button */}
            <button
              onClick={handleShowPass}
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Toggle password visibility"
            >
              {!showPass ? (
                <i className="ri-eye-off-line text-xl"></i>
              ) : (
                <i className="ri-eye-line text-xl"></i>
              )}
            </button>
          </div>
          <button className="text-sm  text-blue-500 hover:text-blue-600 transition-colors">
            Forgot Password?
          </button>{" "}
          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg font-semibold"
          >
            Sign In
          </button>
        </form>

        {/* Forgot Password & Create Account */}
        <div className="text-center  justify-center lg:hidden flex space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to={`/register`}
              className="text-blue-500 hover:text-blue-600 transition-colors font-medium"
            >
              Create New Account
            </Link>
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-4">
          {/* Google Button */}
          <button className="w-full flex items-center justify-center bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-6 h-6 mr-3"
            />
            <span className="font-medium">Sign in with Google</span>
          </button>

          {/* Facebook Button */}
          <button className="w-full flex items-center justify-center bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md">
            <img
              src="https://www.svgrepo.com/show/303114/facebook-3-logo.svg"
              alt="Facebook"
              className="w-6 h-6 mr-3"
            />
            <span className="font-medium">Sign in with Facebook</span>
          </button>
        </div>
      </div>

      {/* Right Section - Post Showcase */}
      <div
        className="w-1/2 lg:flex
hidden p-8 bg-gradient-to-l from-blue-600 to-blue-700 shadow-lg  flex-col justify-center items-center text-white space-y-8 min-h-screen"
        style={{
          backgroundImage: `url('${loginBg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Logo */}
        <div className="absolute top-0 p-2 left-0">
          <h1
            style={{
              fontFamily: "'Merienda', cursive",
              fontSize: "2rem",
            }}
            className="text-gray-100 opacity-95 font-bold"
          >
            Social
          </h1>
        </div>

        {/* Main Image (Post Showcase) */}
        <div className="w-full md:flex max-w-[400px] rounded-xl overflow-hidden shadow-2xl hidden justify-center items-center">
          <img
            src="https://res.cloudinary.com/datcr1zua/image/upload/v1738754523/uploads/p4x03xf7oqd57idqgmvj.png"
            alt="Post"
            className=" transform transition-transform hover:scale-105"
          />
        </div>

        {/* Post Title */}
        <h3 className="text-4xl font-bold text-center text-white opacity-95">
          Discover the Social Experience
        </h3>

        {/* Post Description */}
        <p className="text-lg text-center max-w-md leading-relaxed opacity-85">
          Join thousands of users, explore new ideas, and create meaningful
          connections.
        </p>

        {/* Call-to-Action Button */}
        <Link
          to={`/register`}
          className="bg-white text-blue-600 py-3 px-10 rounded-xl text-lg font-semibold transition-transform transform hover:scale-105 hover:bg-blue-500 hover:text-white focus:outline-none shadow-md hover:shadow-xl active:scale-100 duration-300 ease-in-out"
        >
          Create New Account
        </Link>
      </div>
    </div>
  );
}
export default login;
