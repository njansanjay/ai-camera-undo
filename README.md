# ai-camera-undo — Kerala AI Camera Awareness Platform

![Status](https://img.shields.io/badge/status-active-brightgreen?style=for-the-badge)

AI Camera Undo is a full-stack interactive map platform that helps users locate AI traffic cameras across Kerala.  
It provides real-time visualization of camera locations using GIS mapping technology, clustering, and location-based awareness features.

The platform is designed as a road-safety and traffic-awareness tool built with modern web technologies and scalable map rendering techniques.

---

#  Features

* Interactive Kerala AI camera map
* 5000+ AI camera locations visualized
* Marker clustering for smooth performance
* Zoom-based map exploration
* Mobile-responsive interface
* Camera location popups with district info
* OpenStreetMap integration
* Real-time map rendering using Leaflet
* JSON-based scalable dataset system
* Fast deployment using Vercel

---

# Tech Stack

## Frontend

* Next.js
* TypeScript
* React
* Tailwind CSS
* Leaflet.js
* React Leaflet
* React Leaflet Cluster

---

# Project Structure

```text
ai-camera-undo/
├── app/              # Next.js app router
├── components/       # Map components
├── public/           # Static assets + cameras.json
├── types/            # TypeScript types
├── lib/              # Utility/helper files
└── package.json
```

---

# Setup Instructions

## 1 Clone Repository

```bash
git clone https://github.com/njansanjay/ai-camera-undo.git

cd ai-camera-undo
```

---

## 2️ Install Dependencies

```bash
npm install
```

---

## 3️ Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Dataset

The platform uses a large JSON dataset containing:

* AI camera coordinates
* District information
* Camera locations
* Camera types

Dataset structure example:

```json
{
  "Unique_id": "KL-KEL-KMVD-50-AICS-14-710",
  "District": "Kasaragod",
  "Location": "Bandadka",
  "Lat": 12.498763,
  "Long": 75.267684,
  "Type": "AI Camera"
}
```

---

# Deployment

This project is deployed using:

* Vercel

To deploy:

```bash
git push
```

Vercel automatically redeploys on every push.

---

# Performance Optimizations

* Marker clustering
* Chunked marker loading
* Canvas rendering
* Dynamic JSON loading
* Optimized map rendering

---

# Future Improvements

* Live GPS tracking
* Nearby camera alerts
* Search by district/location
* Route-based camera prediction
* Database integration
* Community camera reporting
* Traffic analytics dashboard

---

# ⚠️ Disclaimer

This platform is intended for:

Road safety awareness  
Traffic information visualization  
Publicly available camera location awareness  

Users should always follow traffic laws and drive responsibly.

---

# Live Preview

```text
https://ai-camera-undo.vercel.app/
```

---

# Author

Sanjay.R

---

# License

This project is open-source and available under the MIT License.
