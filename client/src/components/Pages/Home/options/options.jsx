import FriendList from "../friendList";

function options({ mainItems, SeperatingLine }) {
  const { Options } = mainItems;
  return (
    <>
      <div className="w-[300px]"> </div>
      <div className="fixed top-[70px] border left-0 w-[300px] h-[calc(100vh-70px)] ">
        <div className="w-full h-full overflow-auto px-5 pt-5 flex flex-col gap-6">
          <ul className="flex justify-center items-start flex-col gap-3">
            {Options.map((Option, id) => {
              return (
                <div
                  key={id}
                  className="flex items-center justify-center gap-4"
                >
                  <li className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-green-300 cursor-pointer text-black text-2xl">
                    {Option.icon}
                  </li>
                  <span className="cursor-pointer text-gray-700 text-lg">
                    {Option.label}
                  </span>
                </div>
              );
            })}
            <button className="py-2 px-7 bg-gray-200 text-sm border border-gray-200">
              Show More
            </button>
          </ul>

          <SeperatingLine color={"border-gray-300"} />

          <FriendList mainItems={mainItems} />
        </div>
      </div>
    </>
  );
}
export default options;
