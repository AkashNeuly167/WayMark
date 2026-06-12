function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gradient-to-r from-[#E8EDF2] via-[#F3F6FA] to-[#E8EDF2] ${className}`}
    />
  );
}

export default Skeleton;