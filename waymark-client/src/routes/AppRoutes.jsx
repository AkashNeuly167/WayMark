import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";

import Feed from "../pages/Feed";
import Explore from "../pages/Explore";
import Journey from "../pages/Journey";
import Profile from "../pages/Profile";
import CreateMemory from "../pages/CreateMemory";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/feed" />} />
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
        path="/memories/create"
        element={
          <ProtectedRoute>
            <CreateMemory />
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

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/feed" />} />
    </Routes>
  );
}

export default AppRoutes;
