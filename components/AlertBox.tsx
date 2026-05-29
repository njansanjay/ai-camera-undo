"use client"

import { useEffect, useState } from "react"
import { Camera } from "@/types/camera"

interface AlertBoxProps {
  camera: Camera
  distance: number
  onClose: () => void
}

export default function AlertBox({ camera, distance, onClose }: AlertBoxProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setIsVisible(true)
    }, 10)

    // Auto-hide after 10 seconds if not already closed
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation
    }, 10000)

    return () => {
      clearTimeout(animationTimer)
      clearTimeout(hideTimer)
    }
  }, [camera, onClose])

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[2000] w-full max-w-md px-4 transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="bg-red-600 text-white p-4 rounded-xl shadow-2xl border-2 border-red-500 flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-full animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg leading-tight">Camera Alert!</h3>
          <p className="text-red-100 text-sm">
            {camera.Location} is only {Math.round(distance)}m away.
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
