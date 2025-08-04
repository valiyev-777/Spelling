// src/components/practiceSetting/SettingsModal.tsx
import { useEffect, useState } from "react";

export interface Settings {
  rate: number;
  voiceURI: string;
  category: Category;
}

export type Category =
  | "names"
  | "places"
  | "streets"
  | "card_numbers"
  | "phone_numbers"
  | "postcodes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (newSettings: Settings) => void;
}

const SettingsModal = ({ isOpen, onClose, settings, onSave }: Props) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState(settings.rate);
  const [voiceURI, setVoiceURI] = useState(settings.voiceURI);
  const [category, setCategory] = useState<Category>(settings.category);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices.filter((v) => v.lang.startsWith("en")));
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const testVoice = () => {
    const utter = new SpeechSynthesisUtterance("This is a test voice.");
    utter.lang = "en-US";
    utter.rate = rate;

    const voice =
      voices.find((v) => v.voiceURI === voiceURI) ||
      voices.find((v) => v.lang === "en-US");
    if (voice) {
      utter.voice = voice;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const handleSave = () => {
    onSave({ rate, voiceURI, category });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4 shadow-xl">
        <h2 className="text-2xl font-bold text-blue-700 text-center">
          Settings
        </h2>

        <div>
          <label className="font-semibold text-gray-700">Voice Speed</label>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-500">
            Current: {rate.toFixed(1)}
          </div>
        </div>

        <div>
          <label className="font-semibold text-gray-700">Accent / Voice</label>
          <select
            value={voiceURI}
            onChange={(e) => setVoiceURI(e.target.value)}
            className="w-full border p-2 rounded-lg mt-1"
          >
            {voices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
          <button
            onClick={testVoice}
            className="mt-2 text-blue-600 hover:underline text-sm"
          >
            🔊 Test Voice
          </button>
        </div>

        <div>
          <label className="font-semibold text-gray-700">Word Category</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {(
              [
                ["names", "Names"],
                ["places", "Places"],
                ["streets", "Streets"],
                ["card_numbers", "Cards"],
                ["phone_numbers", "Phones"],
                ["postcodes", "Postcodes"],
              ] as const
            ).map(([val, label]) => (
              <label key={val} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  value={val}
                  checked={category === val}
                  onChange={() => setCategory(val)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            className="bg-gray-200 px-4 py-2 rounded-xl"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
