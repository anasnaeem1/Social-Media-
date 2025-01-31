import logoPic from "../assets/images/mainLogo.png";
// import logoPic from "../public/images/socialLogo-removebg-preview.png";

function logo({}) {
  return (
    // <div
    //   style={{ fontFamily: "montserrat, sans-serif" }}
    // >
    //   <h1 className="text-3xl text-textColor uppercase font-[600] ">social</h1>
    // </div>
    <div className="flex items-end">
      <div
        className="w-[44px] h-[44px] bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${logoPic})`,
          opacity: 1,
        }}
      ></div>
      <h1 className="text-2xl tranform -translate-x-2 text-blue-600 font-semibold">ocial</h1>
    </div>
  );
}
export default logo;
