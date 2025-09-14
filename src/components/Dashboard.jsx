import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cloudImg from "../assets/abr-icon.png";
import picImg from "../assets/picimg.png";
import vidImg from "../assets/vidimg.png";
import fileimg from "../assets/fileimg.png";
import { toast } from "react-toastify";
import { uploadFile, listFiles, createSignedUrl, deleteFile, getCurrentUser, signOut,} from "../services/supabaseService";
import { useTranslation } from "react-i18next";



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

  return (
    <div className={`bg-black text-white min-h-screen w-full flex flex-col items-center py-10 px-6 md:px-12 ${i18n.language === "fa" ? "font-v" : "font-sans"}`}>
      <div className="flex items-center justify-between w-full max-w-6xl mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">My Cloud</h1>
          <img src={cloudImg} alt="Cloud" className="w-12" />
        </div>
        <div className="flex items-center gap-4">
          <span>{user?.email}</span>
          <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">{t("dashboard.Logout")}</button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        {sections.map(s => (
          <button key={s.key} onClick={() => toggleSection(s.key)} className={`${s.open ? "text-white border-b-2" : "text-gray-400"}`}>
            {s.key}
          </button>
        ))}
      </div>

      {sections.map((section, idx) => section.open && (
        <div key={idx} className="bg-gray-900 rounded-xl p-6 w-full max-w-6xl flex flex-col gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-24 h-16 bg-gray-700 flex items-center justify-center rounded-lg">
              <img src={section.icon} alt="upload preview" className="opacity-70" />
            </div>
            <input type="file" onChange={(e) => setSelectedFiles(prev => ({ ...prev, [section.key]: e.target.files[0] }))} />
            <button onClick={() => handleUpload(section.key)} disabled={!selectedFiles[section.key] || uploading[section.key]} className="bg-gray-700 px-6 py-2 rounded-lg">
              {uploading[section.key] ? `${t("dashboard.upl")}` : section.label}
            </button>
          </div>

          <hr className="border-gray-700" />

          {loadingFiles ? <p>{t("dashboard.loading")}</p> :
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {section.files.map(file => (
                <div key={file.filename} className="flex flex-col gap-2 items-center">
                  <FilePreview file={file} />
                  <div className="flex gap-2">
                    <button onClick={() => downloadFile(file)} className="bg-blue-600 px-2 py-1 rounded text-sm">{t("dashboard.Download")}</button>
                    <button onClick={() => handleDelete(file)} className="bg-red-600 px-2 py-1 rounded text-sm">{t("dashboard.Delete")}</button>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      ))}
    </div>
  );
};

export default Dashboard;


