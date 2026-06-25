"use client";

import { usePathname } from "next/navigation";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function TodayDate() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <div className="fixed top-2 right-4 z-50 text-xs text-muted-foreground">
      {todayStr()}
    </div>
  );
}
