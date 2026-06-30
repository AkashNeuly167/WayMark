import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/cloudinary";

function ImageCarousel({
  images = [],
  title = "Memory image",
  className = "",
  variant = "default",
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const touchStartRef = useRef(null);
  const swipedRef = useRef(false);

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

  const isFeed = variant === "feed";
  const isThumb = variant === "thumb";

  const maxIndex = normalizedImages.length - 1;
  const safeActiveIndex = hasImages ? Math.min(activeIndex, maxIndex) : 0;

  const goPrev = (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!hasMultipleImages) return;

    setActiveIndex(safeActiveIndex === 0 ? maxIndex : safeActiveIndex - 1);
  };

  const goNext = (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!hasMultipleImages) return;

    setActiveIndex(safeActiveIndex === maxIndex ? 0 : safeActiveIndex + 1);
  };

  const goToSlide = (event, index) => {
    event.preventDefault();
    event.stopPropagation();

    setActiveIndex(index);
  };

  const handleTouchStart = (event) => {
    touchStartRef.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartRef.current === null || !hasMultipleImages) return;

    const touchEnd = event.changedTouches[0].clientX;
    const distance = touchStartRef.current - touchEnd;

    if (Math.abs(distance) > 50) {
      swipedRef.current = true;

      if (distance > 0) {
        goNext();
      } else {
        goPrev();
      }

      window.setTimeout(() => {
        swipedRef.current = false;
      }, 250);
    }

    touchStartRef.current = null;
  };

  const handleClickCapture = (event) => {
    if (swipedRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  if (!hasImages) {
    return (
      <div
        className={`grid aspect-square w-full place-items-center bg-[#06111F] text-slate-600 ${className}`}
      >
        <div className="flex flex-col items-center gap-2">
          <ImageOff size={30} />

          {!isThumb && (
            <p className="text-xs font-black text-slate-600">No image</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group/carousel relative aspect-square w-full overflow-hidden bg-[#06111F] ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClickCapture={handleClickCapture}
    >
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(-${safeActiveIndex * 100}%)`,
        }}
      >
        {normalizedImages.map((image, index) => (
          <div key={`${image}-${index}`} className="h-full w-full shrink-0">
            <img
              src={getOptimizedImageUrl(image,isThumb ? 200 : isFeed ? 900 :1200)}
              alt={`${title} ${index + 1}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full select-none object-cover"
              draggable="false"
            />
          </div>
        ))}
      </div>

      {hasMultipleImages && !isThumb && (
        <>
          <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[11px] font-black text-white backdrop-blur">
            {safeActiveIndex + 1}/{normalizedImages.length}
          </div>

          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur transition hover:bg-black/65 md:grid md:opacity-0 md:group-hover/carousel:opacity-100"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur transition hover:bg-black/65 md:grid md:opacity-0 md:group-hover/carousel:opacity-100"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>

          <div
            className={`absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 ${
              isFeed ? "md:hidden" : ""
            }`}
          >
            {normalizedImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(event) => goToSlide(event, index)}
                className={`h-1.5 rounded-full transition-all ${
                  safeActiveIndex === index
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/55"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>

          {isFeed && (
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-20 hidden gap-1.5 md:flex">
              {normalizedImages.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition ${
                    safeActiveIndex === index ? "bg-white" : "bg-white/35"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ImageCarousel;