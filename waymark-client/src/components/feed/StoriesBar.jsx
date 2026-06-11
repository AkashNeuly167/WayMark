function StoriesBar() {
  const stories = [
    {
      title: "Your Story",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=500",
    },
    {
      title: "Alpine",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=500",
    },
    {
      title: "Lakes",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=500",
    },
    {
      title: "Nordic",
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=500",
    },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {stories.map((story, index) => (
        <div
          key={index}
          className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded-2xl shadow-md transition hover:scale-105 "
        >
          <img
            src={story.image}
            alt={story.title}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/30" />

          <p className="absolute bottom-2 left-2 text-xs font-bold text-white">
            {story.title}
          </p>
        </div>
      ))}
    </div>
  );
}

export default StoriesBar;