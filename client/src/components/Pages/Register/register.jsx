function register() {
  return (
    <div className="w-full h-screen bg-gray-200 flex justify-center items-center gap-8 ">
      <div className=" w-[500px] ">
        <h1 className="text-textColor text-5xl font-bold">Social</h1>
        <p className="text-2xl ">
          connect with friends and the world arround you on Social
        </p>
      </div>
      <div className="bg-white w-[500px] h-[360px] rounded-xl flex justify-center items-center">
        <form class="flex flex-col gap-4 py-7 w-[400px]">
          <input
            type="text"
            placeholder="Username"
            class="border placeholder-gray-500 border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:border-gray-500"
          />
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
          <input
            type="password"
            placeholder="Password Again"
            class="placeholder-gray-500 border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-gray-500"
          />
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
export default register;
