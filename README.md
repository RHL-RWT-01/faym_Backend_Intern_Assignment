# Analytics Event Collector

This project is a backend analytics service that collects, stores, and analyzes user interaction events such as `view`, `click`, and `location`.

---

## Setup Instructions

### 1. Prerequisites
- Node.js 
- MongoDB connection string

### 2. Clone the Repository
```bash
git clone https://github.com/RHL-RWT-01/faym_Backend_Intern_Assignment
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Create `.env` in Backend
```env
MONGO_URI=..actual_mongodb_connection_string...
PORT=3000
```

### 5. Start Backend
```bash
cd backend
npm install
npm run dev
```

### 6. Generate Dummy Data
Hit this endpoint to insert sample events:
```
GET http://localhost:3000/generate-sample-data
```

---

## API Documentation

### `POST events/create`
- **Purpose**: Create a new event.
- **Request Body**:
```json
{
  "user_id": "user-123",
  "event_type": "click",
  "payload": {
    "element_id": "btn-1",
    "text": "Click Me",
    "xpath": "/html/body/div[1]/button[1]"
  },
  "timestamp": "2025-05-30T10:00:00Z"
}
```
- **Success Response**:
```json
{
  "message": "Event recorded successfully"
}
```
- **Error Responses**:
  - `400 Bad Request`: Invalid/missing fields
  - `500 Internal Server Error`

---

### `GET /events/analytics/event-counts`
- **Purpose**: Get total number of events.
- **Response**:
```json
{
  "total": 3042
}
```

---

### `GET /events/analytics/event-counts-by-type`
- **Purpose**: Get count of each event type.
- **Query Parameters Optional):
start_date : Start date for aggregation (ISO 8601 date, e.g., "20250528").
end_date : End date for aggregation (ISO 8601 date, e.g., "20250529")**
- **Response**:
```json
{
  "view": 1200,
  "click": 1000,
  "location": 842
}
```
---

## Chosen Technologies

- **Language**: JavaScript (ES6)
- **Backend Framework**: Express.js – Minimal, fast, and flexible
- **Database**: MongoDB – Schema-less, scalable, and ideal for analytics
- **ODM**: Mongoose – Simplifies schema validation and querying
- **Frontend**: React + Vite – Lightweight setup and rapid dev environment
- **Extras**: 
  - Faker.js – Mock data generation
  - Service Worker – Background event sending from frontend

---

##  Database Schema Explanation

All events are stored in a single `events` collection using Mongoose discriminators.  
Each event includes:
- `user_id` (string)
- `event_type` (discriminator key)
- `timestamp` (date)
- `payload`: varies per event type

**Payload formats:**
- `view`: `{ url, title }`
- `click`: `{ element_id, text, xpath }`
- `location`: `{ latitude, longitude, accuracy }`

To allows flexible event structure with centralized querying.

---

##  Challenges Faced & Solutions

- **Service Worker fetch logic**: Ensured service worker handles `postMessage` and `fetch()` properly.
- **Payload schema management**: Used Mongoose discriminators to enforce structure per event type.
- **Location event permissions**: Handled browser geolocation permission prompt properly.
- **Syncing frontend/backend timing**: Used `navigator.serviceWorker.ready` to ensure communication starts only after the service worker is active.

---

##  Future Improvements

- **Add User Login**: Use authentication to track events by logged-in users.
- **Handle More Events**: Use message queues (like Kafka) to manage lots of events efficiently.
- **Live Dashboards**: Show real-time event data using WebSockets.
- **Offline Support**: Use browser storage (like IndexedDB) to store events when offline and send them later.
- **Better APIs**: Add filters and pagination to make analytics APIs more useful.

---