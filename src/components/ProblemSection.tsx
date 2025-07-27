// components/ProblemSection.tsx

import { Lightbulb, AlertTriangle } from "lucide-react";

const ProblemSection = () => {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Why is IELTS Listening so tricky?
        </h2>
        <p className="text-lg text-gray-600 mb-10">
          Many test takers lose points not because they don’t understand English
          — but because they can’t spell what they hear.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Problem 1 */}
        <div className="bg-blue-50 p-6 rounded-xl shadow-sm text-center hover:shadow-md transition">
          <AlertTriangle className="w-10 h-10 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Fast Pronunciation</h3>
          <p className="text-gray-600">
            Names, addresses, and numbers are spoken quickly in real tests. You
            barely have time to think!
          </p>
        </div>

        {/* Problem 2 */}
        <div className="bg-blue-50 p-6 rounded-xl shadow-sm text-center hover:shadow-md transition">
          <AlertTriangle className="w-10 h-10 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Spelling Confusion</h3>
          <p className="text-gray-600">
            Words like “Alan” or “Ellen” sound similar — if your spelling is
            off, the answer is wrong.
          </p>
        </div>

        {/* Problem 3 */}
        <div className="bg-blue-50 p-6 rounded-xl shadow-sm text-center hover:shadow-md transition">
          <Lightbulb className="w-10 h-10 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Lack of Targeted Practice
          </h3>
          <p className="text-gray-600">
            Most apps teach grammar or vocabulary — not fast spelling under
            pressure.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
