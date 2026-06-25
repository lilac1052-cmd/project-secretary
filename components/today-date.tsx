"use client";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function TodayDate() {
  return (
    <div className="fixed top-2 right-4 z-50 text-xs text-muted-foreground">
      {todayStr()}
    </div>
  );
}
