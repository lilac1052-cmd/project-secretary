import type { Metadata } from "next";
import { Noto_Sans_KR, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import { TodayDate } from "@/components/today-date";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "프로젝트 비서",
  description: "여러 프로젝트의 세부구성·핵심 요건·진행과정·마감을 한눈에 보여주는 개인 비서형 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistMono.variable} h-full antialiased`}>
      <body className={`${notoSansKr.className} min-h-full flex`}>
        <Sidebar />
        <TodayDate />
        <div className="flex-1 min-h-screen overflow-y-auto">{children}</div>
      </body>
    </html>
  );
}
