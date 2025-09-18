// src/components/LoginCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const LoginCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuth = async () => {
      // Supabase خودش توی URL token میذاره
      const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });

      if (error) {
        console.error("OAuth error:", error.message);
        return;
      }

      if (data.session) {
        // موفقیت => هدایت به داشبورد
        navigate("/Landing/dashboard");
      } else {
        // خطا یا بازگشت به لندینگ
        navigate("/Landing/login");
      }
    };

    handleOAuth();
  }, [navigate]);

  return <p>در حال ورود ... لطفا صبر کنید</p>;
};

export default LoginCallback;
