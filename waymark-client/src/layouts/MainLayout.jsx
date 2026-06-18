import DesktopSidebar from "../components/navigation/DesktopSidebar";
import MobileBottomNav from "../components/navigation/MobileBottomNav";

const MainLayout = ({children}) => {
  return (
    <div>
      <DesktopSidebar />
      <main>
      {children}
      </main>
      
      <MobileBottomNav />
    </div>
  );
};

export default MainLayout;