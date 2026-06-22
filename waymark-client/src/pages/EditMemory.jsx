import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { getMemoryById, updateMemory } from "../services/memory.service";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/useToast";

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

function EditMemory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const currentUserId = user?._id || user?.id;

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
  const [privacy, setPrivacy] = useState("public");
  const [locationOpen, setLocationOpen] = useState(false);

  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    let ignore = false;

    const fetchMemory = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMemoryById(id);
        const memory = data.memory;

        if (ignore) return;

        if (!memory) {
          setError("Memory not found");
          return;
        }

        const authorId = memory.author?._id || memory.author;

        if (
          currentUserId &&
          authorId &&
          authorId.toString() !== currentUserId.toString()
        ) {
          showToast({
            type: "error",
            title: "Not allowed",
            message: "You can only edit your own memories.",
          });

          navigate(`/memories/${id}`);
          return;
        }

        setFormData({
          title: memory.title || "",
          description: memory.description || "",
          country: memory.country || "",
          city: memory.city || "",
          locationName: memory.locationName || "",
          lat: String(memory.coordinates?.lat || "30.7333"),
          lng: String(memory.coordinates?.lng || "76.7794"),
        });

        setImages(memory.images || []);
      } catch (error) {
        if (ignore) return;

        console.error("Fetch edit memory error:", error);
        setError(error.response?.data?.message || "Failed to load memory");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchMemory();

    return () => {
      ignore = true;
    };
  }, [id, currentUserId, navigate, showToast]);

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

      await updateMemory(id, {
        title: formData.title,
        description: formData.description,
        country: formData.country,
        city: formData.city,
        locationName: formData.locationName,
        coordinates: {
          lat,
          lng,
        },
        images,
      });

      showToast({
        type: "success",
        title: "Memory updated",
        message: "Your journey memory has been saved.",
      });

      navigate(`/memories/${id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update memory");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
        <main className="mx-auto grid min-h-screen max-w-6xl place-items-center px-4">
          <div className="flex items-center gap-3 rounded-3xl border border-[#D8DEE6] bg-white px-6 py-5 font-black text-[#1A365D] shadow-sm">
            <Loader2 className="animate-spin text-[#F6AD55]" size={24} />
            Loading memory...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      <main className="mx-auto max-w-[1280px] px-4 pb-36 pt-6 md:px-8 md:pb-28 md:pt-8">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#F6AD55]">
              Refine your journey
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#1A365D] md:text-6xl">
              Edit Memory
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#002045]/60 md:text-base">
              Update your story, refresh your gallery, and adjust the map
              location.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/memories/${id}`)}
            className="hidden rounded-2xl border border-[#D8DEE6] bg-white px-5 py-3 font-bold text-[#1A365D] transition hover:border-[#F6AD55] md:block"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-600">
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

            <div className="rounded-[2rem] border border-[#D8DEE6] bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setLocationOpen((prev) => !prev)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#F6AD55]">
                    Location
                  </p>
                  <h2 className="mt-1 text-xl font-black text-[#1A365D]">
                    Map Anchor
                  </h2>
                </div>

                {locationOpen ? <ChevronUp /> : <ChevronDown />}
              </button>

              {locationOpen && (
                <div className="space-y-5 border-t border-[#E5EAF0] p-5">
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

            <PublishSection
              privacy={privacy}
              setPrivacy={setPrivacy}
              submitting={submitting}
              uploading={uploading}
              mobile
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

              <PublishSection
                privacy={privacy}
                setPrivacy={setPrivacy}
                submitting={submitting}
                uploading={uploading}
              />
            </aside>
          </div>

          <div className="fixed bottom-20 left-4 right-4 z-40 lg:hidden">
            <button
              type="submit"
              disabled={submitting || uploading}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#F6AD55] text-base font-black text-white shadow-xl transition hover:bg-orange-400 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Changes
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
    <section className="rounded-[2rem] border border-[#D8DEE6] bg-white p-5 shadow-[0_10px_25px_rgba(26,54,93,0.05)] md:p-8">
      <div className="mb-8">
        <label className="mb-3 block text-xs font-black uppercase tracking-widest text-[#1A365D]">
          Journey Title
        </label>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Where did the adventure lead?"
          className="w-full border-none bg-transparent p-0 text-3xl font-black leading-tight text-[#002045] outline-none placeholder:text-[#CBD5E1] focus:ring-0 md:text-5xl"
        />
      </div>

      <div className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-[#E5EAF0] pb-3">
          <button
            type="button"
            className="rounded-xl p-2 text-[#74777F] transition hover:bg-[#F1F4F6]"
          >
            <Camera size={18} />
          </button>

          <button
            type="button"
            className="rounded-xl p-2 text-[#74777F] transition hover:bg-[#F1F4F6]"
          >
            <Mountain size={18} />
          </button>

          <div className="mx-2 h-6 w-px bg-[#E5EAF0]" />

          <span className="text-sm text-[#74777F]">Tell the story...</span>
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="7"
          placeholder="The dust had not settled yet when we reached the ridge line..."
          className="w-full resize-none border-none bg-transparent p-0 text-base leading-7 text-[#43474E] outline-none placeholder:text-[#A8B0BA] focus:ring-0 md:text-lg md:leading-8"
        />
      </div>

      <div>
        <label className="mb-4 block text-xs font-black uppercase tracking-widest text-[#1A365D]">
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
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "bg-[#002045] text-white shadow-md"
                    : "bg-[#F1F4F6] text-[#43474E] hover:bg-[#E5E9EB]"
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
    <section className="rounded-[2rem] border border-[#D8DEE6] bg-white p-5 shadow-[0_10px_25px_rgba(26,54,93,0.05)] md:p-8">
      <label className="mb-4 block text-xs font-black uppercase tracking-widest text-[#1A365D]">
        Gallery Assets
      </label>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={`${image.url || image}-${index}`}
            className={`group relative aspect-square overflow-hidden rounded-2xl border ${
              index === 0
                ? "border-2 border-[#F6AD55] ring-4 ring-[#F6AD55]/20"
                : "border-[#D8DEE6]"
            }`}
          >
            <img
              src={image.url || image}
              alt=""
              className="h-full w-full object-cover transition group-hover:scale-105"
            />

            {index === 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-[#F6AD55] px-2 py-1 text-[10px] font-black uppercase text-white">
                Cover
              </span>
            )}

            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/50 text-white opacity-100 transition md:opacity-0 md:group-hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C4C6CF] bg-[#F7FAFC] text-[#74777F] transition hover:border-[#F6AD55] hover:bg-orange-50 hover:text-[#F6AD55]">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <ImagePlus className="h-8 w-8" />
          )}

          <span className="mt-2 text-sm font-bold">
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
    <section className="overflow-hidden rounded-[2rem] border border-[#1A365D]/20 bg-[#1A365D] text-white shadow-xl">
      <div className="p-5 md:p-6">
        <label className="mb-4 block text-xs font-black uppercase tracking-widest text-blue-100">
          Location Anchor
        </label>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-100/70" />

          <input
            name="locationName"
            value={formData.locationName}
            onChange={handleChange}
            placeholder="Search or name this place..."
            className="w-full rounded-xl border-none bg-[#002045]/45 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-blue-100/50 focus:ring-1 focus:ring-[#F6AD55]"
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

        <p className="mt-3 text-xs leading-5 text-blue-100/70">
          Click on the map to set exact coordinates for this memory.
        </p>
      </div>
    </section>
  );
}

function MetadataSection({ formData, handleChange }) {
  return (
    <section className="rounded-[2rem] border border-[#D8DEE6] bg-white p-5 shadow-[0_10px_25px_rgba(26,54,93,0.05)] md:p-6">
      <label className="mb-6 block text-xs font-black uppercase tracking-widest text-[#1A365D]">
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
    <section className="rounded-[2rem] border border-[#D8DEE6] bg-white p-5 shadow-[0_10px_25px_rgba(26,54,93,0.05)] md:p-6">
      <label className="mb-4 block text-xs font-black uppercase tracking-widest text-[#1A365D]">
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
              className={`rounded-full border px-3 py-2 text-xs font-bold transition ${
                active
                  ? "border-[#F6AD55] bg-orange-50 text-[#F6AD55]"
                  : "border-[#D8DEE6] text-[#43474E] hover:bg-[#F7FAFC]"
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

function PublishSection({
  privacy,
  setPrivacy,
  submitting,
  uploading,
  mobile = false,
}) {
  return (
    <section
      className={`rounded-[2rem] bg-[#002045] p-6 text-white shadow-xl ${
        mobile ? "pb-24" : ""
      }`}
    >
      <label className="mb-5 block text-xs font-black uppercase tracking-widest text-blue-100">
        Privacy Controls
      </label>

      <div className="mb-6 grid grid-cols-3 rounded-xl bg-[#1A365D] p-1">
        {["public", "friends", "private"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPrivacy(item)}
            className={`rounded-lg py-2 text-xs font-black capitalize transition ${
              privacy === item
                ? "bg-white text-[#002045] shadow-sm"
                : "text-blue-100/70"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={submitting || uploading}
        className="hidden h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#F6AD55] text-lg font-black text-white shadow-lg transition hover:bg-orange-400 disabled:opacity-60 lg:flex"
      >
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-5 w-5" />
            Save Changes
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-blue-100/60">
        Your updated memory will stay connected to your Waymark travel passport.
      </p>
    </section>
  );
}

function Field({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#002045]/45">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#D8DEE6] bg-[#F7FAFC] px-4 py-3 text-sm font-semibold text-[#002045] outline-none transition placeholder:text-[#94A3B8] focus:border-[#F6AD55] focus:bg-white"
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

export default EditMemory;