import * as React from "react"

const CommitLogSkeleton = () => {
  return (
    <ul className="space-y-6">
      {Array.from({ length: 5 }).map((_, idx) => (
        <li key={idx} className="flex gap-4 animate-pulse">
          {/* Avatar + timeline */}
          <div className="relative flex flex-col items-center">
            {idx !== 4 && (
              <div className="absolute top-10 h-[calc(100%+1.5rem)] w-px bg-muted" />
            )}

            <div className="h-10 w-10 rounded-full bg-muted" />
          </div>

          {/* Card */}
          <div className="flex-1 rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-4 w-4 rounded bg-muted" />
            </div>

            <div className="mb-3 h-5 w-2/3 rounded bg-muted" />

            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-5/6 rounded bg-muted" />
              <div className="h-3 w-4/6 rounded bg-muted" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export const QuestionsSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="border rounded-xl p-5 animate-pulse space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-muted" />
            <div className="h-3 w-24 rounded bg-muted" />
          </div>

          <div className="h-5 w-3/4 rounded bg-muted" />

          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-2/3 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommitLogSkeleton;

