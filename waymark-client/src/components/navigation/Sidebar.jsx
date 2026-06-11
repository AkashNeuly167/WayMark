import {
  Home,
  Search,
  MapPinned,
  Bell,
  User,
  Compass,
} from "lucide-react";

function Sidebar() {
  const items = [
    { icon: Home, label: "Feed" },
    { icon: Search, label: "Search" },
    { icon: MapPinned, label: "Bucket List" },
    { icon: Bell, label: "Notifications" },
    { icon: User, label: "Profile" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-[#081120] border-r border-white/10">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Compass className="text-[#F6AD55]" />
          <h1 className="text-2xl font-bold text-white">
            Waymark
          </h1>
        </div>
      </div>

      <nav className="flex-1 p-4">
        {items.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition"
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;