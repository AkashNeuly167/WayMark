import { Award, BarChart3, Camera, Compass, MapPin } from "lucide-react";

import TopNavbar from "../components/navigation/TopNavbar";
import MobileBottomNav from "../components/navigation/MobileBottomNav";

function TravelWrapped() {
  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      <TopNavbar />

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 md:px-8">
        <section className="overflow-hidden rounded-[32px] border border-[#D8DEE6] bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#0B132B] via-[#1A365D] to-[#F6AD55] p-8 text-white md:p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
              <Award size={32} />
            </div>

            <h1 className="mt-6 text-4xl font-bold md:text-6xl">
              Travel Wrapped
            </h1>

            <p className="mt-4 max-w-2xl text-white/75">
              Your personal travel recap will show your memories, countries,
              cities, and favorite moments.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-4 md:p-8">
            <div className="rounded-3xl bg-[#F7FAFC] p-5">
              <Camera className="text-[#F6AD55]" size={26} />
              <p className="mt-4 text-3xl font-bold">0</p>
              <p className="mt-1 text-sm text-[#002045]/55">Memories</p>
            </div>

            <div className="rounded-3xl bg-[#F7FAFC] p-5">
              <MapPin className="text-[#F6AD55]" size={26} />
              <p className="mt-4 text-3xl font-bold">0</p>
              <p className="mt-1 text-sm text-[#002045]/55">Countries</p>
            </div>

            <div className="rounded-3xl bg-[#F7FAFC] p-5">
              <Compass className="text-[#F6AD55]" size={26} />
              <p className="mt-4 text-3xl font-bold">0</p>
              <p className="mt-1 text-sm text-[#002045]/55">Cities</p>
            </div>

            <div className="rounded-3xl bg-[#F7FAFC] p-5">
              <BarChart3 className="text-[#F6AD55]" size={26} />
              <p className="mt-4 text-3xl font-bold">Soon</p>
              <p className="mt-1 text-sm text-[#002045]/55">Insights</p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-dashed border-[#D8DEE6] bg-white p-8 text-center">
          <h2 className="text-2xl font-bold">Travel stats coming next</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[#002045]/60">
            Once connected to the backend, this page will show your most visited
            countries, total memories, top places, and yearly travel recap.
          </p>
        </section>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default TravelWrapped;