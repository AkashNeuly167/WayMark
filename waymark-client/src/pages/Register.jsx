import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";

import { registerUser } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      login(data.token, data.user);
      navigate("/feed");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B132B] text-white lg:grid lg:h-screen lg:grid-cols-[1.6fr_1fr] lg:overflow-hidden">
      <section className="relative hidden overflow-hidden bg-[#002045] lg:flex">
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1800&auto=format&fit=crop"
          alt="Traveler landscape"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#002045]/40 to-[#0B132B]/95" />

        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(246,173,85,0.35)_1px,transparent_0)] [background-size:40px_40px]" />

        <svg
          className="absolute inset-0 h-full w-full opacity-40"
          fill="none"
          viewBox="0 0 1000 1000"
        >
          <path
            d="M120 780 Q320 650 520 790 T900 520"
            stroke="#F6AD55"
            strokeDasharray="8 8"
            strokeWidth="2"
          />
          <circle cx="120" cy="780" r="4" fill="#F6AD55" />
          <circle cx="520" cy="790" r="4" fill="#F6AD55" />
          <circle cx="900" cy="520" r="6" fill="#F6AD55" />
        </svg>

        <div className="absolute left-12 top-16 z-20 flex flex-col gap-4 xl:left-16 xl:top-24">
          <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-md">
            <Compass className="h-5 w-5 text-[#F6AD55]" />
            <span className="text-sm font-medium">Join the explorer network</span>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-md">
            <span className="text-[#F6AD55]">●</span>
            <span className="text-sm font-medium">Map your first memory</span>
          </div>
        </div>

        <div className="relative z-20 flex h-full w-full items-end p-12 pb-16 xl:p-16 xl:pb-24">
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#F6AD55]">
              Begin Your Waymark
            </p>

            <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Share memories. Discover places. Map your world.
            </h1>

            <p className="max-w-md text-base leading-7 text-white/70 xl:text-lg xl:leading-8">
              Create your digital travel identity and join a community of
              explorers preserving journeys across the globe.
            </p>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#1A365D] via-[#002045] to-[#0B132B] px-5 py-8 lg:h-screen lg:min-h-0 lg:px-8 lg:py-6">
        <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-7 xl:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 rounded-full bg-[#F6AD55]/10 p-3 text-[#F6AD55]">
              <Compass className="h-9 w-9" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight xl:text-4xl">
              Create Account
            </h2>

            <p className="mt-1 text-base text-white/50 xl:text-lg">
              Start mapping your journeys.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold text-white/70">
                Username
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />

                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="adventureseeker"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-12 py-3.5 text-white placeholder:text-white/25 outline-none transition focus:border-[#F6AD55] focus:ring-2 focus:ring-[#F6AD55]/30"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-white/70">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="explorer@waymark.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-12 py-3.5 text-white placeholder:text-white/25 outline-none transition focus:border-[#F6AD55] focus:ring-2 focus:ring-[#F6AD55]/30"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-white/70">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-12 py-3.5 text-white placeholder:text-white/25 outline-none transition focus:border-[#F6AD55] focus:ring-2 focus:ring-[#F6AD55]/30"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-white/70">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />

                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-12 py-3.5 text-white placeholder:text-white/25 outline-none transition focus:border-[#F6AD55] focus:ring-2 focus:ring-[#F6AD55]/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#F6AD55] py-3.5 text-lg font-bold text-[#002045] transition hover:bg-orange-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Waymark"}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/50">
            Already have an account?
            <Link
              to="/login"
              className="ml-2 font-bold text-[#F6AD55] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;