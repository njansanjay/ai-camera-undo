"use client"

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
  Circle,
} from "react-leaflet"

import { useEffect, useState, useCallback } from "react"
import MarkerClusterGroup from "react-leaflet-cluster"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { calculateDistance } from "@/lib/gps"
import AlertBox from "./AlertBox"
import { Camera } from "@/types/camera"

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 2,
    })
  }, [center, zoom, map])
  return null
}

export default function Map() {
  const [cameras, setCameras] = useState<Camera[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([10.8505, 76.2711])
  const [mapZoom, setMapZoom] = useState(7)
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // User tracking state
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [userLocationAccuracy, setUserLocationAccuracy] = useState<number | null>(null)
  const [nearbyCamera, setNearbyCamera] = useState<{ camera: Camera; distance: number } | null>(
    null
  )
  const [lastAlertedCameraId, setLastAlertedCameraId] = useState<string | null>(null)

  const fetchCameras = useCallback(async () => {
    setIsDataLoading(true)
    setError(null)
    try {
      const response = await fetch("/cameras.json")
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.statusText}`)
      }
      const data: Camera[] = await response.json()
      setCameras(data)
    } catch (err: unknown) {
      console.error("Error fetching cameras:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred while loading camera data."
      setError(errorMessage)
    } finally {
      setIsDataLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCameras()
    }, 0)
    return () => clearTimeout(timer)
  }, [fetchCameras])

  // GPS Tracking Logic
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      console.error("Geolocation is not supported by your browser")
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        setUserLocation([latitude, longitude])
        setUserLocationAccuracy(accuracy)

        // Check for nearby cameras
        if (cameras.length > 0) {
          let closestDist = Infinity
          let closestCam: Camera | null = null

          for (const cam of cameras) {
            const dist = calculateDistance(latitude, longitude, cam.Lat, cam.Long)
            if (dist < closestDist) {
              closestDist = dist
              closestCam = cam
            }
          }

          // Trigger alert if within 500 meters and not already alerted for this camera
          if (closestCam && closestDist < 500) {
            if (lastAlertedCameraId !== closestCam.Unique_id) {
              setNearbyCamera({ camera: closestCam, distance: closestDist })
              setLastAlertedCameraId(closestCam.Unique_id)
            }
          } else if (closestDist > 700) {
            // Reset alert if moved away
            setLastAlertedCameraId(null)
          }
        }
      },
      (err) => {
        console.error("Error watching position:", err)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [cameras, lastAlertedCameraId])

  const locateMe = useCallback(() => {
    if (userLocation) {
      setMapCenter(userLocation)
      setMapZoom(13)
    } else {
      alert("Locating you... Please ensure GPS is enabled.")
    }
  }, [userLocation])

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
        setMapZoom(11)
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

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-red-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
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
                className="text-red-600"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Failed to Load Map Data</h3>
            <p className="text-gray-600 mb-6 text-sm">
              {error}
            </p>
            <button
              onClick={() => fetchCameras()}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg w-full"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Locate Me Button */}
      <button
        onClick={locateMe}
        className="absolute bottom-6 right-6 z-[1000] bg-white p-4 rounded-full shadow-2xl hover:bg-gray-50 transition-all duration-300 border border-gray-100 group active:scale-95"
        title="Locate Me"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-gray-700 group-hover:text-blue-600 ${
            !userLocation ? "animate-pulse opacity-50" : ""
          }`}
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </button>

      {/* Proximity Alert */}
      {nearbyCamera && (
        <AlertBox
          camera={nearbyCamera.camera}
          distance={nearbyCamera.distance}
          onClose={() => setNearbyCamera(null)}
        />
      )}

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        preferCanvas={true}
        renderer={L.canvas()}
        style={{ height: "100%", width: "100%" }}
      >
        <MapUpdater center={mapCenter} zoom={mapZoom} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        {userLocation && (
          <>
            {userLocationAccuracy && (
              <Circle
                center={userLocation}
                radius={userLocationAccuracy}
                pathOptions={{
                  fillColor: "#3b82f6",
                  fillOpacity: 0.15,
                  color: "#3b82f6",
                  weight: 1,
                  dashArray: "5, 5",
                }}
              />
            )}
            <CircleMarker
              center={userLocation}
              radius={8}
              pathOptions={{
                fillColor: "#3b82f6",
                fillOpacity: 1,
                color: "white",
                weight: 3,
              }}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-semibold">You are here</p>
                  {userLocationAccuracy && (
                    <p className="text-xs text-gray-500">
                      Accuracy: ±{Math.round(userLocationAccuracy)}m
                    </p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          </>
        )}

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={80}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
        >
          {cameras.map((camera, index) => (
            <Marker key={`${camera.Unique_id}-${index}`} position={[camera.Lat, camera.Long]}>
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