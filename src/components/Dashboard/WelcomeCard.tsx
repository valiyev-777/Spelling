// src/components/dashboard/WelcomeCard.tsx
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const WelcomeCard = () => {
  const { user } = useAuth();
  const [nickname, setNickname] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("users")
        .select("nickname")
        .eq("id", user.id)
        .single();
      if (!error && data) setNickname(data.nickname);
    })();
  }, [user]);
  const name = nickname || "IELTS student";

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-blue-800">
        Welcome back, {name} 👋
      </h2>
      <p className="text-gray-600 mt-1">
        Let’s improve your spelling skills today!
      </p>
    </div>
  );
};

export default WelcomeCard;
