import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Bookmark,
  Camera,
  CalendarDays,
  ExternalLink,
  Globe,
  Heart,
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
import ImageCarousel from "../components/memory/ImageCarousel";
import { getOptimizedImageUrl } from "../utils/cloudinary";

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
      <div className="min-h-screen bg-transparent text-white">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-transparent text-white">
        <main className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-8 text-center shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
            <h2 className="text-2xl font-black text-white">User not found</h2>
            <p className="mt-2 text-slate-400">This profile does not exist.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white">
      <main className="pb-28">
        <section className="relative overflow-hidden">
          <div className="relative h-56 overflow-hidden md:min-h-[600px]">
            {coverImage ? (
              <img
                src={getOptimizedImageUrl(coverImage,1600)}
                alt="Profile cover"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(246,173,85,0.45),transparent_28%),linear-gradient(135deg,#06111F_0%,#1A365D_55%,#F6AD55_140%)]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#06111F] via-[#06111F]/65 to-[#06111F]/20" />

            {isOwnProfile && (
              <div className="absolute right-4 top-4 z-10 flex gap-2 md:right-8 md:top-8">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs font-black text-white backdrop-blur transition hover:bg-white/15">
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
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs font-black text-white backdrop-blur transition hover:bg-red-500 disabled:opacity-60"
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="relative z-10 -mt-16 px-4 pb-4 md:-mt-[210px] md:px-8 md:pb-16">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                  <div className="relative h-28 w-28 shrink-0 md:h-44 md:w-44">
                    <div className="h-28 w-28 overflow-hidden rounded-[1.75rem] border-4 border-[#06111F] bg-gradient-to-br from-[#F6AD55] to-orange-600 text-4xl font-black text-white shadow-2xl md:h-44 md:w-44 md:rounded-[2rem] md:text-5xl">
                      {avatarUrl ? (
                        <img
                          src={getOptimizedImageUrl(avatarUrl,300)}
                          alt={profileUser.username}
                          loading="lazy"
                          decoding="async"
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
                      <label className="absolute -bottom-2 -right-2 grid h-10 w-10 cursor-pointer place-items-center rounded-full border-4 border-[#06111F] bg-[#F6AD55] text-[#06111F] shadow-xl transition hover:bg-orange-300 md:h-12 md:w-12">
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

                  <div className="text-white">
                    <div className="mb-2 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#F6AD55] shadow-sm backdrop-blur md:px-4 md:py-1.5 md:text-xs">
                      Waymark Traveler
                    </div>

                    <h1 className="text-3xl font-black leading-tight text-white md:text-6xl">
                      {profileUser.fullName || profileUser.username}
                    </h1>

                    <p className="mt-1 text-sm font-semibold text-slate-400 md:text-lg">
                      @{profileUser.username}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 md:gap-3">
                      {profileUser.country?.trim() && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/85 shadow-sm backdrop-blur md:px-4 md:py-2 md:text-sm">
                          <MapPin size={14} />
                          {profileUser.country}
                        </span>
                      )}

                      {profileUser.website?.trim() && (
                        <a
                          href={profileUser.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/85 shadow-sm backdrop-blur transition hover:text-[#F6AD55] md:px-4 md:py-2 md:text-sm"
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
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F6AD55] px-5 py-3 text-sm font-black text-[#06111F] shadow-[0_16px_40px_rgba(246,173,85,0.22)] transition hover:bg-orange-300 md:px-6"
                      >
                        <Pencil size={17} />
                        Edit profile
                      </button>

                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={handleAvatarDelete}
                          disabled={avatarLoading}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-black text-red-300 transition hover:bg-red-500 hover:text-white disabled:opacity-60"
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
                      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-black shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition disabled:opacity-60 ${
                        isFollowing
                          ? "border border-white/15 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                          : "bg-[#F6AD55] text-[#06111F] hover:bg-orange-300"
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

        <section className="relative z-10 mx-auto mt-6 max-w-6xl px-4 md:mt-8 md:px-8">
          <div className="grid grid-cols-3 gap-2 md:gap-6">
            <StatCard label="Memories" value={userMemories.length} />

            <button
              type="button"
              onClick={() => handleOpenFollowList("followers")}
              className="rounded-2xl border border-white/10 bg-[#101D2E] p-3 text-center shadow-[0_18px_55px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-[#F6AD55]/35 hover:bg-[#14243A] md:rounded-3xl md:p-7"
            >
              <p className="text-2xl font-black text-white md:text-4xl">
                {followersCount}
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 md:text-xs">
                Followers
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleOpenFollowList("following")}
              className="rounded-2xl border border-white/10 bg-[#101D2E] p-3 text-center shadow-[0_18px_55px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-[#F6AD55]/35 hover:bg-[#14243A] md:rounded-3xl md:p-7"
            >
              <p className="text-2xl font-black text-white md:text-4xl">
                {followingCount}
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 md:text-xs">
                Following
              </p>
            </button>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:px-8 lg:grid-cols-12">
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
              <h2 className="text-xl font-black text-white">About</h2>

              <p className="mt-4 leading-7 text-slate-400">
                {profileUser.bio || "No bio added yet."}
              </p>

              <div className="mt-6 space-y-3">
                {profileUser.country?.trim() && (
                  <InfoRow icon={MapPin}>{profileUser.country}</InfoRow>
                )}

                {profileUser.website?.trim() && (
                  <a
                    href={profileUser.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.07] hover:text-[#F6AD55]"
                  >
                    <Globe size={18} className="text-[#F6AD55]" />
                    <span className="min-w-0 flex-1 truncate">
                      {profileUser.website}
                    </span>
                    <ExternalLink size={15} />
                  </a>
                )}

                <InfoRow icon={CalendarDays}>
                  Joined {formatDate(profileUser.createdAt)}
                </InfoRow>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#F6AD55]/20 bg-gradient-to-br from-[#1A365D] to-[#06111F] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
              <h3 className="text-xl font-black">Travel Snapshot</h3>

              <div className="mt-5 space-y-3">
                <SnapshotRow label="Shared Memories" value={userMemories.length} />
                <SnapshotRow
                  label="Community"
                  value={followersCount + followingCount}
                />

                {isOwnProfile && (
                  <SnapshotRow label="Saved" value={savedMemories.length} />
                )}
              </div>
            </div>
          </aside>

          <section className="lg:col-span-8">
            {isOwnProfile && (
              <div className="mb-6 flex rounded-2xl border border-white/10 bg-[#101D2E] p-1 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
                <button
                  type="button"
                  onClick={() => setActiveTab("memories")}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-black transition ${
                    activeTab === "memories"
                      ? "bg-[#F6AD55] text-[#06111F]"
                      : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  My Memories
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("saved")}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-black transition ${
                    activeTab === "saved"
                      ? "bg-[#F6AD55] text-[#06111F]"
                      : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  Saved
                </button>
              </div>
            )}

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-white">
                  {sectionTitle}
                </h2>
                <p className="mt-1 text-slate-500">{sectionSubtitle}</p>
              </div>

              {activeTab === "saved" ? (
                <Bookmark className="hidden text-slate-700 md:block" />
              ) : (
                <Users className="hidden text-slate-700 md:block" />
              )}
            </div>

            {displayedMemories.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-white/10 bg-[#101D2E] p-10 text-center shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
                <h3 className="text-2xl font-black text-white">
                  {emptyTitle}
                </h3>
                <p className="mt-2 text-slate-400">{emptyMessage}</p>
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
                  return (
                    <Link
                      key={memory._id}
                      to={`/memories/${memory._id}`}
                      className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#101D2E] shadow-[0_20px_70px_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:border-[#F6AD55]/35 hover:bg-[#14243A] md:flex-row"
                    >
                      <div className="h-64 overflow-hidden bg-[#06111F] md:h-auto md:w-64 md:shrink-0">
                        <ImageCarousel
                          images={memory.images || []}
                          title={memory.title}
                          className="h-full !aspect-auto"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between p-6">
                        <div>
                          <div className="mb-3 flex items-center gap-2 text-sm font-black text-[#F6AD55]">
                            <MapPin size={15} />
                            <span className="truncate">
                              {[memory.city, memory.country]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </div>

                          <h3 className="line-clamp-1 text-2xl font-black text-white">
                            {memory.title}
                          </h3>

                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                            {memory.description}
                          </p>
                        </div>

                        <div className="mt-5 flex items-center gap-5 text-sm font-black text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Heart size={16} className="text-red-400" />
                            {memory.likes?.length || 0}
                          </span>

                          <span className="inline-flex items-center gap-1">
                            <MessageCircle
                              size={16}
                              className="text-[#F6AD55]"
                            />
                            {memory.commentsCount || 0}
                          </span>

                          <span className="ml-auto text-xs uppercase tracking-[0.16em] text-slate-600">
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

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101D2E] p-3 text-center shadow-[0_18px_55px_rgba(0,0,0,0.18)] md:rounded-3xl md:p-7">
      <p className="text-2xl font-black text-white md:text-4xl">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 md:text-xs">
        {label}
      </p>
    </div>
  );
}

function InfoRow({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-slate-400">
      <Icon size={18} className="text-[#F6AD55]" />
      {children}
    </div>
  );
}

function SnapshotRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4">
      <span className="text-sm font-semibold text-slate-400">{label}</span>
      <span className="font-black text-[#F6AD55]">{value}</span>
    </div>
  );
}

export default Profile;