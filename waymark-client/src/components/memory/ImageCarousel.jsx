import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

function ImageCarousel({ images = [], title = "Memory image", className = "" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  const normalizedImages = useMemo(() => {
    return images
      .map((image) => {
        if (!image) return "";
        return typeof image === "string" ? image : image.url;
      })
      .filter(Boolean);
  }, [images]);

  const hasImages = normalizedImages.length > 0;
  const hasMultipleImages = normalizedImages.length > 1;

  const goPrev = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setActiveIndex((prev) =>
      prev === 0 ? normalizedImages.length - 1 : prev - 1,
    );
  };

  const goNext = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setActiveIndex((prev) =>
      prev === normalizedImages.length - 1 ? 0 : prev + 1,
    );
  };

  const handleTouchStart = (event) => {
    setTouchStart(event.touches[0].clientX);
  };

  const handleTouchEnd = (event) => {
    if (touchStart === null || !hasMultipleImages) return;

    const touchEnd = event.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;

    if (distance > 50) {
      setActiveIndex((prev) =>
        prev === normalizedImages.length - 1 ? 0 : prev + 1,
      );
    }

    if (distance < -50) {
      setActiveIndex((prev) =>
        prev === 0 ? normalizedImages.length - 1 : prev - 1,
      );
    }

    setTouchStart(null);
  };

  if (!hasImages) {
    return (
      <div
        className={`grid aspect-square w-full place-items-center bg-[#E8EDF2] text-[#002045]/40 ${className}`}
      >
        <ImageOff size={32} />
      </div>
    );
  }

  return (
    <div
      className={`group relative aspect-square w-full overflow-hidden bg-black ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
        }}
      >
        {normalizedImages.map((image, index) => (
          <div key={`${image}-${index}`} className="h-full w-full shrink-0">
            <img
              src={image}
              alt={`${title} ${index + 1}`}
              className="h-full w-full object-cover"
              draggable="false"
            />
          </div>
        ))}
      </div>

      {hasMultipleImages && (
        <>
          <div className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-black text-white">
            {activeIndex + 1}/{normalizedImages.length}
          </div>

          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/65 md:grid md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/65 md:grid md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {normalizedImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setActiveIndex(index);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  activeIndex === index
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/55"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ImageCarousel;