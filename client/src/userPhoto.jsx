import User from "./assets/user.jpg";


function user() {
  return (
    <div
      className=" w-[50px] h-[50px] bg-cover bg-no-repeat rounded-full"
      style={{
        backgroundImage: `url(${User})`,
        opacity: 1,
      }}
    ></div>
  );
}
export default user;
