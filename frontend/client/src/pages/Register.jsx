import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Link } from "react-router-dom";
import loginBg from "../../assets/images/loginBg.jpg";
import * as React from "react";
import {
  LocalizationProvider,
  MobileDatePicker,
  DesktopDatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function register() {
  const [dobForDayjs, setDobForDayjs] = useState(dayjs("2-17-2025"));
  const [dob, setDob] = useState("2-17-2025");
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const firstname = useRef();
  const lastname = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Password is ", passwordValue);
    console.log("Confirm password is ", confirmPasswordValue);
  }, [passwordValue, confirmPasswordValue]);

  const handlePasswordChange = (e) => {
    setPasswordValue(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPasswordValue(e.target.value);
  };

  const handleDateChange = (newValue) => {
    setDobForDayjs(newValue);
    const formatData = newValue.format("YYYY-MM-DD");
    setDob(formatData);
  };

  const handleShowPass = (e) => {
    e.preventDefault();
    setShowPass((prev) => !prev);
  };

  const handleShowCPass = (e) => {
    e.preventDefault();
    setShowCPass((prev) => !prev);
  };

  const generateUsername = (firstname, lastname) => {
    const baseUsername = (firstname + lastname).toLowerCase();
    const uniqueNumber = Math.floor(Math.random() * 100);

    return `${baseUsername}${uniqueNumber}`;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (passwordValue !== confirmPasswordValue) {
      alert("Passwords don't match!");
      return;
    }

    const firstName = firstname.current.value;
    const lastName = lastname.current.value;
    const username = generateUsername(firstName, lastName);
    const fullname = firstName + " " + lastName;

    if (username && fullname) {
      const user = {
        fullname: fullname,
        username: username,
        email: email.current.value,
        password: passwordValue,
        DOB: dob,
      };

      try {
        await axios.post(`/api/auth/register`, user);
        navigate("/login");
      } catch (error) {
        alert("Registration failed. Please try again!");
        console.error(error);
      }
    }
  };

  const handleGetStarted = () => {
    firstname.current.focus();
  };

  return (
    <div className="min-h-screen flex flex-row-reverse bg-gray-50">
      <div className="w-full lg:w-1/2 p-8 bg-white rounded-l-lg shadow-lg flex flex-col justify-center relative space-y-6">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
          Join Now!
        </h2>
        <form onSubmit={handleRegister} className="flex flex-col space-y-6">
          <div className="flex space-x-4">
            <div className="relative w-1/2">
              <input
                required
                ref={firstname}
                type="text"
                id="firstName"
                placeholder="First Name"
                className="w-full p-3 border-2 focus:placeholder-transparent border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all peer"
              />
              <label
                htmlFor="firstName"
                className="absolute text-blue-500 bg-white px-2 left-2 top-1/2 transform -translate-y-1/2 text-md peer-focus:transform peer-focus:-translate-y-[39px] peer-focus:block hidden"
              >
                First Name
              </label>
            </div>
            <div className="relative w-1/2">
              <input
                required
                type="text"
                ref={lastname}
                id="lastName"
                placeholder="Last Name"
                className="w-full p-3 border-2 focus:placeholder-transparent border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all peer"
              />
              <label
                htmlFor="lastName"
                className="absolute text-blue-500 bg-white px-2 left-2 top-1/2 transform -translate-y-1/2 text-md peer-focus:transform peer-focus:-translate-y-[39px] peer-focus:block hidden"
              >
                Last Name
              </label>
            </div>
          </div>

          <div className="relative">
            <input
              required
              ref={email}
              autocomplete="new-email"
              type="email"
              id="email"
              placeholder="Email"
              className="w-full p-3 border-2 focus:placeholder-transparent border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all peer"
            />
            <label
              htmlFor="email"
              className="absolute text-blue-500 bg-white px-2 left-2 top-1/2 transform -translate-y-1/2 text-md peer-focus:transform peer-focus:-translate-y-[39px] peer-focus:block hidden"
            >
              Email
            </label>
          </div>

          <div className="relative">
            <input
              required
              onChange={handlePasswordChange}
              ref={password}
              autocomplete="new-password"
              type={!showPass ? "password" : "text"}
              id="password"
              placeholder="Password"
              className="w-full p-3 border-2 focus:placeholder-transparent border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all peer"
            />
            <label
              htmlFor="password"
              className="absolute text-blue-500 bg-white px-2 left-2 top-1/2 transform -translate-y-1/2 text-md peer-focus:transform peer-focus:-translate-y-[39px] peer-focus:block hidden"
            >
              Password
            </label>
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

          <div className="relative">
            <input
              onChange={handleConfirmPasswordChange}
              required
              autocomplete="new-password"
              ref={confirmPassword}
              type={!showCPass ? "password" : "text"}
              id="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-3 focus:placeholder-transparent border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all peer"
            />
            <label
              htmlFor="confirmPassword"
              className="absolute text-blue-500 bg-white px-2 left-2 top-1/2 transform -translate-y-1/2 text-md peer-focus:transform peer-focus:-translate-y-[39px] peer-focus:block hidden"
            >
              Confirm Password
            </label>
            <button
              onClick={handleShowCPass}
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Toggle confirm password visibility"
            >
              {!showCPass ? (
                <i className="ri-eye-off-line text-xl"></i>
              ) : (
                <i className="ri-eye-line text-xl"></i>
              )}
            </button>
          </div>

          <div className="w-full">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="hidden md:block">
                <DesktopDatePicker
                  label="Date of Birth"
                  value={dobForDayjs}
                  onChange={(newDate) => handleDateChange(newDate)}
                  inputFormat="M/D/YYYY"
                  renderInput={(params) => <input {...params} />}
                />
              </div>

              <div className="block md:hidden">
                <MobileDatePicker
                  label="Date of Birth"
                  value={dobForDayjs}
                  onChange={(newDate) => handleDateChange(newDate)}
                  inputFormat="M/D/YYYY"
                  renderInput={(params) => <input {...params} />}
                />
              </div>
            </LocalizationProvider>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg font-semibold"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-4">
          <Link
            to={`/login`}
            className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            Alreay have an account?
          </Link>
        </div>
      </div>

      <div
        className="w-1/2 lg:flex
hidden p-8 bg-gradient-to-l from-blue-600 to-blue-700 shadow-lg  flex-col justify-center items-center text-white space-y-8 min-h-screen"
        style={{
          backgroundImage: `url('${loginBg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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

        <div className="w-full md:flex max-w-[400px] rounded-xl overflow-hidden shadow-2xl hidden justify-center items-center">
          <img
            src="https://res.cloudinary.com/datcr1zua/image/upload/v1738754523/uploads/p4x03xf7oqd57idqgmvj.png"
            alt="Post"
            className=" transform transition-transform hover:scale-105"
          />
        </div>

        <h3 className="text-4xl font-bold text-center text-white opacity-95">
          Discover the Social Experience
        </h3>

        <p className="text-lg text-center max-w-md leading-relaxed opacity-85">
          Join thousands of users, explore new ideas, and create meaningful
          connections.
        </p>

        <button
          onClick={handleGetStarted}
          className="bg-white text-blue-600 py-3 px-10 rounded-xl text-lg font-semibold transition-transform transform hover:scale-105 hover:bg-blue-500 hover:text-white focus:outline-none shadow-md hover:shadow-xl active:scale-100 duration-300 ease-in-out"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
export default register;

