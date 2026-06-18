import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

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
            <MainLayout>
              <Feed />
            </MainLayout>
            
          </ProtectedRoute>
        }
      />

      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Explore />
            </MainLayout>
            
          </ProtectedRoute>
        }
      />

      <Route
        path="/journeys"
        element={
          <ProtectedRoute>
            <MainLayout>
            <Journey />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bucket-list"
        element={
          <ProtectedRoute>
            <MainLayout>
            <BucketList />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/memories/create"
        element={
          <ProtectedRoute>
            <MainLayout>
            <CreateMemory />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/memories/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
            <MemoryDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
            <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <MainLayout>
            <Notification />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/more"
        element={
          <ProtectedRoute>
            <MainLayout>
            <More />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/travel-wrapped"
        element={
          <ProtectedRoute>
            <MainLayout>
            <TravelWrapped />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
            <Settings />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 fallback must stay LAST */}
      <Route path="*" element={<Navigate to="/feed" />} />
    </Routes>
  );
}

export default AppRoutes;
