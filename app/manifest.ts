import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "프로젝트 비서",
    short_name: "프로젝트 비서",
    description: "여러 프로젝트의 세부구성·핵심 요건·진행과정·마감을 한눈에 보여주는 개인 비서형 대시보드",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8FF",
    theme_color: "#3F5BAA",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
