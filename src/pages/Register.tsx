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

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ??
      // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ??
      // Automatically set by Vercel.
      "http://localhost:3000/";

    // Make sure to include `https://` when not localhost.
    url = url.startsWith("http") ? url : `https://${url}`;

    // Make sure to include a trailing `/`.
    url = url.endsWith("/") ? url : `${url}/`;

    return url;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validate inputs before submission
      if (!email || !password || !nickname) {
        throw new Error("Please fill in all fields");
      }

      // Get dynamic URL using the getURL function
      const dynamicRedirectUrl = `${getURL()}confirm`;

      // Sign up with Supabase
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: dynamicRedirectUrl,
            data: { nickname },
          },
        });

      // Handle signup errors
      if (signUpError) throw signUpError;

      // Check if user needs email confirmation
      if (signUpData.user?.identities?.length === 0) {
        setSuccess("Account created! Please check your email to confirm.");
        setLoading(false);
        return;
      }

      // If user is immediately available, insert user data
      if (signUpData.user) {
        const { error: insertError } = await supabase.from("users").insert({
          id: signUpData.user.id,
          email: signUpData.user.email,
          nickname,
          correct_count: 0,
          wrong_count: 0,
          score: 0,
          most_mistaken_letter: "-",
        });

        if (insertError) {
          // Handle potential duplicate key or other insert errors
          if (!insertError.message.includes("duplicate key")) {
            throw insertError;
          }
        }

        // Navigate to dashboard on successful signup and insert
        navigate("/dashboard");
      }
    } catch (error: any) {
      // Centralized error handling
      setError(error.message || "An unexpected error occurred");
    } finally {
      // Ensure loading is set to false
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
