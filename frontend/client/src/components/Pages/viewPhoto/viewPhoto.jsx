import { useParams, useNavigate } from "react-router-dom";

function ViewPhoto() {
  const { photoName } = useParams();
  const navigate = useNavigate();

  return (
    <div
      style={{ height: "calc(100vh - 65px)" }}
      className="overflow-hidden relative w-full bg-black bg-opacity-90 flex items-center justify-center"
    >
      {/* Fullscreen Image */}
      <div className="w-full h-full flex justify-center items-center">
        {photoName ? (
          <img
            src={`/images/${photoName}`}
            alt="Fullscreen"
            className="max-w-full max-h-full object-contain shadow-lg rounded-md"
          />
        ) : (
          <p className="text-white text-xl">Image not available</p>
        )}
      </div>

      {/* Under Development Tag */}
      <div className="absolute top-10 left-10 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-full shadow-lg transform animate-pulse">
        <span className="font-bold text-xl">Under Development</span>
      </div>

      {/* Close Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 right-5 bg-gradient-to-r from-gray-800 to-gray-600 text-white rounded-full p-4 shadow-lg hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-400 transition-all duration-200"
      >
        <i className="ri-close-line text-2xl"></i>
      </button>
    </div>
  );
}

export default ViewPhoto;
