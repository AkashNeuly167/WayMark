import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Globe,
  ImageOff,
  MapPin,
  Users,
  UserPlus,
  UserRound,
  Pencil,
} from "lucide-react";

import TopNavbar from "../components/navigation/TopNavbar";
import MobileBottomNav from "../components/navigation/MobileBottomNav";
import ProfileSkeleton from "../components/ui/ProfileSkeleton";
import EditProfileModal from "../components/profile/EditProfileModal";

import { getUserProfile, toggleFollowUser } from "../services/user.service";
import { getMemories } from "../services/memory.service";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();


  const currentUserId = user?._id || user?.id;
  const [followLoading, setFollowLoading] = useState(false);

  const [profileUser, setProfileUser] = useState(null);
  const [userMemories, setUserMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const userRes = await getUserProfile(id);
        const memoriesRes = await getMemories();

        const userData = userRes.user || userRes;
        const allMemories = memoriesRes.memories || [];

        const filteredMemories = allMemories.filter((memory) => {
          const authorId = memory.author?._id || memory.author;
          return authorId?.toString() === userData._id?.toString();
        });

        setProfileUser(userData);
        setUserMemories(filteredMemories);
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const isOwnProfile = profileUser?._id === currentUserId;

  const isFollowing = profileUser?.followers?.some((follower) => {
    const followerId = typeof follower === "string" ? follower : follower?._id;
    return followerId?.toString() === currentUserId?.toString();
  });

  const handleFollowToggle = async () => {
    if (!profileUser?._id || followLoading) return;

    try {
      setFollowLoading(true);

      await toggleFollowUser(profileUser._id);

      const updatedProfile = await getUserProfile(profileUser._id);
      setProfileUser(updatedProfile.user);

      showToast({
        type: "success",
        title: isFollowing ? "Unfollowed" : "Followed",
        message: isFollowing
          ? `You unfollowed ${profileUser.username}.`
          : `You are now following ${profileUser.username}.`,
      });
    } catch (error) {
      console.error("Follow error:", error);

      showToast({
        type: "error",
        title: "Action failed",
        message:
          error.response?.data?.message || "Could not update follow status.",
      });
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
        <TopNavbar />
        <ProfileSkeleton />
        <MobileBottomNav />
      </div>
    );
  }

  const handleProfileUpdated = (updatedUser) => {
  setProfileUser(updatedUser);

  showToast({
    type: "success",
    title: "Profile updated",
    message: "Your profile changes were saved successfully.",
  });
};

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
        <TopNavbar />
        <main className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="rounded-3xl border border-[#D8DEE6] bg-white p-8 text-center">
            <h2 className="text-2xl font-bold">User not found</h2>
            <p className="mt-2 text-[#002045]/60">
              This profile does not exist.
            </p>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  const followersCount = profileUser.followers?.length || 0;
  const followingCount = profileUser.following?.length || 0;

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      <TopNavbar />

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 md:px-8">
        <section className="overflow-hidden rounded-[32px] border border-[#D8DEE6] bg-white shadow-sm">
          <div className="h-36 bg-gradient-to-r from-[#0B132B] via-[#1A365D] to-[#F6AD55]" />

          <div className="-mt-14 p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-5 md:flex-row md:items-end">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[#1A365D] text-4xl font-bold text-white shadow-lg">
                  {profileUser.username?.charAt(0).toUpperCase() || (
                    <UserRound size={40} />
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-bold md:text-5xl">
                    {profileUser.fullName || profileUser.username}
                  </h1>

                  <p className="mt-2 text-[#002045]/55">
                    @{profileUser.username}
                  </p>
                </div>
              </div>

            {isOwnProfile ? (
  <button
    type="button"
    onClick={() => setEditOpen(true)}
    className="flex items-center justify-center gap-2 rounded-2xl border border-[#D8DEE6] bg-white px-6 py-3 font-semibold text-[#002045] shadow-sm transition hover:bg-[#F7FAFC]"
  >
    <Pencil size={18} />
    Edit profile
  </button>
) : (
  <button
    type="button"
    onClick={handleFollowToggle}
    disabled={followLoading}
    className={`flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold shadow-sm transition disabled:opacity-60 ${
      isFollowing
        ? "border border-[#D8DEE6] bg-white text-[#002045] hover:bg-[#F7FAFC]"
        : "bg-[#F6AD55] text-white hover:bg-orange-400"
    }`}
  >
    <UserPlus size={18} />
    {followLoading ? "Updating..." : isFollowing ? "Following" : "Follow"}
  </button>
)}
            </div>

            <p className="mt-6 max-w-3xl text-[#002045]/70">
              {profileUser.bio || "No bio added yet."}
            </p>

            <div className="mt-5 flex flex-wrap gap-4 text-sm text-[#002045]/60">
              {profileUser.country?.trim() && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {profileUser.country}
                </div>
              )}

              {profileUser.website?.trim() && (
                <a
                  href={profileUser.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 transition hover:text-[#F6AD55]"
                >
                  <Globe size={16} />
                  {profileUser.website}
                </a>
              )}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-[#F7FAFC] p-4 text-center">
                <p className="text-2xl font-bold">{userMemories.length}</p>
                <p className="mt-1 text-sm text-[#002045]/50">Memories</p>
              </div>

              <div className="rounded-2xl bg-[#F7FAFC] p-4 text-center">
                <p className="text-2xl font-bold">{followersCount}</p>
                <p className="mt-1 text-sm text-[#002045]/50">Followers</p>
              </div>

              <div className="rounded-2xl bg-[#F7FAFC] p-4 text-center">
                <p className="text-2xl font-bold">{followingCount}</p>
                <p className="mt-1 text-sm text-[#002045]/50">Following</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Memories</h2>
              <p className="mt-1 text-[#002045]/55">
                Places shared by this traveler.
              </p>
            </div>

            <Users className="hidden text-[#002045]/30 md:block" size={28} />
          </div>

          {userMemories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#D8DEE6] bg-white p-10 text-center">
              <h3 className="text-2xl font-bold">No memories yet</h3>
              <p className="mt-2 text-[#002045]/60">
                This traveler has not shared any memories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {userMemories.map((memory) => {
                const image = memory.images?.[0]?.url || memory.images?.[0];

                return (
                  <Link
                    key={memory._id}
                    to={`/memories/${memory._id}`}
                    className="overflow-hidden rounded-3xl border border-[#D8DEE6] bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={memory.title}
                        className="h-56 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-56 w-full items-center justify-center bg-[#E8EDF2] text-[#002045]/40">
                        <ImageOff size={28} />
                      </div>
                    )}

                    <div className="p-5">
                      <div className="mb-2 flex items-center gap-1 text-sm text-[#F6AD55]">
                        <MapPin size={14} />
                        {memory.city}, {memory.country}
                      </div>

                      <h3 className="line-clamp-1 text-xl font-bold">
                        {memory.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm text-[#002045]/65">
                        {memory.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {editOpen && (
  <EditProfileModal
    profileUser={profileUser}
    onClose={() => setEditOpen(false)}
    onUpdated={handleProfileUpdated}
  />
)}
      <MobileBottomNav />
    </div>
  );
}

export default Profile;
