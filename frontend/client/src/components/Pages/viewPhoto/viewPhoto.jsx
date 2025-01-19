import { useParams, useNavigate } from "react-router-dom";

function ViewPhoto() {
  const { photoName } = useParams();
  const PF = import.meta.env.VITE_PUBLIC_FOLDER || "/images";
  const navigate = useNavigate();

  return (
    <div
      style={{ height: "calc(100vh - 65px)" }}
      className="overflow-x-hidden relative w-full bg-black bg-opacity-90 flex items-center justify-center"
    >
      {/* Fullscreen Image */}
      <div className="w-[800px] h-[900px] flex justify-center items-center">
        {photoName && (
          <img
            src={`${PF}${photoName}`}
            alt="Fullscreen"
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 right-5 bg-gray-800 text-white rounded-full p-3 shadow-md hover:bg-gray-700 transition-all duration-200"
      >
        <i className="ri-close-line text-2xl"></i>
      </button>
    </div>
  );
}

export default ViewPhoto;
