import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import SettingsModal, {
  type Settings,
  type Category,
} from "../components/practiceSetting/SettingsModal";
import { FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const WORD_BANK: Record<Category, string[]> = {
  names: ["Olivia", "Michael", "Sarah", "John", "Emma"],
  places: ["London", "Paris", "New York", "Tashkent", "Berlin"],
  streets: [
    "Baker Street",
    "Main Avenue",
    "Wall Street",
    "Elm Road",
    "Oxford Street",
  ],
  card_numbers: [
    "4268112356879981",
    "5399988812345678",
    "6011000990139424",
    "4532756279624064",
    "378282246310005",
  ],
  phone_numbers: [
    "998901234567",
    "998911112233",
    "998935551212",
    "998977778899",
    "998933334455",
  ],
  postcodes: ["10001", "W1A1AA", "75001", "90210", "SW1A0AA"],
};

const Practice = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    rate: 0.9,
    voiceURI: "",
    category: "names",
  });

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
  const [manualStop, setManualStop] = useState(false); // 🔴 Stop bosilganmi

  const navigate = useNavigate();
  const WORDS = WORD_BANK[settings.category];

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel(); // sahifadan chiqsa audio to‘xtasin
    };
  }, []);

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

  // 🔁 Dashboardga o‘tish
  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showResult, manualStop, navigate]);

  const speak = (text: string, delay = 800) => {
    return new Promise<void>((resolve) => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      utter.rate = settings.rate;
      const voice = window.speechSynthesis
        .getVoices()
        .find((v) => v.voiceURI === settings.voiceURI);
      if (voice) utter.voice = voice;
      utter.onend = () => setTimeout(resolve, delay);
      window.speechSynthesis.speak(utter);
    });
  };

  const playAudio = async (word: string) => {
    if (speaking || showAnswer) return;
    setSpeaking(true);
    await speak(word, 1000);
    for (let letter of word) {
      await speak(letter.toLowerCase(), 10);
    }
    setSpeaking(false);
  };

  const handleCheck = async () => {
    if (!userId || result !== null || input.trim() === "") return;

    const correctWord = WORDS[current].toLowerCase();
    const userWord = input.trim().toLowerCase();
    const isCorrect = userWord === correctWord;

    setResult(isCorrect);
    setShowAnswer(true);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
      const newMistakes: string[] = [];
      for (let i = 0; i < correctWord.length; i++) {
        if (userWord[i] !== correctWord[i]) {
          newMistakes.push(correctWord[i]);
        }
      }
      setMistakes((prev) => [...prev, ...newMistakes]);
    }

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

    const allMistakes = [...mistakes];
    const freq: Record<string, number> = {};
    allMistakes.forEach((l) => (freq[l] = (freq[l] || 0) + 1));
    let most = "-";
    let max = 0;
    for (const l in freq) {
      if (freq[l] > max) {
        max = freq[l];
        most = l;
      }
    }

    await supabase
      .from("users")
      .update({
        correct_count: prevCorrect + (isCorrect ? 1 : 0),
        wrong_count: prevWrong + (isCorrect ? 0 : 1),
        most_mistaken_letter: most,
        last_practice_at: new Date().toISOString(),
      })
      .eq("id", userId);

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
    setManualStop(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-8 border border-blue-100">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight drop-shadow">
            IELTS Spelling Practice
          </h2>
          <button
            onClick={() => setSettingsOpen(true)}
            className="text-blue-600 hover:text-blue-800 transition text-xl"
            title="Settings"
          >
            <FaCog />
          </button>
        </div>

        {!showResult ? (
          <>
            <div className="flex flex-col items-center space-y-3">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition text-lg font-semibold flex items-center gap-2 disabled:opacity-50"
                onClick={() => playAudio(WORDS[current])}
                disabled={speaking || showAnswer}
              >
                🔊 Play
              </button>
              <div className="text-gray-500 text-sm text-center">
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
              <span>{settings.category.replace("_", " ")}</span>
            </div>

            <button
              className="w-full bg-green-500 text-white py-3 rounded-xl mt-2 font-bold text-xl hover:bg-green-600 transition shadow-lg disabled:opacity-50"
              onClick={handleCheck}
              disabled={showAnswer || !input.trim() || speaking}
            >
              Check
            </button>

            <button
              onClick={() => {
                setManualStop(true);
                setShowResult(true);
              }}
              className="w-full bg-red-500 text-white py-3 rounded-xl  font-bold text-xl hover:bg-red-600 transition shadow-lg"
            >
              🔴 Stop Practice
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
                <div className="text-sm text-gray-600">Mistaken</div>
              </div>
            </div>

            {showResult && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                You’ll be redirected to dashboard in 5 seconds...
              </p>
            )}

            <button
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-xl hover:bg-blue-700 transition shadow-lg"
              onClick={handleRestart}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ⚙️ Modal */}
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          settings={settings}
          onSave={(newSettings) => setSettings(newSettings)}
        />
      </div>
    </div>
  );
};

export default Practice;
