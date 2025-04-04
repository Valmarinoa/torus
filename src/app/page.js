"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  return (
    <main className="h-screen">
      <p className="text-xl absolute right-5 bottom-5  text-[#FFD726]">©2024</p>
      <p className="text-center text-xl fixed bottom-5 left-1/2 -translate-x-1/2 text-[#FFD726]">
        by Valentina Marino
      </p>
      <Scene />
    </main>
  );
}
