import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Camera,
  Globe,
  ImageOff,
  Loader2,
  MapPin,
  Pencil,
  Trash2,
  Users,
  UserPlus,
  UserRound,
} from "lucide-react";

import ProfileSkeleton from "../components/ui/ProfileSkeleton";
import EditProfileModal from "../components/profile/EditProfileModal";

import {
  getUserProfile,
  toggleFollowUser,
  updateAvatar,
  deleteAvatar,
} from "../services/user.service";
import { getMemories } from "../services/memory.service";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/useToast";
import api from "../api/axios";
import { getSavedMemories } from "../services/bookmark.service";
import SavedMemoryRow from "../components/memory/SavedMemoryRow";

function Profile() {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const currentUserId = user?._id || user?.id;

  const [profileUser, setProfileUser] = useState(null);
  const [userMemories, setUserMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [savedMemories, setSavedMemories] = useState([]);
  const [activeTab, setActiveTab] = useState("memories");

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

        const viewingOwnProfile =
          userData._id?.toString() === currentUserId?.toString();

        if (viewingOwnProfile) {
          const savedRes = await getSavedMemories();
          setSavedMemories(savedRes.memories || []);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, currentUserId]);

  const isOwnProfile =
    profileUser?._id?.toString() === currentUserId?.toString();

  const avatarUrl =
    typeof profileUser?.avatar === "string"
      ? profileUser.avatar
      : profileUser?.avatar?.url;

  const isFollowing = profileUser?.followers?.some((follower) => {
    const followerId = typeof follower === "string" ? follower : follower?._id;
    return followerId?.toString() === currentUserId?.toString();
  });

  const handleProfileUpdated = (updatedUser) => {
    setProfileUser(updatedUser);

    if (isOwnProfile) {
      updateUser?.(updatedUser);
    }

    showToast({
      type: "success",
      title: "Profile updated",
      message: "Your profile changes were saved successfully.",
    });
  };

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

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file || avatarLoading) return;

    const uploadData = new FormData();
    uploadData.append("images", file);

    try {
      setAvatarLoading(true);

      const uploadRes = await api.post("/upload/images", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedImage = uploadRes.data.images?.[0];

      if (!uploadedImage) {
        throw new Error("Image upload failed");
      }

      const avatarPayload = {
        url: uploadedImage.url || uploadedImage.secure_url || uploadedImage,
        publicId: uploadedImage.publicId || uploadedImage.public_id,
      };

      if (!avatarPayload.url || !avatarPayload.publicId) {
        throw new Error("Uploaded image is missing url or publicId");
      }

      const avatarRes = await updateAvatar(avatarPayload);
      const updatedUser = avatarRes.user;

      setProfileUser(updatedUser);
      updateUser?.(updatedUser);

      showToast({
        type: "success",
        title: "Avatar updated",
        message: "Your profile photo was updated successfully.",
      });
    } catch (error) {
      console.error("Avatar upload error:", error);

      showToast({
        type: "error",
        title: "Upload failed",
        message:
          error.response?.data?.message ||
          error.message ||
          "Could not update avatar.",
      });
    } finally {
      setAvatarLoading(false);
      e.target.value = "";
    }
  };

  const handleAvatarDelete = async () => {
    if (avatarLoading || !avatarUrl) return;

    try {
      setAvatarLoading(true);

      const avatarRes = await deleteAvatar();
      const updatedUser = avatarRes.user;

      setProfileUser(updatedUser);
      updateUser?.(updatedUser);

      showToast({
        type: "success",
        title: "Avatar removed",
        message: "Your profile photo was removed.",
      });
    } catch (error) {
      console.error("Avatar delete error:", error);

      showToast({
        type: "error",
        title: "Delete failed",
        message: error.response?.data?.message || "Could not remove avatar.",
      });
    } finally {
      setAvatarLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
        <main className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="rounded-3xl border border-[#D8DEE6] bg-white p-8 text-center">
            <h2 className="text-2xl font-bold">User not found</h2>
            <p className="mt-2 text-[#002045]/60">
              This profile does not exist.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const followersCount = profileUser.followers?.length || 0;
  const followingCount = profileUser.following?.length || 0;

  const displayedMemories =
    activeTab === "saved" ? savedMemories : userMemories;

  const emptyTitle =
    activeTab === "saved" ? "No saved memories yet" : "No memories yet";

  const emptyMessage =
    activeTab === "saved"
      ? "Saved memories will appear here."
      : "This traveler has not shared any memories.";

  const sectionTitle = activeTab === "saved" ? "Saved Memories" : "Memories";

  const sectionSubtitle =
    activeTab === "saved"
      ? "Memories you saved for later."
      : "Places shared by this traveler.";

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 md:ml-64 md:px-8">
        <section className="overflow-hidden rounded-[32px] border border-[#D8DEE6] bg-white shadow-sm">
          <div className="h-36 bg-gradient-to-r from-[#0B132B] via-[#1A365D] to-[#F6AD55]" />

          <div className="-mt-14 p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-5 md:flex-row md:items-end">
                <div className="relative h-28 w-28 shrink-0 rounded-full">
                  <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-[#1A365D] text-4xl font-bold text-white shadow-lg">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={profileUser.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center">
                        {profileUser.username?.charAt(0).toUpperCase() || (
                          <UserRound size={40} />
                        )}
                      </div>
                    )}
                  </div>

                  {isOwnProfile && (
                    <label className="absolute bottom-1 right-1 grid h-10 w-10 cursor-pointer place-items-center rounded-full border-2 border-white bg-[#F6AD55] text-white shadow-lg transition hover:bg-orange-400">
                      {avatarLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Camera size={18} />
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={avatarLoading}
                        className="hidden"
                      />
                    </label>
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
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setEditOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-[#D8DEE6] bg-white px-6 py-3 font-semibold text-[#002045] shadow-sm transition hover:bg-[#F7FAFC]"
                  >
                    <Pencil size={18} />
                    Edit profile
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleAvatarDelete}
                      disabled={avatarLoading}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-6 py-3 font-semibold text-red-500 shadow-sm transition hover:bg-red-500 hover:text-white disabled:opacity-60"
                    >
                      {avatarLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                      Remove photo
                    </button>
                  )}
                </div>
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
                  {followLoading
                    ? "Updating..."
                    : isFollowing
                      ? "Following"
                      : "Follow"}
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
          {isOwnProfile && (
            <div className="mb-6 flex rounded-2xl border border-[#D8DEE6] bg-white p-1">
              <button
                type="button"
                onClick={() => setActiveTab("memories")}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-black transition ${
                  activeTab === "memories"
                    ? "bg-[#002045] text-white"
                    : "text-[#002045]/55 hover:bg-[#F7FAFC]"
                }`}
              >
                My Memories
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("saved")}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-black transition ${
                  activeTab === "saved"
                    ? "bg-[#002045] text-white"
                    : "text-[#002045]/55 hover:bg-[#F7FAFC]"
                }`}
              >
                Saved
              </button>
            </div>
          )}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">{sectionTitle}</h2>
              <p className="mt-1 text-[#002045]/55">{sectionSubtitle}</p>
            </div>

            <Users className="hidden text-[#002045]/30 md:block" size={28} />
          </div>

          {displayedMemories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#D8DEE6] bg-white p-10 text-center">
              <h3 className="text-2xl font-bold">{emptyTitle}</h3>
              <p className="mt-2 text-[#002045]/60">{emptyMessage}</p>
            </div>
          ) : activeTab === "saved" ? (
            <div className="space-y-4">
              {savedMemories.map((memory) => (
                <SavedMemoryRow
                  key={memory._id}
                  memory={memory}
                  onRemoved={(memoryId) => {
                    setSavedMemories((prev) =>
                      prev.filter(
                        (savedMemory) => savedMemory._id !== memoryId,
                      ),
                    );
                  }}
                />
              ))}
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
    </div>
  );
}

export default Profile;
