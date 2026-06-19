import { useEffect, useState, useRef } from "react";
import {
  User as UserIcon,
  Lock,
  Shield,
  Activity,
  Check,
  AlertCircle,
  Camera,
  Sparkles,
  Clock,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const avatarsList = [
  { id: "avatar1", name: "Cyber Commander", color: "from-cyan-500 to-blue-500", icon: "🌌" },
  { id: "avatar2", name: "Neural Hacker", color: "from-violet-500 to-fuchsia-500", icon: "⚡" },
  { id: "avatar3", name: "Quantum Operator", color: "from-emerald-500 to-green-500", icon: "🧩" },
  { id: "avatar4", name: "Matrix Agent", color: "from-amber-500 to-orange-500", icon: "🕶️" },
  { id: "avatar5", name: "AI Singularity", color: "from-pink-500 to-rose-500", icon: "🔮" },
  { id: "avatar6", name: "Grid Architect", color: "from-teal-500 to-cyan-500", icon: "🌐" }
];

function Profile() {
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState("avatar1");
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [toast, setToast] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadProfile();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  async function loadProfile() {
    try {
      const response = await fetch("http://localhost:8081/api/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load profile");
      }

      const data = await response.json();
      setProfile(data);
      setFullName(data.fullName);
      setAvatar(data.avatar || "avatar1");
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch profile details", "error");
    }
  }

  const updateProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast("Full name cannot be empty", "error");
      return;
    }

    try {
      setProfileLoading(true);
      const response = await fetch("http://localhost:8081/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName,
          avatar
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      showToast("Profile details updated successfully");
      loadProfile();
    } catch (error) {
      console.error(error);
      showToast(error.message || "Failed to update profile", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast("Current password is required", "error");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showToast("New password must be at least 6 characters long", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    try {
      setPassLoading(true);
      const response = await fetch("http://localhost:8081/api/profile/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      showToast("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      showToast(error.message || "Incorrect current password.", "error");
    } finally {
      setPassLoading(false);
    }
  };

  const isImageAvatar = (val) => val && (val.startsWith("http") || val.startsWith("/") || val.startsWith("data:"));

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:8081/api/profile/upload-avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      await updateProfileAvatar(data.url);
    } catch (err) {
      showToast(err.message || "Upload failed", "error");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const updateProfileAvatar = async (avatarUrl) => {
    const response = await fetch("http://localhost:8081/api/profile/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ fullName, avatar: avatarUrl }),
    });
    if (!response.ok) throw new Error(await response.text());
    setAvatar(avatarUrl);
    showToast("Avatar updated successfully");
    loadProfile();
  };

  const currentAvatarInfo = avatarsList.find(a => a.id === avatar) || avatarsList[0];

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        <span className="text-zinc-500 font-mono text-xs ml-3">Loading core identity profiles...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-violet-400 animate-pulse" />
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono">
            Identity Node Config
          </span>
        </div>
        <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-wider uppercase font-mono">
          Commander Settings
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Manage your localized cryptographic credentials and profile interface.
        </p>
      </div>

      {/* CORE PROFILE CARD */}
      <div className="rounded-[32px] border border-white/10 bg-zinc-950/40 p-8 backdrop-blur-3xl shadow-xl flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            {isImageAvatar(avatar) ? (
              <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-lg relative z-10 border-2 border-white/5">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${currentAvatarInfo.color} flex items-center justify-center text-5xl shadow-lg relative z-10`}>
                {currentAvatarInfo.icon}
              </div>
            )}
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingFile}
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-cyan-400 flex items-center justify-center hover:text-white hover:border-cyan-500 transition-all duration-300 z-20 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Camera size={18} />
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileSelect} />
          <div className="flex flex-col items-center gap-1.5">
            <button 
              onClick={() => setShowAvatarModal(true)}
              className="text-cyan-400 text-[11px] font-mono hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Choose emoji avatar
            </button>
            {uploadingFile && <span className="text-zinc-500 text-[10px] font-mono animate-pulse">Uploading...</span>}
          </div>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white leading-tight">{profile.fullName}</h2>
            <p className="text-zinc-500 text-sm">{profile.email}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Shield size={14} />
              {profile.role}
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Activity size={14} />
              Active
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
              <Clock size={14} />
              Joined {new Date(profile.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* EDIT PROFILE DETAILS */}
        <div className="rounded-[32px] border border-white/10 bg-zinc-950/40 p-6 md:p-8 backdrop-blur-3xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-white text-xl font-bold font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
              <UserIcon size={18} className="text-cyan-400" />
              Modify Identity
            </h3>
            <p className="text-zinc-500 text-xs mb-6">
              Update your secure interface designation moniker.
            </p>

            <form onSubmit={updateProfile} className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-xs font-medium uppercase tracking-widest mb-2">
                  Full Name / Call Sign
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all duration-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-xs font-medium uppercase tracking-widest mb-2">
                  Assigned Avatar Type
                </label>
                <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
                  {isImageAvatar(avatar) ? (
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/5 flex-shrink-0">
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentAvatarInfo.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {currentAvatarInfo.icon}
                    </div>
                  )}
                  <div>
                    <span className="text-white text-sm font-bold block">
                      {isImageAvatar(avatar) ? "Uploaded Photo" : currentAvatarInfo.name}
                    </span>
                    <button 
                      type="button"
                      onClick={() => setShowAvatarModal(true)}
                      className="text-cyan-400 text-xs hover:text-cyan-300 transition-colors text-left"
                    >
                      {isImageAvatar(avatar) ? "Switch to emoji avatar" : "Choose another avatar"}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="w-full py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                {profileLoading ? (
                  <span className="w-5 h-5 border-2 border-black/35 border-t-black rounded-full animate-spin"></span>
                ) : (
                  "Commit Identity Changes"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="rounded-[32px] border border-white/10 bg-zinc-950/40 p-6 md:p-8 backdrop-blur-3xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-white text-xl font-bold font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
              <Lock size={18} className="text-violet-400" />
              Cryptographic Shift
            </h3>
            <p className="text-zinc-500 text-xs mb-6">
              Rotate your account security token access keys.
            </p>

            <form onSubmit={updatePassword} className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-xs font-medium uppercase tracking-widest mb-2">
                  Current Key Pass
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-3.5 pr-12 text-white placeholder-zinc-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all duration-300 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-xs font-medium uppercase tracking-widest mb-2">
                  New Key Pass
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-3.5 pr-12 text-white placeholder-zinc-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all duration-300 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-xs font-medium uppercase tracking-widest mb-2">
                  Confirm Shift Key Pass
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-3.5 pr-12 text-white placeholder-zinc-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all duration-300 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={passLoading}
                className="w-full py-4 rounded-2xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-sm shadow-lg shadow-violet-500/20 transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                {passLoading ? (
                  <span className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
                ) : (
                  "Initiate Shift Rotation"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* AVATAR SELECTOR MODAL */}
      <AnimatePresence>
        {showAvatarModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-[28px] border border-cyan-500/20 bg-[#05070c] shadow-[0_0_60px_rgba(34,211,238,0.12)] overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400"></div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white font-mono uppercase tracking-wider">Choose Avatar Profile</h3>
                    <p className="text-zinc-500 text-xs mt-1">Select a digital calling card interface visual.</p>
                  </div>
                  <button 
                    onClick={() => setShowAvatarModal(false)}
                    className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-lg cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {avatarsList.map((av) => (
                    <button
                      key={av.id}
                      onClick={() => {
                        setAvatar(av.id);
                        setShowAvatarModal(false);
                      }}
                      className={`p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center gap-3 cursor-pointer ${
                        avatar === av.id
                          ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                          : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${av.color} flex items-center justify-center text-3xl shadow-md`}>
                        {av.icon}
                      </div>
                      <span className="text-zinc-300 text-xs font-semibold">{av.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST FEEDBACK */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl border shadow-2xl z-50 flex items-center gap-3 backdrop-blur-xl ${
              toast.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-400 shadow-red-500/5"
                : "bg-green-500/10 border-green-500/20 text-green-400 shadow-green-500/5"
            }`}
          >
            {toast.type === "error" ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
            <span className="text-sm font-semibold tracking-wide">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Profile;