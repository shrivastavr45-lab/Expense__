export default function Skeleton({ className = '', width, height, circle }) {
  return (
    <div
      className={`skeleton ${circle ? 'rounded-full' : ''} ${className}`}
      style={{ width, height: height || 16 }}
    />
  );
}

export function SkeletonCard({ rows = 3 }) {
  return (
    <div className="card p-5 space-y-4">
      <Skeleton height={20} width="60%" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton height={12} width={`${80 - i * 10}%`} />
        </div>
      ))}
    </div>
  );
}
