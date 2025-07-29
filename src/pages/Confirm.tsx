import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const Confirm = () => {
  const [message, setMessage] = useState("Checking confirmation...");
  const navigate = useNavigate();

  useEffect(() => {
    const checkConfirmation = async () => {
      const { data: userData, error } = await supabase.auth.getUser();

      if (error || !userData?.user) {
        setMessage("Confirmation failed. Please try logging in again.");
        return;
      }

      const user = userData.user;
      const nickname =
        user.user_metadata?.nickname || (await getNicknameFromDB(user.id));

      setMessage(`Welcome, ${nickname || "User"}! Redirecting...`);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    };

    checkConfirmation();
  }, []);

  const getNicknameFromDB = async (userId: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from("users")
      .select("nickname")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("❌ Nickname fetch error:", error.message);
      return null;
    }

    return data?.nickname || null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center space-y-4 max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-700">Email Confirmed!</h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default Confirm;
