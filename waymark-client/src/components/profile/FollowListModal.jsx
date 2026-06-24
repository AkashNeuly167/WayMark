import { Link } from "react-router-dom";
import { Loader2, MapPin, X, UserRound } from "lucide-react";

function FollowListModal({ open, title, users, loading, onClose }) {
  if (!open) return null;

  const getAvatarUrl = (user) => {
    if (!user?.avatar) return "";
    return typeof user.avatar === "string" ? user.avatar : user.avatar.url;
  };

  const getInitial = (user) => {
    return (
      user?.username?.charAt(0).toUpperCase() ||
      user?.fullName?.charAt(0).toUpperCase() ||
      "W"
    );
  };

  return (
    <div className="fixed inset-0 z-[999]">
      <button
        type="button"
        aria-label="Close follow list"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <section className="absolute bottom-0 left-0 right-0 max-h-[82vh] overflow-hidden rounded-t-[2rem] border border-white/10 bg-[#101D2E] text-white shadow-[0_30px_100px_rgba(0,0,0,0.5)] md:left-1/2 md:top-1/2 md:w-[520px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[2rem]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-xl font-black text-white">{title}</h2>
            <p className="text-sm text-slate-500">
              {users.length} traveler{users.length === 1 ? "" : "s"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-slate-300 transition hover:bg-white/[0.1] hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[68vh] overflow-y-auto px-5 py-5">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={28} className="animate-spin text-[#F6AD55]" />
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.04] p-8 text-center">
              <h3 className="font-black text-white">No travelers yet</h3>
              <p className="mt-1 text-sm text-slate-500">
                This list is empty.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((listUser) => {
                const avatarUrl = getAvatarUrl(listUser);

                return (
                  <Link
                    key={listUser._id}
                    to={`/profile/${listUser._id}`}
                    onClick={onClose}
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-0.5 hover:border-[#F6AD55]/35 hover:bg-[#14243A]"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#F6AD55] to-orange-600 text-sm font-black text-white ring-1 ring-white/10">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={listUser.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getInitial(listUser) || <UserRound size={20} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-black text-white">
                        {listUser.fullName || listUser.username}
                      </h3>

                      <p className="truncate text-sm text-slate-500">
                        @{listUser.username}
                      </p>

                      {listUser.country?.trim() && (
                        <p className="mt-1 flex items-center gap-1 text-xs font-black text-[#F6AD55]">
                          <MapPin size={12} />
                          {listUser.country}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default FollowListModal;