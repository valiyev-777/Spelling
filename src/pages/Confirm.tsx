import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const Confirm = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const checkSession = async () => {
      // Tasdiqdan keyin token bilan kelganmi — session olishga harakat qilamiz
      const { data, error } = await supabase.auth.getSession();

      if (data.session) {
        setStatus("success");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setStatus("error");
        console.error("Email confirmed, but no session:", error);
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-center">
      {status === "loading" && (
        <p className="text-blue-600 text-xl">Checking confirmation...</p>
      )}
      {status === "success" && (
        <p className="text-green-600 text-xl">
          Email confirmed! Redirecting...
        </p>
      )}
      {status === "error" && (
        <p className="text-red-500 text-xl">
          Email confirmed, but login failed.
          <br />
          Please log in manually.
        </p>
      )}
    </div>
  );
};

export default Confirm;
