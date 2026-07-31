# 🌿 Prakriti Care — Animal Rescue & Eco-Restoration Network

> A tech-enabled social impact platform connecting street animal rescue responders, veterinary practitioners, and community-driven urban forestry networks across India.

🌐 **Live Demo:** [prakriti-care-sand.vercel.app](https://prakriti-care-sand.vercel.app)

---

## 📌 About The Project

Prakriti Care was born out of a real need witnessed on the streets of **Indore, Madhya Pradesh** — animals in distress with no fast way to connect them to veterinary help. What started as a local initiative in 2019 has grown into a multi-state digital rescue network active across **15+ Indian states**.

The platform serves as a unified interface for:
- 🐾 Emergency animal rescue reporting (SOS Portal)
- 🗺️ Real-time rescue dispatch tracking (Leaflet.js Map)
- 🌱 Urban forest (Miyawaki) plantation drives
- 💊 Stray sterilization & reflective collar distribution
- 🤝 Volunteer onboarding & NGO partnership

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (Semantic) |
| Styling | Vanilla CSS3 (Glassmorphism, Custom Properties) |
| Interactivity | Vanilla JavaScript (ES6+) |
| Map | Leaflet.js + CartoDB Voyager Tiles |
| Icons | Lucide Icons (CDN) |
| Fonts | Plus Jakarta Sans + Playfair Display (Google Fonts) |
| Deployment | Vercel |

---

## ✨ Key Features

- **Immersive Hero** — Looping nature video backdrop with ambient particle canvas (leaf + mote animations)
- **Live Rescue Telemetry Card** — 3D tilt-on-hover glassmorphic card simulating active dispatch
- **Pan-India Interactive Map** — 30 real location markers across 11 states (rescues 🔴, vet partners 🟢, plantations 🟡)
- **Emergency SOS Portal** — Dual-tab form (Animal Rescue + Volunteer Registration) with GPS pinning, drag & drop photo upload
- **Live Impact Metrics** — Animated counter section (animals rescued, trees planted, vet partners, active states)
- **About Us Timeline** — Visual story timeline from 2019 → 2024 with 3 organisational pillar cards
- **Services Catalog** — Free Reflective Collars · Miyawaki Consulting · Stray Sterilization Drives
- **Donation Modal** — ₹ preset amounts, custom input, 80G tax exemption flow, success animation
- **Contact Form** — Inquiry category selector (NGO partner / CSR / Media / Feedback)
- **Light-themed Forms & Modals** — All interactive surfaces use crisp white theme for readability
- **Fully Responsive** — Mobile-first layout with hamburger nav overlay

---

## 📁 Project Structure

```
Prakriti-Care/
├── index.html          # Full single-page application markup
├── style.css           # Complete design system + component styles
├── main.js             # Core JS: particles, map, SOS forms, modals, tracker
├── assets/
│   ├── jeev_raksha_rescue.png      # Cause card image — Project Jeev Raksha
│   ├── urban_forest_planting.png   # Cause card image — Project Urban Forest
│   └── paws_warmth_shelter.png     # Cause card image — Project Paws & Warmth
└── README.md
```

---

## 🚀 Running Locally

This is a pure static project — no build tools or dependencies required.

```bash
# Clone the repository
git clone https://github.com/ayushisharma-05/Prakriti-Care.git

# Navigate to project
cd Prakriti-Care

# Open directly in browser
start index.html

# OR serve with any static server (recommended)
npx serve .
```

## 🎨 Design System

```css
/* Core Color Tokens */
--primary-green:       #1B4D3E   /* Brand dark forest green */
--primary-light-green: #4a9578   /* Interactive elements */
--accent-terracotta:   #D97706   /* CTAs, highlights, badges */
--success-emerald:     #10B981   /* Vet network, success states */
--critical-red:        #EF4444   /* Emergency SOS alerts */
```

---

## 📸 Sections Overview

1. **Navigation** — Sticky glass header with smooth scroll links
2. **Hero** — Video + particle canvas + live telemetry card
3. **About Us** — Story timeline + 3 pillar cards (white theme)
4. **How It Works** — 3 image-topped step cards
5. **Our Causes** — 3 campaign cards with donation progress bars
6. **Services** — 3 service catalog cards with images
7. **Rescue Map** — Leaflet interactive map with filter controls
8. **Live Impact** — Animated metric counters
9. **SOS Portal** — Dual tab emergency + volunteer forms
10. **Partner Network** — Logo strip of partner organisations
11. **Trust Badges** — Section 8 / 80G / 12A certification seals
12. **Contact** — General inquiry form (light themed)
13. **Footer** — Links, contact info, newsletter signup
