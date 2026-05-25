"use client"

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
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

export default function Map() {

  const [cameras, setCameras] = useState<any[]>([])

  useEffect(() => {
    fetch("/cameras.json")
      .then((res) => res.json())
      .then((data) => {
        setCameras(data)
      })
  }, [])

  return (
    <MapContainer
      center={[10.8505, 76.2711]}
      zoom={7}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

<MarkerClusterGroup>

  {cameras.map((camera, index) => (
    <Marker
      key={index}
      position={[camera.Lat, camera.Long]}
    >
      <Popup>
        <div>
          <h2>{camera.Location}</h2>
          <p>{camera.District}</p>
          <p>{camera.Type}</p>
        </div>
      </Popup>
    </Marker>
  ))}

</MarkerClusterGroup>

    </MapContainer>
  )
}