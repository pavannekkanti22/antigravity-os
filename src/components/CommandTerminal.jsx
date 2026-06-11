import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Terminal, Send, Trash2, Cpu } from "lucide-react";

function CommandTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { text: "ANTIGRAVITY OS v4.1.0-SECURE [ONLINE]", type: "system" },
    { text: "Type console directives to execute signal nodes.", type: "info" }
  ]);
  const [loading, setLoading] = useState(false);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const executeCommand = async (commandText) => {
    const cmd = commandText.trim();
    if (!cmd) return;

    setHistory((prev) => [...prev, { text: `admin@antigravity:~$ ${cmd}`, type: "user" }]);
    setInput("");

    if (cmd.toLowerCase() === "/clear") {
      setHistory([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8081/api/command/execute", {
        command: cmd
      });
      setHistory((prev) => [...prev, { text: response.data.output, type: "response" }]);
    } catch (err) {
      console.error(err);
      setHistory((prev) => [
        ...prev,
        { text: "Error: Could not synchronize thread signal with remote cluster core.", type: "error" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeCommand(input);
    }
  };

  const presets = [
    { label: "Run Diagnosis", cmd: "/diagnose" },
    { label: "Optimize Cluster", cmd: "/optimize" },
    { label: "Query Logs", cmd: "/system-logs" },
    { label: "Help Matrix", cmd: "/help" }
  ];

  return (
    <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-6 backdrop-blur-3xl shadow-xl flex flex-col h-[400px]">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <Terminal size={18} className="text-violet-400 animate-pulse" />
          <h2 className="text-white text-base font-bold font-mono tracking-wider uppercase">
            Secure Console Shell
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setHistory([])}
            title="Clear Console Buffer"
            className="p-2 rounded-xl bg-zinc-900/40 border border-white/5 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-300 cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full font-mono text-[9px] font-bold text-violet-400 uppercase tracking-widest">
            <Cpu size={12} className="animate-spin" />
            Core Core-1
          </div>
        </div>
      </div>

      {/* QUICK PRESET BUTTONS */}
      <div className="flex flex-wrap gap-2 mb-4">
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => executeCommand(p.cmd)}
            disabled={loading}
            className="px-3 py-1.5 text-[10px] font-mono bg-zinc-900/40 border border-white/5 text-zinc-400 rounded-xl hover:bg-violet-500/15 hover:border-violet-500/30 hover:text-violet-300 transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* TERMINAL CONTENT SCREEN */}
      <div className="flex-1 overflow-y-auto bg-black/50 border border-white/5 rounded-2xl p-4 font-mono text-xs leading-relaxed mb-4 scrollbar-thin">
        <div className="space-y-3">
          {history.map((line, index) => (
            <div 
              key={index} 
              className={`whitespace-pre-wrap ${
                line.type === "user" ? "text-violet-400" :
                line.type === "system" ? "text-cyan-400 font-semibold" :
                line.type === "info" ? "text-zinc-500" :
                line.type === "error" ? "text-red-400 font-bold" :
                "text-emerald-400"
              }`}
            >
              {line.text}
            </div>
          ))}
          {loading && (
            <div className="text-zinc-600 animate-pulse font-mono text-xs">
              Sending directive parameters to target core...
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* INPUT LINE */}
      <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-2xl px-4 py-3">
        <span className="font-mono text-violet-400 text-xs font-bold">admin@antigravity:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Execute system instruction... (e.g. /diagnose, /optimize)"
          disabled={loading}
          className="flex-1 bg-transparent text-white outline-none border-none placeholder-zinc-800 font-mono text-xs"
        />
        <button
          onClick={() => executeCommand(input)}
          disabled={loading || !input.trim()}
          className="text-zinc-500 hover:text-violet-400 transition-all duration-300 disabled:opacity-30 cursor-pointer"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

export default CommandTerminal;
