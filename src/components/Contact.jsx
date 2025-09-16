import { useState } from "react";
import { useTranslation } from "react-i18next";
import img from "../assets/Screenshot 2025-09-16 121338.png";
import { Link } from "react-router-dom";

const CopyableText = ({ text }) => {
  const { t } = useTranslation();
  const [showToast, setShowToast] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    });
  };

  return (
    <div className="relative">
      <h5 
        onClick={copyToClipboard} 
        className="cursor-pointer text-gray-700 hover:text-gray-900 transition"
      >
        {text}
      </h5>
      {showToast && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 mt-1 text-xs text-green-600 font-medium">
          {t("contact.copied") || "Copied!"}
        </span>
      )}
    </div>
  );
};

const Contact = () => {
  const { t } = useTranslation();


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 font-v">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-xl overflow-hidden">

          <Link to={"/Landing"} className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">
            {t("aboutp.exit")}
          </Link>
        <div className="p-8 relative">

          <p className="text-blue-600 hover:text-blue-700 font-semibold">{t("contactp.getintouch")}</p>
          <h2 className="text-3xl font-bold mt-2 mb-4 text-gray-900">
            {t("contactp.letschat")}
          </h2>
          <p className="text-gray-600 mb-8">
            {t("contactp.desc1")}
          </p>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="First name" className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"/>
              <input type="text" placeholder="Last name" className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"/>
            </div>
            <input type="email" placeholder="Email address" className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"/>
            <textarea rows="4" placeholder="Leave us message" className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"></textarea>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
              {t("contactp.sendmessage")}
            </button>
          </form>
        </div>

        <div className="bg-gray-100 flex flex-col justify-center items-center p-8">
          <div className="relative w-full mb-6">
            <img src={img} alt="Person" className="rounded-xl mx-auto" />
          </div>
          <div className="w-full space-y-4">
            <div className="bg-white p-4 rounded-xl shadow flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8 4H8m8-8H8m-2 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t("contactp.email")}</p>
                <p className="font-semibold text-gray-900">
                  <CopyableText text="xmahdi7886@gmail.com" />
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h2l1.403 4.209a1 1 0 00.95.707h3.236a1 1 0 00.95-.707L14 5h2m-7 0v11m8-11v11m-4-11v11" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t("contactp.phone")}</p>
                <p className="font-semibold text-gray-900">
                  <CopyableText text="09352403786" />
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
