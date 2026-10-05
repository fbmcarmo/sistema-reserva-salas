export function RoomSkeleton() {
  return (
    <div className="bg-[#0b0f19]/80 border border-slate-800/80 rounded-2xl p-5 animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-2/3">
          <div className="h-4 bg-slate-800 rounded w-3/4" />
          <div className="h-3 bg-slate-800/60 rounded w-1/2" />
        </div>
        <div className="h-5 bg-slate-800 rounded-full w-16" />
      </div>

      <div className="space-y-1.5 pt-2">
        <div className="h-3 bg-slate-800/50 rounded w-full" />
        <div className="h-3 bg-slate-800/50 rounded w-5/6" />
      </div>

      <div className="flex gap-2 pt-2">
        <div className="h-5 bg-slate-800 rounded-lg w-20" />
        <div className="h-5 bg-slate-800 rounded-lg w-16" />
      </div>

      <div className="h-9 bg-slate-800 rounded-xl w-full mt-4" />
    </div>
  );
}