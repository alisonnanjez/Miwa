#  Miwa — Sugarcane Logistics & Permit System

> *Miwa* is the Swahili word for sugarcane.

## Origin & Motivation

This project was born out of a challenge set during the **ALX Professional Foundations Programme**, where students were asked to identify a real-world problem that could be solved with technology — specifically one that maps to one of the **7 Global Opportunities**, of which **Agriculture** was a key focus.

Sugarcane farming is a significant part of Kenya's agricultural economy, particularly in the Western Kenya region. Yet the process of managing harvest permits, coordinating transport, and tracking deliveries is still largely manual — done through paperwork, phone calls, and informal systems. Farmers lose time, trucks make inefficient trips, and there is no single place to see how the supply chain is performing.

Miwa is an early-stage answer to that problem — a lightweight web application that brings structure and visibility to sugarcane logistics at the farm level.

---

## Overview

Miwa is a full-stack web application built with **Node.js**, **Express**, and **SQLite**. It provides a simple, accessible interface for managing the journey of harvested sugarcane from the farm to the factory.

The system is designed for use by a logistics coordinator or cooperative administrator who manages multiple farmers, permits, and transport bookings.

---

## Features

### Farmer Management
- Register new farmers with their name, location (looked up automatically via OpenStreetMap), and farm acreage
- View all registered farmers and their active permit status

### Permit Management
- Apply for a harvest permit on behalf of a farmer
- Built-in eligibility check — farmers must have a minimum of 5 acres to qualify
- Prevents duplicate active permits for the same farmer
- View all currently approved and active permits

### Transport Optimization
- Automatically calculates the most efficient truck pickup route across all scheduled farm bookings
- Uses the **Nearest-Neighbor algorithm** with the **Haversine formula** to compute real distances between farm locations
- Displays the route as a clean, numbered stop-by-stop list with distances between each stop

### Bookings & Deliveries
- Create transport bookings against approved permits
- Update delivery status in real time: `Scheduled → In Transit → Delivered`
- Full bookings table with truck assignment and pickup times

### Analytics Dashboard
- Tonnage quota vs completed deliveries per farmer
- Delivery efficiency metrics — days from permit issuance to cane pickup

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Runtime     | Node.js                           |
| Framework   | Express.js                        |
| Database    | SQLite via `better-sqlite3`       |
| Templating  | EJS (Embedded JavaScript)         |
| Styling     | Bootstrap 5 + Custom CSS          |
| Fonts       | Google Fonts (Playfair Display, DM Sans) |
| Geocoding   | OpenStreetMap Nominatim API (free, no key needed) |

---

## Project Structure

```
miwa-backend/
├── config/
│   └── db.js                  # SQLite connection
├── controllers/
│   ├── analyticsController.js
│   ├── bookingController.js
│   ├── farmerController.js
│   ├── permitController.js
│   └── transportController.js
├── routes/
│   ├── analyticsRoutes.js
│   ├── bookingRoutes.js
│   ├── farmerRoutes.js
│   ├── permitRoutes.js
│   └── transportRoutes.js
├── views/
│   ├── index.ejs
│   ├── permits.ejs
│   ├── bookings.ejs
│   ├── transport.ejs
│   └── analytics.ejs
├── public/
│   ├── styles.css
│   └── photos/
├── seed.sql                   # Database schema + seed data
├── seed.js                    # Script to populate the database
├── server.js                  # App entry point
└── package.json
```

---

## Getting Started (Local)

### Prerequisites
- Node.js v20 LTS (recommended)
- npm

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/miwa-backend.git
cd miwa-backend

# 2. Install dependencies
npm install

# 3. Create and seed the database
npm run seed

# 4. Start the development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## API Endpoints

### Farmers
| Method | Endpoint                    | Description           |
|--------|-----------------------------|-----------------------|
| GET    | `/api/v1/farmers`           | Get all farmers       |
| POST   | `/api/v1/farmers/register`  | Register a new farmer |

### Permits
| Method | Endpoint                    | Description                      |
|--------|-----------------------------|----------------------------------|
| GET    | `/api/v1/permits/approved`  | Get all approved active permits  |
| POST   | `/api/v1/permits/apply`     | Apply for a new permit           |

### Bookings
| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | `/api/v1/bookings`              | Get all bookings         |
| POST   | `/api/v1/bookings/create`       | Create a new booking     |
| PATCH  | `/api/v1/bookings/:id/status`   | Update delivery status   |

### Transport
| Method | Endpoint                        | Description                        |
|--------|---------------------------------|------------------------------------|
| GET    | `/api/v1/transport/optimize`    | Get optimized truck pickup route   |

### Analytics
| Method | Endpoint                        | Description                        |
|--------|---------------------------------|------------------------------------|
| GET    | `/api/v1/analytics/dashboard`   | Tonnage quota vs deliveries        |
| GET    | `/api/v1/analytics/efficiency`  | Days from permit issue to pickup   |

---

## Deploying to Render

1. Push your project to a GitHub repository
2. Go to [render.com](https://render.com) and create a **New Web Service**
3. Connect your GitHub repository
4. Set the following:
   - **Build Command:** `npm install && npm run seed`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Add a **Persistent Disk** in Render's settings:
   - Mount path: `/var/data`
   - This ensures your SQLite database survives redeploys
6. Add one **Environment Variable:**
   - `RENDER` = `true`

---

## Future Ideas

- Farmer-facing mobile interface for permit self-application
- SMS notifications (via Africa's Talking API) for permit approvals and pickup reminders
- Sugar factory portal to confirm deliveries and record actual tonnage received
- Map view of optimized transport routes
- Role-based access (farmer, logistics coordinator, factory admin)

---

##  Built By

Developed as part of the **ALX Professional Foundations Programme** portfolio.  
Inspired by the real logistical challenges faced by smallholder sugarcane farmers in Western Kenya.
