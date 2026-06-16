import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import MemoryDetail from "../pages/MemoryDetail";
import Feed from "../pages/Feed";
import Explore from "../pages/Explore";
import Journey from "../pages/Journey";
import Profile from "../pages/Profile";
import CreateMemory from "../pages/CreateMemory";
import Notification from "../pages/Notification";
import BucketList from "../pages/BucketList";
import ProtectedRoute from "./ProtectedRoute";
import More from "../pages/More";
import TravelWrapped from "../pages/TravelWrapped";
import Settings from "../pages/Settings";
import Landing from "../pages/Landing";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        }
      />

      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        }
      />

      <Route
        path="/journeys"
        element={
          <ProtectedRoute>
            <Journey />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bucket-list"
        element={
          <ProtectedRoute>
            <BucketList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/memories/create"
        element={
          <ProtectedRoute>
            <CreateMemory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/memories/:id"
        element={
          <ProtectedRoute>
            <MemoryDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/:id"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notification />
          </ProtectedRoute>
        }
      />

      <Route
        path="/more"
        element={
          <ProtectedRoute>
            <More />
          </ProtectedRoute>
        }
      />

      <Route
        path="/travel-wrapped"
        element={
          <ProtectedRoute>
            <TravelWrapped />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* 404 fallback must stay LAST */}
      <Route path="*" element={<Navigate to="/feed" />} />
    </Routes>
  );
}

export default AppRoutes;
