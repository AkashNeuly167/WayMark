import DesktopSidebar from "../components/navigation/DesktopSidebar";
import MobileBottomNav from "../components/navigation/MobileBottomNav";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-transparent text-white">
      <DesktopSidebar />

      <main className="min-h-screen pb-24 md:ml-64 md:pb-8">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}

export default MainLayout;