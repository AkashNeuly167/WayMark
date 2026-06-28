import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Compass, Eye, EyeOff, Lock, Mail } from "lucide-react";

import { loginUser } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);
      login(data.token, data.user);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#06111F] text-white lg:grid lg:h-screen lg:grid-cols-[1.55fr_1fr] lg:overflow-hidden">
      <section className="relative hidden overflow-hidden bg-[#06111F] lg:flex">
        <img
          src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1800&auto=format&fit=crop"
          alt="Mountain landscape"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#06111F]/30 via-[#06111F]/45 to-[#06111F]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06111F] via-transparent to-transparent" />

        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(246,173,85,0.32)_1px,transparent_0)] [background-size:42px_42px]" />

        <svg
          className="absolute inset-0 h-full w-full opacity-45"
          fill="none"
          viewBox="0 0 1000 1000"
        >
          <path
            d="M100 800 Q300 700 500 850 T900 600"
            stroke="#F6AD55"
            strokeDasharray="8 8"
            strokeWidth="2"
          />
          <circle cx="100" cy="800" r="4" fill="#F6AD55" />
          <circle cx="500" cy="850" r="4" fill="#F6AD55" />
          <circle cx="900" cy="600" r="6" fill="#F6AD55" />
        </svg>

        <div className="absolute left-12 top-16 z-20 flex flex-col gap-4 xl:left-16 xl:top-24">
          <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3 shadow-[0_18px_55px_rgba(0,0,0,0.25)] backdrop-blur-md">
            <span className="text-[#F6AD55]">▲</span>
            <span className="text-sm font-black text-white">
              4,280m Peak Ascent
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3 shadow-[0_18px_55px_rgba(0,0,0,0.25)] backdrop-blur-md">
            <Compass className="h-5 w-5 text-[#F6AD55]" />
            <span className="text-sm font-black text-white">
              Dolomites, Italy
            </span>
          </div>
        </div>

        <div className="relative z-20 flex h-full w-full items-end p-12 pb-16 xl:p-16 xl:pb-24">
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-[#F6AD55]">
              Redefining Exploration
            </p>

            <h1 className="mb-5 text-4xl font-black leading-tight tracking-tight text-white xl:text-5xl">
              Archive your journeys in high fidelity.
            </h1>

            <p className="max-w-md text-base leading-7 text-slate-300 xl:text-lg xl:leading-8">
              Join a community of explorers documenting the world&apos;s most
              remote paths with precision and style.
            </p>
          </div>
        </div>
      </section>

      <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#06111F] px-5 py-8 lg:h-screen lg:min-h-0 lg:px-8 lg:py-6">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#F6AD55]/20 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-orange-500/10 blur-[100px]" />

        <div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-[#101D2E]/88 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-7 xl:p-8">
          <div className="mb-7 flex flex-col items-center text-center">
            <div className="mb-3 rounded-2xl border border-[#F6AD55]/20 bg-[#F6AD55]/10 p-3 text-[#F6AD55] shadow-[0_16px_45px_rgba(246,173,85,0.14)]">
              <Compass className="h-9 w-9" />
            </div>

            <h2 className="text-3xl font-black tracking-tight text-white xl:text-4xl">
              WayMark
            </h2>

            <p className="mt-1 text-base font-semibold text-slate-400 xl:text-lg">
              Your world, mapped.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="explorer@waymark.com"
                  className="dark-input w-full rounded-2xl border border-white/10 bg-white/[0.05] px-12 py-3.5 font-semibold !text-white placeholder:text-slate-600 outline-none transition focus:border-[#F6AD55] focus:ring-2 focus:ring-[#F6AD55]/25"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-black text-[#F6AD55] transition hover:text-white"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="dark-input w-full rounded-2xl border border-white/10 bg-white/[0.05] px-12 py-3.5 font-semibold !text-white placeholder:text-slate-600 outline-none transition focus:border-[#F6AD55] focus:ring-2 focus:ring-[#F6AD55]/25"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#F6AD55] py-3.5 text-lg font-black text-[#06111F] shadow-[0_18px_45px_rgba(246,173,85,0.2)] transition hover:bg-orange-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Start Exploring"}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-600">
              or continue with
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] py-3.5 font-black text-white transition hover:bg-white/10"
          >
            <span className="font-black text-blue-400">G</span>
            Google
          </button>

          <p className="mt-6 text-center text-sm font-semibold text-slate-400">
            New to WayMark?
            <Link
              to="/register"
              className="ml-2 font-black text-[#F6AD55] transition hover:text-orange-300"
            >
              Create Account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;