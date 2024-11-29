import { useContext, useState, useRef } from "react";
import { loginCall } from "../../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

function login() {
  const [showPass, setShowPass] = useState(false);

  const handleShowPass = (e) => {
    e.preventDefault();
    setShowPass((prev) => !prev);
  };

  const email = useRef();
  const password = useRef();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };
  console.log(user);

  return (
    <>
      <div className="w-full h-screen bg-gray-200 flex justify-center items-center gap-8 ">
        <div className=" w-[500px]">
          <h1 className="text-textColor text-5xl font-bold">Social</h1>
          <p className="text-2xl ">
            connect with friends and the world arround you on Social
          </p>
        </div>
        <div className="bg-white w-[500px] rounded-xl flex justify-center items-center">
          <form
            className="flex flex-col py-7 gap-4 w-[400px]"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              ref={email}
              required
              placeholder="Email"
              className={`${
                error
                  ? "placeholder-red-500 border border-red-500 focus:border-red-500 w-full"
                  : undefined
              } placeholder-gray-500 border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-gray-500`}
            />
            <div className="relative">
              <input
                required
                ref={password}
                type={!showPass ? "password" : "text"}
                placeholder="Password"
                className={`${
                  error
                    ? "placeholder-red-500 border border-red-500 focus:border-red-500 w-full"
                    : "w-full"
                } placeholder-gray-500 border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-gray-500`}
              />
              <button
                onClick={handleShowPass}
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label="Toggle password visibility"
              >
                {!showPass ? (
                  <i className="ri-eye-off-fill"></i>
                ) : (
                  <i className="ri-eye-fill"></i>
                )}
              </button>
            </div>

            <button
              style={{ height: "50px", minWidth: "300px" }}
              className="bg-blue-500 text-white text-lg px-4 py-3 rounded-md hover:bg-blue-600 transition duration-200 flex justify-center items-center"
              disabled={isFetching} // Disable the button during loading
            >
              {isFetching ? (
                <CircularProgress size="20px" color="inherit" />
              ) : (
                "Log in"
              )}
            </button>
            <div className="flex flex-col gap-4 justify-center items-center ">
              <a className="cursor-pointer text-textColor hover:text-blue-800 list-none">
                Forgot Password?
              </a>
              <Link
                to="/register"
                className="bg-green-600 text-white font-semibold text-lg px-8 py-3 rounded-md hover:bg-green-700 transition duration-200 flex justify-center items-center"
                style={{ height: "50px", minWidth: "300px" }} // Fixed height and minimum width
              >
                {isFetching ? (
                  <CircularProgress size="20px" color="inherit" />
                ) : (
                  <span
                    style={{ visibility: isFetching ? "hidden" : "visible" }}
                  >
                    Create a New Account
                  </span>
                )}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default login;
