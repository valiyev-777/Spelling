// src/pages/Profile.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [nickname, setNickname] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("users")
        .select(
          "nickname, correct_count, wrong_count, most_mistaken_letter, last_practice_at"
        )
        .eq("id", user.id)
        .single();
      if (!error && data) {
        setStats(data);
        setNickname(data.nickname);
      }
      setLoading(false);
    })();
  }, [user]);

  const handleUpdateName = async () => {
    try {
      if (!user) return;
      const { error } = await supabase
        .from("users")
        .update({ nickname })
        .eq("id", user.id);
      if (error) throw error;
      setMessage("Nickname updated successfully.");
      setError("");
    } catch (err: any) {
      setError(err.message);
      setMessage("");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (!user || newPassword.length < 6) {
        setError("Password must be at least 6 characters.");
        setMessage("");
        return;
      }
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      setMessage("Password updated successfully.");
      setError("");
    } catch (err: any) {
      setError(err.message);
      setMessage("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/sign-in");
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-4 mt-6 bg-white rounded-xl shadow space-y-6">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
          {nickname.charAt(0).toUpperCase()}
        </div>
        <h2 className="mt-2 text-xl font-semibold">{nickname}</h2>
      </div>
      {message && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-2 text-center">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-center">
          {error}
        </div>
      )}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="bg-green-50 p-3 rounded text-center">
            <div className="text-lg font-bold text-green-600">
              {stats.correct_count}
            </div>
            <div className="text-xs text-gray-600">To‘g‘ri javoblar</div>
          </div>
          <div className="bg-red-50 p-3 rounded text-center">
            <div className="text-lg font-bold text-red-600">
              {stats.wrong_count}
            </div>
            <div className="text-xs text-gray-600">Noto‘g‘ri javoblar</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded text-center">
            <div className="text-lg font-bold text-yellow-600">
              {stats.most_mistaken_letter || "-"}
            </div>
            <div className="text-xs text-gray-600">
              Eng ko‘p xatolashgan harf
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded text-center">
            <div className="text-lg font-bold text-blue-600">
              {stats.last_practice_at
                ? new Date(stats.last_practice_at).toLocaleDateString()
                : "-"}
            </div>
            <div className="text-xs text-gray-600">Oxirgi mashq</div>
          </div>
        </div>
      )}
      {/* Profilni tahrirlash va logout tugmalari */}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-600 mb-1">Nickname</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <button
              onClick={handleUpdateName}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Saqlash
            </button>
          </div>
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Yangi parol</label>
          <div className="flex gap-2">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <button
              onClick={handleUpdatePassword}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Saqlash
            </button>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 mt-2"
        >
          Chiqish
        </button>
      </div>
    </div>
  );
};

export default Profile;
