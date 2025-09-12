import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile, getFiles, deleteFile } from "../services/contactService";
import cloudImg from "../assets/abr-icon.png";
import picImg from "../assets/picimg.png";
import vidImg from "../assets/vidimg.png";
import fileimg from "../assets/fileimg.png";
import { toast } from "react-toastify";
import axios from "axios";

// ---------- FilePreview Component ----------
const FilePreview = ({ file }) => {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    let url;
    const fetchFile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:9000/download/${file.email}/${file.filename}`,
          { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
        );
        url = window.URL.createObjectURL(res.data);
        setBlobUrl(url);
      } catch (err) {
        console.error("Error loading file preview:", err);
      }
    };
    fetchFile();
    return () => url && window.URL.revokeObjectURL(url);
  }, [file]);

  if (!blobUrl) return <p>Loading...</p>;

  if (file.filename.match(/\.(png|jpg|jpeg|gif)$/i))
    return <img src={blobUrl} alt={file.filename} className="w-32 h-24 object-cover rounded" />;
  if (file.filename.match(/\.(mp4|mov|avi)$/i))
    return <video controls src={blobUrl} className="w-32 h-24 object-cover rounded" />;
  if (file.filename.match(/\.(mp3|wav|ogg|m4a)$/i))
    return <audio controls src={blobUrl} className="w-64" />;

  return <img src={fileimg} alt="file icon" className="w-16 h-16 object-contain" />;
};

// ---------- Dashboard Component ----------
const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

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

  const toggleSection = (section) => {
    setSectionsOpen({
      picture: section === "picture",
      video: section === "video",
      file: section === "file",
      music: section === "music",
    });
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      navigate("/Landing/login");
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    loadFiles(parsedUser.email);
  }, [navigate]);

  const loadFiles = async (email, limit = 20, offset = 0) => {
    setLoadingFiles(true);
    try {
      const res = await getFiles(email);
      const filesWithEmail = res.data.map(f => ({ ...f, email }));
      setFiles(filesWithEmail.slice(0, limit + offset));
    } catch {
      toast.error("خطا در بارگذاری فایل‌ها");
      setFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleUpload = async (type) => {
    if (!selectedFiles[type] || !user) return;

    setUploading(prev => ({ ...prev, [type]: true }));
    const formData = new FormData();
    formData.append("file", selectedFiles[type]);

    try {
      await uploadFile(formData);
      toast.success("فایل با موفقیت آپلود شد");
      setSelectedFiles(prev => ({ ...prev, [type]: null }));
      loadFiles(user.email);
    } catch {
      toast.error("خطا در آپلود فایل");
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleDelete = async (filename) => {
    if (!user) return;
    try {
      await deleteFile(user.email, filename);
      toast.success("فایل حذف شد");
      loadFiles(user.email);
    } catch {
      toast.error("خطا در حذف فایل");
    }
  };

  const downloadFile = async (file) => {
    if (!user) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:9000/download/${user.email}/${file.filename}`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("دانلود نشد، دوباره امتحان کن");
    }
  };

  const imageFiles = files.filter(f => /\.(png|jpg|jpeg|gif)$/i.test(f.filename));
  const videoFiles = files.filter(f => /\.(mp4|mov|avi)$/i.test(f.filename));
  const musicFiles = files.filter(f => /\.(mp3|wav|ogg|m4a)$/i.test(f.filename));
  const otherFiles = files.filter(f => !/\.(png|jpg|jpeg|gif|mp4|mov|avi|mp3|wav|ogg|m4a)$/i.test(f.filename));

  const sections = [
    { key: "picture", open: sectionsOpen.picture, files: imageFiles, icon: picImg, label: "Upload Picture" },
    { key: "video", open: sectionsOpen.video, files: videoFiles, icon: vidImg, label: "Upload Video" },
    { key: "music", open: sectionsOpen.music, files: musicFiles, icon: fileimg, label: "Upload Music" },
    { key: "file", open: sectionsOpen.file, files: otherFiles, icon: fileimg, label: "Upload File" },
  ];

  return (
    <div className="bg-black text-white min-h-screen w-full flex flex-col items-center py-10 px-6 md:px-12">
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">My Cloud</h1>
        <img src={cloudImg} alt="Cloud" className="w-24 sm:w-28 md:w-32 object-contain md:mt-0 mt-6" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-8 w-full justify-center">
        {sections.map(s => (
          <button
            key={s.key}
            className={`${s.open ? "text-white border-b-2" : "text-gray-400 border-white"}`}
            onClick={() => toggleSection(s.key)}
          >
            {s.key.charAt(0).toUpperCase() + s.key.slice(1) + "s"}
          </button>
        ))}
      </div>

      {sections.map((section, idx) => section.open && (
        <div key={idx} className="bg-gray-900 rounded-xl p-6 w-full flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-24 h-16 bg-gray-700 flex items-center justify-center rounded-lg">
              <img src={section.icon} alt="upload preview" className="opacity-70" />
            </div>
            <input type="file" onChange={(e) => setSelectedFiles(prev => ({ ...prev, [section.key]: e.target.files[0] }))} className="border border-gray-300 rounded p-2" />
            <button
              onClick={() => handleUpload(section.key)}
              disabled={!selectedFiles[section.key] || uploading[section.key]}
              className="bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-600 w-full sm:w-auto"
            >
              {uploading[section.key] ? "Uploading..." : section.label}
            </button>
          </div>

          <hr className="border-gray-700" />

          {loadingFiles ? <p>Loading files...</p> :
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {section.files.map(file => (
                <div key={file.filename} className="flex flex-col gap-2 items-center">
                  <FilePreview file={file} />
                  <div className="flex gap-2">
                    <button onClick={() => downloadFile(file)} className="bg-blue-600 px-2 py-1 rounded text-sm hover:bg-blue-500">Download</button>
                    <button onClick={() => handleDelete(file.filename)} className="bg-red-600 px-2 py-1 rounded text-sm hover:bg-red-500">Delete</button>
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
