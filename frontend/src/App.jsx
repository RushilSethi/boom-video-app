import { useEffect, useState } from "react";

function App() {
  const [view, setView] = useState("home");
  const [authView, setAuthView] = useState("login");
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch(() => setVideos([]));
  }, []);

  const handleLike = async (id) => {
    await fetch(`http://localhost:5000/api/videos/like/${id}`, {
      method: "POST",
    });
    setVideos((prev) =>
      prev.map((v) => (v._id === id ? { ...v, likes: v.likes + 1 } : v))
    );
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData();
    data.append("title", form.title.value);
    data.append("video", form.video.files[0]);

    await fetch("http://localhost:5000/api/videos/upload", {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    form.reset();
    alert("Upload successful!");
    setView("home");
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.name?.value,
      email: form.email.value,
      password: form.password.value,
    };

    const route = authView === "login" ? "login" : "register";

    const res = await fetch(`http://localhost:5000/api/auth/${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setView("home");
    } else {
      alert(data.message || "Authentication failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4">
      {/* Header */}
      <div className="w-full max-w-3xl mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800">
            BOOM Entertainment
          </h1>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => setView("auth")}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Login
            </button>
          )}
        </div>

        {/* Breadcrumb */}
        <div className="mt-3 flex gap-2 text-sm text-gray-600">
          <div
            onClick={() => setView("home")}
            className={`cursor-pointer px-3 py-1 rounded-full transition ${
              view === "home"
                ? "bg-gray-300 text-black font-medium"
                : "hover:bg-gray-200"
            }`}
          >
            Home
          </div>
          <div className="text-gray-400">›</div>
          <div
            onClick={() => setView("upload")}
            className={`cursor-pointer px-3 py-1 rounded-full transition ${
              view === "upload"
                ? "bg-gray-300 text-black font-medium"
                : "hover:bg-gray-200"
            }`}
          >
            Upload
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-3xl">
        {view === "auth" ? (
          <form
            onSubmit={handleAuth}
            className="bg-white shadow-lg border border-gray-200 rounded-xl p-8 space-y-5"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {authView === "login" ? "Login" : "Register"}
            </h2>

            {authView === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  name="name"
                  required
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              {authView === "login" ? "Login" : "Register"}
            </button>

            <p className="text-sm mt-2">
              {authView === "login" ? (
                <>
                  Don't have an account?{" "}
                  <span
                    onClick={() => setAuthView("register")}
                    className="text-blue-600 cursor-pointer"
                  >
                    Register
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    onClick={() => setAuthView("login")}
                    className="text-blue-600 cursor-pointer"
                  >
                    Login
                  </span>
                </>
              )}
            </p>
          </form>
        ) : view === "upload" ? (
          user ? (
            <form
              onSubmit={handleUpload}
              className="bg-white shadow-lg border border-gray-200 rounded-xl p-8 space-y-5"
            >
              <h2 className="text-2xl font-semibold text-gray-800">
                Upload a New Video
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video File
                </label>
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  required
                  className="w-full file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Upload Video
              </button>
            </form>
          ) : (
            <div className="bg-white text-center text-gray-700 rounded-lg p-6 shadow">
              You must be logged in to upload a video.
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {videos.length === 0 ? (
              <div className="text-center text-gray-500 text-lg mt-10">
                No videos uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {videos.map((video) => (
                  <div key={video._id} className="bg-white shadow rounded p-4">
                    <h2 className="text-xl font-semibold mb-2">
                      {video.title}
                    </h2>
                    <video
                      src={`http://localhost:5000/uploads/${video.filename}`}
                      controls
                      className="w-full rounded mb-2"
                    />
                    <button
                      onClick={() => handleLike(video._id)}
                      className="flex items-center gap-1 text-red-600 border border-red-500 px-3 py-1.5 rounded-full text-sm font-medium bg-white hover:bg-red-50 transition"
                    >
                      ❤️ <span>Like</span> ({video.likes})
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
