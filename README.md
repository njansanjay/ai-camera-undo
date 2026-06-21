
# 🚦 AI Camera Undo — Kerala AI Camera Awareness Platform

![Status](https://img.shields.io/badge/status-active-brightgreen?style=for-the-badge)

AI Camera Undo is an interactive web platform that helps users locate AI traffic cameras across Kerala using an optimized GIS-based map interface.

The platform visualizes thousands of AI camera locations with clustering, popup information, and smooth rendering for better traffic-awareness and road-safety accessibility.

---

# ✨ Features

- 🗺️ Interactive Kerala AI camera map
- 📍 5000+ AI camera locations visualized
- ⚡ Marker clustering for smooth performance
- 🔍 Zoom-based map exploration
- 📱 Mobile-responsive interface
- 🚦 Camera location popups with district info
- 🌍 OpenStreetMap integration
- ⚙️ Real-time rendering using Leaflet
- 📂 JSON-based scalable dataset system
- 🚀 Fast deployment using Vercel

---

# 🧠 Tech Stack

## Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- Leaflet.js
- React Leaflet
- React Leaflet Cluster

---

# 🗺️ Project Workflow

```mermaid
flowchart LR

A[User Opens Website] --> B[Next.js Frontend]

B --> C[React Leaflet Map]

B --> D[cameras.json Dataset]

D --> E[AI Camera Locations]

E --> F[Latitude & Longitude Parsing]

F --> G[MarkerClusterGroup]

G --> H[Optimized Map Rendering]

H --> I[Interactive Markers]

I --> J[Popup Information]

J --> K[District]
J --> L[Location]
J --> M[Camera Type]
````

---

# 📁 Project Structure

```text
ai-camera-undo/
├── app/
├── components/
├── public/
├── types/
├── lib/
└── package.json
```

---

# ⚙️ Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone https://github.com/njansanjay/ai-camera-undo.git

cd ai-camera-undo
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---


# 🐳 Docker Support

This project can also be run using Docker.

## Build Docker Image

```bash
docker build -t ai-camera-undo .
```

## Run Using Docker

```bash
docker run -p 3000:3000 ai-camera-undo
```

Open:

```text
http://localhost:3000
```

## Run Using Docker Compose

```bash
docker compose up
```

Stop the container:

```bash
docker compose down
```

---


# 🗺️ Dataset

Dataset contains:

* Camera coordinates
* District information
* Camera locations
* Camera types

Example:

```json
{
  "District": "Kasaragod",
  "Location": "Bandadka",
  "Lat": 12.498763,
  "Long": 75.267684,
  "Type": "AI Camera"
}
```

---

# 🚀 Deployment

Deployed using Vercel.

```bash
git push
```

Vercel automatically redeploys on every push.

---

# ⚡ Performance Optimizations

* Marker clustering
* Chunked loading
* Canvas rendering
* Dynamic dataset loading
* Optimized map rendering

---

# 🔮 Future Improvements

* 📍 Live GPS tracking
* 🚨 Nearby camera alerts
* 🔍 Search by district/location
* 🧭 Route-based camera prediction
* ☁️ Database integration
* 👥 Community camera reporting

---

# ⚠️ Disclaimer

This platform is intended for:

* Road safety awareness
* Traffic information visualization
* Publicly available camera location awareness

Users should always follow traffic laws and drive responsibly.

---

# 📸 Live Preview

https://aicameraundo.codes/

---

# 🧑‍💻 Author

Sanjay.R

---

# 📄 License

This project is licensed under the MIT License.

```
```
