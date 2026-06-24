import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#06111F] px-4 text-white">
        <div className="flex items-center gap-3 rounded-[2rem] border border-white/10 bg-[#101D2E] px-6 py-5 font-black shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
          <Loader2 className="animate-spin text-[#F6AD55]" size={22} />
          <span className="text-sm text-slate-300">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
