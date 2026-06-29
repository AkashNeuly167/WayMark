import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

const Landing = lazy(() => import("../pages/Landing"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));

const Feed = lazy(() => import("../pages/Feed"));
const Explore = lazy(() => import("../pages/Explore"));
const Journey = lazy(() => import("../pages/Journey"));
const Profile = lazy(() => import("../pages/Profile"));
const CreateMemory = lazy(() => import("../pages/CreateMemory"));
const MemoryDetail = lazy(() => import("../pages/MemoryDetail"));
const EditMemory = lazy(() => import("../pages/EditMemory"));
const Notification = lazy(() => import("../pages/Notification"));
const BucketList = lazy(() => import("../pages/BucketList"));
const More = lazy(() => import("../pages/More"));
const TravelWrapped = lazy(() => import("../pages/TravelWrapped"));
const Settings = lazy(() => import("../pages/Settings"));
const Passport = lazy(() => import("../pages/Passport"));

function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#06111F] px-4 text-white">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#F6AD55]" />

        <p className="mt-4 text-sm font-black uppercase tracking-[0.22em] text-slate-500">
          Loading WayMark
        </p>
      </div>
    </div>
  );
}

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/feed"
          element={
            <ProtectedPage>
              <Feed />
            </ProtectedPage>
          }
        />

        <Route
          path="/explore"
          element={
            <ProtectedPage>
              <Explore />
            </ProtectedPage>
          }
        />

        <Route
          path="/journeys"
          element={
            <ProtectedPage>
              <Journey />
            </ProtectedPage>
          }
        />

        <Route
          path="/bucket-list"
          element={
            <ProtectedPage>
              <BucketList />
            </ProtectedPage>
          }
        />

        <Route
          path="/memories/create"
          element={
            <ProtectedPage>
              <CreateMemory />
            </ProtectedPage>
          }
        />

        <Route
          path="/memories/:id"
          element={
            <ProtectedPage>
              <MemoryDetail />
            </ProtectedPage>
          }
        />

        <Route
          path="/memories/:id/edit"
          element={
            <ProtectedPage>
              <EditMemory />
            </ProtectedPage>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedPage>
              <Profile />
            </ProtectedPage>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedPage>
              <Notification />
            </ProtectedPage>
          }
        />

        <Route
          path="/more"
          element={
            <ProtectedPage>
              <More />
            </ProtectedPage>
          }
        />

        <Route
          path="/travel-wrapped"
          element={
            <ProtectedPage>
              <TravelWrapped />
            </ProtectedPage>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedPage>
              <Settings />
            </ProtectedPage>
          }
        />

        <Route
          path="/passport"
          element={
            <ProtectedPage>
              <Passport />
            </ProtectedPage>
          }
        />

        {/* 404 fallback must stay LAST */}
        <Route path="*" element={<Navigate to="/feed" />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;