import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Key, Sparkles, Check, AlertCircle } from "lucide-react";

function AuthScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // login, register, forgot

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Recovery States
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      // LOGIN FLOW
      if (mode === "login") {
        const response = await axios.post("http://localhost:8081/api/auth/login", {
          email,
          password
        });

        localStorage.setItem("token", response.data.token);

        const profileResponse = await axios.get("http://localhost:8081/api/profile/me", {
          headers: {
            Authorization: `Bearer ${response.data.token}`
          }
        });

        localStorage.setItem("role", profileResponse.data.role);

        if (profileResponse.data.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
      // REGISTER FLOW
      else if (mode === "register") {
        await axios.post("http://localhost:8081/api/auth/register", {
          fullName,
          email,
          password
        });

        setSuccessMsg("Account created successfully. Please login.");
        setMode("login");
        setFullName("");
        setEmail("");
        setPassword("");
      }
      // FORGOT PASSWORD FLOW
      else {
        if (forgotStep === 1) {
          const res = await axios.post("http://localhost:8081/api/auth/forgot-password", { email });
          setSuccessMsg(res.data.message || "OTP generated. Check backend logs.");
          setForgotStep(2);
        } else if (forgotStep === 2) {
          await axios.post("http://localhost:8081/api/auth/verify-otp", { email, otp });
          setSuccessMsg("OTP validated. You can now reset your password.");
          setForgotStep(3);
        } else {
          await axios.post("http://localhost:8081/api/auth/reset-password", {
            email,
            otp,
            newPassword
          });
          setSuccessMsg("Password reset successfully. Return to Login.");
          setMode("login");
          setForgotStep(1);
          setOtp("");
          setNewPassword("");
          setPassword("");
        }
      }
    } catch (err) {
      console.error("AUTH ERROR:", err);
      if (err.response && err.response.data) {
        setError(
          err.response.data.message ||
          (typeof err.response.data === "string" ? err.response.data : "Authentication failed.")
        );
      } else {
        setError("Network error. Ensure the Antigravity backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccessMsg("");
    setForgotStep(1);
    setOtp("");
    setNewPassword("");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* AUTH CARD */}
      <div className="bg-zinc-950/50 border border-white/5 rounded-[32px] p-8 lg:p-10 backdrop-blur-3xl shadow-[0_24px_50px_rgba(0,0,0,0.6)] glow-violet">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={12} className="text-violet-400 animate-pulse" />
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold font-mono">
              Secure Auth Node
            </span>
          </div>
          <h2 className="text-white text-3xl font-black tracking-wider uppercase font-mono">
            {mode === "login" && "Login Portal"}
            {mode === "register" && "Initialize Identity"}
            {mode === "forgot" && "Recover Access"}
          </h2>
          <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
            {mode === "login" && "Establish secure credentials link."}
            {mode === "register" && "Create your digital authentication keys."}
            {mode === "forgot" && `Step ${forgotStep} of 3: ${
              forgotStep === 1 ? "Verify registered identity." :
              forgotStep === 2 ? "Verify security code." : "Set new security pass."
            }`}
          </p>
        </div>

        {/* ALERTS */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 font-mono"
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 font-mono"
            >
              <Check size={16} />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM */}
        <form onSubmit={handleAuth} className="space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode + "-" + forgotStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* REGISTER NAME */}
              {mode === "register" && (
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-2 uppercase tracking-widest font-mono">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Commander Name"
                      className="w-full bg-black/50 border border-white/5 rounded-2xl pl-11 pr-5 py-4 text-sm text-white placeholder-zinc-700 outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/10 transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {/* EMAIL */}
              {(mode !== "forgot" || forgotStep === 1) && (
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-2 uppercase tracking-widest font-mono">
                    Secure Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@enterprise.com"
                      className="w-full bg-black/50 border border-white/5 rounded-2xl pl-11 pr-5 py-4 text-sm text-white placeholder-zinc-700 outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/10 transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {/* PASSWORD */}
              {mode !== "forgot" && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-zinc-400 text-xs font-semibold uppercase tracking-widest font-mono">
                      Access Password
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => switchMode("forgot")}
                        className="text-xs text-zinc-500 hover:text-violet-400 transition-all duration-300 cursor-pointer font-mono"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/50 border border-white/5 rounded-2xl pl-11 pr-14 py-4 text-sm text-white placeholder-zinc-700 outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/10 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* FORGOT STEP 2: OTP CODE INPUT */}
              {mode === "forgot" && forgotStep === 2 && (
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-2 uppercase tracking-widest font-mono">
                    Verification Code (OTP)
                  </label>
                  <div className="relative">
                    <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                      type="text"
                      required
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6-Digit OTP"
                      className="w-full bg-black/50 border border-white/5 rounded-2xl pl-11 pr-5 py-4 text-white placeholder-zinc-700 outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/10 transition-all duration-300 text-center font-mono tracking-[0.4em] text-base"
                    />
                  </div>
                  <p className="text-zinc-500 text-[10px] mt-2 text-center font-mono">
                    Enter the code logged in the backend server console.
                  </p>
                </div>
              )}

              {/* FORGOT STEP 3: RESET PASSWORD INPUT */}
              {mode === "forgot" && forgotStep === 3 && (
                <div>
                  <label className="block text-zinc-400 text-xs font-semibold mb-2 uppercase tracking-widest font-mono">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 chars)"
                      className="w-full bg-black/50 border border-white/5 rounded-2xl pl-11 pr-14 py-4 text-sm text-white placeholder-zinc-700 outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/10 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 text-white font-bold text-xs tracking-widest uppercase hover:scale-[1.01] hover:brightness-110 active:scale-[0.99] transition-all duration-300 shadow-md shadow-violet-500/10 flex items-center justify-center cursor-pointer font-mono"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                {mode === "login" && "Access System Core"}
                {mode === "register" && "Initialize Identity"}
                {mode === "forgot" && (
                  forgotStep === 1 ? "Send Recovery Code" :
                  forgotStep === 2 ? "Verify Security Code" : "Override Access Pass"
                )}
              </>
            )}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-[1px] bg-white/5"></div>
          <span className="text-zinc-600 text-xs tracking-wider font-mono">
            OR
          </span>
          <div className="flex-1 h-[1px] bg-white/5"></div>
        </div>

        {/* SWITCH MODES */}
        <div className="text-center text-xs font-mono">
          {mode === "login" && (
            <p className="text-zinc-500">
              New Operator?{" "}
              <button
                onClick={() => switchMode("register")}
                className="text-violet-400 hover:text-cyan-400 font-bold transition-all duration-300 cursor-pointer ml-1"
              >
                Register Identity
              </button>
            </p>
          )}

          {mode === "register" && (
            <p className="text-zinc-500">
              Active Credentials?{" "}
              <button
                onClick={() => switchMode("login")}
                className="text-violet-400 hover:text-cyan-400 font-bold transition-all duration-300 cursor-pointer ml-1"
              >
                Sign In
              </button>
            </p>
          )}

          {mode === "forgot" && (
            <button
              onClick={() => switchMode("login")}
              className="text-violet-400 hover:text-cyan-400 font-bold transition-all duration-300 cursor-pointer"
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