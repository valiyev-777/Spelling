// src/components/dashboard/QuickActions.tsx
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          🚀 Ready to practice?
        </h3>
        <p className="text-gray-600 text-sm">
          Improve your listening and spelling skills by starting a new session.
        </p>
      </div>
      <button
        onClick={() => navigate("/practice")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold transition"
      >
        Start Practice
      </button>
    </div>
  );
};

export default QuickActions;
