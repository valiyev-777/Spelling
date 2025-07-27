// src/pages/Register.tsx
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Foydalanuvchini Auth tizimiga qo‘shamiz
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          data: { nickname }, // user_metadata ga nickname yoziladi
        },
      }
    );

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // 2. Agar foydalanuvchi session bilan qaytsa — avtomatik login bo‘lgan
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      setLoading(false);
      setError("Check your email to confirm your account before logging in.");
      return;
    }

    const user = userData.user;

    // 3. public.users jadvaliga qo‘shish (agar trigger yo‘q bo‘lsa)
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: user.id,
        email: user.email,
        nickname,
        correct_count: 0,
        wrong_count: 0,
        most_mistaken_letter: "-",
      },
    ]);

    if (insertError) {
      setError("Auth created, but DB insert failed: " + insertError.message);
      setLoading(false);
      return;
    }

    // 4. Dashboardga o‘tkazish
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-md p-8 rounded-xl max-w-md w-full space-y-5"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-700">
          Register
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-100 rounded p-2">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Register;
