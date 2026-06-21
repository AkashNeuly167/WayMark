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
        className="absolute inset-0 bg-black/45"
      />

      <section className="absolute bottom-0 left-0 right-0 max-h-[82vh] overflow-hidden rounded-t-[2rem] bg-white shadow-2xl md:left-1/2 md:top-1/2 md:w-[520px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[2rem]">
        <div className="flex items-center justify-between border-b border-[#E5EAF0] px-5 py-4">
          <div>
            <h2 className="text-xl font-black text-[#002045]">{title}</h2>
            <p className="text-sm text-[#002045]/45">
              {users.length} traveler{users.length === 1 ? "" : "s"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#F7FAFC] text-[#002045] transition hover:bg-[#E8EDF2]"
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
            <div className="rounded-2xl border border-dashed border-[#D8DEE6] bg-[#F7FAFC] p-8 text-center">
              <h3 className="font-black text-[#002045]">No travelers yet</h3>
              <p className="mt-1 text-sm text-[#002045]/50">
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
                    className="flex items-center gap-4 rounded-2xl border border-[#D8DEE6] bg-white p-4 transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[#1A365D] text-sm font-black text-white">
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
                      <h3 className="truncate font-black text-[#002045]">
                        {listUser.fullName || listUser.username}
                      </h3>

                      <p className="truncate text-sm text-[#002045]/50">
                        @{listUser.username}
                      </p>

                      {listUser.country?.trim() && (
                        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#F6AD55]">
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