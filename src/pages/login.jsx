import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Login() {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-black flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden border-r border-zinc-900">

        {/* Glow */}
        <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px]"></div>

        <div className="absolute bottom-[-200px] right-[-100px] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10 flex flex-col justify-between p-20 w-full">

          <div>

            <div className="flex items-center gap-4 mb-10">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500"></div>

              <h1 className="text-white text-3xl font-bold">
                ANTIGRAVITY OS
              </h1>

            </div>

            <h2 className="text-white text-6xl font-bold leading-tight max-w-2xl">

              Future-ready
              <br />

              enterprise intelligence.

            </h2>

            <p className="text-zinc-500 text-xl mt-8 max-w-xl leading-relaxed">

              Experience AI-powered workflows,
              analytics, automation and futuristic
              operational systems.

            </p>

          </div>

          {/* Floating Card */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-[32px] p-8 backdrop-blur-2xl max-w-lg">

            <p className="text-zinc-400 text-lg leading-relaxed">

              “Antigravity OS completely transformed
              enterprise productivity into an intelligent
              ecosystem.”

            </p>

            <div className="flex items-center gap-4 mt-8">

              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500"></div>

              <div>

                <h3 className="text-white font-semibold">
                  Enterprise Systems Team
                </h3>

                <p className="text-zinc-500 text-sm">
                  Antigravity Technologies
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center px-8">

        <div className="w-full max-w-md">

          <h1 className="text-white text-5xl font-bold mb-4">
            Welcome Back
          </h1>

          <p className="text-zinc-500 text-lg mb-10">
            Access the Antigravity command center.
          </p>

          {/* EMAIL */}
          <input
            type="text"
            placeholder="Email address or username"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 mb-5"
          />

          {/* PASSWORD */}
        <div className="relative">

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 pr-14 text-white outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
  >
    {showPassword ? (
      <EyeOff className="w-5 h-5" />
    ) : (
      <Eye className="w-5 h-5" />
    )}
  </button>

</div>

          {/* FORGOT */}
          <div className="flex justify-end mt-4">

            <button className="text-zinc-500 hover:text-violet-400 transition-all duration-300 text-sm">
              Forgot password?
            </button>

          </div>

          {/* LOGIN */}
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold text-lg mt-6 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-violet-500/20"
          >
            Access System
          </button>

          {/* REGISTER */}
          <div className="mt-10 text-center">

            <p className="text-zinc-500">

              New to Antigravity?{" "}

              <button className="text-violet-400 hover:text-cyan-400 transition-all duration-300">
                Create account
              </button>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;