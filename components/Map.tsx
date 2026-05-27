"use client"

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
} from "react-leaflet"

import { useEffect, useState } from "react"
import MarkerClusterGroup from "react-leaflet-cluster"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5,
    })
  }, [center, zoom, map])
  return null
}

export default function Map() {
  const [cameras, setCameras] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([10.8505, 76.2711])
  const [mapZoom, setMapZoom] = useState(7)
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)

  useEffect(() => {
    setIsDataLoading(true)
    fetch("/cameras.json")
      .then((res) => res.json())
      .then((data) => {
        setCameras(data)
      })
      .finally(() => {
        setIsDataLoading(false)
      })
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        setMapCenter([parseFloat(lat), parseFloat(lon)])
        setMapZoom(13)
        setIsSearchOpen(false)
      } else {
        alert("Location not found. Please try a different search.")
      }
    } catch (error) {
      console.error("Search failed:", error)
      alert("Search failed. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full h-screen">
      {/* Search UI */}
      <div className="absolute top-4 right-4 z-[1000] flex items-start">
        {!isSearchOpen ? (
          <button
            onClick={() => setIsSearchOpen(true)}
            className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center group"
            aria-label="Open search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-700 group-hover:text-blue-600"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        ) : (
          <div className="bg-white border border-gray-300 rounded-lg shadow-2xl flex items-center overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="pl-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, town, or place..."
                className="w-72 px-3 py-3 text-sm text-black focus:outline-none placeholder:text-gray-400"
                autoFocus
              />
              <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 disabled:text-gray-400 transition-colors"
              >
                {isLoading ? "..." : "Search"}
              </button>
            </form>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="px-3 py-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors border-l border-gray-100"
              aria-label="Close search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
        )}
      </div>

      {/* Data Loading Indicator */}
      {isDataLoading && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-gray-700">Loading cameras...</span>
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        preferCanvas={true}
        style={{ height: "100%", width: "100%" }}
      >
        <MapUpdater center={mapCenter} zoom={mapZoom} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup chunkedLoading>
          {cameras.map((camera, index) => (
            <Marker key={index} position={[camera.Lat, camera.Long]}>
              <Popup>
                <div>
                  <h2 className="font-bold">{camera.Location}</h2>
                  <p>{camera.District}</p>
                  <p>{camera.Type}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}