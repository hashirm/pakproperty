# PakProperty — Pakistan's Premier Real Estate Marketplace

Inspired by the functionality, UX architecture, and market ergonomics of **Zameen.com**, **PakProperty** is a complete, production-ready full-stack real estate platform built with Next.js (App Router), Node.js, Express, MongoDB with Mongoose, and Tailwind CSS.

---

## 🌟 Key Features & Pakistani Market Nuances

- **Pakistani Currency Units:** Automatic formatting for PKR amounts into **Thousand**, **Lakh**, **Crore**, and **Arab** (e.g., `PKR 4.25 Crore`, `PKR 1.85 Lakh / month`).
- **Pakistani Land Units:** Native support for **Marla** (225 / 250 sq ft), **Kanal** (20 Marlas), **Square Feet**, and **Square Yards**.
- **Pakistani Top Cities & Localities:** Islamabad, Lahore, Karachi, Rawalpindi, Peshawar, Faisalabad, Multan, Quetta, with detailed sector-level accuracy (CDA sectors F-6, F-7, F-10, DHA Lahore Phases 5-7, Clifton Karachi, Bahria Town, Park View City, Gulberg Greens).
- **Zameen-Style Hero Search:** Tabbed search for **BUY**, **RENT**, and **PROJECTS** with City, Locality, Property Type (Homes, Plots, Commercial), Price presets, and Bedroom selector.
- **Interactive OpenStreetMap / Leaflet Integration:** Toggle map view with price markers and property popups.
- **Role-Based Portals:**
  - **Regular Buyer:** Search, save favorites, send direct inquiries, contact via WhatsApp/Call.
  - **Property Seller:** Post advertisements, track listing views, manage active/pending listings.
  - **Real Estate Agent:** Verified consultancy profile, agency listings inventory, client reviews.
  - **Administrator:** System metrics dashboard, pending property moderation queue (1-click approve/reject), user governance.
- **Direct Pakistani Communication:** 1-click **WhatsApp chat** integration (`https://wa.me/...`) and direct **Phone Call** buttons.

---

## 🏗️ Technology Architecture

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Leaflet / OpenStreetMap, Sonner toasts |
| **Backend** | Node.js, Express.js REST API, Mongoose, JWT authentication, `bcryptjs`, `multer` |
| **Database** | MongoDB with Mongoose (automatic embedded fallback via `MongoMemoryServer` when external URI is not supplied) |
| **Media Handling** | Cloudinary integration + local static fallback `/uploads` |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= v18.0.0

### 2. Running the Backend Server
```bash
cd backend
npm install
npm run dev
```
*The backend connects to MongoDB (or boots an in-memory database), seeds realistic Pakistani properties, agents, and users, and runs on `http://localhost:5001`.*

### 3. Running the Frontend
```bash
cd frontend
npm install
npm run dev # or npm run build && npm run start
```
*The frontend starts on `http://localhost:3000`.*

---

## 🔑 Demo Credentials (1-Click Login on UI)

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@pakproperty.com` | `adminpassword123` |
| **Verified Agent (Islamabad)** | `tariq@apexproperties.pk` | `password123` |
| **Property Seller** | `seller@pakproperty.com` | `password123` |
| **Regular Buyer** | `buyer@pakproperty.com` | `password123` |

---

## 📂 Project Directory Structure

```
pakproperty/
├── backend/
│   ├── src/
│   │   ├── config/ (MongoDB connection & memory server)
│   │   ├── controllers/ (Auth, Properties, Agents, Inquiries, Favorites, Admin, Upload)
│   │   ├── middleware/ (JWT Auth, Role checks, Error handling, Multer)
│   │   ├── models/ (User, Property, Agent, Inquiry, Favorite, Review, Notification, Location)
│   │   ├── routes/ (REST API endpoints)
│   │   ├── utils/ (Pakistani cities, PKR currency formatter, database seeder)
│   │   └── server.ts
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx (Zameen-style homepage with search, city cards, featured listings)
    │   │   ├── properties-for-sale/ (Search & filter sale properties)
    │   │   ├── properties-for-rent/ (Search & filter rental properties)
    │   │   ├── property/[id]/ (High-res gallery, specs, WhatsApp CTA, Leaflet map)
    │   │   ├── agents/ (Agent directory & profiles)
    │   │   ├── agents/[id]/ (Agent details, active inventory, reviews)
    │   │   ├── projects/ (New housing societies and mega projects)
    │   │   ├── submit-property/ (Multi-step listing submission with photo uploads)
    │   │   ├── dashboard/ (Portal overview, my listings, inquiries, favorites, profile)
    │   │   ├── admin/ (Moderation queue, 1-click approve/reject, metrics)
    │   │   ├── login/ & register/ (Authentication forms)
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── home/ (HeroSearch, CityCards, FeaturedSlider, ProjectsSection, AgentShowcase)
    │   │   ├── layout/ (Navbar with sticky header, Footer with top Pakistani cities)
    │   │   ├── property/ (PropertyCard, FilterSidebar, LeafletMap, PropertyListingsView)
    │   │   └── dashboard/ (DashboardLayout)
    │   ├── context/ (AuthContext with JWT persistence)
    │   └── lib/ (API client with typed interfaces)
    └── package.json
```
