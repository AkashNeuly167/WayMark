import { useState } from "react";
import { Loader2, Save, X } from "lucide-react";

import { updateMemory } from "../../services/memory.service";

function EditMemoryModal({ memory, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    title: memory?.title || "",
    description: memory?.description || "",
    country: memory?.country || "",
    city: memory?.city || "",
    locationName: memory?.locationName || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = await updateMemory(memory._id, formData);

      onUpdated(data.memory || data.updatedMemory || data);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/50 px-0 backdrop-blur-sm sm:items-center sm:px-4">
      <button
        type="button"
        onClick={onClose}
        disabled={saving}
        className="absolute inset-0 cursor-default"
        aria-label="Close edit memory modal"
      />

      <div className="relative w-full rounded-t-[32px] bg-white px-5 pb-6 pt-5 shadow-2xl sm:max-w-2xl sm:rounded-[32px] sm:p-6">
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#D8DEE6] sm:hidden" />

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#002045]">
              Edit memory
            </h2>
            <p className="mt-1 text-sm text-[#002045]/60">
              Update your travel memory details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full p-2 text-[#002045]/50 transition hover:bg-[#F1F5F9] hover:text-[#002045]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#002045]">
              Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Sunrise at Manali"
              className="w-full rounded-2xl border border-[#D8DEE6] px-4 py-3 outline-none transition focus:border-[#F6AD55]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#002045]">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write about this memory..."
              rows={5}
              className="w-full resize-none rounded-2xl border border-[#D8DEE6] px-4 py-3 outline-none transition focus:border-[#F6AD55]"
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
                placeholder="Manali"
                className="w-full rounded-2xl border border-[#D8DEE6] px-4 py-3 outline-none transition focus:border-[#F6AD55]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#002045]">
              Location name
            </label>
            <input
              name="locationName"
              value={formData.locationName}
              onChange={handleChange}
              placeholder="Solang Valley"
              className="w-full rounded-2xl border border-[#D8DEE6] px-4 py-3 outline-none transition focus:border-[#F6AD55]"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
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
                <Save size={18} />
              )}
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMemoryModal;