// src/pages/Confirm.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const Confirm = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("Confirming...");
  const navigate = useNavigate();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setMessage("Email confirmed! Redirecting...");
          setTimeout(() => navigate("/dashboard"), 1500);
        } else if (event === "PASSWORD_RECOVERY") {
          setMessage("Password recovery.");
        } else {
          setError("Invalid or expired token. Please try again.");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white text-center">
      <div className="text-xl text-gray-800">
        {error ? <p className="text-red-600">{error}</p> : <p>{message}</p>}
      </div>
    </div>
  );
};

export default Confirm;
