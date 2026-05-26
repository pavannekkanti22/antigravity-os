function Register() {
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

        <input
          type="password"
          placeholder="Password"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-violet-500 transition-all duration-300"
        />

        <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all duration-300 shadow-lg shadow-violet-500/20">
          Create Account
        </button>

      </div>

    </div>
  );
}

export default Register;