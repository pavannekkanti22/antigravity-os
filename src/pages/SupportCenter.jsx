import { useState, useEffect } from "react";
import { Ticket, Plus, Search, MessageSquare, User, Clock, CheckCircle, X, AlertCircle, ChevronDown, Send, Filter, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fallbackTickets = [
  { id: 1, subject: "Cannot access admin dashboard", category: "bug", priority: "high", status: "open", user: "james@example.com", assignee: null, messages: [{ from: "user", text: "Getting 403 when accessing /admin. My role is ADMIN.", at: Date.now() - 86400000 }], createdAt: Date.now() - 86400000 },
  { id: 2, subject: "Feature request: Dark mode toggle", category: "feature", priority: "low", status: "resolved", user: "sarah@example.com", assignee: "Support Team", messages: [{ from: "user", text: "Would love a dark mode toggle on the login screen.", at: Date.now() - 172800000 }, { from: "support", text: "This is now available in Settings > Preferences!", at: Date.now() - 86400000 }], createdAt: Date.now() - 172800000 },
  { id: 3, subject: "Suspicious login activity on my account", category: "security", priority: "critical", status: "open", user: "mike@example.com", assignee: "Security Team", messages: [{ from: "user", text: "Someone logged in from Moscow. Please check.", at: Date.now() - 3600000 }], createdAt: Date.now() - 3600000 },
  { id: 4, subject: "Billing invoice not generating", category: "account", priority: "medium", status: "in_progress", user: "emma@example.com", assignee: "Billing Team", messages: [{ from: "user", text: "Invoice for June not showing in billing.", at: Date.now() - 259200000 }, { from: "support", text: "We're looking into it. Can you share your account ID?", at: Date.now() - 172800000 }], createdAt: Date.now() - 259200000 },
  { id: 5, subject: "API rate limiting too aggressive", category: "other", priority: "medium", status: "closed", user: "dev@example.com", assignee: "Engineering", messages: [{ from: "user", text: "Our integration is hitting rate limits at 100 req/min.", at: Date.now() - 604800000 }, { from: "support", text: "We've increased the limit to 300 req/min for your tier.", at: Date.now() - 518400000 }], createdAt: Date.now() - 604800000 },
];

const categories = ["bug", "feature", "security", "account", "other"];
const priorities = ["low", "medium", "high", "critical"];
const statuses = ["open", "in_progress", "resolved", "closed"];

const statusColors = { open: "text-red-400 bg-red-500/10 border-red-500/20", in_progress: "text-amber-400 bg-amber-500/10 border-amber-500/20", resolved: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", closed: "text-zinc-500 bg-zinc-800/40 border-zinc-700/30" };
const priorityColors = { critical: "text-red-400 bg-red-500/10", high: "text-orange-400 bg-orange-500/10", medium: "text-amber-400 bg-amber-500/10", low: "text-blue-400 bg-blue-500/10" };
const categoryIcons = { bug: AlertCircle, feature: Plus, security: X, account: User, other: Ticket };

function SupportCenter() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [toast, setToast] = useState(null);
  const role = localStorage.getItem("role");
  const userEmail = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user"))?.email || "user@example.com" : "user@example.com";

  const [form, setForm] = useState({ subject: "", category: "bug", priority: "medium", message: "" });

  useEffect(() => { setTickets(fallbackTickets); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const createTicket = () => {
    if (!form.subject.trim() || !form.message.trim()) { showToast("Subject and message are required", "error"); return; }
    const t = { id: Date.now(), ...form, status: "open", user: userEmail, assignee: null, messages: [{ from: "user", text: form.message, at: Date.now() }], createdAt: Date.now() };
    setTickets(prev => [t, ...prev]);
    setShowCreate(false);
    setForm({ subject: "", category: "bug", priority: "medium", message: "" });
    showToast("Ticket created");
  };

  const updateStatus = (id, status) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    showToast(`Ticket ${status}`);
  };

  const assignTicket = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, assignee: "Support Team", status: t.status === "open" ? "in_progress" : t.status } : t));
    showToast("Ticket assigned");
  };

  const sendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, messages: [...t.messages, { from: role === "ADMIN" ? "support" : "user", text: replyText, at: Date.now() }], status: t.status === "resolved" ? "resolved" : t.status === "closed" ? "closed" : role === "ADMIN" ? "in_progress" : t.status } : t));
    setSelectedTicket(prev => ({ ...prev, messages: [...prev.messages, { from: role === "ADMIN" ? "support" : "user", text: replyText, at: Date.now() }], status: prev.status === "resolved" ? "resolved" : prev.status === "closed" ? "closed" : role === "ADMIN" ? "in_progress" : prev.status }));
    setReplyText("");
    showToast("Reply sent");
  };

  const userTickets = role === "ADMIN" ? tickets : tickets.filter(t => t.user === userEmail);
  const filtered = userTickets.filter(t => {
    if (filter !== "all" && t.status !== filter) return false;
    if (search && !t.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Support Center</h1>
          <p className="text-zinc-500 text-sm mt-0.5">{role === "ADMIN" ? "Manage all support tickets" : "Submit and track support tickets"}</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-black font-medium text-sm transition cursor-pointer">
          <Plus size={16} /> New Ticket
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map(s => (
          <div key={s} className={`rounded-xl bg-zinc-900/60 border p-4 ${s === "open" ? "border-red-500/20" : s === "in_progress" ? "border-amber-500/20" : s === "resolved" ? "border-emerald-500/20" : "border-zinc-800"}`}>
            <p className="text-zinc-500 text-xs mb-1 capitalize">{s.replace("_", " ")}</p>
            <div className={`text-2xl font-semibold ${s === "open" ? "text-red-400" : s === "in_progress" ? "text-amber-400" : s === "resolved" ? "text-emerald-400" : "text-zinc-400"}`}>
              {userTickets.filter(t => t.status === s).length}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {["all", ...statuses].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer capitalize ${filter === f ? "bg-zinc-800 text-white" : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800"}`}>{f}</button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input type="text" placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700 placeholder-zinc-600" />
        </div>
      </div>

      {/* Ticket List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-zinc-900/60 border border-zinc-800">
            <Ticket size={32} className="text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No tickets found</p>
          </div>
        ) : (
          filtered.map(ticket => {
            const Icon = categoryIcons[ticket.category] || Ticket;
            const lastMsg = ticket.messages[ticket.messages.length - 1];
            return (
              <div key={ticket.id} onClick={() => setSelectedTicket(ticket)}
                className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5 hover:border-zinc-700 transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl ${priorityColors[ticket.priority]} flex items-center justify-center shrink-0`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-medium">{ticket.subject}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${statusColors[ticket.status]}`}>{ticket.status.replace("_", " ")}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                      </div>
                      <p className="text-zinc-400 text-sm mt-1 truncate">{lastMsg.text}</p>
                      <div className="flex items-center gap-4 mt-2 text-zinc-500 text-xs">
                        <span className="flex items-center gap-1"><User size={12} /> {ticket.user}</span>
                        <span className="flex items-center gap-1 capitalize"><Icon size={12} /> {ticket.category}</span>
                        {ticket.assignee && <span className="flex items-center gap-1"><User size={12} /> {ticket.assignee}</span>}
                        <span className="flex items-center gap-1"><Clock size={12} /> {timeAgo(ticket.createdAt)}</span>
                        <span className="flex items-center gap-1"><MessageSquare size={12} /> {ticket.messages.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Ticket Detail Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-xl border border-zinc-800 bg-[#0a0a0f] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
              <div className="p-6 border-b border-zinc-800 shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="text-lg font-bold text-white">{selectedTicket.subject}</h2>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${statusColors[selectedTicket.status]}`}>{selectedTicket.status.replace("_", " ")}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${priorityColors[selectedTicket.priority]}`}>{selectedTicket.priority}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-500 text-xs">
                      <span className="flex items-center gap-1"><User size={12} /> {selectedTicket.user}</span>
                      <span className="capitalize flex items-center gap-1">{selectedTicket.category}</span>
                      <span className="flex items-center gap-1">#{selectedTicket.id}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedTicket(null)} className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center shrink-0 cursor-pointer"><X size={16} /></button>
                </div>
                {role === "ADMIN" && (
                  <div className="flex gap-2 mt-4">
                    {!selectedTicket.assignee && <button onClick={() => assignTicket(selectedTicket.id)} className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition cursor-pointer">Assign to me</button>}
                    {selectedTicket.status === "open" && <button onClick={() => updateStatus(selectedTicket.id, "in_progress")} className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition cursor-pointer">Start Progress</button>}
                    {selectedTicket.status === "in_progress" && <button onClick={() => updateStatus(selectedTicket.id, "resolved")} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition cursor-pointer"><CheckCircle size={12} className="inline mr-1" />Resolve</button>}
                    {selectedTicket.status === "resolved" && <button onClick={() => updateStatus(selectedTicket.id, "closed")} className="px-3 py-1.5 rounded-lg bg-zinc-800/40 border border-zinc-800 text-zinc-400 text-xs font-medium hover:bg-zinc-800/60 transition cursor-pointer">Close</button>}
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
                {selectedTicket.messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.from === "support" ? "" : "flex-row-reverse"}`}>
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${msg.from === "support" ? "bg-cyan-500/10 border border-cyan-500/20" : "bg-violet-500/10 border border-violet-500/20"}`}>
                      {msg.from === "support" ? <Ticket size={13} className="text-cyan-400" /> : <User size={13} className="text-violet-400" />}
                    </div>
                    <div className={`max-w-[80%] rounded-xl px-4 py-3 ${msg.from === "support" ? "bg-zinc-800/30 border border-zinc-800/50" : "bg-violet-500/10 border border-violet-500/20"}`}>
                      <p className="text-zinc-300 text-sm">{msg.text}</p>
                      <p className="text-zinc-600 text-[10px] mt-1.5">{timeAgo(msg.at)} {msg.from === "support" ? "· Support" : "· You"}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-zinc-800 shrink-0">
                <form onSubmit={e => { e.preventDefault(); sendReply(); }} className="flex gap-3">
                  <input type="text" value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your reply..."
                    className="flex-1 h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700 placeholder-zinc-600" />
                  <button type="submit" disabled={!replyText.trim()}
                    className="w-11 h-11 rounded-lg bg-violet-500 hover:bg-violet-400 text-black disabled:opacity-30 flex items-center justify-center transition cursor-pointer">
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Ticket Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-xl border border-zinc-800 bg-[#0a0a0f] shadow-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">Create Ticket</h2>
                    <p className="text-zinc-500 text-xs mt-0.5">Submit a new support request</p>
                  </div>
                  <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"><X size={16} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-1.5">Subject</label>
                    <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Brief summary of the issue"
                      className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700 placeholder-zinc-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-xs font-medium mb-1.5">Category</label>
                      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700">
                        {categories.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-xs font-medium mb-1.5">Priority</label>
                      <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700">
                        {priorities.map(p => <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-1.5">Message</label>
                    <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Describe your issue in detail"
                      className="w-full px-4 py-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700 placeholder-zinc-600 resize-none" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800/50">
                  <button onClick={() => setShowCreate(false)} className="px-5 py-2.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white text-sm transition cursor-pointer">Cancel</button>
                  <button onClick={createTicket} className="px-5 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-black font-medium text-sm transition cursor-pointer">Submit Ticket</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
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

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default SupportCenter;