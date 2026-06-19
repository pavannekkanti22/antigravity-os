import { useState, useEffect } from "react";
import { Shield, Plus, Pencil, Trash2, X, Check, AlertCircle, Users } from "lucide-react";
import { api } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const fallbackRoles = [
  { id: 1, name: "ADMIN", description: "Full system access", permissions: ["all"], userCount: 2, createdAt: new Date().toISOString() },
  { id: 2, name: "USER", description: "Standard user access", permissions: ["read", "write"], userCount: 15, createdAt: new Date().toISOString() },
  { id: 3, name: "MANAGER", description: "Manager with elevated permissions", permissions: ["read", "write", "manage_users"], userCount: 4, createdAt: new Date().toISOString() },
];

const allPermissions = [
  "read", "write", "delete", "manage_users", "manage_roles", "manage_settings",
  "view_analytics", "view_logs", "manage_notifications", "manage_security",
];

function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", permissions: [] });

  useEffect(() => {
    api.getRoles().then(setRoles).catch(() => setRoles(fallbackRoles));
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const togglePermission = (perm) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm) ? prev.permissions.filter(p => p !== perm) : [...prev.permissions, perm]
    }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", permissions: [] });
    setShowModal(true);
  };

  const openEdit = (role) => {
    setEditing(role);
    setForm({ name: role.name, description: role.description, permissions: [...(role.permissions || [])] });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { showToast("Role name is required", "error"); return; }
    try {
      if (editing) {
        await api.updateRole(editing.id, form);
        showToast("Role updated");
      } else {
        await api.createRole(form);
        showToast("Role created");
      }
      setShowModal(false);
      const data = await api.getRoles();
      setRoles(data);
    } catch {
      // Fallback: update locally
      setRoles(prev => editing
        ? prev.map(r => r.id === editing.id ? { ...r, ...form } : r)
        : [...prev, { id: Date.now(), ...form, userCount: 0, createdAt: new Date().toISOString() }]
      );
      setShowModal(false);
      showToast(editing ? "Role updated (locally)" : "Role created (locally)");
    }
  };

  const deleteRole = async (id) => {
    try {
      await api.deleteRole(id);
      setRoles(prev => prev.filter(r => r.id !== id));
      showToast("Role deleted");
    } catch {
      setRoles(prev => prev.filter(r => r.id !== id));
      showToast("Role deleted (locally)");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Role Management</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Define roles and permissions for your platform</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-black font-medium text-sm transition cursor-pointer">
          <Plus size={16} /> Create Role
        </button>
      </div>

      <div className="grid gap-4">
        {roles.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-zinc-900/60 border border-zinc-800">
            <Shield size={32} className="text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No roles defined yet</p>
          </div>
        ) : (
          roles.map((role) => (
            <div key={role.id} className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5 hover:border-zinc-700 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <Shield size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{role.name}</h3>
                    <p className="text-zinc-400 text-sm">{role.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-zinc-500 text-xs flex items-center gap-1"><Users size={12} /> {role.userCount} users</span>
                      <span className="text-zinc-600 text-xs">{new Date(role.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(role)} className="p-2 rounded-lg bg-zinc-800/40 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"><Pencil size={14} /></button>
                  <button onClick={() => deleteRole(role.id)} className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition cursor-pointer"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(role.permissions || []).map((perm, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-800/60 text-zinc-300 text-[10px] font-mono">{perm}</span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-[#0a0a0f] shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">{editing ? "Edit Role" : "Create Role"}</h2>
                  <p className="text-zinc-500 text-xs mt-0.5">{editing ? "Modify role details and permissions" : "Define a new role with specific permissions"}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-400 text-xs font-medium mb-1.5">Role Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. MODERATOR"
                    className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-medium mb-1.5">Description</label>
                  <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of this role"
                    className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-medium mb-2">Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {allPermissions.map((perm) => (
                      <button key={perm} onClick={() => togglePermission(perm)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition cursor-pointer capitalize ${
                          form.permissions.includes(perm) ? "bg-violet-500/10 border-violet-500/30 text-violet-300" : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                        }`}>
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${form.permissions.includes(perm) ? "bg-violet-500 border-violet-500" : "border-zinc-700"}`}>
                          {form.permissions.includes(perm) && <Check size={10} className="text-white" />}
                        </div>
                        {perm.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/50">
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white text-sm transition cursor-pointer">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-black font-medium text-sm transition cursor-pointer">{editing ? "Save" : "Create"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default RoleManagement;