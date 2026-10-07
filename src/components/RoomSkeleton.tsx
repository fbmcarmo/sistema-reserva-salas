export function RoomSkeleton() {
  return (
    <div className="bg-card border border-border/80 rounded-2xl p-6 animate-pulse space-y-4 shadow-xs">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-2/3">
          <div className="h-5 bg-muted rounded-md w-3/4" />
          <div className="h-3 bg-muted/70 rounded-md w-1/3" />
        </div>
        <div className="h-6 bg-muted rounded-full w-20" />
      </div>

      <div className="pt-2">
        <div className="h-3 bg-muted/60 rounded-md w-1/2" />
      </div>

      <div className="pt-3">
        <div className="h-9 bg-muted/40 rounded-xl w-full" />
      </div>
    </div>
  );
}