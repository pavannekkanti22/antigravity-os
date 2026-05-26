import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Terminal, Send, Trash2, Cpu } from "lucide-react";

function CommandTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { text: "ANTIGRAVITY OS v21.4.0 [COMMAND SYSTEM ON-LINE]", type: "system" },
    { text: "Type /help to query system node capability matrix.", type: "info" }
  ]);
  const [loading, setLoading] = useState(false);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    // Scroll terminal to bottom on new inputs
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const executeCommand = async (commandText) => {
    const cmd = commandText.trim();
    if (!cmd) return;

    // Add user input to terminal history
    setHistory((prev) => [...prev, { text: `commander@antigravity:~$ ${cmd}`, type: "user" }]);
    setInput("");

    if (cmd.toLowerCase() === "/clear") {
      setHistory([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/command/execute", {
        command: cmd
      });
      
      const outputText = response.data.output;
      // Add result to history
      setHistory((prev) => [...prev, { text: outputText, type: "response" }]);
    } catch (err) {
      console.error(err);
      setHistory((prev) => [
        ...prev,
        { text: "Error: Unable to connect to neural command interface. Ensure backend service is active.", type: "error" }
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
    { label: "Optimize Memory", cmd: "/optimize" },
    { label: "Query Logs", cmd: "/system-logs" },
    { label: "Help Matrix", cmd: "/help" }
  ];

  return (
    <div className="bg-zinc-950/60 border border-zinc-900 rounded-3xl p-6 backdrop-blur-3xl shadow-2xl shadow-black/40 flex flex-col h-[400px]">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <Terminal size={18} className="text-violet-400 animate-pulse" />
          <h2 className="text-white text-lg font-bold tracking-wider uppercase font-mono">
            Interactive AI Terminal
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setHistory([])}
            title="Clear terminal"
            className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-300 cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full">
            <Cpu size={12} className="text-violet-400 animate-spin" />
            <span className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">
              Core Core-1
            </span>
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
            className="px-3 py-1.5 text-xs bg-zinc-900/40 border border-zinc-800 text-zinc-400 rounded-xl hover:bg-violet-500/10 hover:border-violet-500/30 hover:text-violet-300 transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* TERMINAL CONTENT SCREEN */}
      <div className="flex-1 overflow-y-auto bg-black/60 border border-zinc-900/80 rounded-2xl p-4 font-mono text-sm leading-relaxed mb-4 scrollbar-thin scrollbar-thumb-zinc-800">
        <div className="space-y-3">
          {history.map((line, index) => (
            <div 
              key={index} 
              className={`whitespace-pre-wrap ${
                line.type === "user" ? "text-violet-400" :
                line.type === "system" ? "text-cyan-400 font-semibold" :
                line.type === "info" ? "text-zinc-500" :
                line.type === "error" ? "text-red-400" :
                "text-emerald-400"
              }`}
            >
              {line.text}
            </div>
          ))}
          {loading && (
            <div className="text-zinc-500 animate-pulse">
              Executing command query on remote cluster...
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* INPUT LINE */}
      <div className="flex items-center gap-3 bg-black/40 border border-zinc-900 rounded-2xl px-4 py-3">
        <span className="font-mono text-violet-400 text-sm">commander$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type console command (e.g. /diagnose, /optimize)..."
          disabled={loading}
          className="flex-1 bg-transparent text-white outline-none border-none placeholder-zinc-700 font-mono text-sm"
        />
        <button
          onClick={() => executeCommand(input)}
          disabled={loading || !input.trim()}
          className="text-zinc-500 hover:text-violet-400 transition-all duration-300 disabled:opacity-30 cursor-pointer"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

export default CommandTerminal;
