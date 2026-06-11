import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Loader2, MapPin, Save } from "lucide-react";

import api from "../api/axios";
import TopNavbar from "../components/navigation/TopNavbar";
import MobileBottomNav from "../components/navigation/MobileBottomNav";

function CreateMemory() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    country: "",
    city: "",
    locationName: "",
    lat: "",
    lng: "",
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const uploadData = new FormData();

    files.forEach((file) => {
      uploadData.append("images", file);
    });

    try {
      setUploading(true);

      const res = await api.post("/upload/images", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImages(res.data.images || []);
    } catch (error) {
      setError(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSubmitting(true);

      await api.post("/memories", {
        title: formData.title,
        description: formData.description,
        country: formData.country,
        city: formData.city,
        locationName: formData.locationName,
        coordinates: {
          lat: Number(formData.lat),
          lng: Number(formData.lng),
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
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      <TopNavbar />

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-8 md:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F6AD55]">
            Preserve a journey
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-5xl">
            Create Memory
          </h1>

          <p className="mt-3 max-w-2xl text-[#002045]/60">
            Share a place you visited, add location details, and attach photos
            from your journey.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_360px]"
        >
          <section className="space-y-5 rounded-[28px] border border-[#D8DEE6] bg-white p-6 shadow-sm">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Memory Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Sunrise at Spiti Valley"
                className="w-full rounded-2xl border border-[#D8DEE6] px-4 py-3 outline-none focus:border-[#F6AD55]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Write your travel memory..."
                className="w-full resize-none rounded-2xl border border-[#D8DEE6] px-4 py-3 outline-none focus:border-[#F6AD55]"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Country
                </label>
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="India"
                  className="w-full rounded-2xl border border-[#D8DEE6] px-4 py-3 outline-none focus:border-[#F6AD55]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  City
                </label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Spiti"
                  className="w-full rounded-2xl border border-[#D8DEE6] px-4 py-3 outline-none focus:border-[#F6AD55]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Location Name
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#F6AD55]" />
                <input
                  name="locationName"
                  value={formData.locationName}
                  onChange={handleChange}
                  placeholder="Spiti Valley"
                  className="w-full rounded-2xl border border-[#D8DEE6] px-12 py-3 outline-none focus:border-[#F6AD55]"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Latitude
                </label>
                <input
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  placeholder="32.246"
                  className="w-full rounded-2xl border border-[#D8DEE6] px-4 py-3 outline-none focus:border-[#F6AD55]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Longitude
                </label>
                <input
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  placeholder="78.034"
                  className="w-full rounded-2xl border border-[#D8DEE6] px-4 py-3 outline-none focus:border-[#F6AD55]"
                />
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-[#D8DEE6] bg-white p-6 shadow-sm">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#D8DEE6] bg-[#F7FAFC] px-5 py-10 text-center transition hover:border-[#F6AD55]">
                <ImagePlus className="h-10 w-10 text-[#F6AD55]" />
                <p className="mt-3 font-bold">Upload Photos</p>
                <p className="mt-1 text-sm text-[#002045]/55">
                  Select multiple images
                </p>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {uploading && (
                <div className="mt-4 flex items-center gap-2 text-sm text-[#002045]/60">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading images...
                </div>
              )}

              {images.length > 0 && (
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url || image}
                      alt=""
                      className="h-24 rounded-2xl object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || uploading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#F6AD55] px-6 py-4 font-bold text-white shadow-lg transition hover:bg-orange-400 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Share Memory
                </>
              )}
            </button>
          </aside>
        </form>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default CreateMemory;