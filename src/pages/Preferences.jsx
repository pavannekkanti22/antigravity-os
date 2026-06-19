import { useState } from "react";
import { Moon, Sun, Globe, Clock, Bell, Save, Check, AlertCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

function Preferences() {
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = async () => {
    localStorage.setItem("preferences", JSON.stringify({ language, timezone, emailNotifs, pushNotifs, theme }));
    showToast("Preferences saved");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Preferences</h1>
        <p className="text-zinc-500 text-sm mt-0.5">Customize your experience</p>
      </div>

      {/* Appearance */}
      <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          {theme === "dark" ? <Moon size={16} className="text-violet-400" /> : <Sun size={16} className="text-amber-400" />}
          Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-300 text-sm font-medium">Theme</p>
            <p className="text-zinc-500 text-xs mt-0.5">Switch between dark and light mode</p>
          </div>
          <button onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border transition cursor-pointer text-sm font-medium"
            style={{ borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}>
            {theme === "dark" ? <><Moon size={14} /> Dark</> : <><Sun size={14} /> Light</>}
          </button>
        </div>
      </div>

      {/* Language & Region */}
      <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Globe size={16} className="text-cyan-400" /> Language & Region
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)}
              className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
            </select>
          </div>
          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Timezone</label>
            <select value={timezone} onChange={e => setTimezone(e.target.value)}
              className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700">
              {["UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "Europe/London", "Europe/Paris", "Europe/Berlin", "Asia/Tokyo", "Asia/Shanghai", "Asia/Kolkata", "Australia/Sydney"].map(tz => (
                <option key={tz} value={tz}>{tz.replace("_", " ")}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Bell size={16} className="text-amber-400" /> Notification Preferences
        </h3>
        <div className="space-y-4">
          {[
            { label: "Email Notifications", desc: "Receive notifications via email", val: emailNotifs, set: setEmailNotifs },
            { label: "Push Notifications", desc: "Receive in-app push notifications", val: pushNotifs, set: setPushNotifs },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="text-zinc-300 text-sm">{item.label}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{item.desc}</p>
              </div>
              <button onClick={() => item.set(!item.val)}
                className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${item.val ? "bg-emerald-500" : "bg-zinc-700"}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${item.val ? "left-5.5" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-medium text-sm transition cursor-pointer">
        <Save size={16} /> Save Preferences
      </button>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 right-8 px-5 py-3 rounded-xl border shadow-2xl z-50 flex items-center gap-3 backdrop-blur-xl ${
              toast.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}>
            {toast.type === "error" ? <AlertCircle size={16} /> : <Check size={16} />}
            <span className="text-sm font-medium">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Preferences;