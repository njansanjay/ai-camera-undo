"use client"

import dynamic from "next/dynamic"

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 font-medium animate-pulse">Initializing Map...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  return (
    <main>
      <Map />
    </main>
  )
}