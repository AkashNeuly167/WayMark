import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../context/useToast";

import {
  createBucketItem,
  deleteBucketItem,
  getBucketList,
  updateBucketItem,
} from "../services/bucket.service";

const emptyForm = {
  title: "",
  country: "",
  city: "",
  notes: "",
};

function BucketList() {
  const { showToast } = useToast();

  const [bucketItems, setBucketItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBucketList = async () => {
    try {
      setLoading(true);

      const data = await getBucketList();

      setBucketItems(data.bucketList || data.items || data.bucket || []);
    } catch (error) {
      console.error("Bucket fetch error:", error);

      showToast({
        type: "error",
        title: "Failed",
        message: "Could not load your bucket list.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadInitialBucketList = async () => {
      try {
        const data = await getBucketList();

        if (ignore) return;

        setBucketItems(data.bucketList || data.items || data.bucket || []);
      } catch (error) {
        if (ignore) return;

        console.error("Bucket fetch error:", error);

        showToast({
          type: "error",
          title: "Failed",
          message: "Could not load your bucket list.",
        });
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadInitialBucketList();

    return () => {
      ignore = true;
    };
  }, [showToast]);

  const openCreateForm = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setFormOpen(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);

    setFormData({
      title: item.title || item.locationName || "",
      country: item.country || "",
      city: item.city || "",
      notes: item.notes || item.description || "",
    });

    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;

    setFormOpen(false);
    setEditingItem(null);
    setFormData(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.country.trim()) {
      showToast({
        type: "error",
        title: "Missing details",
        message: "Title and country are required.",
      });
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),
        locationName: formData.title.trim(),
        country: formData.country.trim(),
        city: formData.city.trim(),
        notes: formData.notes.trim(),
        description: formData.notes.trim(),
      };

      if (editingItem) {
        const data = await updateBucketItem(editingItem._id, payload);

        const updatedItem =
          data.item || data.bucketItem || data.updatedItem || data;

        setBucketItems((prev) =>
          prev.map((item) =>
            item._id === editingItem._id ? { ...item, ...updatedItem } : item,
          ),
        );

        showToast({
          type: "success",
          title: "Updated",
          message: "Bucket item updated successfully.",
        });
      } else {
        const data = await createBucketItem(payload);

        const newItem = data.item || data.bucketItem || data.newItem || data;

        setBucketItems((prev) => [newItem, ...prev]);

        showToast({
          type: "success",
          title: "Added",
          message: "Destination added to your bucket list.",
        });
      }

      closeForm();
      await fetchBucketList();
    } catch (error) {
      console.error("Bucket save error:", error);

      showToast({
        type: "error",
        title: "Save failed",
        message: error.response?.data?.message || "Could not save item.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisited = async (item) => {
    const currentStatus = item.status || "want_to_visit";
    const nextStatus =
      currentStatus === "visited" ? "want_to_visit" : "visited";

    try {
      const data = await updateBucketItem(item._id, {
        status: nextStatus,
      });

      const updatedItem =
        data.bucketItem || data.item || data.updatedItem || data;

      setBucketItems((prev) =>
        prev.map((bucketItem) =>
          bucketItem._id === item._id
            ? {
                ...bucketItem,
                ...updatedItem,
                status: nextStatus,
              }
            : bucketItem,
        ),
      );

      showToast({
        type: "success",
        title: nextStatus === "visited" ? "Marked visited" : "Marked unvisited",
        message:
          nextStatus === "visited"
            ? "Destination moved to visited."
            : "Destination moved back to your bucket list.",
      });
    } catch (error) {
      console.error("Visited toggle error:", error);

      showToast({
        type: "error",
        title: "Update failed",
        message: "Could not update visited status.",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteItemId) return;

    try {
      setDeleteLoading(true);

      await deleteBucketItem(deleteItemId);

      setBucketItems((prev) =>
        prev.filter((item) => item._id !== deleteItemId),
      );

      setDeleteItemId(null);

      showToast({
        type: "success",
        title: "Deleted",
        message: "Bucket item removed successfully.",
      });
    } catch (error) {
      console.error("Bucket delete error:", error);

      showToast({
        type: "error",
        title: "Delete failed",
        message: error.response?.data?.message || "Could not delete item.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <ConfirmDialog
        open={Boolean(deleteItemId)}
        title="Delete bucket item?"
        description="This destination will be removed from your bucket list."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteItemId(null)}
      />

      {formOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/50 px-0 backdrop-blur-sm sm:items-center sm:px-4">
          <button
            type="button"
            onClick={closeForm}
            disabled={saving}
            className="absolute inset-0 cursor-default"
            aria-label="Close bucket form"
          />

          <div className="relative w-full rounded-t-[32px] bg-white px-5 pb-6 pt-5 shadow-2xl sm:max-w-xl sm:rounded-[32px] sm:p-6">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#D8DEE6] sm:hidden" />

            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#002045]">
                  {editingItem ? "Edit destination" : "Add destination"}
                </h2>
                <p className="mt-1 text-sm text-[#002045]/60">
                  Save places you want to visit next.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-full p-2 text-[#002045]/50 transition hover:bg-[#F1F5F9] hover:text-[#002045]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#002045]">
                  Place name
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ladakh road trip"
                  className="w-full rounded-2xl border border-[#D8DEE6] px-4 py-3 outline-none transition focus:border-[#F6AD55]"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#002045]">
                    Country
                  </label>
                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="India"
                    className="w-full rounded-2xl border border-[#D8DEE6] px-4 py-3 outline-none transition focus:border-[#F6AD55]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#002045]">
                    City
                  </label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Leh"
                    className="w-full rounded-2xl border border-[#D8DEE6] px-4 py-3 outline-none transition focus:border-[#F6AD55]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#002045]">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Why do you want to visit this place?"
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-[#D8DEE6] px-4 py-3 outline-none transition focus:border-[#F6AD55]"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="w-full rounded-2xl border border-[#D8DEE6] px-5 py-3 font-semibold text-[#002045] transition hover:bg-[#F7FAFC] disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F6AD55] px-5 py-3 font-semibold text-white transition hover:bg-orange-400 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Plus size={18} />
                  )}
                  {saving
                    ? "Saving..."
                    : editingItem
                      ? "Save changes"
                      : "Add item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 md:ml-64 md:px-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-bold">Bucket List</h1>
              <p className="mt-2 text-[#002045]/60">
                Plan future trips and mark places once you visit them.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#F6AD55] px-5 py-3 font-semibold text-white transition hover:bg-orange-400"
            >
              <Plus size={18} />
              Add destination
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-44 animate-pulse rounded-3xl border border-[#D8DEE6] bg-white"
                />
              ))}
            </div>
          ) : bucketItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#D8DEE6] bg-white p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-[#F6AD55]">
                <MapPin size={28} />
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                Your bucket list is empty
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[#002045]/60">
                Add destinations you dream of visiting and track them as you go.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#F6AD55] px-5 py-3 font-semibold text-white transition hover:bg-orange-400"
              >
                <Plus size={18} />
                Add first destination
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {bucketItems.map((item) => {
                const title =
                  item.title || item.locationName || "Untitled place";
                const notes = item.notes || item.description || "";
                const visited = item.status === "visited";

                return (
                  <article
                    key={item._id}
                    className="rounded-3xl border border-[#D8DEE6] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#F6AD55]">
                          <MapPin size={15} />
                          {item.city ? `${item.city}, ` : ""}
                          {item.country}
                        </div>

                        <h2 className="text-2xl font-bold">{title}</h2>

                        <span
                          className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            visited
                              ? "bg-green-50 text-green-600"
                              : "bg-orange-50 text-[#F6AD55]"
                          }`}
                        >
                          {visited ? "Visited" : "Want to visit"}
                        </span>

                        {notes && (
                          <p className="mt-3 line-clamp-2 text-[#002045]/65">
                            {notes}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleVisited(item)}
                        className={`rounded-full p-2 transition ${
                          visited
                            ? "bg-green-50 text-green-600"
                            : "bg-[#F7FAFC] text-[#002045]/40 hover:text-green-600"
                        }`}
                        title={visited ? "Visited" : "Mark visited"}
                      >
                        <CheckCircle2 size={22} />
                      </button>
                    </div>

                    <div className="mt-5 flex gap-3 border-t border-[#E5EAF0] pt-4">
                      <button
                        type="button"
                        onClick={() => openEditForm(item)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#D8DEE6] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#F7FAFC]"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteItemId(item._id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-100 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default BucketList;
