// components/HeroSection.tsx

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-b from-white to-blue-50 min-h-screen flex flex-col justify-center items-center text-center px-6 py-24">
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Master Spelling in
        <br className="hidden md:inline" /> IELTS Listening
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Train your ear and improve your spelling for names, addresses, and
        numbers — just like in the real IELTS test.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <button
          className="px-6 py-3 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 transition duration-300"
          onClick={() => {
            navigate("/practice");
          }}
        >
          Start Practicing
        </button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
