function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gradient-to-r from-white/[0.06] via-white/[0.12] to-white/[0.06] ${className}`}
    />
  );
}

export default Skeleton;