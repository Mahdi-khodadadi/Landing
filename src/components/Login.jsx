import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { getAllUsers, createUser, loginUser } from "../services/contactService";






const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  useEffect(() => {
    if (i18n.language === "fa") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [i18n.language]);





  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup) {
      try {
        const { data: users } = await getAllUsers();
        const userExists = users.find(
          (u) => u.email === email || u.username === username
        );
  
        if (userExists) {
          toast.error("این کاربر قبلاً ثبت نام کرده ❌");
          return;
        }
  
        const newUser = { id: Date.now(), username, email: email.toLowerCase(), password };
        const response = await createUser(newUser);
        const data = response.data;
  
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        console.log(data.token);
        console.log(data.user);
  
        toast.success("ثبت‌نام با موفقیت انجام شد ✅");
        navigate("/Landing/dashboard");
      } catch (err) {
        toast.error("خطا در ثبت‌نام ❌");
        console.error(err);
      }
    } else {
      try {
        const { data } = await loginUser({ email: email.toLowerCase(), password });

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
  
        toast.success("خوش آمدید 👋");
        navigate("/Landing/dashboard");
      } catch (err) {
        toast.error(err.response?.data?.error || "خطا در ورود ❌");
        console.error(err);
      }
    }
  };
  



  return (
    <div className={`min-h-screen flex items-center justify-center bg-[#f8f8f8] p-4 ${i18n.language === "fa" ? "font-v" : "font-sans"}`}>
      <div className="bg-[#ffffff] rounded-3xl shadow-2xl w-full max-w-md p-8 border border-[#e5e5e5]">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[#222222] mb-6">
          {isSignup ? `${t("login.title_signup")}` : `${t("login.title_login")}`}
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-[#7b7b7b]">
                  {t("login.username")}
              </label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t("login.username")} className="w-full mt-1 px-4 py-3 rounded-xl border border-[#7b7b7b]/30 focus:ring-2 focus:ring-[#222222] focus:outline-none"/>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#7b7b7b]">
              {t("login.username_or_email")}
            </label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("login.username_or_email")} className="w-full mt-1 px-4 py-3 rounded-xl border border-[#7b7b7b]/30 focus:ring-2 focus:ring-[#222222] focus:outline-none"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#7b7b7b]">
              {t("login.password")}
            </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("login.password")} className="w-full mt-1 px-4 py-3 rounded-xl border border-[#7b7b7b]/30 focus:ring-2 focus:ring-[#222222] focus:outline-none"/>
          </div>

          <button type="submit" className="w-full py-3 bg-[#222222] text-[#ffffff] rounded-xl font-semibold shadow-md hover:opacity-90 transition">
            {isSignup ? `${t("login.btn_signup")}` : `${t("login.btn_login")}`}
          </button>
        </form>

        <div className="mt-6">
          <button type="button" className="w-full flex items-center justify-center gap-3 py-3 border border-[#7b7b7b]/30 rounded-xl shadow-sm hover:bg-[#f8f8f8] transition">
            <FcGoogle size={24} />
            <span className="font-medium text-[#222222]">
              {isSignup ? `${t("login.btn_google_signup")}` : `${t("login.btn_google_login")}`}
            </span>
          </button>
        </div>

        <p className="text-center text-[#7b7b7b] mt-6">
          {isSignup ? `${t("login.have_account")}` : `${t("login.no_account")}`}
          <button className="text-[#222222] font-semibold hover:underline ml-1" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? `${t("login.login_link")}` : `${t("login.signup_link")}`}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
