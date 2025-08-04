// src/pages/Register.tsx
import { useState } from "react";
import { supabase } from "../lib/supabase";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Dinamik URL (dev/prod farqlaydi)
  // const getURL = () => {
  //   if (typeof window !== "undefined") {
  //     return window.location.origin;
  //   }
  //   return "https://spelling-tau.vercel.app"; // Default prod URL
  // };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!email || !password || !nickname) {
        throw new Error("Please fill in all fields");
      }

      // const redirectUrl = `${getURL()}/confirm`;

      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nickname },
          },
        });

      if (signUpError) throw signUpError;

      // Agar confirmation yoqilgan bo‘lsa — session bo‘lmaydi
      if (!signUpData.session) {
        setSuccess("✅ Account created! Please check your email to confirm.");
        return;
      }

      setSuccess("✅ Account created and logged in.");
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-2xl p-8 rounded-xl max-w-md w-full space-y-6 border border-blue-200"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700">
          Create Account
        </h2>

        {error && (
          <div className="text-red-600 text-center bg-red-100 rounded p-2">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-700 text-center bg-green-100 rounded p-2">
            {success}
          </div>
        )}

        <input
          type="text"
          placeholder="Your Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Register;
