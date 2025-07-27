// components/FeaturesSection.tsx

import { Headphones, SpellCheck2, BarChart3, Bot } from "lucide-react";

const features = [
  {
    icon: <Headphones className="w-10 h-10 text-blue-600 mb-4" />,
    title: "Real Listening Practice",
    description:
      "Train with real-speed audio – names, streets, numbers, just like the real IELTS test.",
  },
  {
    icon: <SpellCheck2 className="w-10 h-10 text-blue-600 mb-4" />,
    title: "Spelling Accuracy",
    description:
      "Type what you hear. Get instant feedback. Improve your spelling under time pressure.",
  },
  {
    icon: <BarChart3 className="w-10 h-10 text-blue-600 mb-4" />,
    title: "Track Your Progress",
    description:
      "See your accuracy, speed, and most common mistakes over time with detailed stats.",
  },
  {
    icon: <Bot className="w-10 h-10 text-blue-600 mb-4" />,
    title: "AI Voice Generator",
    description:
      "No boring robotic sounds. Practice with natural AI-generated voices for realistic experience.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Your IELTS Spelling Coach
        </h2>
        <p className="text-lg text-gray-600">
          This platform isn’t just another quiz app. It’s built to target the
          exact skills you need to boost your IELTS listening score.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center"
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
