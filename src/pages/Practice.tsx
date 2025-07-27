// src/pages/Practice.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const WORDS = [
  "technology",
  "development",
  "strategy",
  "language",
  "university",
];

const Practice = () => {
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // So‘zni va harflarni o‘qib berish
  const playAudio = async (word: string) => {
    setSpeaking(true);

    // Butun so'zni aytish
    await speak(word, 1200);

    // Har bir harfni aytish
    for (let letter of word) {
      // faqat harfni o'qitish, upperCase emas!
      await speak(letter, 10);
    }

    setSpeaking(false);
  };

  const speak = (text: string, delay = 800) => {
    return new Promise<void>((resolve) => {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      utter.onend = () => setTimeout(resolve, delay);
      window.speechSynthesis.speak(utter);
    });
  };

  useEffect(() => {
    setInput("");
    setResult(null);
    setShowAnswer(false);
    setSpeaking(false);
  }, [current]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
      }
    })();
  }, []);

  const handleCheck = async () => {
    if (!userId || result !== null) return; // ✅ Oldini olish: check tugmasi 1 marta ishlasin

    const correctWord = WORDS[current].toLowerCase();
    const userWord = input.trim().toLowerCase();
    const isCorrect = userWord === correctWord;

    setResult(isCorrect);
    setShowAnswer(true); // 🔒 input ni bloklash

    // ✅ Lokal state yangilash
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);

      // Harflar bo‘yicha xatolarni yig‘ish
      for (let i = 0; i < correctWord.length; i++) {
        if (userWord[i] !== correctWord[i]) {
          setMistakes((prev) => [...prev, correctWord[i]]);
        }
      }
    }

    // ✅ Supabase’dan oldingi natijalarni olib yangilash
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("correct_count, wrong_count")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("❌ Fetch error:", fetchError);
      return;
    }

    const prevCorrect = userData?.correct_count || 0;
    const prevWrong = userData?.wrong_count || 0;

    // ✅ Supabase yangilash
    const { error: updateError } = await supabase
      .from("users")
      .update({
        correct_count: prevCorrect + (isCorrect ? 1 : 0),
        wrong_count: prevWrong + (isCorrect ? 0 : 1),
        last_practice_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("❌ Update error:", updateError);
    }

    // ⏱ So‘zni almashtirish
    setTimeout(() => {
      if (current < WORDS.length - 1) {
        setCurrent((prev) => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setCurrent(0);
    setCorrectCount(0);
    setWrongCount(0);
    setMistakes([]);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-8 border border-blue-100">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-4 tracking-tight drop-shadow">
          IELTS Spelling Practice
        </h2>
        {!showResult ? (
          <>
            <div className="flex flex-col items-center space-y-3">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition text-lg font-semibold flex items-center gap-2 disabled:opacity-50"
                onClick={() => playAudio(WORDS[current])}
                disabled={speaking}
              >
                🔊 Play
              </button>
              <div className="text-gray-500 text-sm">
                Listen and type the word you hear
              </div>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3 mb-4">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${((current + 1) / WORDS.length) * 100}%` }}
              ></div>
            </div>
            <input
              type="text"
              className="w-full border-2 border-blue-300 rounded-xl p-4 text-xl focus:outline-none focus:border-blue-500 transition shadow-sm"
              placeholder="Type the word..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={showAnswer}
              autoFocus
            />
            {result !== null && (
              <div
                className={`text-center text-2xl font-bold ${
                  result ? "text-green-600" : "text-red-600"
                }`}
              >
                {result ? "✅ Correct!" : `❌ Incorrect!`}
                {!result && showAnswer && (
                  <div className="text-gray-700 mt-2 text-lg">
                    Correct: <span className="font-bold">{WORDS[current]}</span>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-between text-base text-gray-500 mt-4 font-medium">
              <span>
                Word {current + 1} / {WORDS.length}
              </span>
              <span>IELTS Listening Boost</span>
            </div>
            <button
              className="w-full bg-green-500 text-white py-3 rounded-xl mt-2 font-bold text-xl hover:bg-green-600 transition shadow-lg disabled:opacity-50"
              onClick={handleCheck}
              disabled={showAnswer || !input.trim() || speaking}
            >
              Check
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <h3 className="text-2xl font-bold text-blue-700">Your Results</h3>
            <div className="w-full flex flex-col sm:flex-row justify-around items-center gap-4">
              <div className="bg-green-50 p-4 rounded-xl text-center w-full">
                <div className="text-3xl font-bold text-green-600">
                  {correctCount}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="bg-red-50 p-4 rounded-xl text-center w-full">
                <div className="text-3xl font-bold text-red-600">
                  {wrongCount}
                </div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl text-center w-full">
                <div className="text-3xl font-bold text-yellow-600">
                  {(() => {
                    const freq: Record<string, number> = {};
                    mistakes.forEach((l) => (freq[l] = (freq[l] || 0) + 1));
                    let most = "-";
                    let max = 0;
                    for (const l in freq) {
                      if (freq[l] > max) {
                        max = freq[l];
                        most = l;
                      }
                    }
                    return most;
                  })()}
                </div>
                <div className="text-sm text-gray-600">
                  Most Mistaken Letter
                </div>
              </div>
            </div>
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-xl hover:bg-blue-700 transition shadow-lg"
              onClick={handleRestart}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;
