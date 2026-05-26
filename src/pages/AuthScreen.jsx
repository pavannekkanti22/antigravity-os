import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AuthScreen() {
  const navigate = useNavigate();
  
  const [mode, setMode] = useState("login"); // "login" | "register" | "forgot"
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (mode === "login") {
        const response = await axios.post("http://localhost:8080/api/auth/login", {
          email,
          password
        });
        
        // Save token and user details to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify({
          id: response.data.userId,
          fullName: response.data.fullName,
          email: response.data.email,
          role: response.data.role
        }));

        navigate("/dashboard");
      } else if (mode === "register") {
        const response = await axios.post("http://localhost:8080/api/auth/register", {
          fullName,
          email,
          password
        });

        // Save token and user details to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify({
          id: response.data.userId,
          fullName: response.data.fullName,
          email: response.data.email,
          role: response.data.role
        }));

        setSuccessMsg("Registration successful! Initiating system access...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        // Forgot password
        setSuccessMsg("If this email exists, a secure recovery code has been dispatched.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(typeof err.response.data === "string" ? err.response.data : "Authentication failed.");
      } else {
        setError("Network error. Ensure the Antigravity backend is running.");
      }
    } finally {
      if (mode !== "forgot" && !successMsg) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* LOGO MOBILE */}
      <div className="lg:hidden flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
          <span className="text-white font-bold text-xl">A</span>
        </div>
        <div>
          <h1 className="text-white font-bold text-xl tracking-wider">ANTIGRAVITY</h1>
          <p className="text-zinc-500 text-xs">Enterprise OS</p>
        </div>
      </div>

      {/* AUTH CARD */}
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-[32px] p-8 lg:p-10 backdrop-blur-3xl shadow-2xl shadow-black/80">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold tracking-tight mb-2">
            {mode === "login" && "Login Portal"}
            {mode === "register" && "Initialize Identity"}
            {mode === "forgot" && "Recover Access"}
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            {mode === "login" && "Establish secure interface connection."}
            {mode === "register" && "Create your digital credentials."}
            {mode === "forgot" && "Reset your system security keys."}
          </p>
        </div>

        {/* ALERTS */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"
            >
              {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM */}
        <form onSubmit={handleAuth} className="space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* REGISTER NAME */}
              {mode === "register" && (
                <div>
                  <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-widest">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Commander Name"
                    className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder-zinc-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                  />
                </div>
              )}

              {/* EMAIL */}
              <div>
                <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-widest">
                  Secure Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@enterprise.com"
                  className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder-zinc-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                />
              </div>

              {/* PASSWORD */}
              {mode !== "forgot" && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
                      Access Password
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot");
                          setError("");
                          setSuccessMsg("");
                        }}
                        className="text-xs text-zinc-500 hover:text-violet-400 transition-all duration-300"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder-zinc-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold hover:scale-[1.01] active:scale-95 transition-all duration-300 shadow-lg shadow-violet-500/10 hover:shadow-violet-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                {mode === "login" && "Access Core System"}
                {mode === "register" && "Create Identity"}
                {mode === "forgot" && "Send Recovery Signal"}
              </>
            )}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-[1px] bg-zinc-900"></div>
          <span className="text-zinc-600 text-xs tracking-wider">OR</span>
          <div className="flex-1 h-[1px] bg-zinc-900"></div>
        </div>

        {/* SWITCH MODES */}
        <div className="text-center text-sm">
          {mode === "login" && (
            <p className="text-zinc-500">
              New Commander?{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setError("");
                  setSuccessMsg("");
                }}
                className="text-violet-400 hover:text-cyan-400 font-medium transition-all duration-300"
              >
                Register Account
              </button>
            </p>
          )}

          {mode === "register" && (
            <p className="text-zinc-500">
              Have credentials?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccessMsg("");
                }}
                className="text-violet-400 hover:text-cyan-400 font-medium transition-all duration-300"
              >
                Sign In
              </button>
            </p>
          )}

          {mode === "forgot" && (
            <button
              onClick={() => {
                setMode("login");
                setError("");
                setSuccessMsg("");
              }}
              className="text-violet-400 hover:text-cyan-400 font-medium transition-all duration-300"
            >
              Return to Login Portal
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;