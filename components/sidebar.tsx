"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, CalendarClock, CalendarDays, PlusCircle, Menu, X, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "대시보드", icon: Home },
  { href: "/deadlines", label: "마감 기한", icon: CalendarClock },
  { href: "/calendar", label: "캘린더", icon: CalendarDays },
  { href: "/projects/new", label: "새 프로젝트", icon: PlusCircle },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 px-2 py-4 space-y-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
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
  );
}

function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-2 mx-2 mb-4 rounded-xl text-sm text-muted-foreground hover:bg-accent"
    >
      <LogOut className="size-5" />
      <span>로그아웃</span>
    </button>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (pathname === "/login") {
    return null;
  }

  return (
    <>
      {/* 데스크탑: 고정 사이드바 */}
      <aside className="hidden md:flex w-[260px] bg-muted/40 border-r border-border h-screen flex-col shrink-0">
        <div className="px-6 h-16 flex items-center">
          <span className="text-xl font-bold text-primary">프로젝트 비서</span>
        </div>
        <NavLinks pathname={pathname} />
        <LogoutButton />
      </aside>

      {/* 모바일: 햄버거 버튼 */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="메뉴 열기"
        className="md:hidden fixed top-3 left-3 z-50 size-9 rounded-lg bg-card border border-border shadow-sm flex items-center justify-center"
      >
        <Menu className="size-5" />
      </button>

      {/* 모바일: 오버레이 드로어 */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[260px] bg-card border-r border-border flex flex-col shadow-lg">
            <div className="px-6 h-16 flex items-center justify-between">
              <span className="text-xl font-bold text-primary">프로젝트 비서</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="메뉴 닫기"
                className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent"
              >
                <X className="size-4" />
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            <LogoutButton />
          </aside>
        </div>
      )}
    </>
  );
}
