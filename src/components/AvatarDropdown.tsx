// src/components/AvatarDropdown.tsx
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AvatarDropdown = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();
  const [nickname, setNickname] = useState("");
  useEffect(() => {
    if (!user) return setNickname("");
    (async () => {
      const { data, error } = await supabase
        .from("users")
        .select("nickname")
        .eq("id", user.id)
        .single();
      if (!error && data) setNickname(data.nickname);
      else setNickname("");
    })();
  }, [user]);
  const firstLetter = (nickname || "User").charAt(0).toUpperCase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/sign-in");
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg"
        onClick={() => setOpen(!open)}
      >
        {firstLetter}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
          >
            Profile
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              navigate("/dashboard");
              setOpen(false);
            }}
          >
            Dashboard
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
