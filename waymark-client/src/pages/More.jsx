import {
  Bell,
  Compass,
  Gift,
  ListChecks,
  Map,
  Settings,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

const moreItems = [
  {
    title: "Bucket List",
    description: "Plan places you want to visit.",
    icon: ListChecks,
    path: "/bucket-list",
  },
  {
    title: "Journeys",
    description: "View your travel journeys.",
    icon: Map,
    path: "/journeys",
  },
  {
    title: "Notifications",
    description: "Likes, comments, and follows.",
    icon: Bell,
    path: "/notifications",
  },
  {
    title: "Passport",
    description: "Open your traveler profile.",
    icon: User,
    path: "/passport",
  },
  {
    title: "Travel Wrapped",
    description: "Your travel recap and stats.",
    icon: Gift,
    path: "/travel-wrapped",
  },
  {
    title: "Settings",
    description: "Manage account preferences.",
    icon: Settings,
    path: "/settings",
  },
];

function More() {
  return (
    <div className="min-h-screen bg-transparent text-white">
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-8 md:px-8 md:pt-10">
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] md:p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-[#F6AD55]/20 bg-[#F6AD55]/10 text-[#F6AD55]">
            <Compass size={30} />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-[#F6AD55]">
            WayMark tools
          </p>

          <h1 className="mt-2 text-4xl font-black text-white md:text-5xl">
            More
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
            Quick access to your WayMark tools and travel features.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {moreItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.path}
                className="group rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-[#F6AD55]/35 hover:bg-[#14243A]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#F6AD55] transition group-hover:border-[#F6AD55]/30 group-hover:bg-[#F6AD55]/10">
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-black text-white">
                      {item.title}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default More;