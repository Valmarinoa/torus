"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  return (
    <main className="h-screen">
      <div className="text-xl absolute right-5 bottom-1 text-[#FFD726] rounded-full z-50  backdrop-blur-sm p-6">
        ©2024
      </div>
      <div className="text-center text-xl fixed bottom-1 rounded-full left-1/2 -translate-x-1/2 text-[#FFD726] z-50 backdrop-blur-sm p-6">
        by Valentina Marino
      </div>
      <Scene />
    </main>
  );
}
