// src/pages/Confirm.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const Confirm = () => {
  const [message, setMessage] = useState("⏳ Confirming your email...");
  const navigate = useNavigate();

  useEffect(() => {
    const confirm = async () => {
      const url = window.location.href;

      const { error } = await supabase.auth.exchangeCodeForSession(url);

      if (error) {
        console.error("Confirmation error:", error);
        setMessage("❌ Invalid or expired token. Please try again.");
        return;
      }

      setMessage("✅ Email confirmed! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 2000);
    };

    confirm();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-xl text-blue-600 font-semibold">
      {message}
    </div>
  );
};

export default Confirm;
