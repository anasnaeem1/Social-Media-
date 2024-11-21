function userInfo({ user, Friends }) {
  return (
    <div>
      {" "}
      <div className="normal lg:sticky top-[100px] right-0 w-full lg:w-[400px] flex flex-col gap-4">
        {/* USER INFO */}
        <div className="bg-white rounded-lg p-4">
          <h1 className="text-lg font-semibold border-b pb-2 mb-4">
            About {user.username}
          </h1>
          <div className="flex flex-col gap-3">
            {/* City */}
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">City:</span>
              <span className="text-gray-600 font-medium">{user.city}</span>
            </div>
            {/* From */}
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">From:</span>
              <span className="text-gray-600 font-medium">{user.from}</span>
            </div>
            {/* Relationship */}
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">Relationship:</span>
              <span className="text-gray-600 font-medium">
                {user.relationship === 1
                  ? "Single"
                  : user.relationship === 2
                  ? "Mingle"
                  : user.relationship === 3
                  ? "Married"
                  : "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* USER FRIENDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Friends.map((Friend, index) => (
            <div
              key={index}
              className={`flex flex-col items-center gap-2 text-center ${
                index >= 4 && index < 6 ? "hidden sm:block" : ""
              } && ${index >= 6 ? "hidden" : undefined}`}
            >
              <img
                src={Friend.pic}
                alt={`${Friend.fname} ${Friend.lname}`}
                className="rounded-md w-full aspect-square object-cover"
              />
              <div>
                <span className="text-gray-600 text-sm font-medium">
                  {Friend.fname}
                </span>{" "}
                <span className="text-sm">{Friend.lname}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default userInfo;
