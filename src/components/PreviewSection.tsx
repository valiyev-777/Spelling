import { PlayCircle, Keyboard, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: <PlayCircle className="w-10 h-10 text-blue-600 mb-4" />,
    title: "1. Listen Carefully",
    description:
      "Play the audio and focus on the details — names, numbers, or addresses.",
  },
  {
    icon: <Keyboard className="w-10 h-10 text-blue-600 mb-4" />,
    title: "2. Type What You Hear",
    description:
      "Write the exact spelling — no auto-correct, no help. Just like the IELTS exam.",
  },
  {
    icon: <CheckCircle2 className="w-10 h-10 text-blue-600 mb-4" />,
    title: "3. Get Instant Feedback",
    description: "See if you got it right. Review your mistakes and try again!",
  },
];

const PreviewSection = () => {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-3xl font-bold text-gray-800 mb-4">
          How It Works
        </h2>
        <p className="text-lg text-gray-600">
          No long lessons. Just simple, targeted practice — like a real IELTS
          mini test.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-blue-50 p-6 rounded-xl shadow text-center hover:shadow-md transition"
          >
            {step.icon}
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PreviewSection;
