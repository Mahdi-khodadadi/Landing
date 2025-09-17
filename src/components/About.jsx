import { Link } from "react-router-dom";
import img from "../assets/abr-icon.png";
import { useTranslation } from "react-i18next";




const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 font-v">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-xl overflow-hidden">
          <Link to={"/Landing"} className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">
            {t("aboutp.exit")}
          </Link>
        <div className="p-8 flex flex-col justify-center relative">
          <p className="text-blue-600 font-semibold">{t("aboutp.aboutus")}</p>
          <h2 className="text-3xl font-bold mt-2 mb-4 text-gray-900">
            {t("aboutp.aboutmyClud")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t("aboutp.desc1")}
          </p>
          <p className="text-gray-600 mb-6">
            {t("aboutp.desc2")}
          </p>
          <p className="text-gray-600">
            {t("aboutp.desc3")}
          </p>
        </div>
        <div className="bg-gray-900 flex flex-col justify-center items-center p-8">
          <div className="relative w-full">
            <img src={img} alt="About MyClud" className="rounded-xl mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

    