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
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 px-0 backdrop-blur-md sm:items-center sm:px-4">
      <button
        type="button"
        onClick={onClose}
        disabled={saving}
        className="absolute inset-0 cursor-default"
        aria-label="Close edit memory modal"
      />

      <div className="relative w-full rounded-t-[32px] border border-white/10 bg-[#101D2E] px-5 pb-6 pt-5 text-white shadow-[0_30px_100px_rgba(0,0,0,0.5)] sm:max-w-2xl sm:rounded-[32px] sm:p-6">
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-white/15 sm:hidden" />

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F6AD55]">
              Memory details
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Edit memory
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Update your travel memory details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full border border-white/10 bg-white/[0.06] p-2 text-slate-400 transition hover:bg-white/[0.1] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <MemoryField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Sunrise at Manali"
          />

          <div>
            <label className="mb-2 block text-sm font-black text-slate-300">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write about this memory..."
              rows={5}
              className="dark-input w-full resize-none rounded-2xl border border-white/10 bg-[#06111F] px-4 py-3 font-semibold !text-white caret-[#F6AD55] outline-none transition placeholder:!text-slate-600 focus:border-[#F6AD55]/60 focus:ring-4 focus:ring-[#F6AD55]/10"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <MemoryField
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="India"
            />

            <MemoryField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Manali"
            />
          </div>

          <MemoryField
            label="Location name"
            name="locationName"
            value={formData.locationName}
            onChange={handleChange}
            placeholder="Solang Valley"
          />

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="w-full rounded-2xl border border-white/10 px-5 py-3 font-black text-white transition hover:bg-white/[0.08] disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F6AD55] px-5 py-3 font-black text-[#06111F] shadow-[0_16px_40px_rgba(246,173,85,0.22)] transition hover:bg-orange-300 disabled:opacity-60"
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

function MemoryField({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-300">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="dark-input w-full rounded-2xl border border-white/10 bg-[#06111F] px-4 py-3 font-semibold !text-white caret-[#F6AD55] outline-none transition placeholder:!text-slate-600 focus:border-[#F6AD55]/60 focus:ring-4 focus:ring-[#F6AD55]/10"
      />
    </div>
  );
}

export default EditMemoryModal;