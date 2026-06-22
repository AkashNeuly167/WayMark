import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Bookmark,
  Camera,
  CalendarDays,
  ExternalLink,
  Globe,
  Heart,
  ImageOff,
  Loader2,
  MapPin,
  MessageCircle,
  Pencil,
  Trash2,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";

import ProfileSkeleton from "../components/ui/ProfileSkeleton";
import EditProfileModal from "../components/profile/EditProfileModal";
import SavedMemoryRow from "../components/memory/SavedMemoryRow";
import FollowListModal from "../components/profile/FollowListModal";

import {
  deleteAvatar,
  deleteCoverImage,
  getUserFollowers,
  getUserFollowing,
  getUserProfile,
  toggleFollowUser,
  updateAvatar,
  updateCoverImage,
} from "../services/user.service";
import { getMemories } from "../services/memory.service";
import { getSavedMemories } from "../services/bookmark.service";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/useToast";
import api from "../api/axios";

function Profile() {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const currentUserId = user?._id || user?.id;

  const [profileUser, setProfileUser] = useState(null);
  const [userMemories, setUserMemories] = useState([]);
  const [savedMemories, setSavedMemories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("memories");

  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalTitle, setFollowModalTitle] = useState("");
  const [followListUsers, setFollowListUsers] = useState([]);
  const [followListLoading, setFollowListLoading] = useState(false);

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
        } else {
          setSavedMemories([]);
          setActiveTab("memories");
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

  const coverUrl =
    typeof profileUser?.coverImage === "string"
      ? profileUser.coverImage
      : profileUser?.coverImage?.url;

  const followersCount = profileUser?.followers?.length || 0;
  const followingCount = profileUser?.following?.length || 0;

  const isFollowing = profileUser?.followers?.some((follower) => {
    const followerId = typeof follower === "string" ? follower : follower?._id;
    return followerId?.toString() === currentUserId?.toString();
  });

  const fallbackCoverImage =
    userMemories[0]?.images?.[0]?.url || userMemories[0]?.images?.[0] || "";

  const coverImage = coverUrl || fallbackCoverImage;

  const displayedMemories =
    activeTab === "saved" ? savedMemories : userMemories;

  const sectionTitle = activeTab === "saved" ? "Saved Memories" : "Memories";

  const sectionSubtitle =
    activeTab === "saved"
      ? "Memories saved for later."
      : "Places shared by this traveler.";

  const emptyTitle =
    activeTab === "saved" ? "No saved memories yet" : "No memories yet";

  const emptyMessage =
    activeTab === "saved"
      ? "Saved memories will appear here."
      : "This traveler has not shared any memories.";

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file || coverLoading) return;

    const uploadData = new FormData();
    uploadData.append("images", file);

    try {
      setCoverLoading(true);

      const uploadRes = await api.post("/upload/images", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedImage = uploadRes.data.images?.[0];

      if (!uploadedImage) {
        throw new Error("Cover image upload failed");
      }

      const coverPayload = {
        url: uploadedImage.url || uploadedImage.secure_url || uploadedImage,
        publicId: uploadedImage.publicId || uploadedImage.public_id,
      };

      if (!coverPayload.url || !coverPayload.publicId) {
        throw new Error("Uploaded cover is missing url or publicId");
      }

      const coverRes = await updateCoverImage(coverPayload);
      const updatedUser = coverRes.user;

      setProfileUser(updatedUser);
      updateUser?.(updatedUser);

      showToast({
        type: "success",
        title: "Cover updated",
        message: "Your profile cover was updated successfully.",
      });
    } catch (error) {
      console.error("Cover upload error:", error);

      showToast({
        type: "error",
        title: "Upload failed",
        message:
          error.response?.data?.message ||
          error.message ||
          "Could not update cover image.",
      });
    } finally {
      setCoverLoading(false);
      e.target.value = "";
    }
  };

  const handleCoverDelete = async () => {
    if (coverLoading || !coverUrl) return;

    try {
      setCoverLoading(true);

      const coverRes = await deleteCoverImage();
      const updatedUser = coverRes.user;

      setProfileUser(updatedUser);
      updateUser?.(updatedUser);

      showToast({
        type: "success",
        title: "Cover removed",
        message: "Your profile cover was removed.",
      });
    } catch (error) {
      console.error("Cover delete error:", error);

      showToast({
        type: "error",
        title: "Delete failed",
        message:
          error.response?.data?.message || "Could not remove cover image.",
      });
    } finally {
      setCoverLoading(false);
    }
  };

  const handleOpenFollowList = async (type) => {
    if (!profileUser?._id) return;

    try {
      setFollowModalOpen(true);
      setFollowListLoading(true);
      setFollowListUsers([]);
      setFollowModalTitle(type === "followers" ? "Followers" : "Following");

      const data =
        type === "followers"
          ? await getUserFollowers(profileUser._id)
          : await getUserFollowing(profileUser._id);

      setFollowListUsers(
        type === "followers" ? data.followers || [] : data.following || [],
      );
    } catch (error) {
      console.error("Follow list error:", error);

      showToast({
        type: "error",
        title: "Could not load list",
        message:
          error.response?.data?.message ||
          "Could not load followers/following.",
      });
    } finally {
      setFollowListLoading(false);
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
            <h2 className="text-2xl font-black">User not found</h2>
            <p className="mt-2 text-[#002045]/60">
              This profile does not exist.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      <main className="pb-28 ">
        <section className="relative overflow-hidden">
          {/* ── Cover image ── */}
          <div className="relative h-56 overflow-hidden md:min-h-[600px]">
            {coverImage ? (
              <img
                src={coverImage}
                alt="Profile cover"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(246,173,85,0.45),transparent_28%),linear-gradient(135deg,#0B132B_0%,#1A365D_55%,#F6AD55_140%)]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#002045]/95 via-[#002045]/45 to-[#002045]/10" />

            {isOwnProfile && (
              <div className="absolute right-4 top-4 z-10 flex gap-2 md:right-8 md:top-8">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-black text-white backdrop-blur transition hover:bg-white/25">
                  {coverLoading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Camera size={15} />
                  )}
                  {coverUrl ? "Change cover" : "Add cover"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={coverLoading}
                    className="hidden"
                  />
                </label>

                {coverUrl && (
                  <button
                    type="button"
                    onClick={handleCoverDelete}
                    disabled={coverLoading}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-black text-white backdrop-blur transition hover:bg-red-500 disabled:opacity-60"
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── Profile info overlaid on cover ──
              FIX: increased pb from pb-8 → pb-16 on desktop so the
              avatar/name row has enough clearance before the stats cards. */}
          <div className="relative z-10 -mt-16 px-4 pb-4 md:-mt-[210px] md:px-8 md:pb-16">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                  <div className="relative h-28 w-28 shrink-0 md:h-44 md:w-44">
                    <div className="h-28 w-28 overflow-hidden rounded-[1.75rem] border-4 border-white bg-[#1A365D] text-4xl font-black text-white shadow-2xl md:h-44 md:w-44 md:rounded-[2rem] md:text-5xl">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={profileUser.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center">
                          {profileUser.username?.charAt(0).toUpperCase() || (
                            <UserRound size={42} />
                          )}
                        </div>
                      )}
                    </div>

                    {isOwnProfile && (
                      <label className="absolute -bottom-2 -right-2 grid h-10 w-10 cursor-pointer place-items-center rounded-full border-4 border-white bg-[#F6AD55] text-white shadow-xl transition hover:bg-orange-400 md:h-12 md:w-12">
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

                  <div className="text-[#002045] md:text-white">
                    <div className="mb-2 inline-flex rounded-full border border-[#D8DEE6] bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#F6AD55] shadow-sm md:border-white/20 md:bg-white/10 md:px-4 md:py-1.5 md:text-xs md:backdrop-blur">
                      Waymark Traveler
                    </div>

                    <h1 className="text-3xl font-black leading-tight md:text-6xl">
                      {profileUser.fullName || profileUser.username}
                    </h1>

                    <p className="mt-1 text-sm font-semibold text-[#002045]/55 md:text-lg md:text-white/70">
                      @{profileUser.username}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 md:gap-3">
                      {profileUser.country?.trim() && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#D8DEE6] bg-white px-3 py-1.5 text-xs font-bold text-[#002045]/70 shadow-sm md:border-white/20 md:bg-white/10 md:px-4 md:py-2 md:text-sm md:text-white/85 md:backdrop-blur">
                          <MapPin size={14} />
                          {profileUser.country}
                        </span>
                      )}

                      {profileUser.website?.trim() && (
                        <a
                          href={profileUser.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-[#D8DEE6] bg-white px-3 py-1.5 text-xs font-bold text-[#002045]/70 shadow-sm transition hover:text-[#F6AD55] md:border-white/20 md:bg-white/10 md:px-4 md:py-2 md:text-sm md:text-white/85 md:backdrop-blur"
                        >
                          <Globe size={14} />
                          Website
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-1 flex flex-col gap-2 sm:flex-row md:mt-0">
                  {isOwnProfile ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setEditOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#002045] shadow-sm transition hover:bg-[#F7FAFC] md:px-6 md:shadow-xl"
                      >
                        <Pencil size={17} />
                        Edit profile
                      </button>

                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={handleAvatarDelete}
                          disabled={avatarLoading}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-black text-red-500 shadow-sm transition hover:bg-red-500 hover:text-white disabled:opacity-60 md:border-white/25 md:bg-white/10 md:text-white md:backdrop-blur"
                        >
                          {avatarLoading ? (
                            <Loader2 size={17} className="animate-spin" />
                          ) : (
                            <Trash2 size={17} />
                          )}
                          Remove photo
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-black shadow-sm transition disabled:opacity-60 md:shadow-xl ${
                        isFollowing
                          ? "border border-[#D8DEE6] bg-white text-[#002045] hover:bg-[#F7FAFC] md:border-white/25 md:bg-white/10 md:text-white md:backdrop-blur md:hover:bg-white/20"
                          : "bg-[#F6AD55] text-white hover:bg-orange-400"
                      }`}
                    >
                      <UserPlus size={17} />
                      {followLoading
                        ? "Updating..."
                        : isFollowing
                          ? "Following"
                          : "Follow"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats cards ──
            FIX: removed md:-mt-10 negative margin that caused cards to
            overlap the hero section. Now uses a clean positive mt-6 gap. */}
        <section className="relative z-10 mx-auto mt-6 max-w-6xl px-4 md:mt-8 md:px-8">
          <div className="grid grid-cols-3 gap-2 md:gap-6">
            <div className="rounded-2xl border border-[#D8DEE6] bg-white p-3 text-center shadow-sm md:rounded-3xl md:p-7">
              <p className="text-2xl font-black text-[#1A365D] md:text-4xl">
                {userMemories.length}
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#002045]/45 md:text-xs">
                Memories
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenFollowList("followers")}
              className="rounded-2xl border border-[#D8DEE6] bg-white p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md md:rounded-3xl md:p-7"
            >
              <p className="text-2xl font-black text-[#1A365D] md:text-4xl">
                {followersCount}
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#002045]/45 md:text-xs">
                Followers
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleOpenFollowList("following")}
              className="rounded-2xl border border-[#D8DEE6] bg-white p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md md:rounded-3xl md:p-7"
            >
              <p className="text-2xl font-black text-[#1A365D] md:text-4xl">
                {followingCount}
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#002045]/45 md:text-xs">
                Following
              </p>
            </button>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:px-8 lg:grid-cols-12">
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-[2rem] border border-[#D8DEE6] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#1A365D]">About</h2>

              <p className="mt-4 leading-7 text-[#002045]/70">
                {profileUser.bio || "No bio added yet."}
              </p>

              <div className="mt-6 space-y-3">
                {profileUser.country?.trim() && (
                  <div className="flex items-center gap-3 rounded-2xl bg-[#F7FAFC] p-4 text-sm font-semibold text-[#002045]/70">
                    <MapPin size={18} className="text-[#F6AD55]" />
                    {profileUser.country}
                  </div>
                )}

                {profileUser.website?.trim() && (
                  <a
                    href={profileUser.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-2xl bg-[#F7FAFC] p-4 text-sm font-semibold text-[#002045]/70 transition hover:text-[#F6AD55]"
                  >
                    <Globe size={18} className="text-[#F6AD55]" />
                    <span className="min-w-0 flex-1 truncate">
                      {profileUser.website}
                    </span>
                    <ExternalLink size={15} />
                  </a>
                )}

                <div className="flex items-center gap-3 rounded-2xl bg-[#F7FAFC] p-4 text-sm font-semibold text-[#002045]/70">
                  <CalendarDays size={18} className="text-[#F6AD55]" />
                  Joined {formatDate(profileUser.createdAt)}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#1A365D] p-6 text-white shadow-xl">
              <h3 className="text-xl font-black">Travel Snapshot</h3>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4">
                  <span className="text-sm font-semibold text-white/70">
                    Shared Memories
                  </span>
                  <span className="font-black text-[#F6AD55]">
                    {userMemories.length}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4">
                  <span className="text-sm font-semibold text-white/70">
                    Community
                  </span>
                  <span className="font-black text-[#F6AD55]">
                    {followersCount + followingCount}
                  </span>
                </div>

                {isOwnProfile && (
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4">
                    <span className="text-sm font-semibold text-white/70">
                      Saved
                    </span>
                    <span className="font-black text-[#F6AD55]">
                      {savedMemories.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </aside>

          <section className="lg:col-span-8">
            {isOwnProfile && (
              <div className="mb-6 flex rounded-2xl border border-[#D8DEE6] bg-white p-1 shadow-sm">
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
                <h2 className="text-3xl font-black text-[#002045]">
                  {sectionTitle}
                </h2>
                <p className="mt-1 text-[#002045]/55">{sectionSubtitle}</p>
              </div>

              {activeTab === "saved" ? (
                <Bookmark className="hidden text-[#002045]/30 md:block" />
              ) : (
                <Users className="hidden text-[#002045]/30 md:block" />
              )}
            </div>

            {displayedMemories.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#D8DEE6] bg-white p-10 text-center">
                <h3 className="text-2xl font-black">{emptyTitle}</h3>
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
              <div className="space-y-6">
                {userMemories.map((memory) => {
                  const image = memory.images?.[0]?.url || memory.images?.[0];

                  return (
                    <Link
                      key={memory._id}
                      to={`/memories/${memory._id}`}
                      className="group flex flex-col overflow-hidden rounded-[2rem] border border-[#D8DEE6] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:flex-row"
                    >
                      <div className="h-64 bg-[#E8EDF2] md:h-auto md:w-64 md:shrink-0">
                        {image ? (
                          <img
                            src={image}
                            alt={memory.title}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#002045]/35">
                            <ImageOff size={30} />
                          </div>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between p-6">
                        <div>
                          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#F6AD55]">
                            <MapPin size={15} />
                            <span className="truncate">
                              {memory.city}, {memory.country}
                            </span>
                          </div>

                          <h3 className="line-clamp-1 text-2xl font-black text-[#002045]">
                            {memory.title}
                          </h3>

                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#002045]/65">
                            {memory.description}
                          </p>
                        </div>

                        <div className="mt-5 flex items-center gap-5 text-sm font-black text-[#002045]/45">
                          <span className="inline-flex items-center gap-1">
                            <Heart size={16} />
                            {memory.likes?.length || 0}
                          </span>

                          <span className="inline-flex items-center gap-1">
                            <MessageCircle size={16} />
                            {memory.commentsCount || 0}
                          </span>

                          <span className="ml-auto text-xs uppercase tracking-[0.16em] text-[#002045]/35">
                            {formatDate(memory.createdAt)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </section>
      </main>

      {editOpen && (
        <EditProfileModal
          profileUser={profileUser}
          onClose={() => setEditOpen(false)}
          onUpdated={handleProfileUpdated}
        />
      )}

      <FollowListModal
        open={followModalOpen}
        title={followModalTitle}
        users={followListUsers}
        loading={followListLoading}
        onClose={() => setFollowModalOpen(false)}
      />
    </div>
  );
}

export default Profile;