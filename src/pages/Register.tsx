import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://spelling-tau.vercel.app/confirm", // ✅ https
        data: { nickname },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      setSuccess("Account created! Please check your email to confirm.");
      setLoading(false);
      return;
    }

    const user = userData.user;

    const { error: insertError } = await supabase
      .from("users")
      .insert([
        {
          id: user.id,
          email: user.email,
          nickname,
          correct_count: 0,
          wrong_count: 0,
          score: 0,
          most_mistaken_letter: "-",
        },
      ])
      .select();

    if (insertError && !insertError.message.includes("duplicate key")) {
      setError("Auth success, but DB insert failed: " + insertError.message);
      setLoading(false);
      return;
    }

    navigate("/dashboard");
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
          <div className="text-red-600 text-sm bg-red-100 p-3 rounded shadow">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-700 text-sm bg-green-100 p-3 rounded shadow">
            {success}
          </div>
        )}

        <input
          type="text"
          placeholder="Your Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="email"
          placeholder="you@example.com"
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
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/sign-in"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
