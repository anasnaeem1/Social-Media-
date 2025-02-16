import logoPic from "../assets/images/mainLogo.png";
// import logoPic from "../public/images/socialLogo-removebg-preview.png";

function logo() {
  return (
    <div className="pl-2">
      <h1
        style={{
          fontFamily: "'Merienda', cursive",
          fontSize: "2rem",
        }}
        className="text-blue-500 opacity-95 font-bold"
      >
        Social
      </h1>
    </div>
    // <img
    //     src="https://res.cloudinary.com/datcr1zua/image/upload/v1738707170/uploads/ros8l0e0ol53ibhng2sl.png"
    //     alt="Logo"
    //     className="h-[50px] "
    //   />
  );
}
export default logo;
