import Navbar from "./components/Header/navbar";
import Home from "./components/Pages/Home/home";

function App() {
  return (
    <div
      className="overflow-x-hidden overflow-y-hidden"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <Navbar />
      <Home />
    </div>
  );
}

export default App;
