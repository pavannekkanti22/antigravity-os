import { useState, useEffect } from "react";
import { Building2, Plus, Search, Users, HardDrive, Activity, Globe, Mail, Phone, Calendar, CheckCircle, X, AlertCircle, Edit3, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fallbackOrgs = [
  { id: 1, name: "Antigravity OS", domain: "antigravity.io", plan: "enterprise", status: "active", users: 24, storageGB: 156, apiCalls: 452000, contactName: "Alex Chen", contactEmail: "alex@antigravity.io", contactPhone: "+1 (555) 123-4567", createdAt: "2025-01-15", members: [
    { email: "admin@antigravity.io", role: "Owner", joined: "2025-01-15" }, { email: "james@example.com", role: "Admin", joined: "2025-02-20" }, { email: "sarah@example.com", role: "Member", joined: "2025-03-10" },
  ]},
  { id: 2, name: "TechStart Inc", domain: "techstart.com", plan: "business", status: "active", users: 12, storageGB: 48, apiCalls: 128000, contactName: "James Wilson", contactEmail: "james@techstart.com", contactPhone: "+1 (555) 987-6543", createdAt: "2025-03-01", members: [
    { email: "james@techstart.com", role: "Owner", joined: "2025-03-01" },
  ]},
  { id: 3, name: "DataFlow Analytics", domain: "dataflow.io", plan: "free", status: "trial", users: 3, storageGB: 2, apiCalls: 8500, contactName: "Maria Garcia", contactEmail: "maria@dataflow.io", contactPhone: "+1 (555) 456-7890", createdAt: "2026-06-01", members: [
    { email: "maria@dataflow.io", role: "Owner", joined: "2026-06-01" },
  ]},
  { id: 4, name: "SecureNet Solutions", domain: "securenet.com", plan: "enterprise", status: "suspended", users: 47, storageGB: 312, apiCalls: 890000, contactName: "Robert Kim", contactEmail: "robert@securenet.com", contactPhone: "+1 (555) 321-0987", createdAt: "2024-09-10", members: [
    { email: "robert@securenet.com", role: "Owner", joined: "2024-09-10" }, { email: "ops@securenet.com", role: "Admin", joined: "2024-10-01" },
  ]},
  { id: 5, name: "CloudBase Devs", domain: "cloudbase.dev", plan: "startup", status: "active", users: 8, storageGB: 18, apiCalls: 45000, contactName: "Priya Patel", contactEmail: "priya@cloudbase.dev", contactPhone: "+1 (555) 789-0123", createdAt: "2026-04-20", members: [
    { email: "priya@cloudbase.dev", role: "Owner", joined: "2026-04-20" }, { email: "dev@cloudbase.dev", role: "Member", joined: "2026-05-01" },
  ]},
];

const plans = ["free", "startup", "business", "enterprise"];
const statuses = ["active", "trial", "suspended"];

const planColors = { free: "text-zinc-400 bg-zinc-500/10", startup: "text-blue-400 bg-blue-500/10", business: "text-amber-400 bg-amber-500/10", enterprise: "text-violet-400 bg-violet-500/10" };
const statusColors = { active: "text-emerald-400 bg-emerald-500/10", trial: "text-cyan-400 bg-cyan-500/10", suspended: "text-red-400 bg-red-500/10" };

function OrganizationManagement() {
  const [orgs, setOrgs] = useState([]);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [expandedOrg, setExpandedOrg] = useState(null);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({ name: "", domain: "", plan: "startup", contactName: "", contactEmail: "", contactPhone: "" });

  useEffect(() => { setOrgs(fallbackOrgs); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const openCreate = () => {
    setEditingOrg(null);
    setForm({ name: "", domain: "", plan: "startup", contactName: "", contactEmail: "", contactPhone: "" });
    setShowCreate(true);
  };

  const openEdit = (org) => {
    setEditingOrg(org);
    setForm({ name: org.name, domain: org.domain, plan: org.plan, contactName: org.contactName, contactEmail: org.contactEmail, contactPhone: org.contactPhone });
    setShowCreate(true);
  };

  const saveOrg = () => {
    if (!form.name.trim() || !form.domain.trim()) { showToast("Name and domain are required", "error"); return; }
    if (editingOrg) {
      setOrgs(prev => prev.map(o => o.id === editingOrg.id ? { ...o, ...form } : o));
      showToast("Organization updated");
    } else {
      const newOrg = { id: Date.now(), ...form, status: "active", users: 0, storageGB: 0, apiCalls: 0, createdAt: new Date().toISOString().split("T")[0], members: [] };
      setOrgs(prev => [newOrg, ...prev]);
      showToast("Organization created");
    }
    setShowCreate(false);
    setEditingOrg(null);
  };

  const toggleStatus = (org) => {
    const newStatus = org.status === "active" ? "suspended" : org.status === "suspended" ? "active" : "active";
    setOrgs(prev => prev.map(o => o.id === org.id ? { ...o, status: newStatus } : o));
    showToast(`Organization ${newStatus === "suspended" ? "suspended" : "reactivated"}`);
  };

  const deleteOrg = (id) => {
    setOrgs(prev => prev.filter(o => o.id !== id));
    setExpandedOrg(null);
    showToast("Organization deleted");
  };

  const filtered = orgs.filter(o => {
    if (planFilter !== "all" && o.plan !== planFilter) return false;
    if (search && !o.name.toLowerCase().includes(search.toLowerCase()) && !o.domain.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Organizations</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Manage multi-tenant organizations, members, and usage</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-black font-medium text-sm transition cursor-pointer">
          <Plus size={16} /> New Organization
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Organizations", value: orgs.length, icon: Building2, color: "text-white", border: "border-zinc-800" },
          { label: "Active", value: orgs.filter(o => o.status === "active").length, icon: CheckCircle, color: "text-emerald-400", border: "border-emerald-500/20" },
          { label: "Trial", value: orgs.filter(o => o.status === "trial").length, icon: Activity, color: "text-cyan-400", border: "border-cyan-500/20" },
          { label: "Suspended", value: orgs.filter(o => o.status === "suspended").length, icon: AlertCircle, color: "text-red-400", border: "border-red-500/20" },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`rounded-xl bg-zinc-900/60 border ${card.border} p-4`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-500 text-xs font-medium">{card.label}</span>
                <Icon size={16} className={card.color} />
              </div>
              <div className={`text-2xl font-semibold ${card.color}`}>{card.value}</div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {["all", ...plans].map(p => (
            <button key={p} onClick={() => setPlanFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer capitalize ${planFilter === p ? "bg-zinc-800 text-white" : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800"}`}>{p}</button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input type="text" placeholder="Search organizations..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700 placeholder-zinc-600" />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-zinc-900/60 border border-zinc-800">
            <Building2 size={32} className="text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No organizations found</p>
          </div>
        ) : (
          filtered.map(org => (
            <div key={org.id} className="rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <Building2 size={18} className="text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-medium">{org.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${planColors[org.plan]}`}>{org.plan}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${statusColors[org.status]}`}>{org.status}</span>
                        <span className="text-zinc-600 text-xs font-mono">{org.domain}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-zinc-500 text-xs">
                        <span className="flex items-center gap-1"><Users size={12} /> {org.users} users</span>
                        <span className="flex items-center gap-1"><HardDrive size={12} /> {org.storageGB} GB</span>
                        <span className="flex items-center gap-1"><Activity size={12} /> {org.apiCalls.toLocaleString()} API calls</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {org.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEdit(org)} className="p-2 rounded-lg bg-zinc-800/40 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"><Edit3 size={14} /></button>
                    <button onClick={() => toggleStatus(org)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${org.status === "suspended" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20" : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"}`}>
                      {org.status === "suspended" ? "Reactivate" : "Suspend"}
                    </button>
                    <button onClick={() => setExpandedOrg(expandedOrg === org.id ? null : org.id)} className="p-2 rounded-lg bg-zinc-800/40 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer">
                      {expandedOrg === org.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedOrg === org.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="border-t border-zinc-800/50 overflow-hidden">
                    <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white text-sm font-medium mb-3">Contact Information</h4>
                        <div className="space-y-2.5 text-sm">
                          <div className="flex items-center gap-3 text-zinc-400"><Mail size={14} /> {org.contactEmail}</div>
                          <div className="flex items-center gap-3 text-zinc-400"><Phone size={14} /> {org.contactPhone || "—"}</div>
                          <div className="flex items-center gap-3 text-zinc-400"><Globe size={14} /> {org.domain}</div>
                          <div className="flex items-center gap-3 text-zinc-400"><Calendar size={14} /> Created {org.createdAt}</div>
                        </div>

                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white text-sm font-medium">Usage</h4>
                            <span className="text-zinc-500 text-xs">{Math.round((org.storageGB / 500) * 100)}% of limit</span>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1"><span className="text-zinc-400">Storage</span><span className="text-white font-medium">{org.storageGB} GB / 500 GB</span></div>
                              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden"><div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${Math.min((org.storageGB / 500) * 100, 100)}%` }} /></div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1"><span className="text-zinc-400">API Calls</span><span className="text-white font-medium">{(org.apiCalls / 1000).toFixed(1)}K / month</span></div>
                              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden"><div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${Math.min((org.apiCalls / 1000000) * 100, 100)}%` }} /></div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1"><span className="text-zinc-400">Users</span><span className="text-white font-medium">{org.users} / {org.plan === "enterprise" ? "∞" : org.plan === "business" ? "50" : org.plan === "startup" ? "10" : "5"}</span></div>
                              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${Math.min((org.users / (org.plan === "enterprise" ? 100 : org.plan === "business" ? 50 : org.plan === "startup" ? 10 : 5)) * 100, 100)}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white text-sm font-medium">Members ({org.members.length})</h4>
                        </div>
                        <div className="space-y-2">
                          {org.members.map((m, i) => (
                            <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-zinc-800/20 border border-zinc-800/50">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center">
                                  <Users size={12} className="text-violet-400" />
                                </div>
                                <div>
                                  <p className="text-zinc-300 text-xs">{m.email}</p>
                                  <p className="text-zinc-600 text-[10px]">Joined {m.joined}</p>
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${m.role === "Owner" ? "text-amber-400 bg-amber-500/10" : m.role === "Admin" ? "text-cyan-400 bg-cyan-500/10" : "text-zinc-400 bg-zinc-800/40"}`}>{m.role}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button onClick={() => deleteOrg(org.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition cursor-pointer">
                            <Trash2 size={12} /> Delete Organization
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-xl border border-zinc-800 bg-[#0a0a0f] shadow-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">{editingOrg ? "Edit Organization" : "Create Organization"}</h2>
                    <p className="text-zinc-500 text-xs mt-0.5">{editingOrg ? "Update organization details" : "Register a new tenant organization"}</p>
                  </div>
                  <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"><X size={16} /></button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-xs font-medium mb-1.5">Organization Name</label>
                      <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Acme Corp"
                        className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700 placeholder-zinc-600" />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-xs font-medium mb-1.5">Domain</label>
                      <input type="text" value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })} placeholder="acme.com"
                        className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700 placeholder-zinc-600" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-1.5">Plan</label>
                    <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })}
                      className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700">
                      {plans.map(p => <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="border-t border-zinc-800/50 pt-4">
                    <p className="text-zinc-500 text-xs font-medium mb-3">Contact Information</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-zinc-400 text-xs font-medium mb-1.5">Contact Name</label>
                        <input type="text" value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} placeholder="John Doe"
                          className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700 placeholder-zinc-600" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-zinc-400 text-xs font-medium mb-1.5">Email</label>
                          <input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} placeholder="john@acme.com"
                            className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700 placeholder-zinc-600" />
                        </div>
                        <div>
                          <label className="block text-zinc-400 text-xs font-medium mb-1.5">Phone</label>
                          <input type="text" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} placeholder="+1 (555) 000-0000"
                            className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700 placeholder-zinc-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/50">
                  <button onClick={() => setShowCreate(false)} className="px-5 py-2.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white text-sm transition cursor-pointer">Cancel</button>
                  <button onClick={saveOrg} className="px-5 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-black font-medium text-sm transition cursor-pointer">
                    {editingOrg ? "Save Changes" : "Create Organization"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 right-8 px-5 py-3 rounded-xl border shadow-2xl z-50 flex items-center gap-3 backdrop-blur-xl ${
              toast.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}>
            {toast.type === "error" ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            <span className="text-sm font-medium">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default OrganizationManagement;