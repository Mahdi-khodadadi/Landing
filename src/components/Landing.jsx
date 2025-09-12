import img1 from "../assets/laptop.png";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


const Landing = ({ onChange }) => {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const languages = [
    { code: "fa", label: "فارسی" },
    { code: "en", label: "English" },
  ];

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setOpen(false);
  };

  useEffect(() => {
    if (i18n.language === "fa") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [i18n.language]);




  return (
    <div className={`bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-[4rem] ${i18n.language === "fa" ? "font-v" : "font-sans"}`}>
      <div className="relative bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-[4rem] flex flex-col-reverse md:flex-row h-auto md:h-[80vh] items-center gap-6 sm:gap-8 md:gap-10">

        <div className="flex-1 space-y-4 sm:space-y-5 md:space-y-6 text-center md:text-left">
          <div className="w-12 sm:w-14 md:w-16 lg:w-[3.5rem] h-12 sm:h-14 md:h-16 lg:h-[3.5rem] bg-gray-700 rounded-lg mx-auto md:mx-0"></div>
          <h1 className="flex text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
            {t("title1")} {t("title2")}
          </h1>
          <p className=" flex text-base sm:text-lg md:text-[1.1rem] lg:text-[1.3rem] max-w-md mx-auto md:mx-0">
            {t("description")}
          </p>
          <button onClick={() => navigate("/Landing/login")} className="flex px-5 sm:px-6 md:px-6 lg:px-7 py-3 sm:py-3 md:py-3 lg:py-4 bg-white border shadow-md rounded-xl text-base sm:text-base md:text-[1.15rem] lg:text-[1.3rem] font-medium hover:bg-gray-100">
            {t("start")}
          </button>
        </div>

        <div className="flex justify-center relative h-60 sm:h-72 md:h-80 lg:h-[25rem]">
          <img src={img1} alt="3D Design" className={`w-64 sm:w-72 md:w-96 lg:w-[550px] object-contain ${i18n.language === "fa" ? "rotate-y-180" : ""}`}/>
        </div>

        <nav className={`absolute top-4 md:top-10 flex gap-4 sm:gap-6 md:gap-10 text-sm sm:text-base md:text-[1.3rem] text-gray-800 ${i18n.language === "fa" ? "left-4 md:left-16" : "right-4 md:right-16"}`}>
          <div className="relative">
            <button onClick={() => setOpen(!open)}>{t("language")}</button>
            {open && (
              <div className="origin-top-right absolute right-0 mt-2 w-28 sm:w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1 bg-gray-100">
                  {languages.map((lang) => (
                    <button key={lang.code} onClick={() => {changeLanguage(lang.code); setOpen(false);}} className="w-full text-left px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-white">
                      {lang.label}
                    </button>
                  ))}
                </div>
                <div className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rotate-45 absolute -top-[4px] sm:-top-[5px] right-[10px] sm:right-[12px] bg-gray-100"></div>
              </div>
            )}
          </div>
          <a href="#">{t("about")}</a>
          <a href="#">{t("contact")}</a>
        </nav>

      </div>
    </div>
  );
};

export default Landing;
 

