import {
  ArrowRight,
  BadgeCheck,
  Mountain,
  Navigation,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
          <Link to="/" className="text-2xl font-black text-[#1A365D]">
            Waymark
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-bold text-[#002045]/60 md:flex">
            <a href="#map" className="hover:text-[#F6AD55]">
              Map Explorer
            </a>
            <a href="#stories" className="hover:text-[#F6AD55]">
              Stories
            </a>
            <a href="#features" className="hover:text-[#F6AD55]">
              Features
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-bold text-[#002045] transition hover:bg-[#F7FAFC] sm:block"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-full bg-[#F6AD55] px-5 py-2.5 text-sm font-black text-white shadow-lg transition hover:bg-orange-400"
            >
              Join Waymark
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-16">
          <img
            src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=2200&auto=format&fit=crop"
            alt="Mountain landscape"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#002045]/70 via-[#002045]/30 to-[#F7FAFC]" />

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur">
              <BadgeCheck size={18} className="text-[#F6AD55]" />
              Join explorers mapping their world
            </div>

            <h1 className="text-5xl font-black leading-tight text-white drop-shadow-lg md:text-7xl lg:text-8xl">
              Your world, mapped.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/85 md:text-2xl md:leading-10">
              Document every ridge line, city street, and hidden trail. Waymark
              is a visual diary for modern travelers.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F6AD55] px-8 py-4 text-lg font-black text-white shadow-2xl transition hover:-translate-y-1 hover:bg-orange-400 sm:w-auto"
              >
                Start Your Journey
                <ArrowRight size={20} />
              </Link>

              <Link
                to="/login"
                className="w-full rounded-2xl border border-white/35 bg-white/10 px-8 py-4 text-lg font-black text-white backdrop-blur transition hover:bg-white/20 sm:w-auto"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-5 md:grid-cols-4 md:px-10">
            {[
              ["142", "Countries visited"],
              ["890k", "Kilometers logged"],
              ["52k", "Active explorers"],
              ["12M", "Waypoints created"],
            ].map(([number, label]) => (
              <div key={label} className="rounded-3xl bg-[#F7FAFC] p-6 text-center">
                <p className="text-4xl font-black text-[#1A365D]">{number}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-widest text-[#002045]/45">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="map" className="overflow-hidden py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#F6AD55]">
                Live Travel Network
              </p>

              <h2 className="text-4xl font-black leading-tight text-[#1A365D] md:text-5xl">
                Witness the global trail.
              </h2>

              <p className="mt-5 text-lg leading-8 text-[#002045]/65">
                Discover where travelers are creating memories, sharing routes,
                and marking hidden places around the world.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: Navigation,
                    title: "Real travel memories",
                    text: "Share photos, cities, countries, and personal stories.",
                  },
                  {
                    icon: Users,
                    title: "Community discovery",
                    text: "Find travelers, profiles, and places from search.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex gap-4 rounded-3xl border border-[#D8DEE6] bg-white p-5 shadow-sm"
                    >
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-[#F6AD55]">
                        <Icon size={22} />
                      </div>

                      <div>
                        <h3 className="font-black">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-[#002045]/60">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative h-[520px] overflow-hidden rounded-[2rem] border border-[#D8DEE6] bg-[#E8EDF2] shadow-2xl lg:col-span-7">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600&auto=format&fit=crop"
                alt="Map"
                className="h-full w-full object-cover grayscale"
              />

              <div className="absolute inset-0 bg-[#002045]/20" />

              <div className="absolute left-[20%] top-[32%] h-4 w-4 animate-pulse rounded-full bg-[#F6AD55] shadow-[0_0_25px_rgba(246,173,85,0.9)]" />
              <div className="absolute left-[52%] top-[45%] h-6 w-6 animate-pulse rounded-full border-2 border-white bg-[#F6AD55] shadow-[0_0_30px_rgba(246,173,85,0.9)]" />
              <div className="absolute left-[74%] top-[64%] h-3 w-3 animate-pulse rounded-full bg-[#F6AD55] shadow-[0_0_20px_rgba(246,173,85,0.9)]" />

              <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/40 bg-white/85 p-5 shadow-xl backdrop-blur md:left-auto md:w-80">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1A365D] font-black text-white">
                    W
                  </div>

                  <div>
                    <h4 className="font-black">Live from Chile</h4>
                    <p className="text-sm text-[#002045]/55">
                      New memory added in Patagonia
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-[#F6AD55]">
                    Hiking
                  </span>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-[#F6AD55]">
                    Patagonia
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="stories" className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-sm font-black uppercase tracking-widest text-[#F6AD55]">
                  Featured Stories
                </p>
                <h2 className="text-4xl font-black text-[#1A365D] md:text-5xl">
                  Stories from the wild.
                </h2>
                <p className="mt-4 max-w-xl text-[#002045]/60">
                  Curated expeditions from explorers and weekend travelers.
                </p>
              </div>

              <Link
                to="/register"
                className="flex items-center gap-2 font-black text-[#1A365D] hover:text-[#F6AD55]"
              >
                Join and share yours
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-4 md:grid-rows-2 md:h-[760px]">
              <StoryCard
                large
                image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop"
                title="Beyond the glacier: solo across the ice."
                subtitle="How solitude changed everything about navigation."
              />

              <StoryCard
                wide
                image="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1600&auto=format&fit=crop"
                title="Peak nightscapes"
                subtitle="Mastering camping under the stars."
              />

              <StoryCard
                image="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop"
                title="Urban trails"
              />

              <StoryCard
                image="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop"
                title="Hidden valleys"
              />
            </div>
          </div>
        </section>

        <section id="features" className="bg-[#1A365D] py-24">
          <div className="mx-auto max-w-5xl px-5 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white/10 text-[#F6AD55]">
              <Mountain size={32} />
            </div>

            <h2 className="mt-6 text-4xl font-black text-white md:text-6xl">
              Ready to leave your mark?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
              Join a community that values the journey as much as the
              destination.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="rounded-2xl bg-[#F6AD55] px-8 py-4 text-lg font-black text-white shadow-xl transition hover:bg-orange-400"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="rounded-2xl border border-white/25 px-8 py-4 text-lg font-black text-white transition hover:bg-white/10"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#D8DEE6] bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 text-center md:flex-row md:px-10 md:text-left">
          <div>
            <h3 className="text-2xl font-black text-[#1A365D]">Waymark</h3>
            <p className="mt-2 text-sm text-[#002045]/55">
              The travel community for mapping your memories.
            </p>
          </div>

          <p className="text-sm text-[#002045]/45">
            © 2026 Waymark Community. Built for the wild.
          </p>
        </div>
      </footer>
    </div>
  );
}

function StoryCard({ image, title, subtitle, large, wide }) {
  return (
    <div
      className={`group relative min-h-[260px] cursor-pointer overflow-hidden rounded-[2rem] border border-[#D8DEE6] ${
        large ? "md:col-span-2 md:row-span-2" : wide ? "md:col-span-2" : ""
      }`}
    >
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 p-6 text-white md:p-8">
        <div className="mb-3 flex items-center gap-2 text-[#F6AD55]">
          <Sparkles size={18} />
          <span className="text-xs font-black uppercase tracking-widest">
            Waymark Story
          </span>
        </div>

        <h3 className="text-2xl font-black md:text-3xl">{title}</h3>

        {subtitle && <p className="mt-3 text-sm text-white/70">{subtitle}</p>}
      </div>
    </div>
  );
}

export default Landing;