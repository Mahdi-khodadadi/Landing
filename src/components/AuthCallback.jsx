import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // گرفتن session از Supabase
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth error:", error.message);
          navigate("/Landing/login");
          return;
        }

        if (session?.user) {
          // ذخیره اطلاعات کاربر در localStorage
          localStorage.setItem("user", JSON.stringify({
            id: session.user.id,
            email: session.user.email
          }));

          // هدایت به داشبورد
          navigate("/Landing/dashboard");
        } else {
          // اگر session نبود → صفحه login
          navigate("/Landing/login");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        navigate("/Landing/login");
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg font-semibold">در حال ورود با گوگل ... ⏳</p>
    </div>
  );
};

export default AuthCallback;
