import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
function Register() {
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <div className="w-full max-w-md">

      <div className="mb-10">

        <h1 className="text-white text-5xl font-bold mb-4">
          Create Account
        </h1>

        <p className="text-zinc-500 text-lg">
          Join the Antigravity ecosystem.
        </p>

      </div>

      <div className="space-y-5">

        <input
          type="text"
          placeholder="Full Name"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-violet-500 transition-all duration-300"
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-violet-500 transition-all duration-300"
        />

      <div className="relative">

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 pr-14 text-white outline-none"
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
<div className="relative mt-5">

  <input
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Confirm Password"
    
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 pr-14 text-white outline-none"
  />
<p className="text-red-500">
  CONFIRM PASSWORD TEST
</p>
  <button
    type="button"
    onClick={() =>
      setShowConfirmPassword(!showConfirmPassword)
    }
    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
  >
    {showConfirmPassword ? (
      <EyeOff className="w-5 h-5" />
    ) : (
      <Eye className="w-5 h-5" />
    )}
  </button>

</div>

    </div>
  </div>
  );
}

export default Register;