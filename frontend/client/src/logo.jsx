import logoPic from "../assets/images/mainLogo.png";
// import logoPic from "../public/images/socialLogo-removebg-preview.png";

function logo() {
  return (
    <button className="logo" data-text="Awesome">
      <span
        style={{ fontFamily: "montserrat, sans-serif" }}
        className=" actual-text"
      >
        &nbsp;Social&nbsp;
      </span>
      <span
        style={{ fontFamily: "montserrat, sans-serif" }}
        aria-hidden="true"
        className="hover-text"
      >
        &nbsp;Social&nbsp;
      </span>
    </button>
  );
}
export default logo;
