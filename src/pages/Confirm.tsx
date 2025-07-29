// src/pages/Confirm.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const Confirm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        navigate("/dashboard");
      } else {
        navigate("/sign-in");
      }
    };

    checkUser();
  }, [navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center text-blue-700 text-xl">
      Confirming your account...
    </div>
  );
};

export default Confirm;
