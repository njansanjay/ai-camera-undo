"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

type CameraRecord = {
  District: string
  Type: string
}

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="map-loading">
      <span className="map-spinner" />
      <p>Preparing your camera map</p>
    </div>
  ),
})

function CameraMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none">
          <path d="M11 10.5 14 6h12l3 4.5" fill="currentColor" />
          <rect x="3" y="10" width="34" height="26" rx="9" fill="currentColor" />
          <circle cx="19" cy="23" r="8" fill="#f7f7f2" />
          <circle cx="19" cy="23" r="4.3" fill="currentColor" />
          <circle cx="31" cy="16" r="2" fill="#c7f36b" />
      </svg>
    </span>
  )
}

export default function Home() {
  const [cameraData, setCameraData] = useState<CameraRecord[]>([])

  useEffect(() => {
    fetch("/cameras.json")
      .then((response) => (response.ok ? response.json() : []))
      .then((data: CameraRecord[]) => setCameraData(data))
      .catch(() => setCameraData([]))
  }, [])

  const districtCount = new Set(cameraData.map((camera) => camera.District)).size
  const aiCameraCount = cameraData.filter((camera) => camera.Type === "AI Camera").length

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="AI Camera Undo home">
          <CameraMark />
          <span className="brand-name">AI Camera <span>Undo</span></span>
          <span className="brand-dot">.</span>
        </a>
        <nav className="topnav" aria-label="Main navigation">
          <a href="#map">Explore map</a>
          <a href="#about">About</a>
        </nav>
        <a className="topbar-cta" href="#map">
          Open live map <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> KERALA CAMERA MAP</div>
          <h1>Know the road.<br /><span>Keep moving.</span></h1>
          <p className="hero-description">
            Find AI traffic cameras across Kerala before you set off. A clear,
            community-friendly map made for more informed journeys.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#map">Explore the map <span aria-hidden="true">↓</span></a>
            <a className="text-link" href="#about">How it works <span aria-hidden="true">↗</span></a>
          </div>
          <div className="hero-note"><span className="note-icon">✳</span> Stay aware. Drive responsibly.</div>
        </div>

        <div className="hero-art" aria-label="Illustration of a camera location on a map">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="map-grid" />
          <svg className="road-lines" viewBox="0 0 560 480" fill="none" aria-hidden="true">
            <path d="M-20 115 102 163l95-21 85 63 99-13 198 78" stroke="#d9ddd4" strokeWidth="31" strokeLinecap="round" />
            <path d="m31 405 87-89-18-93 72-60 92 15 49-92 128-21 79-81" stroke="#d9ddd4" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M-20 115 102 163l95-21 85 63 99-13 198 78" stroke="#fff" strokeWidth="3" strokeDasharray="9 11" />
            <path d="m31 405 87-89-18-93 72-60 92 15 49-92 128-21 79-81" stroke="#fff" strokeWidth="3" strokeDasharray="8 10" />
            <path d="M111 31 154 111 126 204 202 260l-15 86 103 78" stroke="#e4e7df" strokeWidth="13" strokeLinecap="round" />
            <path d="m375 221 61 67-25 84 68 62" stroke="#e4e7df" strokeWidth="13" strokeLinecap="round" />
          </svg>
          <div className="art-label label-one"><span className="mini-pin">●</span> Thiruvananthapuram</div>
          <div className="art-label label-two"><span className="mini-pin">●</span> 697 locations</div>
          <div className="hero-pin"><CameraMark /><span className="pin-pulse" /></div>
          <div className="art-caption"><span>01 / 14 DISTRICTS</span><strong>Kerala, mapped.</strong></div>
          <div className="art-coordinates">8°29&apos; N&nbsp; 76°57&apos; E</div>
        </div>
      </section>

      <section className="stats-row" aria-label="Camera map statistics">
        <div className="stats-intro"><span className="stats-kicker">THE BIG PICTURE</span><strong>One map. A clearer view.</strong></div>
        <div className="stat"><strong>{cameraData.length ? cameraData.length.toLocaleString("en-IN") : "697"}</strong><span>mapped locations</span></div>
        <div className="stat"><strong>{districtCount || 14}<span>/14</span></strong><span>districts covered</span></div>
        <div className="stat"><strong>{aiCameraCount ? aiCameraCount.toLocaleString("en-IN") : "669"}</strong><span>AI cameras listed</span></div>
      </section>

      <section className="map-section" id="map">
        <div className="section-heading">
          <div><span className="section-eyebrow">YOUR NEXT STOP</span><h2>Explore the map<span>.</span></h2></div>
          <p>Search a place, zoom into your route, and tap a marker to see what’s nearby.</p>
        </div>
        <div className="map-frame"><Map /></div>
        <div className="map-footnote"><span><i className="legend-dot" /> Camera location</span><span>Map data © OpenStreetMap contributors</span></div>
      </section>

      <section className="about-strip" id="about">
        <div className="about-symbol">✳</div>
        <div><span className="section-eyebrow">BUILT FOR AWARENESS</span><h2>A little more context for every journey.</h2></div>
        <p>Browse publicly listed camera locations, check the map before you travel, and always follow the rules of the road.</p>
      </section>

      <footer className="footer"><a className="footer-brand" href="#home">AI Camera <span>Undo</span>.</a><span>Made for Kerala. Drive safe, wherever you go. <span aria-hidden="true">·</span> An open-source project by <a href="https://github.com/njansanjay" target="_blank" rel="noreferrer">njansanjay ↗</a></span><a href="#home">Back to top ↑</a></footer>
    </main>
  )
}
