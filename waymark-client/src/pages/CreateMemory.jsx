import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Loader2,
  Mountain,
  Save,
  Search,
  X,
} from "lucide-react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";

import api from "../api/axios";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const moodOptions = [
  "Adventure",
  "Peaceful",
  "Romantic",
  "Food",
  "Discovery",
  "Road Trip",
];

const activityOptions = [
  "Hiking",
  "Photography",
  "Camping",
  "Backpacking",
  "Wildlife",
  "City Walk",
];

function CreateMemory() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    country: "",
    city: "",
    locationName: "",
    lat: "30.7333",
    lng: "76.7794",
  });

  const [images, setImages] = useState([]);
  const [selectedMood, setSelectedMood] = useState("Adventure");
  const [selectedActivities, setSelectedActivities] = useState(["Hiking"]);

  const [locationOpen, setLocationOpen] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const mapPosition = useMemo(() => {
    const lat = Number(formData.lat);
    const lng = Number(formData.lng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return [30.7333, 76.7794];
    }

    return [lat, lng];
  }, [formData.lat, formData.lng]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleMapPick = ({ lat, lng }) => {
    setFormData((prev) => ({
      ...prev,
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
    }));
  };

  const toggleActivity = (activity) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((item) => item !== activity)
        : [...prev, activity],
    );
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const uploadData = new FormData();

    files.forEach((file) => {
      uploadData.append("images", file);
    });

    try {
      setError("");
      setUploading(true);

      const res = await api.post("/upload/images", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImages((prev) => [...prev, ...(res.data.images || [])]);
    } catch (error) {
      setError(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const lat = Number(formData.lat);
    const lng = Number(formData.lng);

    if (!formData.title.trim()) {
      setError("Memory title is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Memory description is required");
      return;
    }

    if (!formData.country.trim() || !formData.city.trim()) {
      setError("Country and city are required");
      return;
    }

    if (!formData.locationName.trim()) {
      setError("Location name is required");
      return;
    }

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setError("Please choose a valid map location");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/memories", {
        title: formData.title.trim(),
        description: formData.description.trim(),
        country: formData.country.trim(),
        city: formData.city.trim(),
        locationName: formData.locationName.trim(),
        coordinates: {
          lat,
          lng,
        },
        images,
      });

      navigate("/feed");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create memory");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <main className="mx-auto max-w-[1280px] px-4 pb-36 pt-5 md:px-8 md:pb-28 md:pt-7">
        <div className="mb-6 rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.24)] md:mb-8 md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#F6AD55]">
                Preserve a journey
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-6xl">
                Create Memory
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
                Upload your photos, write the story, anchor it on the map, and
                preserve the moment.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/feed")}
              className="hidden rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 font-black text-white transition hover:bg-white/[0.1] md:block"
            >
              Cancel
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 px-5 py-4 font-semibold text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 lg:hidden">
            <GallerySection
              images={images}
              uploading={uploading}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
            />

            <StorySection
              formData={formData}
              handleChange={handleChange}
              selectedMood={selectedMood}
              setSelectedMood={setSelectedMood}
            />

            <div className="rounded-[2rem] border border-white/10 bg-[#101D2E] shadow-[0_18px_55px_rgba(0,0,0,0.2)]">
              <button
                type="button"
                onClick={() => setLocationOpen((prev) => !prev)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#F6AD55]">
                    Location
                  </p>
                  <h2 className="mt-1 text-xl font-black text-white">
                    Map Anchor
                  </h2>
                </div>

                {locationOpen ? <ChevronUp /> : <ChevronDown />}
              </button>

              {locationOpen && (
                <div className="space-y-5 border-t border-white/10 p-5">
                  <LocationSection
                    formData={formData}
                    handleChange={handleChange}
                    mapPosition={mapPosition}
                    handleMapPick={handleMapPick}
                    compact
                  />

                  <MetadataSection
                    formData={formData}
                    handleChange={handleChange}
                  />
                </div>
              )}
            </div>

            <ActivitySection
              selectedActivities={selectedActivities}
              toggleActivity={toggleActivity}
            />

            
          </div>

          <div className="hidden grid-cols-1 items-start gap-6 lg:grid lg:grid-cols-12">
            <section className="space-y-6 lg:col-span-8">
              <StorySection
                formData={formData}
                handleChange={handleChange}
                selectedMood={selectedMood}
                setSelectedMood={setSelectedMood}
              />

              <GallerySection
                images={images}
                uploading={uploading}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
              />
            </section>

            <aside className="space-y-6 lg:col-span-4">
              <LocationSection
                formData={formData}
                handleChange={handleChange}
                mapPosition={mapPosition}
                handleMapPick={handleMapPick}
              />

              <MetadataSection
                formData={formData}
                handleChange={handleChange}
              />

              <ActivitySection
                selectedActivities={selectedActivities}
                toggleActivity={toggleActivity}
              />

              <SubmitSection submitting={submitting} uploading={uploading} />
            </aside>
          </div>

          <div className="fixed bottom-24 left-4 right-4 z-40 lg:hidden">
            <button
              type="submit"
              disabled={submitting || uploading}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#F6AD55] text-base font-black text-[#06111F] shadow-[0_18px_45px_rgba(246,173,85,0.28)] transition hover:bg-orange-300 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Preserving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Preserve Memory
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function StorySection({
  formData,
  handleChange,
  selectedMood,
  setSelectedMood,
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.2)] md:p-8">
      <div className="mb-8">
        <label className="mb-3 block text-xs font-black uppercase tracking-widest text-[#F6AD55]">
          Journey Title
        </label>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Where did the adventure lead?"
          className="dark-input w-full border-none bg-transparent p-0 text-3xl font-black leading-tight !text-white caret-[#F6AD55] outline-none placeholder:!text-slate-600 focus:ring-0 md:text-5xl"
        />
      </div>

      <div className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
          <button
            type="button"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
          >
            <Camera size={18} />
          </button>

          <button
            type="button"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
          >
            <Mountain size={18} />
          </button>

          <div className="mx-2 h-6 w-px bg-white/10" />

          <span className="text-sm text-slate-500">Tell the story...</span>
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="7"
          placeholder="The dust had not settled yet when we reached the ridge line..."
          className="dark-input w-full resize-none border-none bg-transparent p-0 text-base leading-7 !text-slate-200 caret-[#F6AD55] outline-none placeholder:!text-slate-600 focus:ring-0 md:text-lg md:leading-8"
        />
      </div>

      <div>
        <label className="mb-4 block text-xs font-black uppercase tracking-widest text-[#F6AD55]">
          Current Mood
        </label>

        <div className="flex flex-wrap gap-3">
          {moodOptions.map((mood) => {
            const active = selectedMood === mood;

            return (
              <button
                key={mood}
                type="button"
                onClick={() => setSelectedMood(mood)}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  active
                    ? "bg-[#F6AD55] text-[#06111F] shadow-[0_12px_30px_rgba(246,173,85,0.22)]"
                    : "border border-white/10 bg-white/[0.06] text-slate-400 hover:bg-white/[0.1] hover:text-white"
                }`}
              >
                {mood}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ images, uploading, handleImageUpload, removeImage }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.2)] md:p-8">
      <label className="mb-4 block text-xs font-black uppercase tracking-widest text-[#F6AD55]">
        Gallery Assets
      </label>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={`${image.url || image}-${index}`}
            className={`group relative aspect-square overflow-hidden rounded-2xl border ${
              index === 0
                ? "border-2 border-[#F6AD55] ring-4 ring-[#F6AD55]/20"
                : "border-white/10"
            }`}
          >
            <img
              src={image.url || image}
              alt=""
              className="h-full w-full object-cover transition group-hover:scale-105"
            />

            {index === 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-[#F6AD55] px-2 py-1 text-[10px] font-black uppercase text-[#06111F]">
                Cover
              </span>
            )}

            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white opacity-100 transition md:opacity-0 md:group-hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.04] text-slate-500 transition hover:border-[#F6AD55]/50 hover:bg-[#F6AD55]/10 hover:text-[#F6AD55]">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <ImagePlus className="h-8 w-8" />
          )}

          <span className="mt-2 text-sm font-black">
            {uploading ? "Uploading" : "Add Media"}
          </span>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>
    </section>
  );
}

function LocationSection({
  formData,
  handleChange,
  mapPosition,
  handleMapPick,
  compact = false,
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#F6AD55]/20 bg-gradient-to-br from-[#1A365D] to-[#06111F] text-white shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
      <div className="p-5 md:p-6">
        <label className="mb-4 block text-xs font-black uppercase tracking-widest text-[#F6AD55]">
          Location Anchor
        </label>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <input
            name="locationName"
            value={formData.locationName}
            onChange={handleChange}
            placeholder="Search or name this place..."
            className="dark-input w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-sm font-semibold !text-white caret-[#F6AD55] outline-none placeholder:!text-slate-500 focus:border-[#F6AD55]/60 focus:ring-4 focus:ring-[#F6AD55]/10"
          />
        </div>

        <div
          className={`overflow-hidden rounded-2xl border border-white/10 ${
            compact ? "h-52" : "h-72"
          }`}
        >
          <MapContainer
            center={mapPosition}
            zoom={7}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={mapPosition} />
            <MapClickHandler onPick={handleMapPick} />
          </MapContainer>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          Click on the map to set exact coordinates for this memory.
        </p>
      </div>
    </section>
  );
}

function MetadataSection({ formData, handleChange }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.2)] md:p-6">
      <label className="mb-6 block text-xs font-black uppercase tracking-widest text-[#F6AD55]">
        Metadata
      </label>

      <div className="space-y-5">
        <Field
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="India"
        />

        <Field
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Spiti"
        />

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Latitude"
            name="lat"
            value={formData.lat}
            onChange={handleChange}
            placeholder="32.246"
          />

          <Field
            label="Longitude"
            name="lng"
            value={formData.lng}
            onChange={handleChange}
            placeholder="78.034"
          />
        </div>
      </div>
    </section>
  );
}

function ActivitySection({ selectedActivities, toggleActivity }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.2)] md:p-6">
      <label className="mb-4 block text-xs font-black uppercase tracking-widest text-[#F6AD55]">
        Activity Context
      </label>

      <div className="flex flex-wrap gap-2">
        {activityOptions.map((activity) => {
          const active = selectedActivities.includes(activity);

          return (
            <button
              key={activity}
              type="button"
              onClick={() => toggleActivity(activity)}
              className={`rounded-full border px-3 py-2 text-xs font-black transition ${
                active
                  ? "border-[#F6AD55]/50 bg-[#F6AD55]/15 text-[#F6AD55]"
                  : "border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {activity}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SubmitSection({ submitting, uploading }) {
  return (
    <section className="rounded-[2rem] border border-[#F6AD55]/20 bg-gradient-to-br from-[#1A365D] to-[#06111F] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
      <label className="mb-5 block text-xs font-black uppercase tracking-widest text-[#F6AD55]">
        Ready to Publish
      </label>

      <p className="mb-6 text-sm leading-6 text-slate-400">
        Your memory will be shared publicly on WayMark for other travelers to
        discover.
      </p>

      <button
        type="submit"
        disabled={submitting || uploading}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#F6AD55] text-lg font-black text-[#06111F] shadow-[0_18px_45px_rgba(246,173,85,0.24)] transition hover:bg-orange-300 disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Preserving...
          </>
        ) : (
          <>
            <Save className="h-5 w-5" />
            Preserve Memory
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-slate-500">
        Public by default. You can edit or delete this memory later.
      </p>
    </section>
  );
}

function Field({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="dark-input w-full rounded-2xl border border-white/10 bg-[#06111F] px-4 py-3 text-sm font-semibold !text-white caret-[#F6AD55] outline-none transition placeholder:!text-slate-600 focus:border-[#F6AD55]/60 focus:ring-4 focus:ring-[#F6AD55]/10"
      />
    </div>
  );
}

function MapClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng);
    },
  });

  return null;
}

export default CreateMemory;