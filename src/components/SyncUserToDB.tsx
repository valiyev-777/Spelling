// src/components/SyncUserToDB.tsx
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const SyncUserToDB = () => {
  const { user } = useAuth();

  useEffect(() => {
    const run = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("firebase_uid", user.id)
        .single();

      if (error && error.code !== "PGRST116") return; // boshqa xatolar
      if (!data) {
        await supabase.from("users").insert({
          firebase_uid: user.id,
          email: user.email ?? "",
          nickname: user.user_metadata?.nickname ?? "",
        });
      }
    };
    run();
  }, [user]);

  return null;
};

export default SyncUserToDB;
