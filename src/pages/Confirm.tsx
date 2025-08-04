// src/pages/Confirm.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const Confirm = () => {
  const [message, setMessage] = useState(
    "⏳ Checking your confirmation link..."
  );
  const navigate = useNavigate();

  useEffect(() => {
    const urlHash = window.location.hash;
    const params = new URLSearchParams(urlHash.substring(1)); // remove the "#" from hash

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const type = params.get("type");

    if (!access_token || !refresh_token || type !== "email") {
      setMessage("❌ Invalid or expired token. Please try again.");
      return;
    }

    const confirmSession = async () => {
      // 1. Set the session from the confirmation token
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        setMessage("❌ Failed to confirm your email: " + error.message);
        return;
      }

      setMessage("✅ Email confirmed! Redirecting to dashboard...");

      // 2. Optional: Write to public.users if needed
      // const { data: { user } } = await supabase.auth.getUser();
      // await supabase.from("users").upsert({
      //   id: user.id,
      //   email: user.email,
      //   nickname: user.user_metadata?.nickname || "",
      // });

      // 3. Redirect
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    };

    confirmSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 px-4">
      <div className="text-center text-xl font-semibold text-blue-700 bg-white p-6 rounded shadow-lg">
        {message}
      </div>
    </div>
  );
};

export default Confirm;
