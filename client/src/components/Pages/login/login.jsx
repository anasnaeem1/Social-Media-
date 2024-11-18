function login() {
  return (
    <div className="w-full h-screen bg-gray-200 flex justify-center items-center gap-8 ">
      <div className=" w-[500px] ">
        <h1 className="text-textColor text-5xl font-bold">Social</h1>
        <p className="text-2xl ">
          connect with friends and the world arround you on Social
        </p>
      </div>
      <div className="bg-white w-[500px] rounded-xl flex justify-center items-center">
        <form class="flex flex-col py-7 gap-4 w-[400px]">
          <input
            type="Email"
            placeholder="Email"
            class="placeholder-gray-500 border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-gray-500"
          />
          <input
            type="password"
            placeholder="Password"
            class="placeholder-gray-500 border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-gray-500"
          />
          <button
            type="submit"
            class="bg-blue-500 text-white text-lg px-4 py-3 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Log in
          </button>
          <div className="flex flex-col gap-4 justify-center items-center ">
            <a className="cursor-pointer text-textColor hover:text-blue-800 list-none">Forgot Password?</a>
            <button
              type="submit"
              class="bg-green-600 text-white font-semibold text-lg px-8 py-3 rounded-md hover:bg-green-700 transition duration-200"
            >
              Create a New Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default login;
