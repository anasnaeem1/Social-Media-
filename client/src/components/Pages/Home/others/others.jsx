import Gift from "../../../../assets/birthday-Gift.png";
import BirhdayPic from "../../../../assets/birthday.jpg";
import FriendList from "../friendList";

function others({ mainItems }) {

  return (
    <>
      <div className="w-[400px] h-full"> </div>
      <div className="fixed right-0 top-[70px] w-[400px] border border-gray-300 ">
        <div className="flex px-2 flex-col gap-3 h-screen overflow-y-auto">
          {/* here you can see how many people have birthday today  */}
          <div className="list-none flex items-center gap-1">
            <img
              src={Gift}
              alt={`openBox`}
              className="w-[4rem] h-[4rem] rounded-full"
            />
            <li className="text-md">
              <span className="font-semibold">Pola Foster</span> and{" "}
              <span className="font-semibold">3 other friends</span> have a
              birthday today
            </li>{" "}
          </div>
          {/* here you can see the image for birthday section  */}
          <div className="flex justify-center items-center">
            <div
              className="relative w-[370px] h-[300px] rounded-xl bg-cover bg-center flex items-center justify-start text-white"
              style={{ backgroundImage: `url(${BirhdayPic})` }}
            >
              <div className="absolute w-[370px] bg-gray-500 opacity-20 h-[300px] rounded-xl text-white">
                {" "}
              </div>
              <div className="list-none flex z-10 flex-col text-4xl px-2">
                <li className="font-extrabold font-[Montserrat]">cold</li>
                <li className="font-extrabold font-[Montserrat]">smoooth</li>
                <li className="font-extrabold font-[Montserrat]">$tasty,</li>
              </div>
            </div>
          </div>
          {/* here you can see the freindList*/}
          <div>
            <FriendList mainItems={mainItems} />
          </div>
        </div>
      </div>
    </>
  );
}
export default others;
