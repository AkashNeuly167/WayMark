import { Navigate, useLocation } from "react-router-dom";
import DesktopSidebar from "../components/navigation/DesktopSideBar";
import { useAuth } from "../context/AuthContext";
import MobileBottomNav from "../components/navigation/MobileBottomNav";
import FeedSkeleton from "../components/ui/FeedSkeleton";

function ProtectedRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth) return null;

  const { user, loading } = auth;

  if (loading) {
    if (location.pathname === "/feed") {
      return (
        <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
          <DesktopSidebar />

          <main className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 px-4 pb-36 pt-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:pb-12">
            <section className="min-w-0">
              <FeedSkeleton />
            </section>
          </main>

          <MobileBottomNav />
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FAFC] text-[#002045]">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;