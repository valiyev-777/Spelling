import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-blue-600 py-20 px-6 text-center text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Boots Your IELTS Listening Score?
        </h2>
        <p className="text-lg md:text-xl mb-8">
          Start practicing the most overlooked part of the exam — fast, accurate
          spelling.
        </p>

        <div className="flex flex-col md:flex-row justify-center">
          <button
            className="border border-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-white hover:text-blue-600 transition duration-300"
            onClick={() => {
              navigate("/practice");
            }}
          >
            Start Practicing
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
