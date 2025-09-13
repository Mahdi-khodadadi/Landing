import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signIn, getCurrentUser } from "../services/supabaseService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../supabaseClient";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const check = async () => {
      const user = await getCurrentUser();
      if (user) {
        localStorage.setItem("user", JSON.stringify({ id: user.id, email: user.email }));
        navigate("/Landing/dashboard");
      }
    };
    check();
  }, [navigate]);

  useEffect(() => {
    if (i18n.language === "fa") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [i18n.language]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        localStorage.setItem("user", JSON.stringify({
          id: session.user.id,
          email: session.user.email
        }));
        navigate("/Landing/dashboard");
      }
    };
    getSession();
  }, [navigate]);
  



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const { error } = await signUp(email.toLowerCase(), password, { username });
        if (error) throw error;
        toast.success("ثبت‌نام با موفقیت انجام شد ✅");
        navigate("/Landing/dashboard");
      } else {
        const { data, error } = await signIn(email.toLowerCase(), password);
        if (error) throw error;
        const user = data.user;
        localStorage.setItem("user", JSON.stringify({ id: user.id, email: user.email }));
        toast.success("خوش آمدید 👋");
        navigate("/Landing/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "خطا در ورود ❌");
      console.error(err);
    }
  };

  const handleGoogleAuth = async () => {
    const { data , error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: '/Landing/dashboard' }
    });
    
    if (error) {
      toast.error(error.message);
      return
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-[#f8f8f8] p-4 ${i18n.language === "fa" ? "font-v" : "font-sans"}`}>
      <div className="bg-[#ffffff] rounded-3xl shadow-2xl w-full max-w-md p-8 border border-[#e5e5e5]">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[#222222] mb-6">
          {isSignup ? t("login.title_signup") : t("login.title_login")}
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-[#7b7b7b]">{t("login.username")}</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t("login.username")} className="w-full mt-1 px-4 py-3 rounded-xl border" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#7b7b7b]">{t("login.username_or_email")}</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("login.username_or_email")} className="w-full mt-1 px-4 py-3 rounded-xl border" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#7b7b7b]">{t("login.password")}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("login.password")} className="w-full mt-1 px-4 py-3 rounded-xl border" />
          </div>

          <button type="submit" className="w-full py-3 bg-[#222222] text-[#ffffff] rounded-xl font-semibold">
            {isSignup ? t("login.btn_signup") : t("login.btn_login")}
          </button>
        </form>

        <div className="mt-6">
          <button onClick={handleGoogleAuth} type="button" className="w-full flex items-center justify-center gap-3 py-3 border border-[#7b7b7b]/30 rounded-xl shadow-sm hover:bg-[#f8f8f8] transition">
            <FcGoogle size={24} />
            <span className="font-medium text-[#222222]">
              {isSignup ? `${t("login.btn_google_signup")}` : `${t("login.btn_google_login")}`}
            </span>
          </button>
        </div>

        <p className="text-center text-[#7b7b7b] mt-6">
          {isSignup ? t("login.have_account") : t("login.no_account")}
          <button className="text-[#222222] font-semibold ml-1" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? t("login.login_link") : t("login.signup_link")}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;








