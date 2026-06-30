import {
  ArrowRight,
  Book,
  Bookmark,
  Camera,
  Compass,
  MapPin,
  Route,
  Search,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Create travel memories",
    text: "Upload photos, write the story, and save the exact place on a map.",
    icon: Camera,
  },
  {
    title: "Explore places on a map",
    text: "Discover public memories by city, country, or location.",
    icon: MapPin,
  },
  {
    title: "Build your passport",
    text: "Turn your visited countries, cities, and memories into a travel identity.",
    icon: Book,
  },
  {
    title: "Follow travelers",
    text: "Connect with people, save memories, and get notified on activity.",
    icon: Users,
  },
];

const appPreviewCards = [
  {
    title: "Feed",
    description: "Browse memories from travelers.",
    icon: Camera,
  },
  {
    title: "Explore",
    description: "Find memories through an interactive map.",
    icon: Search,
  },
  {
    title: "Journey",
    description: "See your route timeline and visited places.",
    icon: Route,
  },
  {
    title: "Passport",
    description: "Track countries, cities, and stamps.",
    icon: Book,
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-[#06111F] text-white">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#06111F]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#F6AD55] text-[#06111F]">
              <Compass size={19} />
            </span>
            <span className="text-xl font-black tracking-tight">WayMark</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-bold text-slate-400 md:flex">
            <a href="#features" className="transition hover:text-[#F6AD55]">
              Features
            </a>
            <a href="#preview" className="transition hover:text-[#F6AD55]">
              Preview
            </a>
            <a href="#why" className="transition hover:text-[#F6AD55]">
              Why WayMark
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10 sm:block"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-full bg-[#F6AD55] px-5 py-2.5 text-sm font-black text-[#06111F] transition hover:bg-orange-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-5 pb-20 pt-28 md:px-10 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-300">
              <MapPin size={16} className="text-[#F6AD55]" />
              Travel memories with real locations
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Every trip deserves a memory.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              WayMark helps travelers save photos, stories, and places in one
              simple travel journal. Pin memories on the map, follow other
              travelers, and build your personal travel passport.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F6AD55] px-7 py-4 text-base font-black text-[#06111F] transition hover:bg-orange-300"
              >
                Create your first memory
                <ArrowRight size={19} />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-4 text-base font-black text-white transition hover:bg-white/[0.08]"
              >
                Login
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <MiniStat value="Maps" label="Explore" />
              <MiniStat value="Photos" label="Memories" />
              <MiniStat value="Stamps" label="Passport" />
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.34)]">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
                <div className="relative h-72 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center md:h-96">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101D2E] via-[#101D2E]/25 to-transparent" />

                  <div className="absolute left-5 top-5 rounded-full bg-black/45 px-4 py-2 text-xs font-black text-white backdrop-blur">
                    Gulmarg, India
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-[#101D2E]/90 p-4 backdrop-blur">
                    <p className="text-xs font-black uppercase tracking-widest text-[#F6AD55]">
                      Memory
                    </p>
                    <h3 className="mt-1 text-2xl font-black">Kashmir</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Amazing view from the valley.
                    </p>

                    <div className="mt-4 flex items-center gap-3 text-sm font-black text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Bookmark size={15} className="text-[#F6AD55]" />
                        Saved
                      </span>
                      <span>1 like</span>
                      <span>0 comments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-3 hidden rounded-3xl border border-white/10 bg-[#101D2E] p-5 shadow-2xl md:block">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                Passport
              </p>
              <p className="mt-2 text-3xl font-black text-white">2</p>
              <p className="text-sm font-bold text-[#F6AD55]">countries</p>
            </div>

            <div className="absolute -right-3 -top-6 hidden rounded-3xl border border-white/10 bg-[#101D2E] p-5 shadow-2xl md:block">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                Journey
              </p>
              <p className="mt-2 text-sm font-bold text-white">
                Map your route
              </p>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-white/10 bg-[#0B1728] py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-widest text-[#F6AD55]">
                What you can do
              </p>
              <h2 className="mt-3 text-4xl font-black md:text-5xl">
                A travel app built around memories.
              </h2>
              <p className="mt-4 text-slate-400">
                WayMark combines a travel journal, social feed, map discovery,
                and passport-style profile into one MERN application.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-[1.75rem] border border-white/10 bg-[#101D2E] p-6 transition hover:border-[#F6AD55]/35 hover:bg-[#14243A]"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F6AD55]/15 text-[#F6AD55]">
                      <Icon size={23} />
                    </div>

                    <h3 className="mt-5 text-lg font-black">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {feature.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="preview" className="py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-[#F6AD55]">
                  App preview
                </p>
                <h2 className="mt-3 text-4xl font-black md:text-5xl">
                  Designed for mobile and web.
                </h2>
              </div>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 font-black text-[#F6AD55] transition hover:text-orange-300"
              >
                Try the app
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {appPreviewCards.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[1.75rem] border border-white/10 bg-[#101D2E] p-6"
                  >
                    <Icon size={26} className="text-[#F6AD55]" />
                    <h3 className="mt-5 text-xl font-black">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="why" className="bg-[#101D2E] py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-[#F6AD55]">
                Why WayMark
              </p>
              <h2 className="mt-3 text-4xl font-black md:text-5xl">
                More than a photo dump.
              </h2>
            </div>

            <div className="space-y-4 text-lg leading-8 text-slate-400">
              <p>
                A memory is more useful when it has context. WayMark keeps the
                story, images, location, city, country, likes, comments, and
                saved status connected.
              </p>
              <p>
                The app is also built like a real full-stack product: protected
                routes, image uploads, MongoDB relationships, notifications,
                map views, profile customization, and responsive layouts.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <h2 className="text-4xl font-black md:text-6xl">
              Start your travel journal today.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              Create your first memory, pin it on the map, and start building
              your WayMark passport.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="rounded-2xl bg-[#F6AD55] px-8 py-4 text-lg font-black text-[#06111F] transition hover:bg-orange-300"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="rounded-2xl border border-white/15 px-8 py-4 text-lg font-black text-white transition hover:bg-white/10"
              >
                Login
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#06111F] py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 text-center md:flex-row md:px-10 md:text-left">
          <div>
            <h3 className="text-2xl font-black text-white">WayMark</h3>
            <p className="mt-2 text-sm text-slate-500">
              A MERN travel community project.
            </p>
          </div>

          <p className="text-sm text-slate-600">
            © 2026 WayMark. Built with React, Express, MongoDB, and Cloudinary.
          </p>
        </div>
      </footer>
    </div>
  );
}

function MiniStat({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-lg font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-widest text-slate-500">
        {label}
      </p>
    </div>
  );
}

export default Landing;