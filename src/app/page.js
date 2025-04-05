"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <div className="w-full text-center text-xl fixed bottom-0 left-1/2   -translate-x-1/2 text-[#FFD726] z-50 backdrop-blur-sm p-3 flex-nowrap">
        <span className="pr-2"> by Valentina Marino</span> -{" "}
        <span className="pl-2">©2024</span>
      </div>
      <Scene />
    </main>
  );
}
