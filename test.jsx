





const [user, setUser] = useState(null);
const [files, setFiles] = useState([]);
const [selectedFile, setSelectedFile] = useState(null);
const [loadingFiles, setLoadingFiles] = useState(true);
const [uploading, setUploading] = useState(false);
const navigate = useNavigate();

// ---------------- بارگذاری کاربر و فایل‌ها ----------------
useEffect(() => {
  const savedUser = localStorage.getItem("user");
  if (!savedUser) {
    navigate("/login");
    return;
  }

  const parsedUser = JSON.parse(savedUser);
  setUser(parsedUser);

  loadFiles(parsedUser.email);
}, [navigate]);

const loadFiles = async (email) => {
  setLoadingFiles(true);
  try {
    const res = await getFiles(email);
    setFiles(res.data);
  } catch (err) {
    console.error("Error fetching files:", err);
    setFiles([]);
  } finally {
    setLoadingFiles(false);
  }
};

// ---------------- آپلود فایل ----------------
const handleUpload = async () => {
  if (!selectedFile) return;
  setUploading(true);

  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("email", user.email);

  try {
    await uploadFile(formData);
    setSelectedFile(null);
    loadFiles(user.email);
  } catch (err) {
    console.error("Error uploading file:", err);
  } finally {
    setUploading(false);
  }
};

// ---------------- حذف فایل ----------------
const handleDelete = async (filename) => {
  try {
    await deleteFile(user.email, filename);
    loadFiles(user.email);
  } catch (err) {
    console.error("Error deleting file:", err);
  }
};

// ---------------- خروج ----------------
const handleLogout = () => {
  localStorage.removeItem("user");
  navigate("/Landing");
};

if (!user) return <div>Loading...</div>;













<div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6">
<div className="max-w-5xl mx-auto">
  {/* سلام */}
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-gray-800">
      سلام، {user.username} 👋
    </h1>
    <button
      onClick={handleLogout}
      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
    >
      خروج
    </button>
  </div>




  {/* آپلود فایل */}
  <div className="bg-white p-6 rounded-xl shadow mb-6 flex flex-col md:flex-row items-center gap-4">
    <input
      type="file"
      onChange={(e) => setSelectedFile(e.target.files[0])}
      className="border border-gray-300 rounded p-2"
    />
    <button
      onClick={handleUpload}
      disabled={!selectedFile || uploading}
      className={`px-6 py-2 rounded font-semibold shadow-md transition ${
        uploading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {uploading ? "در حال آپلود..." : "آپلود فایل"}
    </button>
  </div>







  {/* لیست فایل‌ها */}
  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="text-xl font-semibold mb-4">فایل‌های من</h2>

    {loadingFiles ? (
      <p>در حال بارگذاری فایل‌ها...</p>
    ) : files.length === 0 ? (
      <p>هیچ فایلی آپلود نشده است.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="border rounded p-4 flex flex-col justify-between bg-gray-50 hover:bg-gray-100 transition"
          >
            <a
              href={file.url}
              download
              className="text-blue-600 underline mb-2 truncate"
              title={file.filename}
            >
              {file.filename}
            </a>
            <button
              onClick={() => handleDelete(file.filename)}
              className="mt-auto px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              حذف
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
</div>








