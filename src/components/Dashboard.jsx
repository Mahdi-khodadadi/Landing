import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cloudImg from "../assets/abr-icon.png";
import picImg from "../assets/picimg.png";
import vidImg from "../assets/vidimg.png";
import fileimg from "../assets/fileimg.png";
import { toast } from "react-toastify";
import { uploadFile, listFiles, createSignedUrl, deleteFile, getCurrentUser, signOut,} from "../services/supabaseService";
import { useTranslation } from "react-i18next";
import bg from "../assets/bg-img.mp4"


const FilePreview = ({ file }) => {
  const [signedUrl, setSignedUrl] = useState(null);
  

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const url = await createSignedUrl(file.path, 60); // 60s
        if (mounted) setSignedUrl(url);
      } catch (err) {
        console.error(err);
      }
    };
    load();
    return () => { mounted = false; };
  }, [file]);

  if (!signedUrl) return <p>Loading...</p>;

  if (file.filename.match(/\.(png|jpg|jpeg|gif)$/i))
    return <img src={signedUrl} alt={file.filename} className="w-32 h-24 object-cover rounded" />;
  if (file.filename.match(/\.(mp4|mov|avi)$/i))
    return <video controls src={signedUrl} className="w-32 h-24 object-cover rounded" />;
  if (file.filename.match(/\.(mp3|wav|ogg|m4a)$/i))
    return <audio controls src={signedUrl} className="w-64" />;

  return <img src={fileimg} alt="file icon" className="w-16 h-16 object-contain" />;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({
    picture: null,
    video: null,
    file: null,
    music: null,
  });

  const [uploading, setUploading] = useState({
    picture: false,
    video: false,
    file: false,
    music: false,
  });

  const [sectionsOpen, setSectionsOpen] = useState({
    picture: true,
    video: false,
    file: false,
    music: false,
  });

  useEffect(() => {
    const s = async () => {
      const u = await getCurrentUser();
      if (!u) {
        navigate("/Landing/login");
        return;
      }
      const minimal = { id: u.id, email: u.email };
      setUser(minimal);
      await loadFiles(minimal.email);
    };
    s();
  }, [navigate]);

  const loadFiles = async (email) => {
    setLoadingFiles(true);
    try {
      const list = await listFiles(email);
      setFiles(list.map(f => ({ filename: f.filename, path: f.path, ...f })));
    } catch (err) {
      console.error(err);
      toast.error(`${t("toast.Errorloadingfiles")}`);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleUpload = async (type) => {
    if (!selectedFiles[type] || !user) return;
    setUploading(prev => ({ ...prev, [type]: true }));
    try {
      await uploadFile(user.email, selectedFiles[type]);
      toast.success(`${t("toast.Fileuploadedsuccessfully")}`);
      setSelectedFiles(prev => ({ ...prev, [type]: null }));
      await loadFiles(user.email);
    } catch (err) {
      console.error(err);
      toast.error(`${t("toast.Erroruploadingfile")}`);
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleDelete = async (file) => {
    if (!user) return;
    try {
      await deleteFile(file.path);
      toast.success(`${t("toast.Thefilewasdeleted")}`);
      await loadFiles(user.email);
    } catch (err) {
      console.error(err);
      toast.error(`${t("toast.Errordeletingfile")}`);
    }
  };

  const downloadFile = async (file) => {
    try {
      const url = await createSignedUrl(file.path, 60);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      toast.error(`${t("toast.Downloadfailedtryagain")}`);
    }
  };

  const imageFiles = files.filter(f => /\.(png|jpg|jpeg|gif)$/i.test(f.filename));
  const videoFiles = files.filter(f => /\.(mp4|mov|avi)$/i.test(f.filename));
  const musicFiles = files.filter(f => /\.(mp3|wav|ogg|m4a)$/i.test(f.filename));
  const otherFiles = files.filter(f => !/\.(png|jpg|jpeg|gif|mp4|mov|avi|mp3|wav|ogg|m4a)$/i.test(f.filename));

  const sections = [
    { key: `${t("dashboard.pictures")}`, open: sectionsOpen.picture, files: imageFiles, icon: picImg, label: `${t("dashboard.upPic")}` },
    { key: `${t("dashboard.videos")}`, open: sectionsOpen.video, files: videoFiles, icon: vidImg, label: `${t("dashboard.upVid")}` },
    { key: `${t("dashboard.musics")}`, open: sectionsOpen.music, files: musicFiles, icon: fileimg, label: `${t("dashboard.upMis")}` },
    { key: `${t("dashboard.files")}`, open: sectionsOpen.file, files: otherFiles, icon: fileimg, label: `${t("dashboard.upFil")}` },
  ];

  const toggleSection = (section) => setSectionsOpen({
    picture: section === `${t("dashboard.pictures")}`,
    video: section === `${t("dashboard.videos")}`,
    file: section === `${t("dashboard.files")}`,
    music: section === `${t("dashboard.musics")}`,
  });

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem("user");
    navigate("/Landing/login");
  };


  const languages = [
    { code: "fa", label: "فارسی" },
    { code: "en", label: "English" },
  ];

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setOpen(false);
  };


  return (
    <div
      className={`text-white min-h-screen w-full flex flex-col items-center py-8 px-4 sm:px-6 md:px-10 lg:px-16 ${i18n.language === "fa" ? "font-v" : "font-sans"}`}>
      <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover min-h-screen -z-10">
        <source src={bg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <header className="flex flex-col sm:flex-row items-center justify-between w-full max-w-6xl mb-10 gap-4">
        {/* سمت چپ */}
        <div className="flex items-center gap-3">
          <img
            src={cloudImg}
            alt="Cloud"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
          />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Cloud
          </h1>
        </div>
  
        {/* سمت راست */}
        <div className="flex items-center gap-4">
          <span className="text-sm sm:text-base break-all">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm sm:text-base transition"
          >
            {t("dashboard.Logout")}
          </button>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm"
            >
              {t("language")}
            </button>
            {open && (
              <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-800 transition"
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
  
      {/* تب‌ها */}
      <nav className="flex flex-wrap gap-3 mb-8 w-full max-w-6xl justify-center sm:justify-start">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => toggleSection(s.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              s.open
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {s.key}
          </button>
        ))}
      </nav>
  
      {/* بخش‌های فایل */}
      {sections.map(
        (section, idx) =>
          section.open && (
            <section key={idx} className="bg-gray-900/50 backdrop-blur-md border border-gray-700/30 rounded-2xl p-5 sm:p-8 w-full max-w-6xl flex flex-col gap-6 mb-8 shadow-lg">
              {/* آپلود فایل */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-full sm:w-28 h-20 bg-gray-800/50 flex items-center justify-center rounded-xl backdrop-blur-sm">
                  <img
                    src={section.icon}
                    alt="upload preview"
                    className="w-12 h-12 object-contain opacity-80"
                  />
                </div>
                <input
                  className="w-full sm:flex-1 border border-gray-700 rounded-lg bg-gray-800/50 text-gray-200 px-3 py-2 text-sm backdrop-blur-sm"
                  type="file"
                  onChange={(e) =>
                    setSelectedFiles((prev) => ({
                      ...prev,
                      [section.key]: e.target.files[0],
                    }))
                  }
                />
                <button
                  onClick={() => handleUpload(section.key)}
                  disabled={!selectedFiles[section.key] || uploading[section.key]}
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading[section.key] ? `${t("dashboard.upl")}` : section.label}
                </button>
              </div>

              {/* لیست فایل‌ها */}
              {loadingFiles ? (
                <p className="text-gray-400">{t("dashboard.loading")}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {section.files.map((file) => (
                    <div
                      key={file.filename}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 flex flex-col gap-3 items-center shadow hover:shadow-lg transition"
                    >
                      <FilePreview file={file} />
                      <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <button
                          onClick={() => downloadFile(file)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-xs font-medium transition"
                        >
                          {t("dashboard.Download")}
                        </button>
                        <button
                          onClick={() => handleDelete(file)}
                          className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-xs font-medium transition"
                        >
                          {t("dashboard.Delete")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          )
      )}
    </div>
  );
};

export default Dashboard;


