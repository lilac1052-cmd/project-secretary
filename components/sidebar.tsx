"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, CalendarClock, CalendarDays, PlusCircle } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "대시보드", icon: Home },
  { href: "/deadlines", label: "마감 기한", icon: CalendarClock },
  { href: "/calendar", label: "캘린더", icon: CalendarDays },
  { href: "/projects/new", label: "새 프로젝트", icon: PlusCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] bg-muted/40 border-r border-border h-screen flex flex-col shrink-0">
      <div className="px-6 h-16 flex items-center">
        <span className="text-xl font-bold text-primary">프로젝트 비서</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-colors",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              <Icon className="size-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
