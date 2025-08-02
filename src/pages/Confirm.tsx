// src/pages/Confirm.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const Confirm = () => {
  const [message, setMessage] = useState("⏳ Verifying your email...");
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const url = new URL(window.location.href);
        const hash = url.hash;

        // Agar redirect URL'da hash (#access_token=...) bo'lsa — uni Supabase o'zi qo'ygan bo'ladi
        if (hash && hash.includes("access_token")) {
          const queryParams = new URLSearchParams(hash.substring(1));
          const access_token = queryParams.get("access_token");
          const refresh_token = queryParams.get("refresh_token");

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (error) {
              setMessage("❌ Failed to confirm email: " + error.message);
              return;
            }

            setMessage("✅ Email confirmed! Redirecting...");
            setTimeout(() => navigate("/dashboard"), 2000);
            return;
          }
        }

        setMessage("❌ Invalid or expired token. Please try again.");
      } catch (err) {
        setMessage("❌ Unexpected error occurred.");
      }
    };

    confirmEmail();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-xl font-medium text-blue-700">
      {message}
    </div>
  );
};

export default Confirm;
