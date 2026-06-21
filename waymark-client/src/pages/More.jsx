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


import MobileBottomNav from "../components/navigation/MobileBottomNav";

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
    path: "/profile/me",
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
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-8 md:px-8">
        <div className="mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-[#F6AD55]">
            <Compass size={30} />
          </div>

          <h1 className="mt-5 text-4xl font-bold">More</h1>
          <p className="mt-2 text-[#002045]/60">
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
                className="group rounded-3xl border border-[#D8DEE6] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F7FAFC] text-[#F6AD55] transition group-hover:bg-orange-50">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">{item.title}</h2>
                    <p className="mt-1 text-sm text-[#002045]/60">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default More;