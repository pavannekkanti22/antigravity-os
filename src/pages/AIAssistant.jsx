import { useState, useRef, useEffect } from "react";
import { Bot, Send, Cpu, Shield, Activity, AlertTriangle, CheckCircle, Zap, RefreshCw, BarChart3, Users, Globe, Clock, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialMessages = [
  { id: "welcome", role: "assistant", content: "Hello, I'm **AEGIS** — your AI security assistant. I can help with system diagnostics, security recommendations, threat analysis, and compliance checks. What would you like to explore?", timestamp: Date.now() },
];

const quickActions = [
  { label: "System Health", icon: Cpu, query: "Run a full system health diagnostic" },
  { label: "Security Scan", icon: Shield, query: "Perform a security vulnerability scan" },
  { label: "Threat Summary", icon: AlertTriangle, query: "Summarize current active threats" },
  { label: "Compliance Check", icon: CheckCircle, query: "Check compliance status against SOC 2 and GDPR" },
];

const systemDiagnostics = {
  status: "healthy",
  uptime: "14d 6h 32m",
  services: [
    { name: "Authentication Service", status: "operational", latency: "12ms" },
    { name: "Database Cluster", status: "operational", latency: "4ms" },
    { name: "API Gateway", status: "operational", latency: "23ms" },
    { name: "Threat Detection Engine", status: "operational", latency: "45ms" },
    { name: "Notification Queue", status: "degraded", latency: "320ms" },
  ],
  recentAlerts: 3,
  activeUsers: 24,
};

function generateResponse(query) {
  const q = query.toLowerCase();
  if (q.includes("health") || q.includes("diagnostic")) {
    return {
      content: `## System Health Diagnostic\n\nAll critical services are **operational**. Here's the summary:\n\n| Service | Status | Latency |\n|---------|--------|--------|\n| Auth Service | ✅ Operational | 12ms |\n| Database | ✅ Operational | 4ms |\n| API Gateway | ✅ Operational | 23ms |\n| Threat Engine | ✅ Operational | 45ms |\n| Notifications | ⚠️ Degraded | 320ms |\n\n**Recommendation:** Check the notification queue — latency is above threshold (expected <100ms). Consider scaling the worker pool.`,
      diagnostics: { overall: "healthy", degraded: ["Notification Queue"] },
    };
  }
  if (q.includes("scan") || q.includes("vulnerability")) {
    return {
      content: `## Security Scan Results\n\n**Scan ID:** SCN-${Date.now().toString(36).toUpperCase()}\n**Scope:** All external-facing services\n\n| Severity | Count |\n|----------|------|\n| 🔴 Critical | 0 |\n| 🟠 High | 1 |\n| 🟡 Medium | 3 |\n| 🔵 Low | 5 |\n\n**High severity:** API rate limiting is not enforced on \`/api/auth/login\` — potential brute force vector.\n\n**Suggested fix:** Enable rate limiting middleware on the auth routes. Recommended: 5 attempts per 15 minutes per IP.`,
      diagnostics: { overall: "warning", high: 1, medium: 3, low: 5 },
    };
  }
  if (q.includes("threat")) {
    return {
      content: `## Active Threat Summary\n\n**Current threat level:** ELEVATED (Yellow)\n\n| Threat | Risk | Status |\n|--------|------|--------|\n| Brute Force (IP: 91.121.87.5) | 🔴 Critical | Active |\n| Impossible Travel (sarah@example.com) | 🔴 Critical | Investigating |\n| VPN/Proxy Login (emma@example.com) | 🟠 High | Monitoring |\n| Failed Login Cluster (185.220.101.1) | 🟠 High | Active |\n\n**Alert:** 5 failed login attempts detected in the last 3 minutes from Moscow, RU. Consider blocking the IP range temporarily.`,
      diagnostics: { overall: "elevated", critical: 2, high: 2 },
    };
  }
  if (q.includes("compliance")) {
    return {
      content: `## Compliance Status Report\n\n| Framework | Status | Score |\n|-----------|--------|-------|\n| SOC 2 | ✅ Compliant | 94% |\n| GDPR | ✅ Compliant | 88% |\n| HIPAA | ⚠️ In Progress | 62% |\n| PCI DSS | ❌ Non-Compliant | 45% |\n\n**PCI DSS Gaps:**\n- Encryption at rest not enabled for payment logs (required)\n- Access reviews not conducted quarterly\n- Penetration testing overdue (last: 8 months ago)\n\n**Priority action:** Enable AES-256 encryption on the audit log storage to close the most critical PCI gap.`,
      diagnostics: { overall: "warning", compliant: 2, inProgress: 1, nonCompliant: 1 },
    };
  }
  if (q.includes("user") || q.includes("active")) {
    return {
      content: `## User Activity Report\n\n**Currently active:** 24 users online\n**New today:** 12 sign-ups\n**Sessions expired:** 3\n\n| User | Last Active | Device | Risk |\n|------|-----------|--------|------|\n| admin@antigravity.io | Just now | Windows · Chrome | Low |\n| james@example.com | 3m ago | macOS · Firefox | Medium |\n| sarah@example.com | 12m ago | iOS · Safari | Low |\n| mike@example.com | 1h ago | Android · Chrome | High |\n\n**Flagged:** mike@example.com logged in from 3 different IPs in the last hour.`,
      diagnostics: { overall: "healthy", activeUsers: 24, flagged: 1 },
    };
  }
  return {
    content: "I've analyzed the available system data. Based on current metrics, all core services are stable. I recommend running a full diagnostic or security scan for a more detailed analysis. Is there a specific area you'd like me to investigate?\n\nYou can ask me about:\n- System health diagnostics\n- Security vulnerabilities\n- Active threat summary\n- Compliance status\n- User activity",
    diagnostics: null,
  };
}

function AIAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = (text) => {
    const q = text.trim();
    if (!q || isTyping) return;
    const userMsg = { id: Date.now(), role: "user", content: q, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const response = generateResponse(q);
      const botMsg = { id: Date.now() + 1, role: "assistant", content: response.content, timestamp: Date.now(), diagnostics: response.diagnostics };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const clearChat = () => setMessages(initialMessages);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Bot className="text-cyan-400" size={24} /> AEGIS Assistant
          </h1>
          <p className="text-zinc-500 text-sm mt-0.5">AI-powered security analysis, diagnostics, and recommendations</p>
        </div>
        <button onClick={clearChat} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white text-sm transition cursor-pointer">
          <RefreshCw size={15} /> New Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Panel */}
        <div className="lg:col-span-2 rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Sparkles size={14} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">AEGIS Chat</h3>
                <p className="text-zinc-600 text-[10px]">{isTyping ? "Thinking..." : "Online"}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${msg.role === "user" ? "bg-violet-500/10 border border-violet-500/20" : "bg-cyan-500/10 border border-cyan-500/20"}`}>
                    {msg.role === "user" ? <Users size={14} className="text-violet-400" /> : <Bot size={14} className="text-cyan-400" />}
                  </div>
                  <div className={`max-w-[85%] rounded-xl px-4 py-3 ${msg.role === "user" ? "bg-violet-500/10 border border-violet-500/20" : "bg-zinc-800/30 border border-zinc-800/50"}`}>
                    <div className="text-white text-sm leading-relaxed whitespace-pre-wrap [&_table]:w-full [&_th]:text-left [&_th]:text-zinc-400 [&_th]:text-xs [&_td]:text-zinc-300 [&_td]:text-xs [&_tr]:border-b [&_tr]:border-zinc-800/50 [&_table]:mt-2 [&_table]:mb-2 prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, "<br/>").replace(/\|/g, " | ") }}
                    />
                    <p className="text-zinc-600 text-[10px] mt-2">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"><Bot size={14} className="text-cyan-400" /></div>
                  <div className="rounded-xl px-4 py-3 bg-zinc-800/30 border border-zinc-800/50">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 border-t border-zinc-800">
            <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-3">
              <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask AEGIS anything about your system..."
                className="flex-1 h-11 px-4 rounded-lg bg-zinc-900/80 border border-zinc-800 text-white text-sm outline-none focus:border-zinc-700 placeholder-zinc-600" />
              <button type="submit" disabled={!input.trim() || isTyping}
                className="w-11 h-11 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black disabled:opacity-30 flex items-center justify-center transition cursor-pointer">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Zap size={16} className="text-zinc-400" /> Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button key={i} onClick={() => sendMessage(action.query)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800/20 hover:bg-zinc-800/40 border border-zinc-800/50 text-left transition cursor-pointer">
                    <Icon size={16} className="text-cyan-400 shrink-0" />
                    <span className="text-zinc-300 text-sm">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* System Snapshot */}
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-zinc-400" /> System Snapshot</h3>
            <div className="space-y-3">
              {[
                { label: "Uptime", value: systemDiagnostics.uptime, icon: Clock },
                { label: "Active Users", value: systemDiagnostics.activeUsers, icon: Users },
                { label: "Active Alerts", value: systemDiagnostics.recentAlerts, icon: AlertTriangle },
                { label: "Status", value: "Operational", icon: CheckCircle },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <span className="text-zinc-400 text-sm flex items-center gap-2"><Icon size={12} /> {stat.label}</span>
                    <span className="text-white text-sm font-medium">{stat.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Activity size={16} className="text-zinc-400" /> Services</h3>
            <div className="space-y-3">
              {systemDiagnostics.services.map((svc, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${svc.status === "operational" ? "bg-emerald-500" : "bg-amber-500"}`} />
                    <span className="text-zinc-300 text-xs">{svc.name}</span>
                  </div>
                  <span className={`text-[10px] ${svc.status === "operational" ? "text-emerald-400" : "text-amber-400"}`}>{svc.latency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;