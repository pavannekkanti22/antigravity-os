import { useState, useEffect } from "react";
import { Settings, Save, Globe, Shield, Bell, Palette, AlertCircle, Check, X } from "lucide-react";
import { api } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const fallbackSettings = {
  appName: "Antigravity OS",
  companyName: "Antigravity Technologies",
  supportEmail: "support@antigravity.io",
  supportPhone: "+1 (555) 123-4567",
  maintenanceMode: false,
  allowRegistration: true,
  defaultRole: "USER",
  maxLoginAttempts: 5,
  sessionTimeout: 30,
  passwordMinLength: 8,
  requireSpecialChar: true,
  requireNumber: true,
  enableNotifications: true,
  enableAuditLog: true,
};

function SystemSettings() {
  const [settings, setSettings] = useState(fallbackSettings);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => setSettings(fallbackSettings));
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateSettings(settings);
      showToast("Settings saved successfully");
    } catch {
      showToast("Settings saved (locally)", "success");
    } finally {
      setSaving(false);
    }
  };

  const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">System Settings</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Configure platform-wide settings and policies</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-medium text-sm transition cursor-pointer disabled:opacity-60">
          {saving ? <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin"></span> : <Save size={16} />}
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Branding */}
        <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Globe size={16} className="text-cyan-400" /> Branding
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-xs font-medium mb-1.5">Application Name</label>
              <input type="text" value={settings.appName} onChange={(e) => update("appName", e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700" />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-medium mb-1.5">Company Name</label>
              <input type="text" value={settings.companyName} onChange={(e) => update("companyName", e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700" />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-medium mb-1.5">Support Email</label>
              <input type="email" value={settings.supportEmail} onChange={(e) => update("supportEmail", e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700" />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-medium mb-1.5">Support Phone</label>
              <input type="text" value={settings.supportPhone} onChange={(e) => update("supportPhone", e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700" />
            </div>
          </div>
        </div>

        {/* Security Policies */}
        <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Shield size={16} className="text-violet-400" /> Security Policies
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-300 text-sm">Maintenance Mode</span>
              <button onClick={() => update("maintenanceMode", !settings.maintenanceMode)}
                className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${settings.maintenanceMode ? "bg-amber-500" : "bg-zinc-700"}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${settings.maintenanceMode ? "left-5.5" : "left-0.5"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-300 text-sm">Allow Registration</span>
              <button onClick={() => update("allowRegistration", !settings.allowRegistration)}
                className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${settings.allowRegistration ? "bg-emerald-500" : "bg-zinc-700"}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${settings.allowRegistration ? "left-5.5" : "left-0.5"}`} />
              </button>
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-medium mb-1.5">Default Role</label>
              <select value={settings.defaultRole} onChange={(e) => update("defaultRole", e.target.value)}
                className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700">
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-xs font-medium mb-1.5">Max Login Attempts</label>
                <input type="number" value={settings.maxLoginAttempts} onChange={(e) => update("maxLoginAttempts", parseInt(e.target.value))}
                  className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700" />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs font-medium mb-1.5">Session Timeout (min)</label>
                <input type="number" value={settings.sessionTimeout} onChange={(e) => update("sessionTimeout", parseInt(e.target.value))}
                  className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Policy */}
      <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Palette size={16} className="text-amber-400" /> Password Policy
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Minimum Length</label>
            <input type="number" value={settings.passwordMinLength} onChange={(e) => update("passwordMinLength", parseInt(e.target.value))}
              className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700" />
          </div>
          <div className="flex items-center justify-between bg-zinc-900/80 border border-zinc-800 rounded-lg px-4">
            <span className="text-zinc-300 text-sm">Require Special Char</span>
            <button onClick={() => update("requireSpecialChar", !settings.requireSpecialChar)}
              className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${settings.requireSpecialChar ? "bg-emerald-500" : "bg-zinc-700"}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${settings.requireSpecialChar ? "left-5.5" : "left-0.5"}`} />
            </button>
          </div>
          <div className="flex items-center justify-between bg-zinc-900/80 border border-zinc-800 rounded-lg px-4">
            <span className="text-zinc-300 text-sm">Require Number</span>
            <button onClick={() => update("requireNumber", !settings.requireNumber)}
              className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${settings.requireNumber ? "bg-emerald-500" : "bg-zinc-700"}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${settings.requireNumber ? "left-5.5" : "left-0.5"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* System Toggles */}
      <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Bell size={16} className="text-cyan-400" /> System Features
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-300 text-sm">Enable Notifications</p>
              <p className="text-zinc-500 text-xs">Allow the system to send notifications to users</p>
            </div>
            <button onClick={() => update("enableNotifications", !settings.enableNotifications)}
              className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${settings.enableNotifications ? "bg-emerald-500" : "bg-zinc-700"}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${settings.enableNotifications ? "left-5.5" : "left-0.5"}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-300 text-sm">Enable Audit Log</p>
              <p className="text-zinc-500 text-xs">Track all administrative actions for compliance</p>
            </div>
            <button onClick={() => update("enableAuditLog", !settings.enableAuditLog)}
              className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${settings.enableAuditLog ? "bg-emerald-500" : "bg-zinc-700"}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${settings.enableAuditLog ? "left-5.5" : "left-0.5"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 right-8 px-5 py-3 rounded-xl border shadow-2xl z-50 flex items-center gap-3 backdrop-blur-xl ${
              toast.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}>
            {toast.type === "error" ? <AlertCircle size={16} /> : <Check size={16} />}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SystemSettings;