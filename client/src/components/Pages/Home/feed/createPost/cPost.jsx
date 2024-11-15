function cPost({ ShareOptions, UserPhoto, SeperatingLine }) {
  return (
    <div className="bg-white p-5 shadow-lg rounded-2xl flex flex-col gap-4 w-[90%] ">
      <div className="rounded-2xl flex flex-col justify-center items-start gap-4">
        <div className="flex justify-center items-center gap-3">
          <div>
            <UserPhoto />
          </div>
          <div>
            <input
              className="w-[350px] py-2 px-2 rounded-md focus:outline-none"
              placeholder="What’s on your mind?"
              type="text"
            />
          </div>
        </div>
        <div className="w-full">
          <SeperatingLine color={"border-gray-300"} />
        </div>
      </div>
      <div>
        <ul className="flex justify-around gap-2 text-sm">
          {ShareOptions.map((option, id) => {
            const colorClasses = [
              "text-red-600", // Color for id 0
              "text-blue-600", // Color for id 1
              "text-green-600", // Color for id 2
              "text-yellow-600", // Color for id 3
            ];

            return (
              <div
                key={id}
                className={`flex justify-center items-center gap-1`}
              >
                <li className={`${colorClasses[id]} cursor-pointer text-xl`}>
                  {option.icon}
                </li>
                <span className="cursor-pointer">{option.label}</span>
              </div>
            );
          })}
          <button className="py-2 px-4 border rounded-xl hover:bg-green-500 transition-all duration-300 ">
            Post
          </button>
        </ul>
      </div>
    </div>
  );
}
export default cPost;
